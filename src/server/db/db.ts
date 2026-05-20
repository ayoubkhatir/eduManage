import * as schema from "./schema"
import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import type { NeonHttpDatabase } from "drizzle-orm/neon-http"

const sql = neon(import.meta.env.VITE_DATABASE_URL!)

export type Database = NeonHttpDatabase<typeof schema>

export const db: Database = drizzle(sql, {
  schema,
})


