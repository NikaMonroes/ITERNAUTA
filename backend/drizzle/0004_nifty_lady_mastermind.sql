CREATE TABLE "publication_partners" (
	"id" serial PRIMARY KEY NOT NULL,
	"publication_id" integer NOT NULL,
	"partner_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "publication_partners" ADD CONSTRAINT "publication_partners_publication_id_publications_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_partners" ADD CONSTRAINT "publication_partners_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;