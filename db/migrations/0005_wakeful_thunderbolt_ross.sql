ALTER TABLE "business_plan" ADD COLUMN "reminder_limit" integer;--> statement-breakpoint
ALTER TABLE "business_plan" ADD COLUMN "reminders_usage" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "plans" ADD COLUMN "notifications_limit" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "whatsapp_conversation" ADD COLUMN "ephemeral_expiration" integer;