import {ConversationStatus} from "@/lib/common/models/ConversationStatus";
import {WhatsappRouteComposition} from "@/composition/WhatsappRouteComposition";
import {MessageSource} from "@/lib/common/models/MessageSource";
import {AudioMessage, Data as WebHookData} from "@/lib/whatsapp/models/webhook/MessageWebhookSchema";
import {SendMessageResponseSchema} from "@/lib/whatsapp/models/message/SendMessageResponseSchema";
import {RouteResponse} from "@/lib/whatsapp/models/RouteResponse";
import {HttpResponseCode} from "@/lib/common/models/HttpResponseCode";
import {HasActivePlanException} from "@/lib/whatsapp/useCases/HasActivePlanUseCase";
import {BotWebhookRequest} from "@/lib/whatsapp/models/botservice/BotWebhookRequest";
import {WAIT_FOR_RESPONSE} from "@/lib/whatsapp/models/const";
import * as Path from "path";
import * as fs from 'fs';
import {BotSecretaryResponse} from "@/lib/whatsapp/models/botsecretary/BotSecretaryResponse";
import {User} from "@/lib/whatsapp/models/User";

enum ResponseMessage {
  AlreadyDispatched = 'Already dispatched',
  UserInChat = 'User in chat',
  UnknownError = 'Unknown error',
  Responded = 'Responded',
  GroupMessage = 'Group message ignored',
  DoesNotHavePermission = 'User does not have permission',
  InvalidMessage = 'Invalid message',
  PlanExpired = 'Plan expired',
}

export class WhatsappApiRouteController {
  constructor(private readonly composition: WhatsappRouteComposition) {}

  readonly audioDestinationPath = Path.resolve(__dirname, '..', '..', '..', '..', 'public', 'whatsapp', 'audio')

  async processMessage(
    whatsappId: string,
    data: WebHookData
  ): Promise<RouteResponse> {
    try {
      if (this.isFromGroup(data)) {
        return {
          body: {message: ResponseMessage.GroupMessage},
          init: {status: HttpResponseCode.Ok},
        }
      }

      const remoteUserId = this.getRemoteJid(data)
      if (await this.checkIfSenderIsBlackListed(whatsappId, remoteUserId)) {
        return {
          body: {message: ResponseMessage.Responded},
          init: {status: HttpResponseCode.Ok},
        }
      }

      if (await this.isSecretaryUser(whatsappId)) {
        if (await this.hasUserSecretaryPermissions(remoteUserId)) {
          return this.secretaryRespondToBusiness(whatsappId, remoteUserId, data)
        }
        return {
          body: {message: ResponseMessage.DoesNotHavePermission},
          init: {status: HttpResponseCode.Unauthorized},
        }
      }

      if (!await this.hasActivePlan(whatsappId)) {
        return {
          body: {message: ResponseMessage.PlanExpired},
          init: {status: HttpResponseCode.Unauthorized},
        }
      }

      const clientId = await this.getClientId(remoteUserId)
      const source = await this.getMessageSource(data)
      const conversationId = await this.getConversationId(whatsappId, clientId)

      if (source === MessageSource.Bot)
        return {
          body: {message: ResponseMessage.AlreadyDispatched},
          init: {status: HttpResponseCode.AlreadyReported},
        }

      if (source === MessageSource.BusinessUser) {
        await this.updateConversationStatus(conversationId, ConversationStatus.UserTookControl)
        return {
          body: {message: ResponseMessage.UserInChat},
          init: {status: HttpResponseCode.Ok},
        }
      }

      return await this.respondToClient(whatsappId, conversationId, clientId, data);

    } catch (exception) {
      if (exception instanceof HasActivePlanException) {
        const httpCode = exception.code !== HasActivePlanException.ErrorCode.SystemError ?
          HttpResponseCode.NotFound : HttpResponseCode.ServerError
        return {
          body: {message: exception.message},
          init: {status: httpCode},
        }
      }
      else {
        return {
          // @ts-ignore
          body: {message: exception.message},
          init: {status: HttpResponseCode.ServerError}
        }
      }
    }
  }

