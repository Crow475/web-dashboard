-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."user_role" AS ENUM('admin', 'editor', 'viewer');--> statement-breakpoint
CREATE TABLE "dashboards" (
	"dashboard_id" uuid DEFAULT uuid_generate_v4() NOT NULL,
	"title" varchar(63) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"edited_at" timestamp,
	"properties" json NOT NULL,
	"owner_id" uuid NOT NULL,
	"is_private" boolean DEFAULT true,
	"icon" char(35)
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"profile_id" uuid DEFAULT uuid_generate_v4() NOT NULL,
	"username" varchar(63) NOT NULL,
	"user_id" uuid NOT NULL,
	"icon" char(35),
	"public_email" varchar(254)
);
--> statement-breakpoint
CREATE TABLE "users_of_dashboard" (
	"profile_id" uuid NOT NULL,
	"role_in_dashboard" "user_role",
	"dashboard_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dashboards" ADD CONSTRAINT "dashboard_owner" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_of_dashboard" ADD CONSTRAINT "fk_profile" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_of_dashboard" ADD CONSTRAINT "fk_dashboard" FOREIGN KEY ("dashboard_id") REFERENCES "public"."dashboards"("dashboard_id") ON DELETE no action ON UPDATE no action;
*/