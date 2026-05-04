import { z } from 'zod/v4'
import { statusSchema } from './shared.schema'

export const addSubjectSchema = z.object({
    schoolId: z.string().min(1, 'School is required'),
    name: z
        .string()
        .min(2, 'Subject name is required')
        .max(80, 'Subject name is too long'),
    code: z
        .string()
        .max(30, 'Code is too long'),
    gradeIds: z.array(z.string().min(1)).min(1, 'Select at least one grade'),
    status: statusSchema,
})

export type AddSubjectSchema = z.infer<typeof addSubjectSchema>