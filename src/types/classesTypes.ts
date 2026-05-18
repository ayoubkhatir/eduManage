import z from "zod";
import type { addClassSchema } from "#/schemas/classes.schema";
import * as schema from '../server/db/schema';






export type Class = typeof schema.classesTable.$inferSelect



export type AddClassSchema = z.infer<typeof addClassSchema>