import {boolean, pgTable, uuid} from "drizzle-orm/pg-core";
import {users} from "@/db/schema/users";
import {businessLocations} from "@/db/schema/businessLocations";

export const businessUsersLocations = pgTable('business_users_locations', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessUserId: uuid('business_user_id').notNull().references(() => users.id),
  businessLocationId: uuid('business_location_id').notNull().references(() => businessLocations.id),
  deleted: boolean('deleted').default(false).notNull(),
})