import {pgTable, uuid, text, timestamp, integer} from 'drizzle-orm/pg-core'
import {whatsappConversation} from "@/db/schema/whatsappConversation";

/**
 * Whatsapp messages table
 *
 * This table is used to store the whatsapp messages received and sent.
 */
export const whatsappMessages = pgTable('whatsapp_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  whatsappConversationId: uuid('whatsapp_conversation_id').notNull().references(() => whatsappConversation.id),
  content: text('content').notNull(),
  sentAt: timestamp('sent_at').defaultNow().notNull(),
  whapiMessageId: text('whapi_message_id'),
  whapiChatId: text('whapi_chat_id'),
  status: integer('status').notNull(),
  source: integer('source').notNull(),
})
