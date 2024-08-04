import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const user = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    audios: text("audio_urls").array(),
});

