
import * as schema from '#/server/db/schema';
import { addStudentSchema, editStudentSchema, getStudentsSchema  } from '#/schemas/students.schema';
import z from "zod";

export type Student = typeof schema.studentsTable.$inferSelect

export type StudentMarks = typeof schema.studentMarksTable.$inferSelect

export type GetStudentsSchema = z.infer<typeof getStudentsSchema>;

export type AddStudentSchema = z.infer<typeof addStudentSchema>

export type EditStudentSchema = z.infer<typeof editStudentSchema>