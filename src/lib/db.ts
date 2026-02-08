import { Pool } from "pg";

let pool: Pool | null = null;

export function getDbPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  if (!pool) {
    console.log(`Initializing DB pool with URL: ${connectionString.substring(0, 20)}...`);
    pool = new Pool({ connectionString });
  }

  return pool;
}
