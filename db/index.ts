import { drizzle } from "drizzle-orm/netlify-db";
import * as schema from "./schema.js";

// Lazy: drizzle() throws at import time when NETLIFY_DB_URL is unset,
// which would crash the whole function before it can validate input.
// Create the client on first use instead, so validation and the
// stored:false fallback keep working when the DB is not wired up.
let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db) _db = drizzle({ schema });
  return _db;
}
