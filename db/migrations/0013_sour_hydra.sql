ALTER TABLE "plans" DROP CONSTRAINT "plans_name_unique";--> statement-breakpoint
ALTER TABLE "plans" ADD COLUMN IF NOT EXISTS "display_name" text;--> statement-breakpoint
ALTER TABLE "plans" ADD COLUMN IF NOT EXISTS "currency_id" uuid;