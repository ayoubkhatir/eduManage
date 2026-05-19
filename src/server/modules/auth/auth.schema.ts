import { authRoleSchema, genderSchema } from "#/schemas/shared.schema"
import z from "zod"

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
    rememberMe: z.boolean().default(false),
    role: authRoleSchema,
    callbackURL: z.url().optional(),
})

export const registerSchema = z.object({
    fullName: z.string().min(3),
    schoolName: z.string().min(3),
    email: z.email(),
    password: z.string().min(8),
    gender: genderSchema,
    rememberMe: z.boolean().default(false),
    callbackURL: z.url().optional(),
    confirmPassword: z.string().min(8)
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })


export type LoginBody = z.infer<typeof loginSchema>
export type RegisterBody = z.infer<typeof registerSchema>
