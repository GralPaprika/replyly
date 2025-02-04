import {boolean, pgTable, text, uuid} from "drizzle-orm/pg-core";
import {whatsapp} from "@/db/schema/whatsapp";

export const whatsappContacts =  pgTable('whatsapp_contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  contactId: text('contact_id').notNull(),
  name: text('name').notNull(),
  imageUrl: text('image_url'),
  whatsappId: uuid('whatsapp_id').notNull().references(() => whatsapp.id),
  onBlacklist: boolean('on_blacklist').default(false).notNull(),
  deleted: boolean('deleted').default(false).notNull(),
})