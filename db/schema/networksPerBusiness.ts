import {boolean, pgTable, uuid} from 'drizzle-orm/pg-core'
import {network} from '@/db/schema/network'
import {businesses} from '@/db/schema/businesses'

/**
 * Table that associates a businesses with networks
 *
 * When a business is associated with a plan, a set of networks are associated with the business for the duration of the plan.
 * TODO: The active field is used to determine if the network is currently active for the business. This way the network
 * can be disabled without deleting the association and the chat can be still displayed. This should be talk about with
 * the development team to see if this is the desired behavior.
 */
export const networksPerBusiness = pgTable('networks_per_business', {
  id: uuid('id').defaultRandom().primaryKey(),
  networkId: uuid('network_id').notNull().references(() => network.id),
  businessId: uuid('business_id').notNull().references(() => businesses.id),
  active: boolean('active').default(true).notNull(),
  deleted: boolean('deleted').default(false).notNull(),
})
