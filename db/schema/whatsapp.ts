import {pgTable, uuid, text, timestamp, boolean, integer} from 'drizzle-orm/pg-core'
import {businessLocations} from "@/db/schema/businessLocations";

/**
 * Whatsapp table
 *
 * This table store whatsapp information necessary to send and receive messages.
 * It's linked to a business location.
 */
export const whatsapp = pgTable('whatsapp', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessLocationId: uuid('business_location_id').notNull().references(() => businessLocations.id),
  phoneNumber: text('phone_number').notNull(),
  sessionStatus: integer('session_status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  deleted: boolean('deleted').default(false).notNull(),
})
