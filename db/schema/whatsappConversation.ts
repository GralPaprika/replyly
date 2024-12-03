import {boolean, integer, pgTable, text, uuid} from "drizzle-orm/pg-core";
import {whatsapp} from "@/db/schema/whatsapp";

export const whatsappConversation = pgTable('whatsapp_conversation', {
  id: uuid('id').defaultRandom().primaryKey(),
  whatsappId: uuid('whatsapp_id').notNull().references(() => whatsapp.id),
  whapiChatId: text('whapi_chat_id').notNull(),
  conversationStatus: integer('conversation_status').notNull(),
  deleted: boolean('deleted').default(false).notNull(),
})