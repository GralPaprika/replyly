import {MessageStatus} from "@/lib/whatsapp/models/enum/MessageStatus"
import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";
import {Exception} from "@/lib/common/models/Exception";

export class UpdateMessageException implements Exception {
  constructor(public readonly message: string) {}
}

export class UpdateMessageStatusUseCase {
  constructor(private readonly whatsappRepository: WhatsappRepository) {}

  /**
   * Update the status of a message
   * @param whapiMessageId
   * @param status
   * @throws {UpdateMessageException}
   */
  async execute(whapiMessageId: string, status: MessageStatus): Promise<void> {
    try {
      return this.whatsappRepository.updateMessageStatus(whapiMessageId, status)
    } catch (exception) {
      // @ts-ignore
      throw new UpdateMessageException(exception.message)
    }
  }
}