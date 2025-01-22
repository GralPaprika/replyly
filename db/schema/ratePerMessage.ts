import {boolean, doublePrecision, integer, pgTable, uuid} from 'drizzle-orm/pg-core'
import {businesses} from '@/db/schema/businesses'
import {currencies} from "@/db/schema/currencies";

/**
 * The rate per message for a business.
 * A business can have multiple rates per message, but only one can be active at a time. The active rate per message is
 * determined by the limit. If the limit is null, then the rate is active.
 * Once the limit is reached the next available rate is activated.
 * TODO: We need to discuss this 'business rule', what happens is the limit is reached and no other rate is available?
 * My suggestion is to keep the last rate active.
 */
export const ratePerMessage = pgTable('rate_per_message', {
  id: uuid('id').defaultRandom().primaryKey(),
  rate: doublePrecision('rate').notNull(),
  currency: integer('currency').notNull().references(() => currencies.id),
  businessId: uuid('business_id').notNull().references(() => businesses.id),
  messagesLowerLimit: integer('messages_lower_limit').default(0).notNull(),
  messagesUpperLimit: integer('messages_upper_limit'),
  deleted: boolean('deleted').default(false).notNull(),
})
