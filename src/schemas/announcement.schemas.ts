import { z } from 'zod'

export const AnnouncementSchema = z.object({
  id: z.string(),
  audience: z.enum(['All School', 'Students', 'Teachers']),
  authorName: z.string(),
  title: z.string(),
  content: z.string(),
  publishedAt: z.string(),
  isRead: z.boolean().optional().default(false),
})

export type AnnouncementModel = z.infer<typeof AnnouncementSchema>

// Create Announcement Schema (without id and timestamps)
export const CreateAnnouncementSchema = AnnouncementSchema.omit({
  id: true,
  publishedAt: true,
  isRead: true,
})

export type CreateAnnouncementModel = z.infer<typeof CreateAnnouncementSchema>

// Edit Announcement Schema
export const EditAnnouncementSchema = AnnouncementSchema.omit({ id: true })

export type EditAnnouncementModel = z.infer<typeof EditAnnouncementSchema>

export const AnnouncementSearchSchema = z.object({
  search: z.string().optional(),
})
