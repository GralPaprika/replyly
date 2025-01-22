import {pgTable, text, numeric, timestamp, boolean, uuid, integer} from 'drizzle-orm/pg-core'

/**
 * The plans that are available for purchase.
 *
 * The plans are associated with a region and have a price, a messages limit and a description.
 * This way the UI can display the plans available for the user to purchase.
 */
export const plans = pgTable('plans', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description').notNull(),
  price: numeric('price').notNull(),
  messagesLimit: integer ('messages_limit').notNull(),
  regionId: uuid('region_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  deleted: boolean('deleted').default(false).notNull(),
})
