import z from 'zod/v4'
import { validCuidSchema } from '#/schemas/shared.schema'

export const assessmentStatusSchema = z.enum([
    'Active',
    'Inactive',
    'Pending',
    'New',
])

export const assessmentTypeSchema = z.enum([
    'Homework',
    'Quiz',
    'Test',
    'Exam',
    'Project',
    'Participation',
])

export const classIdSchema = z.object({
    classId: validCuidSchema,
})

export const assessmentIdSchema = z.object({
    assessmentId: validCuidSchema,
})

export const getTeacherClassMarksPageSchema = z.object({
    classId: validCuidSchema,
    teacherId: validCuidSchema,
    subjectId: validCuidSchema.optional(),
    periodId: validCuidSchema.optional(),
})

export type GetTeacherClassMarksPageSchema = z.infer<
    typeof getTeacherClassMarksPageSchema
>

export const createAssessmentSchema = z.object({
    schoolId: validCuidSchema,
    classId: validCuidSchema,
    subjectId: validCuidSchema,
    teacherAssignmentId: validCuidSchema.optional(),
    periodId: validCuidSchema.optional(),

    title: z.string().trim().min(2).max(120),
    type: assessmentTypeSchema,
    maxScore: z.coerce.number().int().positive().max(1000).default(20),
    weight: z.coerce.number().int().positive().max(100).default(1),
    assessmentDate: z.string().datetime().optional(),
    notes: z.string().trim().max(2000).optional(),
    status: assessmentStatusSchema.default('Active'),
})

export type CreateAssessmentSchema = z.infer<typeof createAssessmentSchema>

export const updateAssessmentSchema = z.object({
    assessmentId: validCuidSchema,
    title: z.string().trim().min(2).max(120).optional(),
    type: assessmentTypeSchema.optional(),
    maxScore: z.coerce.number().int().positive().max(1000).optional(),
    weight: z.coerce.number().int().positive().max(100).optional(),
    assessmentDate: z.string().datetime().optional(),
    notes: z.string().trim().max(2000).nullable().optional(),
    periodId: validCuidSchema.nullable().optional(),
    status: assessmentStatusSchema.optional(),
})

export type UpdateAssessmentSchema = z.infer<typeof updateAssessmentSchema>

export const getAssessmentsByClassSubjectSchema = z.object({
    classId: validCuidSchema,
    subjectId: validCuidSchema,
    periodId: validCuidSchema.optional(),
})

export type GetAssessmentsByClassSubjectSchema = z.infer<
    typeof getAssessmentsByClassSubjectSchema
>

export const markEntrySchema = z.object({
    studentId: validCuidSchema,
    score: z.union([z.coerce.number().min(0).max(1000), z.null()]).optional(),
    absent: z.boolean().default(false),
    excused: z.boolean().default(false),
    comment: z.string().trim().max(1000).nullable().optional(),
})

export const saveStudentMarksSchema = z.object({
    schoolId: validCuidSchema,
    assessmentId: validCuidSchema,
    marks: z.array(markEntrySchema).min(1),
})

export type SaveStudentMarksSchema = z.infer<typeof saveStudentMarksSchema>

export const getAssessmentMarksSchema = z.object({
    assessmentId: validCuidSchema,
})

export type GetAssessmentMarksSchema = z.infer<typeof getAssessmentMarksSchema>

export const deleteAssessmentSchema = z.object({
    assessmentId: validCuidSchema,
})

export type DeleteAssessmentSchema = z.infer<typeof deleteAssessmentSchema>