import {boolean, pgTable, text, uuid} from "drizzle-orm/pg-core";

/**
 * The social media platforms that are supported by the application.
 */
export const network = pgTable('network', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  deleted: boolean('deleted').default(false).notNull(),
  isRegisteredInStripe: boolean('is_registered_in_stripe').default(false).notNull(),
})
