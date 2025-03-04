import {boolean, integer, pgTable, uuid} from "drizzle-orm/pg-core";
import {whatsapp} from "@/db/schema/whatsapp";
import {secretaries} from "@/db/schema/secretaries";

export const whatsappSecretaryConversation = pgTable('whatsapp_secretary_conversation', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => whatsapp.id),
  secretaryId: uuid('secretary_id').notNull().references(() => secretaries.id),
  ephemeralExpiration: integer('ephemeral_expiration'),
  deleted: boolean('deleted').default(false).notNull(),
})