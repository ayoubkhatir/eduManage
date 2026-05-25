import * as schema from '#/server/db/schema';
import { addGradeSchema } from "#/schemas/grades.schema";
import z from "zod";

export type Grade = typeof schema.gradesTable.$inferSelect

export type GradeSubjects = typeof schema.gradeSubjectsTable.$inferSelect

export type AddGradeSchema = z.infer<typeof addGradeSchema>

export type GradeCardProps = {
  grade: {
    id: string
    name: string
    levelOrder: number
    status: string
    classes: Array<{
      id: string
      name: string
    }>
    subjects: Array<{
      id: string
      name: string
      code?: string | null
    }>
  }
}




