import {MessageSource} from "@/lib/common/models/MessageSource";
import {Exception} from "@/lib/common/models/Exception";
import {RepositoryException, WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";

enum ErrorMessage {
  MessageNotFound = 'Message not found',
}

enum ErrorCode {
  MessageNotFound,
  ServiceError,
}

export class GetMessageSourceException implements Exception {
  static ErrorCode = ErrorCode
  constructor(public readonly message: string, public readonly code: ErrorCode) {}
}

export class GetMessageSourceUseCase {
  constructor(private readonly whatsappRepository: WhatsappRepository) {}

  /**
   * Get the source of a message
   * @param whatsappMessageId
   * @returns {Promise<MessageSource>}
   * @throws {GetMessageSourceException}
   */
  async execute(whatsappMessageId: string): Promise<MessageSource> {
    try {
      const source = await this.whatsappRepository.getMessageSource(whatsappMessageId)
      switch (source) {
        case 1:
          return MessageSource.BusinessUser
        case 2:
          return MessageSource.Client
        default:
          return MessageSource.Bot
      }
    } catch (error) {
      if (error instanceof RepositoryException)
        throw new GetMessageSourceException(ErrorMessage.MessageNotFound, ErrorCode.MessageNotFound)

      // @ts-ignore
      throw new GetMessageSourceException(error.message, ErrorCode.ServiceError)
    }
  }
}