import type { addSubjectSchema } from '#/schemas/subjects.schema';
import * as schema from '#/server/db/schema';
import z from "zod";






export type Subject = typeof schema.subjectsTable.$inferSelect

export type AddSubjectSchema = z.infer<typeof addSubjectSchema>