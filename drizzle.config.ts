import "dotenv/config"
import { defineConfig } from "drizzle-kit"
console.log(process.env.DATABASE_URL)

export default defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./src/server/db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    // database: "database",
    // user: "username",
    // password: "password",
    // host: "localhost",
    // port: 5432,
  },
})