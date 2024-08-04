CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"audio_urls" text[],
	CONSTRAINT "user_name_unique" UNIQUE("name"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
