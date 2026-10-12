import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({
  path: "../../.env",
});

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

export const pool = new Pool({
  connectionString: databaseUrl,
});