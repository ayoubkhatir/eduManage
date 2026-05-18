


import * as schema from '#/server/db/schema';
import { createAssessmentSchema, updateAssessmentSchema , getAssessmentsByClassSubjectSchema, saveStudentMarksSchema, getAssessmentMarksSchema, deleteAssessmentSchema} from "#/schemas/marks.schema";
import z from "zod";





export type Assessment = typeof schema.assessmentsTable.$inferSelect

export type AssessmentPeriod = typeof schema.assessmentPeriodsTable.$inferSelect

export const AssessmentType = schema.assessmentTypeEnum

export type CreateAssessmentSchema = z.infer<typeof createAssessmentSchema>
    
export type UpdateAssessmentSchema = z.infer<typeof updateAssessmentSchema>

export type GetAssessmentsByClassSubjectSchema = z.infer<
    typeof getAssessmentsByClassSubjectSchema
>
    
export type SaveStudentMarksSchema = z.infer<typeof saveStudentMarksSchema>

export type GetAssessmentMarksSchema = z.infer<typeof getAssessmentMarksSchema>

export type DeleteAssessmentSchema = z.infer<typeof deleteAssessmentSchema>
