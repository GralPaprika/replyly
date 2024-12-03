import {boolean, integer, pgTable, timestamp, uuid} from "drizzle-orm/pg-core";
import {businesses} from "@/db/schema/businesses";
import {plans} from "@/db/schema/plans";

/**
 * Business Plan
 *
 * When a business buys a plan, a record should be created in this table.
 * By our 'business rules', a plan has a start and end date, but it could be manually deactivated to stop the usage.
 * This is because the limit is not enforced, the excess is just a warning, and it's paid at the end of the month in its
 * own rate.
 */
export const businessPlan = pgTable('business_plan', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessId: uuid('business_id').notNull().references(() => businesses.id),
  planId: uuid('plan_id').notNull().references(() => plans.id),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  active: boolean('active').default(true).notNull(),
  limit: integer('plan_limit'),
  usage: integer('usage').default(0).notNull(),
})