import {boolean, jsonb, pgTable, text, timestamp, uuid} from 'drizzle-orm/pg-core'
import {businesses} from '@/db/schema/businesses'

/**
 * Business Locations
 *
 * Each business could have multiple locations, the relationship is one-to-many.
 * When a business is created by default a 'global' location should be created.
 */
export const businessLocations = pgTable('business_locations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  businessId: uuid('business_id').notNull().references(() => businesses.id),
  address: text('address').notNull(),
  isGlobal: boolean('is_global').notNull(),
  schedule: jsonb('schedule'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  deleted: boolean('deleted').default(false).notNull(),
})
