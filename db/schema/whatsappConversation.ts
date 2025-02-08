import {boolean, integer, pgTable, text, uuid} from "drizzle-orm/pg-core";
import {whatsapp} from "@/db/schema/whatsapp";
import {clients} from "@/db/schema/clients";

export const whatsappConversation = pgTable('whatsapp_conversation', {
  id: uuid('id').defaultRandom().primaryKey(),
  whatsappId: uuid('whatsapp_id').notNull().references(() => whatsapp.id),
  clientId: uuid('client_id').notNull().references(() => clients.id),
  conversationStatus: integer('conversation_status').notNull(),
  deleted: boolean('deleted').default(false).notNull(),
})