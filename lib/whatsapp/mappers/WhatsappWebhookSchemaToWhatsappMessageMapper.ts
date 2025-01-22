import {WhatsappMessage} from "@/lib/whatsapp/models/message/WhatsappMessage";
import {MessageWebhookSchema} from "@/lib/whatsapp/models/webhook/MessageWebhookSchema";
import {MessageStatus} from "@/lib/whatsapp/models/enum/MessageStatus";
import {MessageSource} from "@/lib/common/models/MessageSource";

export class WhatsappWebhookSchemaToWhatsappMessageMapper {
  map(
    conversationId: string,
    messageStatus: MessageStatus,
    source: MessageSource,
    webhookSchema: MessageWebhookSchema
  ): WhatsappMessage {
    const message = webhookSchema.messages[0]
    return {
      whatsappConversationId: conversationId,
      content: message.text.body,
      sentAt: new Date(message.timestamp),
      whapiMessageId: message.id,
      whapiChatId: message.chat_id,
      status: messageStatus,
      source: source,
    }
  }
}