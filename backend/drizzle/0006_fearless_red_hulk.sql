CREATE TYPE "public"."user_plan" AS ENUM('FREE', 'PREMIUM');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('CLIENT', 'ORGANIZER', 'SPONSOR', 'SUPER_ADMIN');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"identity_provider_id" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'CLIENT' NOT NULL,
	"plan" "user_plan" DEFAULT 'FREE' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_identity_provider_id_unique" UNIQUE("identity_provider_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
