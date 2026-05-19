import * as schema from '#/server/db/schema';
import { classIdSchema, getTeacherClassMarksPageSchema } from '#/schemas/marks.schema';
import { addTeacherSchema, assignmentIdSchema, assignTeacherSchema, editTeacherSchema, getTeacherClassesSchema, getTeachersSchema, schoolIdSchema, teacherIdSchema, teacherSearchSchema, teacherUserIdSchema, updateTeacherAssignmentSchema } from '#/schemas/teachers.schema';
import z from "zod";
import type { AuthUser } from './authTypes';






export type Teacher = typeof schema.teachersTable.$inferSelect

// * Teacher with user info
export type TeacherUser = AuthUser & {
	info: Teacher
}

export type TeacherAssignments = typeof schema.teacherAssignmentsTable.$inferSelect

export type GetTeacherClassMarksPageType = z.infer<
    typeof getTeacherClassMarksPageSchema
>

export type GetTeachersType = z.infer<typeof getTeachersSchema>;

export type AddTeacherType = z.infer<typeof addTeacherSchema>;

export type EditTeacherType = z.infer<typeof editTeacherSchema>;

export type TeacherIdType = z.infer<typeof teacherIdSchema>;

export type TeacherUserIdType = z.infer<typeof teacherUserIdSchema>;

export type SchoolIdType = z.infer<typeof schoolIdSchema>;

export type AssignTeacherType = z.infer<typeof assignTeacherSchema>;

export type UpdateTeacherAssignmentType = z.infer<
    typeof updateTeacherAssignmentSchema
>

export type AssignmentIdType = z.infer<typeof assignmentIdSchema>

export type ClassIdType = z.infer<typeof classIdSchema>

export type GetTeacherClassesType = z.infer<typeof getTeacherClassesSchema>

export type TeacherSearchType = z.infer<typeof teacherSearchSchema>

export type TeacherClassItem = {
  assignmentId: string
  classId: string
  className: string
  gradeId: string
  gradeName: string
  subjectId: string
  subjectName: string
  studentCount: number
  isPrimaryTeacher: boolean
  status: schema.StatusEnum
}
