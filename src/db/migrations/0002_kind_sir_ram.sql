ALTER TABLE "users" DROP CONSTRAINT "users_name_unique";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;