import z from "zod";
import type { addClassSchema } from "#/schemas/classes.schema";
import * as schema from '../server/db/schema';
import type { ReactNode } from "react";






export type Class = typeof schema.classesTable.$inferSelect



export type AddClassSchema = z.infer<typeof addClassSchema>

export type ClassCardProps = {
  classe: {
    id: string
    name: string
  }
  children : ReactNode
}