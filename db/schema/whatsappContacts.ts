import {boolean, pgTable, text, uuid} from "drizzle-orm/pg-core";
import {whatsapp} from "@/db/schema/whatsapp";

export const whatsappContacts =  pgTable('whatsappContacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(), // Name from the contact book.
  waId: text('wa_id').notNull(),
  pushName: text('pushname'), // Account name from WA or WA Business name.
  isBusiness: boolean('is_business'),
  profilePic: text('profile_pic'),
  profilePicFull: text('profile_pic_full'),
  status: text('status'),
  whatsappId: text('whatsapp_id').notNull().references(() => whatsapp.id),
  onBlacklist: boolean('on_blacklist').default(false).notNull(),
  deleted: boolean('deleted').default(false).notNull(),
})