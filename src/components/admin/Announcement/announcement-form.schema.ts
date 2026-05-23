import { z } from 'zod'

export const AnnouncementFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters'),
  content: z
    .string()
    .min(1, 'Content is required')
    .min(10, 'Content must be at least 10 characters'),
  audience: z.enum(['All School', 'Students', 'Teachers'] as const, {
    error: 'Please select an audience',
  }),
  status: z.enum(['PUBLISHED', 'DRAFT', 'ARCHIVED']),
})

export type AnnouncementFormType = z.infer<typeof AnnouncementFormSchema>

export const getAnnouncementFormSchema = () => AnnouncementFormSchema
