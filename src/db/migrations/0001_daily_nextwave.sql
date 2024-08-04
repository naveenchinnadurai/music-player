ALTER TABLE "user" RENAME TO "users";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "user_name_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "user_email_unique";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");