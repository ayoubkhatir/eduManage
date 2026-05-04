import { phoneNumberSchema } from '#/schemas/shared.schema'
import { z } from 'zod/v4'

export const newInfoSchema = z
  .object({
    id: z.number().optional(),
    username: z.string().min(1, 'Username is required'),
    telNumber: phoneNumberSchema,
    about: z.string().nullable(),
    newPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm Password must be at least 6 characters long'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type NewInfoSchema = z.infer<typeof newInfoSchema>
