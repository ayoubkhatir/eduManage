import { createServerFn } from '@tanstack/react-start'
import {
    createAssessmentSchema,
    deleteAssessmentSchema,
    getAssessmentMarksSchema,
    getAssessmentsByClassSubjectSchema,
    getTeacherClassMarksPageSchema,
    saveStudentMarksSchema,
    updateAssessmentSchema,
} from '#/schemas/marks.schema'
import { marksController } from './marks.controller'
import {
    successResponse,
    type APIResponse,
} from '#/server/utils/response.type'
import { mapDbError } from '#/server/utils/db_error_handling'

export const getTeacherClassMarksPageServerFn = createServerFn({
    method: 'GET',
})
    .inputValidator(getTeacherClassMarksPageSchema)
    .handler(async ({ data }) => {
        try {
            return successResponse(
                await marksController.getTeacherClassMarksPage(data),
            )
        } catch (error) {
            return mapDbError(error) as APIResponse<{
                class: {
                    classId: string;
                    className: string;
                    gradeId: string;
                    gradeName: string;
                };
                teacherAssignments: {
                    assignmentId: string;
                    classId: string;
                    subjectId: string;
                    subjectName: string;
                    subjectCode: string | null;
                    isPrimaryTeacher: boolean;
                    status: "Active" | "Inactive" | "Pending" | "New";
                }[];
                students: {
                    studentId: string;
                    userId: string;
                    name: string;
                    email: string;
                    image: string | null;
                    status: "Active" | "Inactive" | "Pending" | "New";
                }[];
                periods: {
                    id: string;
                    name: string;
                    code: string | null;
                    startDate: Date;
                    endDate: Date;
                    status: "Active" | "Inactive" | "Pending" | "New";
                }[] | never[];
                selectedSubjectId: string;
                assessments: {
                    id: string;
                    title: string;
                    type: "Homework" | "Quiz" | "Test" | "Exam" | "Project" | "Participation";
                    maxScore: number;
                    weight: number;
                    assessmentDate: Date | null;
                    notes: string | null;
                    periodId: string | null;
                    status: "Active" | "Inactive" | "Pending" | "New";
                    createdAt: Date;
                }[];
                summary: {
                    totalStudents: number;
                    totalSubjects: number;
                    totalAssessments: number;
                }
            }>
        }
    })

export const createAssessmentServerFn = createServerFn({
    method: 'POST',
})
    .inputValidator(createAssessmentSchema)
    .handler(async ({ data }) => {
        try {
            return successResponse(await marksController.createAssessment(data))
        } catch (error) {
            return mapDbError(error) as APIResponse<{
                classId: string;
                subjectId: string;
                periodId: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                schoolId: string;
                status: "Active" | "Inactive" | "Pending" | "New";
                teacherAssignmentId: string | null;
                title: string;
                type: "Homework" | "Quiz" | "Test" | "Exam" | "Project" | "Participation";
                maxScore: number;
                weight: number;
                assessmentDate: Date | null;
                notes: string | null;
            }>
        }
    })

type updateAssessment = {
    id: string;
    schoolId: string;
    classId: string;
    subjectId: string;
    teacherAssignmentId: string | null;
    periodId: string | null;
    title: string;
    type: "Homework" | "Quiz" | "Test" | "Exam" | "Project" | "Participation";
    maxScore: number;
    weight: number;
    assessmentDate: Date | null;
    notes: string | null;
    status: "Active" | "Inactive" | "Pending" | "New";
    createdAt: Date;
    updatedAt: Date;
}
export const updateAssessmentServerFn = createServerFn({
    method: 'POST',
})
    .inputValidator(updateAssessmentSchema)
    .handler(async ({ data }) => {
        try {
            return successResponse(await marksController.updateAssessment(data)) as APIResponse<updateAssessment>
        } catch (error) {
            return mapDbError(error) as APIResponse<updateAssessment>
        }
    })

export const deleteAssessmentServerFn = createServerFn({
    method: 'POST',
})
    .inputValidator(deleteAssessmentSchema)
    .handler(async ({ data }) => {
        try {
            await marksController.deleteAssessment(data.assessmentId)
            return { success: true }
        } catch (error) {
            return mapDbError(error) as APIResponse<unknown>
        }
    })

type AssessmentsByClassSubject = {
    id: string;
    title: string;
    type: "Homework" | "Quiz" | "Test" | "Exam" | "Project" | "Participation";
    maxScore: number;
    weight: number;
    assessmentDate: Date | null;
    notes: string | null;
    periodId: string | null;
    status: "Active" | "Inactive" | "Pending" | "New";
    createdAt: Date;
}[]
export const getAssessmentsByClassSubjectServerFn = createServerFn({
    method: 'GET',
})
    .inputValidator(getAssessmentsByClassSubjectSchema)
    .handler(async ({ data }) => {
        try {
            return successResponse(
                await marksController.getAssessmentsByClassAndSubject(data),
            ) as APIResponse<AssessmentsByClassSubject>
        } catch (error) {
            return mapDbError(error) as APIResponse<AssessmentsByClassSubject>
        }
    })

type AssessmentMarks = {
    assessment: {
        id: string;
        title: string;
        type: "Homework" | "Quiz" | "Test" | "Exam" | "Project" | "Participation";
        maxScore: number;
        weight: number;
        classId: string;
        subjectId: string;
        status: "Active" | "Inactive" | "Pending" | "New";
    };
    entries: {
        studentId: string;
        name: string;
        email: string;
        image: string | null;
        markId: string | null;
        score: number | null;
        absent: boolean;
        excused: boolean;
        comment: string | null;
        updatedAt: Date | null;
    }[];
    summary: {
        totalStudents: number;
        enteredMarks: number;
    };
}

export const getAssessmentMarksServerFn = createServerFn({
    method: 'GET',
})
    .inputValidator(getAssessmentMarksSchema)
    .handler(async ({ data }) => {
        try {
            return successResponse(
                await marksController.getAssessmentMarks(data.assessmentId),
            ) as APIResponse<AssessmentMarks>
        } catch (error) {
            return mapDbError(error) as APIResponse<AssessmentMarks>
        }
    })


type StudentMarks = {
    assessment: {
        id: string;
        title: string;
        type: "Homework" | "Quiz" | "Test" | "Exam" | "Project" | "Participation";
        maxScore: number;
        weight: number;
        classId: string;
        subjectId: string;
        status: "Active" | "Inactive" | "Pending" | "New";
    };
    entries: {
        studentId: string;
        name: string;
        email: string;
        image: string | null;
        markId: string | null;
        score: number | null;
        absent: boolean;
        excused: boolean;
        comment: string | null;
        updatedAt: Date | null;
    }[];
    summary: {
        totalStudents: number;
        enteredMarks: number;
    };
}

export const saveStudentMarksServerFn = createServerFn({
    method: 'POST',
})
    .inputValidator(saveStudentMarksSchema)
    .handler(async ({ data }) => {
        try {
            return successResponse(await marksController.saveStudentMarks(data)) as APIResponse<StudentMarks>
        } catch (error) {
            return mapDbError(error) as APIResponse<StudentMarks>
        }
    })