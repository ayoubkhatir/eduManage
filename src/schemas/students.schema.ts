import z from "zod/v4";
import { addUserSchema, getUsersSchema } from "./users.schema";
import { phoneNumberSchema, validCuidSchema } from "./shared.schema";

export const getStudentsSchema = getUsersSchema.extend({
    grade: z.string().trim().nullable().default(null),
    classe: z.string().trim().nullable().default(null),
});
export type GetStudentsSchema = z.infer<typeof getStudentsSchema>;

export const addStudentSchema = addUserSchema.extend({
    schoolId: validCuidSchema,
    gradeId: validCuidSchema,
    classId: validCuidSchema,
    parentPhoneNumber: z.string()
        .regex(/^(?:06|05|07)\d{8}$/, 'Phone number is not valid'),
    parentName: phoneNumberSchema,
    status: z.enum(["Active", "Inactive", "Pending", "New"]),
    address: z.string().nonempty(),

    dateOfBirth: z.string(),
    enrollmentDate: z.string(),
})
export type AddStudentSchema = z.infer<typeof addStudentSchema>

export const editStudentSchema = addStudentSchema
    .extend({ studentId: validCuidSchema })
    .omit({ schoolId: true });
export type EditStudentSchema = z.infer<typeof editStudentSchema>