import z from "zod/v4";
import { getUsersSchema } from "./users.schema";
import { genderSchema, statusSchema, validCuidSchema } from "./shared.schema";
import { StatusEnum } from "#/server/db/schema";

export const getTeachersSchema = getUsersSchema.extend({
    subject: z.string().nullable().default(""),
});



export const addTeacherSchema = z.object({
    schoolId: validCuidSchema,
    name: z.string().min(2).max(50),
    email: z.email(),
    image: z.string(),
    telNumber: z.string().max(20),
    gender: genderSchema,
    address: z.string().min(1),
    dateOfBirth: z.string().min(1),
    status: statusSchema,
})



export const editTeacherSchema = z
    .object({
        teacherId: z.string().min(1),
        name: z.string().min(2).max(50),
        email: z.email(),
        image: z.string().nullable(),
        telNumber: z.string().min(1).max(20),
        gender: genderSchema,

        about: z.string(),
        address: z.string().min(1),
        dateOfBirth: z.string().min(1),
        status: statusSchema,
    })



export const teacherIdSchema = z.object({
    teacherId: z.string().min(1),
})



export const teacherUserIdSchema = z.object({
    userId: z.string().min(1),
})



export const schoolIdSchema = z.object({
    schoolId: validCuidSchema,
})



export const assignTeacherSchema = z.object({
    schoolId: validCuidSchema,
    teacherId: validCuidSchema,
    classId: validCuidSchema,
    gradeId: validCuidSchema,
    subjectId: validCuidSchema,
    isPrimaryTeacher: z.boolean().optional(),
    status: statusSchema.optional(),
})



export const updateTeacherAssignmentSchema = z
    .object({
        assignmentId: validCuidSchema,
        classId: validCuidSchema.optional(),
        subjectId: validCuidSchema.optional(),
        isPrimaryTeacher: z.boolean().optional(),
        status: statusSchema.optional(),
    })
    .strict()



export const assignmentIdSchema = z.object({
    assignmentId: validCuidSchema,
})



export const classIdSchema = z.object({
    classId: validCuidSchema,
})



export const getTeacherClassesSchema = z.object({
    teacherId: validCuidSchema,
    search: z.string().default(''),
    page: z.coerce.number().int().default(1),
    size: z.coerce.number().int().default(10),
    status: z
        .enum([...Object.values(StatusEnum), "All"])
        .default('All'),
})

