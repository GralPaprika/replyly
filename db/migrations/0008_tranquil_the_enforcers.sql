ALTER TABLE "users" ADD COLUMN "phone_number" text;--> statement-breakpoint
ALTER TABLE "whatsapp" DROP COLUMN IF EXISTS "phone_number";