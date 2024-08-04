import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import dotenv from "dotenv";

import * as schema from "./schema";

dotenv.config();

if (!process.env.DATABASE_URL) {
    console.log("🔴 Cannot find database url");
}

const client = postgres(process.env.DATABASE_URL as string, { max: 1 });
const db = drizzle(client, { schema });

export default db;