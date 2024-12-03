import {ConversationStatus} from "@/lib/common/models/ConversationStatus";
import {Exception} from "@/lib/common/models/Exception";
import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";

export class UpdateConversationStatusException implements Exception {
  constructor(readonly message: string) {}
}

export class UpdateConversationStatusUseCase {
  constructor(private whatsappRepository: WhatsappRepository) {}

  /**
   * Update the status of a conversation
   * @param conversationId
   * @param status
   * @throws {UpdateConversationStatusException}
   */
  async execute(conversationId: string, status: ConversationStatus): Promise<void> {
    try {
      await this.whatsappRepository.updateConversationStatus(conversationId, status)
    } catch (error) {
      // @ts-ignore
      throw new UpdateConversationStatusException(error.message)
    }
  }
}