  private async secretaryRespondToBusiness(secretaryId: string, remoteUserJid: string, data: WebHookData): Promise<RouteResponse> {
    const {fromMe, syncUpdate} = this.getMessageSourceData(data)

    if (syncUpdate || fromMe) {
      return {
        body: {message: ResponseMessage.Responded},
        init: {status: HttpResponseCode.Ok},
      }
    }

    let result: BotSecretaryResponse;
    const message = this.getMessage(data)
    const audioMessage = this.getAudioMessage(data)
    const user = await this.getUser(remoteUserJid)

    if (message) {
      result = await this.composition
        .provideGetBestResponseFromSecretaryUseCase()
        .execute(user.id, secretaryId, message)
    } else if (audioMessage) {
      result = await this.getBestResponseFromSecretaryAudio(user.id, secretaryId, audioMessage)
    } else {
      console.log(`Invalid message received`)
      return {
        body: {message: ResponseMessage.InvalidMessage},
        init: {status: HttpResponseCode.Accepted},
      }
    }

    if (message !== WAIT_FOR_RESPONSE) {
      console.log('Sent message from secretary', await this.sendResponseFromSecretary(
        secretaryId,
        result.userId,
        data,
        result.message,
      ))
    } else {
      console.log(`Waiting for response from secretary ${secretaryId}`)
    }

    return {
      body: {message: ResponseMessage.Responded},
      init: {status: HttpResponseCode.Ok},
    }
  }

  private async respondToClient(
    whatsappId: string,
    conversationId: string,
    clientId: string,
    data: WebHookData,
  ): Promise<RouteResponse> {
    const conversationStatus = await this.getConversationStatus(conversationId)

    if (
      conversationStatus == ConversationStatus.Idle ||
      conversationStatus == ConversationStatus.MessageReceived ||
      conversationStatus == ConversationStatus.BotResponded
    ){
      return this.handleCreateResponse(
        whatsappId,
        conversationId,
        clientId,
        data as WebHookData,
      )
    }

    if (conversationStatus == ConversationStatus.UserTookControl) {
      return {
        body: {message: ResponseMessage.Responded},
        init: {status: HttpResponseCode.Ok},
      }
    }

    return {
      body: {message: ResponseMessage.UnknownError},
      init: {status: HttpResponseCode.ServerError},
    }
  }

  private async handleCreateResponse(
    whatsappId: string,
    conversationId: string,
    clientId: string,
    data: WebHookData,
  ): Promise<RouteResponse> {
    await this.updateConversationStatus(conversationId, ConversationStatus.MessageReceived)

    const message = this.getMessage(data)
    const audioMessage = this.getAudioMessage(data)
    const businessId = await this.composition.provideGetBusinessIdUseCase().execute(whatsappId)

    let response: string

    if (message) {
      console.log(`Message received: ${message}`)
      response = await this.getBestResponse({
        businessId,
        whatsappId,
        message,
        chatId: clientId,
      })
    } else if (audioMessage) {
      console.log(`Audio message received: ${audioMessage.url}`)
      const messageId = data.messages.key.id
      response = await this.getBestResponseForAudio(
        conversationId,
        audioMessage,
        messageId,
        clientId,
        whatsappId,
        businessId,
      )
    } else {
      console.log(`Invalid message received`)
      return {
        body: {message: ResponseMessage.InvalidMessage},
        init: {status: HttpResponseCode.Accepted},
      }
    }

    if (response !== WAIT_FOR_RESPONSE) {
      console.log('Sent message', await this.sendResponseMessage(whatsappId, clientId, data, response))
    } else {
      console.log(`Waiting for response for conversation ${conversationId}`)
    }

    await this.updateConversationStatus(conversationId, ConversationStatus.BotResponded)

    await this.increaseMessageCountUsage(whatsappId)

    await this.scheduleBotReset(conversationId)

    return {
      body: {message: ResponseMessage.Responded},
      init: {status: HttpResponseCode.Ok},
    }
  }

  private getMessage(data: WebHookData): string | undefined {
    return data.messages.message.ephemeralMessage?.message?.extendedTextMessage?.text ?? // Windows
      data.messages?.message?.extendedTextMessage?.text ?? // Android
      data.messages?.message?.conversation // Android message doesn't disappear.
  }

  private getAudioMessage(data: WebHookData): AudioMessage | undefined {
    return data.messages.message.audioMessage
  }

  private getMessageExpiration(data: WebHookData): number | undefined {
    return data.messages?.message?.ephemeralMessage?.message?.extendedTextMessage?.contextInfo?.expiration // Windows
      ?? (data.messages?.message?.extendedTextMessage?.contextInfo?.ephemeralSettingTimestamp as number|undefined) // Android
  }

  private getRemoteJid(data: WebHookData): string {
    return data.messages.key.remoteJid
  }

  private getMessageSourceData(data: WebHookData): {fromMe: boolean, fromServer: boolean, syncUpdate: boolean} {
    return {
      fromMe: data.messages.key.fromMe,
      fromServer: data.messages.sentFromServer,
      syncUpdate: data.messages.message.protocolMessage?.type === 'EPHEMERAL_SYNC_RESPONSE',
    }
  }

