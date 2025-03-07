ALTER TABLE "whatsapp_secretary_conversation" RENAME COLUMN "whatsapp_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "whatsapp_secretary_conversation" DROP CONSTRAINT "whatsapp_secretary_conversation_whatsapp_id_whatsapp_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "whatsapp_jid" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "whatsapp_secretary_conversation" ADD CONSTRAINT "whatsapp_secretary_conversation_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
