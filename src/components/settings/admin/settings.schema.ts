
import z from 'zod'

export const newInfoOwnerSchema = z.object({
  SchoolName: z.string().min(3, 'School name is required'),
  description: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phoneNumber: z
    .string()
    .regex(/^(?:06|05|07)\d{8}$/, 'Phone number is not valid'),
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
export type NewInfoOwnerFields = z.infer<typeof newInfoOwnerSchema>
