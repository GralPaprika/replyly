import {boolean, pgTable, text, uuid} from "drizzle-orm/pg-core";

export const secretaries = pgTable('secretaries', {
  id: uuid('id').defaultRandom().primaryKey(),
  remoteJid: text('remote_jid').notNull(),
  deleted: boolean('deleted').default(false).notNull(),
})