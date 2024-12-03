import {Exception} from "@/lib/common/models/Exception";
import {MessageWebhookSchema} from "@/lib/whatsapp/models/webhook/MessageWebhookSchema";
import {
  WhatsappWebhookSchemaToWhatsappMessageMapper,
} from "@/lib/whatsapp/mappers/WhatsappWebhookSchemaToWhatsappMessageMapper";
import {MessageStatus} from "@/lib/whatsapp/models/enum/MessageStatus";
import {MessageSource} from "@/lib/common/models/MessageSource";
import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";

export class SaveReceivedMessageException implements Exception {
  constructor(public readonly message: string) {}
}

export class SaveReceivedMessageUseCase {
  constructor(
    private readonly whatsappRepository: WhatsappRepository,
    private readonly whatsappWebhookSchemaToWhatsappMessageMapper: WhatsappWebhookSchemaToWhatsappMessageMapper,
  ) {}

  async execute(
    conversationId: string,
    messageStatus: MessageStatus,
    source: MessageSource,
    webhookSchema: MessageWebhookSchema,
  ): Promise<void> {
    try {
      const message = this.whatsappWebhookSchemaToWhatsappMessageMapper.map(
        conversationId,
        messageStatus,
        source,
        webhookSchema,
      )
      await this.whatsappRepository.saveMessage(message)
    } catch (error) {
      // @ts-ignore
      throw new SaveReceivedMessageException(error.message)
    }
  }
}