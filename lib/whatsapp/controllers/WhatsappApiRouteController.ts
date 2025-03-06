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

      const remoteUserId = data.messages.key.remoteJid
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
    const fromMe = data.messages.key.fromMe
    const fromServer = data.messages.sentFromServer
    const sync = data.messages.message.protocolMessage?.type === 'EPHEMERAL_SYNC_RESPONSE'

    if (sync || fromMe) {
      return {
        body: {message: ResponseMessage.Responded},
        init: {status: HttpResponseCode.Ok},
      }
    }

    const message = data.messages.message.ephemeralMessage?.message?.extendedTextMessage?.text ?? // Windows
      data.messages?.message?.extendedTextMessage?.text ?? // Android
      data.messages?.message?.conversation // Android message doesn't disappear.

    if (message) {
      const result = await this.composition
        .provideGetBestResponseFromSecretaryUseCase()
        .execute(remoteUserJid, message)

      if (message !== WAIT_FOR_RESPONSE) {
        console.log('Sent message', await this.sendResponseFromSecretary(
          secretaryId,
          result.userId,
          data,
          result.message,
        ))
      } else {
        console.log(`Waiting for response from secretary ${secretaryId}`)
      }
    } else {
      console.log(`Invalid message received`)
      return {
        body: {message: ResponseMessage.InvalidMessage},
        init: {status: HttpResponseCode.Accepted},
      }
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

    // TODO: Validate message format, if message null throw exception
    const message = data.messages.message.ephemeralMessage?.message?.extendedTextMessage?.text ?? // Windows
      data.messages?.message?.extendedTextMessage?.text ?? // Android
      data.messages?.message?.conversation // Android message doesn't disappear.

    const audioMessage = data.messages.message.audioMessage
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
    const fromMe = data.messages.key.fromMe
    const fromServer = data.messages.sentFromServer
    const syncUpdate = data.messages.message.protocolMessage?.type === 'EPHEMERAL_SYNC_RESPONSE'

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
    const remoteUserId = data.messages.key.remoteJid
    const expiration = data.messages?.message?.ephemeralMessage?.message?.extendedTextMessage?.contextInfo?.expiration // Windows
      ?? (data.messages?.message?.extendedTextMessage?.contextInfo?.ephemeralSettingTimestamp as number|undefined) // Android
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
    const destinationPath = Path.resolve(__dirname, '..', '..', '..', '..', 'public', 'whatsapp', 'audio')

    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, {recursive: true})
    }

    return await this.composition.provideGetBestResponseForAudioUseCase().execute(
      conversationId,
      audioMessage,
      messageId,
      destinationPath,
      chatId,
      whatsappId,
      businessId,
    )
  }

  private isFromGroup(data: WebHookData): boolean  {
    return data.messages.key.participant === null;
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
    const remoteUserJid = data.messages.key.remoteJid
    const expiration = data.messages?.message?.ephemeralMessage?.message?.extendedTextMessage?.contextInfo?.expiration // Windows
      ?? (data.messages?.message?.extendedTextMessage?.contextInfo?.ephemeralSettingTimestamp as number|undefined) // Android
    await this.composition.provideUpdateEphemeralUseCase().execute(secretaryId, userId, expiration ?? null)
    return await this.composition.provideSendMessageToClientUseCase().execute(secretaryId, remoteUserJid, message, expiration)
  }
}