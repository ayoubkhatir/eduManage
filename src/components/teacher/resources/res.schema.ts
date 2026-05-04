import z from 'zod'

export const resourceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  folder: z.string().min(1, 'Folder selection is required'),
  description: z.string().optional(),
})

export type ResourceType = z.infer<typeof resourceSchema>
