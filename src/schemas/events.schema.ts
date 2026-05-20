import z from 'zod/v4'
import { statusSchema, validCuidSchema } from '#/schemas/shared.schema'

export const getEventsSchema = z.object({
    classId: validCuidSchema.optional(),
    teacherUserId: validCuidSchema.optional(),
    isOwner: z.boolean().default(false),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
})


export const addEventSchema = z.object({
    schoolId: validCuidSchema,
    classId: validCuidSchema.optional(),
    teacherId: validCuidSchema.optional(),
    subjectId: validCuidSchema.optional(),

    title: z.string().trim().min(2).max(150),
    description: z.string().trim().optional().default(''),
    color: z.string().trim().default('#2563eb'),

    start: z.date(),
    end: z.date(),

    allDay: z.boolean().default(false),
    repeatWeekly: z.boolean().default(false),
    isClass: z.boolean().default(false),
    status: statusSchema
})

