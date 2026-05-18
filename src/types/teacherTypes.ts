import * as schema from '#/server/db/schema';
import { classIdSchema, getTeacherClassMarksPageSchema  } from '#/schemas/marks.schema';
import { addTeacherSchema, assignmentIdSchema, assignTeacherSchema, editTeacherSchema, getTeacherClassesSchema, getTeachersSchema, schoolIdSchema, teacherIdSchema, teacherUserIdSchema, updateTeacherAssignmentSchema } from '#/schemas/teachers.schema';
import z from "zod";





export type Teacher = typeof schema.teachersTable.$inferSelect

export type TeacherAssignments = typeof schema.teacherAssignmentsTable.$inferSelect

export type GetTeacherClassMarksPageSchema = z.infer<
    typeof getTeacherClassMarksPageSchema
>

export type GetTeachersSchema = z.infer<typeof getTeachersSchema>;

export type AddTeacherSchema = z.infer<typeof addTeacherSchema>

export type EditTeacherSchema = z.infer<typeof editTeacherSchema>

export type TeacherIdSchema = z.infer<typeof teacherIdSchema>

export type TeacherUserIdSchema = z.infer<typeof teacherUserIdSchema>

export type SchoolIdSchema = z.infer<typeof schoolIdSchema>

export type AssignTeacherSchema = z.infer<typeof assignTeacherSchema>

export type UpdateTeacherAssignmentSchema = z.infer<
    typeof updateTeacherAssignmentSchema
>

export type AssignmentIdSchema = z.infer<typeof assignmentIdSchema>

export type ClassIdSchema = z.infer<typeof classIdSchema>

export type GetTeacherClassesSchema = z.infer<typeof getTeacherClassesSchema>
