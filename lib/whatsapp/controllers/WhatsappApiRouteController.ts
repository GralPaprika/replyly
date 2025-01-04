import {ConversationStatus} from "@/lib/common/models/ConversationStatus";
import {WhatsappRouteComposition} from "@/composition/WhatsappRouteComposition";
import {MessageSentNotificationWebhookSchema} from "@/lib/whatsapp/models/webhook/MessageSentNotificationWebhookSchema";
import {MessageStatus} from "@/lib/whatsapp/models/enum/MessageStatus";
import {MessageSource} from "@/lib/common/models/MessageSource";
import {Data as WebHookData} from "@/lib/whatsapp/models/webhook/MessageWebhookSchema";
import {SentMessageResponseSchema} from "@/lib/whatsapp/models/message/SentMessageResponseSchema";
import {RouteResponse} from "@/lib/whatsapp/models/RouteResponse";
import {HttpResponseCode} from "@/lib/common/models/HttpResponseCode";
import {GetMessageSourceException} from "@/lib/whatsapp/useCases/GetMessageSourceUseCase";
import {HasActivePlanException} from "@/lib/whatsapp/useCases/HasActivePlanUseCase";

enum ResponseMessage {
  AlreadyDispatched = 'Already dispatched',
  UserInChat = 'User in chat',
  ErrorSendingMessage = 'Error sending message',
  UnknownError = 'Unknown error',
  Responded = 'Responded',
}

export class WhatsappApiRouteController {
  constructor(private readonly composition: WhatsappRouteComposition) {}

  async processMessage(
    whatsappId: string,
    data: WebHookData | MessageSentNotificationWebhookSchema
  ): Promise<RouteResponse> {
    const conversationId = await this.getConversationId(whatsappId, this.getChatId(data))

    // Because of how Whapi works any time the owner of the whatsapp session sends a message (it could be through whapi
    // or manually) another request is sent to the webhook with the status of said message. So we need to check if the bot
    // has already responded to the message to parse the request accordingly and update the status of the message.
    const conversationStatus = await this.getConversationStatus(conversationId)

    if (conversationStatus === ConversationStatus.BotResponded) {
      return this.handleBotResponded(data as MessageSentNotificationWebhookSchema)
    } else if (conversationStatus === ConversationStatus.UserTookControl) {
      return {
        body: {message: ResponseMessage.AlreadyDispatched},
        init: {status: HttpResponseCode.Ok},
      }
    } else if (
      conversationStatus == ConversationStatus.Idle ||
      conversationStatus == ConversationStatus.MessageReceived
    ){
      return this.handleCreateResponse(
        whatsappId,
        conversationId,
        data as WebHookData,
      )
    }
    else {
      return {
        body: {message: ResponseMessage.UnknownError},
        init: {status: HttpResponseCode.ServerError},
      }
    }
  }

  private async handleBotResponded(data: MessageSentNotificationWebhookSchema): Promise<RouteResponse> {
    try {
      const whatsappMessageId = data.statuses[0].id
      const status = this.getMessageStatusSentFromNotification(data)

      if (status === MessageStatus.Failed) {
        return {
          body: {message: `${ResponseMessage.ErrorSendingMessage} ${whatsappMessageId}`},
          init: {status: HttpResponseCode.ServerError},
        }
      }

      await this.updateMessageStatus(whatsappMessageId, status)

      return {
        body: {message: ResponseMessage.AlreadyDispatched},
        init: {status: HttpResponseCode.Ok},
      }
    } catch (exception) {
      return {
        // @ts-ignore
        body: {message: exception.message},
        init: {status: HttpResponseCode.ServerError}
      }
    }
  }

  private async handleCreateResponse(
    whatsappId: string,
    conversationId: string,
    data: WebHookData,
  ): Promise<RouteResponse> {
    try {
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

      const whatsappMessageId = data.messages.key.id
      const fromMe = data.messages.key.fromMe
      const source = await this.getMessageSource(whatsappMessageId, fromMe)

      if (source === MessageSource.Bot)
        return {
          body: {message: ResponseMessage.AlreadyDispatched},
          init: {status: HttpResponseCode.AlreadyReported},
        }

      if (source === MessageSource.BusinessUser)
        return {
          body: {message: ResponseMessage.UserInChat},
          init: {status: HttpResponseCode.Ok},
        }

      await this.updateConversationStatus(conversationId, ConversationStatus.MessageReceived)

      const response = await this.getBestResponse()

      const messageSent = await this.sendResponseMessage(whatsappId, data, response)

      await this.updateConversationStatus(conversationId, ConversationStatus.BotResponded)

      await this.increaseMessageCountUsage(whatsappId)

      return {
        body: {message: ResponseMessage.Responded},
        init: {status: HttpResponseCode.Ok},
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
      else if (exception instanceof GetMessageSourceException) {
        const httpCode =
          exception.code === GetMessageSourceException.ErrorCode.MessageNotFound ?
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

  private getChatId(schema: WebHookData | MessageSentNotificationWebhookSchema): string {
    if ('messages' in schema) return schema.messages.key.remoteJid
    return schema.statuses[0].recipient_id
  }

  private async getConversationId(whatsappId: string, chatId: string): Promise<string> {
    return await this.composition.provideGetConversationIdUseCase().execute(whatsappId, chatId)
  }

  private async getConversationStatus(conversationId: string): Promise<ConversationStatus> {
    return this.composition.provideGetConversationStatusUseCase().execute(conversationId)
  }

  private getMessageStatusSentFromNotification(notificationSchema: MessageSentNotificationWebhookSchema): MessageStatus {
    const status = notificationSchema.statuses[0].status
    return this.composition.provideStringToMessageStatusMapper().map(status)
  }

  private async updateMessageStatus(whatsappMessageId: string, status: MessageStatus): Promise<void> {
    await this.composition.provideUpdateMessageStatusUseCase().execute(whatsappMessageId, status)
  }

  private async getMessageSource(whatsappMessageId: string, fromMe: boolean): Promise<MessageSource> {
    if (!fromMe) return MessageSource.Client

    return await this.composition.provideGetMessageSourceUseCase().execute(whatsappMessageId)
  }

  private async hasActivePlan(whatsappId: string): Promise<boolean> {
    return this.composition.provideHasActivePlanUseCase().execute(whatsappId)
  }

  private async updateConversationStatus(conversationId: string, status: ConversationStatus): Promise<void> {
    await this.composition.provideUpdateConversationStatusUseCase().execute(conversationId, status)
  }

  private async isMessageReceivedWithWorkingHours(whatsappId: string) {
    return await this.composition.provideTimeWithinLocationBusinessHoursUseCase().execute(whatsappId)
  }

  private async sendResponseMessage(
    whatsappId: string,
    data: WebHookData,
    content: string,
  ): Promise<SentMessageResponseSchema> {
    const recipientId = data.messages.key.remoteJid
    return await this.composition.provideSendMessageToClientUseCase().execute(whatsappId, recipientId, content)
  }

  private async increaseMessageCountUsage(whatsappId: string): Promise<void> {
    const amount = 1
    await this.composition.provideIncreaseMessageCountUsageUseCase().execute(whatsappId, amount)
  }

  private async checkIfSenderIsBlackListed(whatsappId: string, sender: string): Promise<boolean> {
    return await this.composition.provideIsNumberBlackListedUseCase().execute(whatsappId, sender)
  }

  private async getBestResponse(): Promise<string> {
    return "Foo"
  }
}