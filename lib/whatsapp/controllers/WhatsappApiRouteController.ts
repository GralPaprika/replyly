import {ConversationStatus} from "@/lib/common/models/ConversationStatus";
import {WhatsappRouteComposition} from "@/composition/WhatsappRouteComposition";
import {MessageSentNotificationWebhookSchema} from "@/lib/whatsapp/models/webhook/MessageSentNotificationWebhookSchema";
import {MessageStatus} from "@/lib/whatsapp/models/enum/MessageStatus";
import {MessageSource} from "@/lib/common/models/MessageSource";
import {MessageWebhookSchema} from "@/lib/whatsapp/models/webhook/MessageWebhookSchema";
import {SentMessageResponseSchema} from "@/lib/whatsapp/models/message/SentMessageResponseSchema";
import {Document} from "@/lib/ai/models/Document";
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
    data: MessageWebhookSchema | MessageSentNotificationWebhookSchema
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
        data as MessageWebhookSchema,
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
      const whapiMessageId = data.statuses[0].id
      const status = this.getMessageStatusSentFromNotification(data)

      if (status === MessageStatus.Failed) {
        return {
          body: {message: `${ResponseMessage.ErrorSendingMessage} ${whapiMessageId}`},
          init: {status: HttpResponseCode.ServerError},
        }
      }

      await this.updateMessageStatus(whapiMessageId, status)

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
    messageSchema: MessageWebhookSchema,
  ): Promise<RouteResponse> {
    try {
      if (!await this.hasActivePlan(whatsappId)) {
        return {
          body: {message: ResponseMessage.UnknownError},
          init: {status: HttpResponseCode.ServerError},
        }
      }

      const sender = messageSchema.messages[0].from
      if (await this.checkIfSenderIsBlackListed(whatsappId, sender)) {
        return {
          body: {message: ResponseMessage.Responded},
          init: {status: HttpResponseCode.Ok},
        }
      }

      const whapiMessageId = messageSchema.messages[0].id
      const fromMe = messageSchema.messages[0].from_me
      const source = await this.getMessageSource(whapiMessageId, fromMe)

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

      await this.saveReceivedMessage(conversationId, messageSchema)

      await this.updateConversationStatus(conversationId, ConversationStatus.MessageReceived)

      let response: string
      if (await this.isMessageReceivedWithWorkingHours(whatsappId)) {
        // Process the input
        response = await this.getBusinessBestResponseToPrompt(whatsappId, messageSchema.messages[0].text.body)
      } else {
        response = await this.getRAGResponse(whatsappId, messageSchema.messages[0].text.body)
      }

      const messageSent = await this.sendResponseMessage(whatsappId, messageSchema, response)

      await this.updateConversationStatus(conversationId, ConversationStatus.BotResponded)

      await this.saveSentMessage(conversationId, messageSent)

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

  private getChatId(schema: MessageWebhookSchema | MessageSentNotificationWebhookSchema): string {
    if ('messages' in schema) return schema.messages[0].chat_id
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

  private async updateMessageStatus(whapiMessageId: string, status: MessageStatus): Promise<void> {
    await this.composition.provideUpdateMessageStatusUseCase().execute(whapiMessageId, status)
  }

  private async getMessageSource(whapiMessageId: string, fromMe: boolean): Promise<MessageSource> {
    if (!fromMe) return MessageSource.Client

    return await this.composition.provideGetMessageSourceUseCase().execute(whapiMessageId)
  }

  private async hasActivePlan(whatsappId: string): Promise<boolean> {
    return this.composition.provideHasActivePlanUseCase().execute(whatsappId)
  }

  private async saveReceivedMessage(conversationId: string, messageSchema: MessageWebhookSchema): Promise<void> {
    await this.composition.provideSaveReceivedMessageUseCase().execute(
      conversationId,
      MessageStatus.Read, // Because the bot is the one receiving the message its status is read.
      MessageSource.Client,
      messageSchema,
    )
  }

  private async updateConversationStatus(conversationId: string, status: ConversationStatus): Promise<void> {
    await this.composition.provideUpdateConversationStatusUseCase().execute(conversationId, status)
  }

  private async isMessageReceivedWithWorkingHours(whatsappId: string) {
    return await this.composition.provideTimeWithinLocationBusinessHoursUseCase().execute(whatsappId)
  }

  private async getBusinessBestResponseToPrompt(whatsappId: string, prompt: string): Promise<string> {
    const possibleResponses = await (
      await this.composition.provideGetBestResponsesToClientRequestUseCase()
    ).execute(whatsappId, prompt)

    return possibleResponses[0][0].pageContent
  }

  private async getRAGResponse(whatsappId: string, prompt: string): Promise<string> {
    return (await this.composition.provideGetRAGResponseUseCase()).execute(whatsappId, prompt);
  }

  private async sendResponseMessage(
    whatsappId: string,
    data: MessageWebhookSchema,
    content: string,
  ): Promise<SentMessageResponseSchema> {
    const recipientId = data.messages[0].from
    return await this.composition.provideSendMessageToClientUseCase().execute(whatsappId, recipientId, content)
  }

  private async saveSentMessage(conversationId: string, responseSchema: SentMessageResponseSchema): Promise<void> {
    await this.composition.provideSaveSentMessageUseCase().execute(
      conversationId,
      MessageStatus.Sent,
      MessageSource.Bot,
      responseSchema,
    )
  }

  private async increaseMessageCountUsage(whatsappId: string): Promise<void> {
    const amount = 1
    await this.composition.provideIncreaseMessageCountUsageUseCase().execute(whatsappId, amount)
  }

  private async checkIfSenderIsBlackListed(whatsappId: string, sender: string): Promise<boolean> {
    return await this.composition.provideIsNumberBlackListedUseCase().execute(whatsappId, sender)
  }

  async saveResponses(businessLocationId: string, responses: string[]): Promise<void> {
    await (await this.composition.provideSaveResponsesUseCase()).execute(businessLocationId, responses)
  }

  async getResponsesForPrompt(whatsappId: string, prompt: string): Promise<[Document, number][]> {
    return await (await this.composition.provideGetBestResponsesToClientRequestUseCase()).execute(whatsappId, prompt)
  }
}