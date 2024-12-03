import {ConversationStatus} from "@/lib/common/models/ConversationStatus";
import {Exception} from "@/lib/common/models/Exception";
import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";

const ConversationStatusNotFound = 'Conversation status not found'

export class GetConversationStatusException implements Exception {
  constructor(readonly message: string) {}
}

export class GetConversationStatusUseCase {
  constructor(private readonly whatsappRepository: WhatsappRepository) {}

  /**
   * Get the conversation status of a whatsappId
   * @param conversationId
   * @returns {Promise<ConversationStatus>}
   * @throws {GetConversationStatusException}
   */
  async execute(conversationId: string): Promise<ConversationStatus> {
    try {
      const status = await this.whatsappRepository.getConversationStatus(conversationId)

      switch (status) {
        case ConversationStatus.Idle.valueOf():
          return ConversationStatus.Idle
        case ConversationStatus.MessageReceived.valueOf():
          return ConversationStatus.MessageReceived
        case ConversationStatus.BotResponded.valueOf():
          return ConversationStatus.BotResponded
        case ConversationStatus.UserTookControl.valueOf():
          return ConversationStatus.UserTookControl
        default:
          return Promise.reject(new GetConversationStatusException(ConversationStatusNotFound))
      }

    } catch (exception) {
      // @ts-ignore
      throw new GetConversationStatusException(exception.message)
    }
  }
}