import {pgTable, uuid, text, timestamp, boolean} from 'drizzle-orm/pg-core'

/**
 * Table to store businesses
 *
 * This table stores information about businesses
 */
export const businesses = pgTable('businesses', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessName: text('business_name').notNull().unique(),
  email: text('email'),
  stripeId: text('stripe_id'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  secondLastName: text('second_last_name'),
  displayName: text('display_name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  deleted: boolean('deleted').default(false).notNull(),
})
