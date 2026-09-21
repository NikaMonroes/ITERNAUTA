CREATE TABLE "offers" (
	"id" serial PRIMARY KEY NOT NULL,
	"publication_partner_id" integer NOT NULL,
	"partner_sku" varchar(100) NOT NULL,
	"price" integer NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"status" varchar(30) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_publication_partner_id_publication_partners_id_fk" FOREIGN KEY ("publication_partner_id") REFERENCES "public"."publication_partners"("id") ON DELETE no action ON UPDATE no action;