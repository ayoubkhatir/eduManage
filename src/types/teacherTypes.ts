import * as schema from '#/server/db/schema';
import { classIdSchema, getTeacherClassMarksPageSchema } from '#/schemas/marks.schema';
import { addTeacherSchema, assignmentIdSchema, assignTeacherSchema, editTeacherSchema, getTeacherClassesSchema, getTeachersSchema, schoolIdSchema, teacherIdSchema, teacherSearchSchema, teacherUserIdSchema, updateTeacherAssignmentSchema } from '#/schemas/teachers.schema';
import z from "zod";





export type Teacher = typeof schema.teachersTable.$inferSelect

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



// export type TeacherUser = {
//     id: string,
//     userId: string,
//     // teacherId: string,
//     email: string;
//     emailVerified: boolean;
//     image: string | null;
//     name: string;
//     telNumber: string | null;
//     role: schema.UserRoleEnum;
//     createdAt: Date;
//     updatedAt: Date;
//     schoolId: string;
//     gender: schema.UserGenderEnum;
//     address: string;
//     subjects: { id: string, name: string }[];
//     dateOfBirth: string;
//     joiningDate: string;
//     status: schema.StatusEnum;
//     about: string
// }

// export function TeacherUserDto(
//     teacher: Teacher,
//     user: AuthUser,
//     subjects: { id: string, name: string }[]
// ): TeacherUser {
//     return {
//         id: teacher.id,
//         address: teacher.address,
//         createdAt: user.createdAt,
//         dateOfBirth: teacher.dateOfBirth,
//         email: user.email,
//         emailVerified: user.emailVerified,
//         gender: user.gender,
//         image: user.image,
//         name: user.name,
//         role: user.role,
//         schoolId: teacher.schoolId,
//         status: teacher.status,
//         updatedAt: user.updatedAt,
//         userId: user.id,
//         telNumber: user.telNumber,
//         joiningDate: teacher.joiningDate,
//         // teacherId: teacher.id,
//         subjects,
//         about: teacher.about,
//     }
// }