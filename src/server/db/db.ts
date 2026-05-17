import * as schema from "./schema"
import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import type { NeonHttpDatabase } from "drizzle-orm/neon-http"

import "dotenv/config"

const sql = neon(process.env.DATABASE_URL!)

export type Database = NeonHttpDatabase<typeof schema>

export const db: Database = drizzle(sql, {
  schema,
})


