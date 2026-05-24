ALTER TABLE "announcements" ALTER COLUMN "audience" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "announcements" ALTER COLUMN "audience" SET DEFAULT 'Public'::text;--> statement-breakpoint
DROP TYPE "public"."announcement_audience";--> statement-breakpoint
CREATE TYPE "public"."announcement_audience" AS ENUM('Public', 'Teachers', 'Students');--> statement-breakpoint
ALTER TABLE "announcements" ALTER COLUMN "audience" SET DEFAULT 'Public'::"public"."announcement_audience";--> statement-breakpoint
ALTER TABLE "announcements" ALTER COLUMN "audience" SET DATA TYPE "public"."announcement_audience" USING "audience"::"public"."announcement_audience";