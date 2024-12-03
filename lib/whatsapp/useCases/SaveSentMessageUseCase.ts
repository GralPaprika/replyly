import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";
import {
  SentMessageResponseSchemaToWhatsappMessageMapper
} from "@/lib/whatsapp/mappers/SentMessageResponseSchemaToWhatsappMessageMapper";
import {MessageStatus} from "@/lib/whatsapp/models/enum/MessageStatus";
import {MessageSource} from "@/lib/common/models/MessageSource";
import {SentMessageResponseSchema} from "@/lib/whatsapp/models/message/SentMessageResponseSchema";

export class SaveSentMessageException {
  constructor(public readonly message: string) {}
}

export class SaveSentMessageUseCase {
  constructor(
    private readonly whatsappRepository: WhatsappRepository,
    private readonly sentMessageResponseSchemaToWhatsappMessageMapper: SentMessageResponseSchemaToWhatsappMessageMapper,
  ) {}

  /**
   * Save a message that was sent to a client.
   * @param conversationId The ID of the conversation.
   * @param messageStatus The status of the message sent.
   * @param source The source of the message.
   * @param responseSchema The response schema received from the whatsapp API.
   * @throws {SaveSentMessageException}
   */
  async execute(
    conversationId: string,
    messageStatus: MessageStatus,
    source: MessageSource,
    responseSchema: SentMessageResponseSchema,
  ): Promise<void> {
    try {
      const message = this.sentMessageResponseSchemaToWhatsappMessageMapper.map(
        conversationId,
        messageStatus,
        source,
        responseSchema,
      )

      await this.whatsappRepository.saveMessage(message)
    } catch (error) {
      // @ts-ignore
      throw new SaveSentMessageException(error.message)
    }
  }
}