import {ConversationStatus} from "@/lib/common/models/ConversationStatus";
import {WhatsappRouteComposition} from "@/composition/WhatsappRouteComposition";
import {MessageSource} from "@/lib/common/models/MessageSource";
import {Data as WebHookData} from "@/lib/whatsapp/models/webhook/MessageWebhookSchema";
import {SendMessageResponseSchema} from "@/lib/whatsapp/models/message/SendMessageResponseSchema";
import {RouteResponse} from "@/lib/whatsapp/models/RouteResponse";
import {HttpResponseCode} from "@/lib/common/models/HttpResponseCode";
import {HasActivePlanException} from "@/lib/whatsapp/useCases/HasActivePlanUseCase";

enum ResponseMessage {
  AlreadyDispatched = 'Already dispatched',
  UserInChat = 'User in chat',
  UnknownError = 'Unknown error',
  Responded = 'Responded',
}

export class WhatsappApiRouteController {
  constructor(private readonly composition: WhatsappRouteComposition) {}

  async processMessage(
    whatsappId: string,
    data: WebHookData
  ): Promise<RouteResponse> {
    const conversationId = await this.getConversationId(whatsappId, this.getChatId(data))

    const conversationStatus = await this.getConversationStatus(conversationId)

    if (conversationStatus === ConversationStatus.BotResponded) {
      return {
        body: {message: ResponseMessage.Responded},
        init: {status: HttpResponseCode.Ok},
      }
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

      const fromMe = data.messages.key.fromMe
      const fromSever = data.messages.sentFromServer
      const source = await this.getMessageSource(fromMe, fromSever)

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
      else {
        return {
          // @ts-ignore
          body: {message: exception.message},
          init: {status: HttpResponseCode.ServerError}
        }
      }
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

  private async getMessageSource(fromMe: boolean, fromServer: boolean): Promise<MessageSource> {
    if (!fromMe) return MessageSource.Client
    return fromServer ? MessageSource.Bot : MessageSource.BusinessUser
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
  ): Promise<SendMessageResponseSchema> {
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