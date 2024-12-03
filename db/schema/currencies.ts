import {boolean, integer, pgTable, text} from "drizzle-orm/pg-core";

export const currencies = pgTable('currencies', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  symbol: text('symbol').notNull(),
  code: text('code').notNull(),
  deleted: boolean('deleted').default(false).notNull(),
})