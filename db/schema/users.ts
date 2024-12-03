import {pgTable, uuid, text, boolean, integer} from 'drizzle-orm/pg-core'
import {businesses} from '@/db/schema/businesses'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name'),
  username: text('username').unique(),
  password: text('password').notNull(),
  email: text('email'),
  roleId: integer('role_id').notNull(),
  businessId: uuid('business_id').references(() => businesses.id),
  deleted: boolean('deleted').default(false).notNull(),
})
