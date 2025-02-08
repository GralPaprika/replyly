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

enum ResponseMessage {
  AlreadyDispatched = 'Already dispatched',
  UserInChat = 'User in chat',
  UnknownError = 'Unknown error',
  Responded = 'Responded',
  GroupMessage = 'Group message ignored',
  InvalidMessage = 'Invalid message',
}

export class WhatsappApiRouteController {
  constructor(private readonly composition: WhatsappRouteComposition) {}

  async processMessage(
    whatsappId: string,
    data: WebHookData
  ): Promise<RouteResponse> {
    try {
      const conversationId = await this.getConversationId(whatsappId, this.getChatId(data))

      if (this.isFromGroup(data)) {
        return {
          body: {message: ResponseMessage.GroupMessage},
          init: {status: HttpResponseCode.Ok},
        }
      }

      const source = await this.getMessageSource(data)

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

      if (!await this.hasActivePlan(whatsappId)) {
        return {
          body: {message: ResponseMessage.UnknownError},
          init: {status: HttpResponseCode.ServerError},
        }
      }

      const sender = data.messages.key.remoteJid
      if (await this.checkIfSenderIsBlackListed(whatsappId, sender)) {
        return {
          body: {message: ResponseMessage.Responded},
          init: {status: HttpResponseCode.Ok},
        }
      }

      const conversationStatus = await this.getConversationStatus(conversationId)

      if (
        conversationStatus == ConversationStatus.Idle ||
        conversationStatus == ConversationStatus.MessageReceived ||
        conversationStatus == ConversationStatus.BotResponded
      ){
        return this.handleCreateResponse(
          whatsappId,
          conversationId,
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

  private async handleCreateResponse(
    whatsappId: string,
    conversationId: string,
    data: WebHookData,
  ): Promise<RouteResponse> {
    await this.updateConversationStatus(conversationId, ConversationStatus.MessageReceived)

    // TODO: Validate message format, if message null throw exception
    const message = data.messages.message.ephemeralMessage?.message?.extendedTextMessage?.text ?? // Windows
      data.messages?.message?.extendedTextMessage?.text ?? // Android
      data.messages?.message?.conversation // Android message doesn't disappear.

    const audioMessage = data.messages?.message.audioMessage

    let response: string

    if (message) {
      console.log(`Message received: ${message}`)
      response = await this.getBestResponse({
        whatsappBusinessLocationId: whatsappId,
        chatId: conversationId,
        message: message,
      })
    } else if (audioMessage) {
      console.log(`Audio message received: ${audioMessage.url}`)
      response = await this.getBestResponseForAudio(audioMessage)
    } else  {
      console.log(`Invalid message received`)
      return {
        body: {message: ResponseMessage.InvalidMessage},
        init: {status: HttpResponseCode.Accepted},
      }
    }

    if (response !== WAIT_FOR_RESPONSE) {
      console.log(await this.sendResponseMessage(whatsappId, data, response))
    } else {
      console.log(`Waiting for response for conversation ${conversationId}`)
    }

    await this.updateConversationStatus(conversationId, ConversationStatus.BotResponded)

    await this.increaseMessageCountUsage(whatsappId)

    this.scheduleBotReset(conversationId)

    return {
      body: {message: ResponseMessage.Responded},
      init: {status: HttpResponseCode.Ok},
    }
  }

  private getChatId(schema: WebHookData): string {
    return schema.messages.key.remoteJid
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

    if (!fromMe && !syncUpdate) return MessageSource.Client
    if (fromMe && (fromServer || syncUpdate)) return MessageSource.Bot
    console.log(`fromMe: ${fromMe}, fromServer: ${fromServer}, syncUpdate: ${syncUpdate}`)
    return MessageSource.BusinessUser
  }

  private async hasActivePlan(whatsappId: string): Promise<boolean> {
    return this.composition.provideHasActivePlanUseCase().execute(whatsappId)
  }

  private async updateConversationStatus(conversationId: string, status: ConversationStatus): Promise<void> {
    await this.composition.provideUpdateConversationStatusUseCase().execute(conversationId, status)
  }

  private scheduleBotReset(conversationId: string) {
    this.composition.provideScheduleBotResetUseCase().execute(conversationId)
  }

  private async sendResponseMessage(
    whatsappId: string,
    data: WebHookData,
    content: string,
  ): Promise<SendMessageResponseSchema> {
    const recipientId = data.messages.key.remoteJid
    const expiration = data.messages?.message?.ephemeralMessage?.message?.extendedTextMessage?.contextInfo?.expiration // Windows
      ?? (data.messages?.message?.extendedTextMessage?.contextInfo?.ephemeralSettingTimestamp as number|undefined) // Android
    return await this.composition.provideSendMessageToClientUseCase().execute(whatsappId, recipientId, content, expiration)
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

  private async getBestResponseForAudio(audioMessage: AudioMessage): Promise<string> {
    return await this.composition.provideGetBestResponseForAudioUseCase().execute(audioMessage)
  }

  private isFromGroup(data: WebHookData): boolean  {
    return data.messages.key.participant === null;
  }
}