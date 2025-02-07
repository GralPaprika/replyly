ALTER TABLE "whatsappContacts" RENAME TO "whatsapp_contacts";--> statement-breakpoint
ALTER TABLE "whatsapp_contacts" DROP CONSTRAINT "whatsappContacts_whatsapp_id_whatsapp_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "plans" ADD COLUMN "enum_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "whatsapp_contacts" ADD CONSTRAINT "whatsapp_contacts_whatsapp_id_whatsapp_id_fk" FOREIGN KEY ("whatsapp_id") REFERENCES "public"."whatsapp"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
