import z from "zod/v4"

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(5),
})

export const registerSchema = z.object({
    email: z.email(),
    password: z.string().min(5),
    username: z.string().min(3),
})

export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>
