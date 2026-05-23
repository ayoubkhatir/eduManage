CREATE TYPE "public"."announcement_audience" AS ENUM('All', 'Teachers', 'Students');--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"author_id" text NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"audience" "announcement_audience" DEFAULT 'All' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_school_id_admins_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."admins"("school_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "announcements_school_title_unique" ON "announcements" USING btree ("school_id","author_id","title");