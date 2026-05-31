import z from "zod/v4";
import { addUserSchema, getUsersSchema } from "./users.schema";
import { phoneNumberSchema, statusSchema, validCuidSchema } from "./shared.schema";
import { DashboardPeriodEnum } from "#/types/studentTypes";

export const getStudentsSchema = getUsersSchema.extend({
    grade: z.string().trim().nullable().default(null),
    classe: z.string().trim().nullable().default(null),
});

export const addStudentSchema = addUserSchema.extend({
    schoolId: validCuidSchema,
    gradeId: validCuidSchema,
    classId: validCuidSchema,
    parentPhoneNumber: phoneNumberSchema,
    parentName: z.string().trim().nonempty('Parent name is required'),
    status: statusSchema,
    address: z.string().nonempty(),
    dateOfBirth: z.string(),
    enrollmentDate: z.string(),
})

export const editStudentSchema = addStudentSchema
    .extend({ studentId: validCuidSchema })
    .omit({ schoolId: true });

export const studentSearchSchema = z.object({
    search: z.string().default(""),
    page: z.number().default(1),
    size: z.number().default(10),
    sortBy: z.enum(['name', 'email']).default('name'),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export const dashboardPeriodSchema = z.object({
  period: z.enum(DashboardPeriodEnum),
  schoolId: z.string(),
})