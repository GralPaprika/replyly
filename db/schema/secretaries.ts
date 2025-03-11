import {boolean, pgTable, text, uuid} from "drizzle-orm/pg-core";

export const secretaries = pgTable('secretaries', {
  id: uuid('id').defaultRandom().primaryKey(),
  remoteJid: text('remote_jid').notNull(),
  phoneNumber: text('phone_number'),
  countryCode: text('country_code'),
  deleted: boolean('deleted').default(false).notNull(),
})