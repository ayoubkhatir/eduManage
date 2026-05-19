import * as schema from '#/server/db/schema';
import { addStudentSchema, editStudentSchema, getStudentsSchema, studentSearchSchema } from '#/schemas/students.schema';
import z from "zod";
import type { AuthUser } from './authTypes';

export type Student = typeof schema.studentsTable.$inferSelect

export type StudentUser = Omit<AuthUser, "info"> & {
    info: Student
}

export type GetStudentsType = z.infer<typeof getStudentsSchema>;

export type AddStudentType = z.infer<typeof addStudentSchema>

export type EditStudentType = z.infer<typeof editStudentSchema>

export type StudentSearchType = z.infer<typeof studentSearchSchema>

export type StudentMarksType = typeof schema.studentMarksTable.$inferSelect

// export function StudentUserDto(
//     student: Student,
//     user: AuthUser,
//     studentClass: { id: string, name: string },
//     grade: { id: string, name: string }
// ): StudentUser {
//     return {
//         id: student.id,
//         address: student.address,
//         createdAt: user.createdAt.toISOString(),
//         dateOfBirth: student.dateOfBirth,
//         email: user.email,
//         emailVerified: user.emailVerified,
//         gender: user.gender,
//         image: user.image,
//         name: user.name,
//         parentName: student.parentName,
//         parentPhoneNumber: student.parentPhoneNumber,
//         role: user.role,
//         schoolId: student.schoolId,
//         status: student.status,
//         updatedAt: user.updatedAt.toISOString(),
//         userId: user.id,
//         telNumber: user.telNumber,
//         enrollmentDate: student.enrollmentDate,
//         class: studentClass,
//         grade
//     }
// }