import {pgTable, uuid} from 'drizzle-orm/pg-core'
import {network} from '@/db/schema/network'
import {plans} from "@/db/schema/plans";

export const networksPerPlan = pgTable('networks_per_plan', {
  id: uuid('id').defaultRandom().primaryKey(),
  network_id: uuid('network_id').notNull().references(() => network.id),
  plan_id: uuid('plan_id').notNull().references(() => plans.id),
})
