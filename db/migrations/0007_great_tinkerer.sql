CREATE TABLE IF NOT EXISTS "secretaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"remote_jid" text NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "whatsapp_secretary_conversation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"whatsapp_id" uuid NOT NULL,
	"secretary_id" uuid NOT NULL,
	"ephemeral_expiration" integer,
	"deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clients" RENAME COLUMN "whatsapp_id" TO "remote_jid";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "whatsapp_secretary_conversation" ADD CONSTRAINT "whatsapp_secretary_conversation_whatsapp_id_whatsapp_id_fk" FOREIGN KEY ("whatsapp_id") REFERENCES "public"."whatsapp"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "whatsapp_secretary_conversation" ADD CONSTRAINT "whatsapp_secretary_conversation_secretary_id_secretaries_id_fk" FOREIGN KEY ("secretary_id") REFERENCES "public"."secretaries"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
