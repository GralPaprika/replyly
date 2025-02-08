import {boolean, pgTable, text, uuid} from "drizzle-orm/pg-core";

export const clients = pgTable('clients', {
  id: uuid('id').defaultRandom().primaryKey(),
  whatsappId: text('whatsapp_id').notNull(),
  deleted: boolean('deleted').default(false).notNull(),
})