  private isFromGroup(data: WebHookData): boolean  {
    return data.messages.key.participant === null;
  }

  private async getClientId(whatsappChatId: string): Promise<string> {
    return await this.composition.provideGetClientIdUseCase().execute(whatsappChatId)
  }

  private async getConversationId(whatsappId: string, chatId: string): Promise<string> {
    return await this.composition.provideGetConversationIdUseCase().execute(whatsappId, chatId)
  }

  private async getConversationStatus(conversationId: string): Promise<ConversationStatus> {
    return this.composition.provideGetConversationStatusUseCase().execute(conversationId)
  }

  private async getMessageSource(data: WebHookData): Promise<MessageSource> {
    const {fromMe, fromServer, syncUpdate} = this.getMessageSourceData(data)
    if (fromServer) return MessageSource.Bot
    if (fromMe && !syncUpdate) return MessageSource.BusinessUser
    return MessageSource.Client
  }

  private async hasActivePlan(whatsappId: string): Promise<boolean> {
    return this.composition.provideHasActivePlanUseCase().execute(whatsappId)
  }

  private async updateConversationStatus(conversationId: string, status: ConversationStatus): Promise<void> {
    await this.composition.provideUpdateConversationStatusUseCase().execute(conversationId, status)
  }

  private async scheduleBotReset(conversationId: string) {
    await this.composition.provideScheduleBotResetUseCase().execute(conversationId)
  }

  private async sendResponseMessage(
    whatsappId: string,
    clientId: string,
    data: WebHookData,
    content: string,
  ): Promise<SendMessageResponseSchema> {
    const remoteUserId = this.getRemoteJid(data)
    const expiration = this.getMessageExpiration(data)
    const result = await this.composition.provideSendMessageToClientUseCase().execute(whatsappId, remoteUserId, content, expiration)
    await this.composition.provideReadReceivedMessageUseCase().execute(data.messages.key, whatsappId)
    await this.composition.provideUpdateEphemeralUseCase().execute(whatsappId, clientId, expiration ?? null)
    return result
  }

  private async increaseMessageCountUsage(whatsappId: string): Promise<void> {
    const amount = 1
    await this.composition.provideIncreaseMessageCountUsageUseCase().execute(whatsappId, amount)
  }

  private async checkIfSenderIsBlackListed(whatsappId: string, sender: string): Promise<boolean> {
    return await this.composition.provideIsNumberBlackListedUseCase().execute(whatsappId, sender)
  }

  private async getBestResponse(requestData: BotWebhookRequest): Promise<string> {
    return await this.composition.provideGetBestResponseUseCase().execute(requestData)
  }

  private async isSecretaryUser(sessionId: string): Promise<boolean> {
    return await this.composition.provideIsSecretaryUserUseCase().execute(sessionId)
  }

  private async getBestResponseForAudio(
    conversationId: string,
    audioMessage: AudioMessage,
    messageId: string,
    chatId: string,
    whatsappId: string,
    businessId: string,
  ): Promise<string> {
    this.createPathIfNotExists(this.audioDestinationPath)

    return await this.composition.provideGetBestResponseForAudioUseCase().execute(
      conversationId,
      audioMessage,
      messageId,
      this.audioDestinationPath,
      chatId,
      whatsappId,
      businessId,
    )
  }

  private async getBestResponseFromSecretaryAudio(
    userId: string,
    secretaryId: string,
    audioMessage: AudioMessage,
  ): Promise<BotSecretaryResponse> {
    this.createPathIfNotExists(this.audioDestinationPath)
    return await this.composition
      .provideGetBestResponseFromSecretaryAudioUseCase()
      .execute(userId, secretaryId, audioMessage, this.audioDestinationPath)
  }

  private async hasUserSecretaryPermissions(remoteUserJid: string): Promise<boolean> {
    return await this.composition.provideHasUserSecretaryPermissionsUseCase().execute(remoteUserJid)
  }

  private async sendResponseFromSecretary(
    secretaryId: string,
    userId: string,
    data: WebHookData,
    message: string,
  ) : Promise<SendMessageResponseSchema> {
    const remoteUserJid = this.getRemoteJid(data)
    const expiration = this.getMessageExpiration(data)
    await this.composition.provideUpdateEphemeralUseCase().execute(secretaryId, userId, expiration ?? null)
    return await this.composition.provideSendMessageToClientUseCase().execute(secretaryId, remoteUserJid, message, expiration)
  }

  private async getUser(remoteUserJid: string): Promise<User> {
    return await this.composition.provideGetUserUseCase().execute(remoteUserJid)
  }

  private createPathIfNotExists(path: string): void {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, {recursive: true})
    }
  }
}