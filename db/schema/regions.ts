import {boolean, pgTable, text, uuid} from 'drizzle-orm/pg-core'

/**
 * The regions that are available in the application.
 * These are directly related to the plans that are available for purchase.
 */
export const regions = pgTable('regions', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  deleted: boolean('deleted').default(false).notNull(),
})
