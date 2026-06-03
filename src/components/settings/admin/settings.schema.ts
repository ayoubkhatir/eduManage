
import { UserGenderEnum } from '#/server/db/schema'
import { z } from 'zod/v4'

export const newInfoOwnerSchema = z.object({
	id: z.string(),
	name: z.string().min(3, 'Name is required'),
	SchoolName: z.string().min(3, 'School name is required'),
	description: z.string().optional(),
	email: z.string().email('Invalid email address'),
	phoneNumber: z
		.string()
		.regex(/^(?:\+213|0)(?:5|6|7)\d{8}$/, 'Phone number is not valid'),
	image: z.string().optional(),
	gender: z.enum(UserGenderEnum).optional(),
	teacherNotifications: z.boolean().optional(),
	schoolAnnouncements: z.boolean().optional(),
	sharedCalendar: z.boolean().optional(),
	paymentsModule: z.boolean().optional(),
})
export type NewInfoOwnerFields = z.infer<typeof newInfoOwnerSchema>
