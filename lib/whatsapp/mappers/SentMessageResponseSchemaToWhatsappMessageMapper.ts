import {WhatsappMessage} from "@/lib/whatsapp/models/message/WhatsappMessage";
import {MessageStatus} from "@/lib/whatsapp/models/enum/MessageStatus";
import {MessageSource} from "@/lib/common/models/MessageSource";
import {SentMessageResponseSchema} from "@/lib/whatsapp/models/message/SentMessageResponseSchema";

export class SentMessageResponseSchemaToWhatsappMessageMapper {
  map(
    conversationId: string,
    messageStatus: MessageStatus,
    source: MessageSource,
    requestBody: SentMessageResponseSchema,
  ): WhatsappMessage {
    const message = requestBody.message

    return {
      whatsappConversationId: conversationId,
      content: message.text.body,
      sentAt: new Date(message.timestamp),
      whapiMessageId: message.id,
      whapiChatId: message.chat_id,
      status: messageStatus,
      source: source
    }
  }
}