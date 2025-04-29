import {pgTable, text, numeric, timestamp, boolean, uuid, integer} from 'drizzle-orm/pg-core'

/**
 * The plans that are available for purchase.
 *
 * The plans are associated with a region and have a price, a messages limit and a description.
 * This way the UI can display the plans available for the user to purchase.
 */
export const plans = pgTable('plans', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  displayName: text('display_name'),
  description: text('description').notNull(),
  price: numeric('price').notNull(),
  messagesLimit: integer('messages_limit').notNull(),
  notificationsLimit: integer ('notifications_limit').notNull().default(0),
  regionId: uuid('region_id').notNull(),
  currencyId: integer('currency_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  deleted: boolean('deleted').default(false).notNull(),
})
