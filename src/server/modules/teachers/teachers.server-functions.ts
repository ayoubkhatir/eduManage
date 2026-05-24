import {
    addTeacherSchema,
    getTeachersSchema,
    editTeacherSchema,
    teacherIdSchema,
    schoolIdSchema,
    assignTeacherSchema,
    updateTeacherAssignmentSchema,
    classIdSchema,
    getTeacherClassesSchema,
} from "#/schemas/teachers.schema";
import { createServerFn } from "@tanstack/react-start";
import { paginatedSuccessResponse, successResponse, type APIResponse } from "#/server/utils/response.type";
import { teachersController } from "./teachers.contoller";
import { mapDbError } from "#/server/utils/db_error_handling";
import { validCuidSchema } from "#/schemas/shared.schema";
import type { StatusEnum } from "#/server/db/schema";
import type { TeacherUser } from "#/types/teacherTypes";


export const getTeachersServerFn = createServerFn({ method: "GET" })
    .inputValidator(getTeachersSchema)
    .handler(async ({ data: search_queries }) => {
        const { data, pagination } = await teachersController.listTeachers(search_queries)
        return paginatedSuccessResponse(data, pagination);
    })

// Create
export const addTeacherServerFn = createServerFn({ method: 'POST' })
    .inputValidator(addTeacherSchema)
    .handler(async ({ data: body }) => {
        // the real import is at the top this looks like it does nothing
        console.log("data : ", body)
        // const { teachersController } = await import('./teachers.contoller')
        try {
            const data = await teachersController.createTeacher(body)
            return successResponse(data) as APIResponse<TeacherUser>
        }
        catch (error) {
            console.log("\x1b[36m[server]\x1b[0m " + error)
            return mapDbError(error) as APIResponse<TeacherUser>
        }
    })

// Get all teachers in school
export const getAllTeachersServerFn = createServerFn({ method: 'GET' })
    .inputValidator(schoolIdSchema)
    .handler(async ({ data }) => {
        return successResponse(await teachersController.getTeachers(data.schoolId))
    })

// Get one teacher by teacherId
export const getTeacherServerFn = createServerFn({ method: 'GET' })
    .inputValidator(teacherIdSchema)
    .handler(async ({ data }) => {
        return successResponse(await teachersController.getTeacherById(data.teacherId)
        )
    })

// Get one teacher by teacherID
export const getTeacherByIdServerFn = createServerFn({ method: 'GET' })
    .inputValidator(validCuidSchema)
    .handler(async ({ data: teacherId }) => {
        return successResponse(await teachersController.getTeacherById(teacherId)
        )
    })
// Get one teacher by userId
export const getTeacherByUserIdServerFn = createServerFn({ method: 'GET' })
    .inputValidator(validCuidSchema)
    .handler(async ({ data: userId }) => {
        return successResponse(await teachersController.getTeacherByUserId(userId)
        )
    })

// Update
export const editTeacherServerFn = createServerFn({ method: 'POST' })
    .inputValidator(editTeacherSchema)
    .handler(async ({ data: body }) => {
        try {
            const data = await teachersController.updateTeacher(body)
            return successResponse(data) as APIResponse<TeacherUser>
        } catch (error) {
            console.log({ error })
            return mapDbError(error) as APIResponse<TeacherUser>
        }
    })

// Delete
export const deleteTeacherServerFn = createServerFn({ method: 'POST' })
    .inputValidator(validCuidSchema)
    .handler(async ({ data: teacherId }) => {
        await teachersController.deleteTeacher(teacherId)
        return { success: true }
    })

// Stats
// export const getTeachersStatsServerFn = createServerFn({ method: 'GET' })
//     .inputValidator(schoolIdSchema)
//     .handler(async ({ data }) => {
//         return successResponse(await teachersController.getTeachersStats(data.schoolId)
//         )
//     })

// Assign teacher -> class + subject
export const assignTeacherToClassAndSubjectServerFn = createServerFn({ method: 'POST' })
    .inputValidator(assignTeacherSchema)
    .handler(async ({ data }) => {
        try {
            return successResponse(await teachersController.assignTeacherToClassAndSubject(data))
        } catch (error) {
            console.log("\x1b[36m[server]\x1b[0m " + error)
            return mapDbError(error) as APIResponse<{
                schoolId: string;
                teacherId: string;
                classId: string;
                gradeId: string | null;
                subjectId: string;
                isPrimaryTeacher: boolean;
                status: StatusEnum;
                id: string;
                createdAt: Date;
                updatedAt: Date;
            }>
        }
    })

// Update assignment
export const updateTeacherAssignmentServerFn = createServerFn({
    method: 'POST',
})
    .inputValidator(updateTeacherAssignmentSchema)
    .handler(async ({ data }) => {
        const { assignmentId, ...payload } = data
        return successResponse(await teachersController.updateAssignment(assignmentId, payload)
        )
    })

// Remove assignment
export const deleteTeacherAssignmentServerFn = createServerFn({
    method: 'POST',
})
    .inputValidator(validCuidSchema)
    .handler(async ({ data: assignmentId }) => {
        await teachersController.removeAssignment(assignmentId)
        return { success: true }
    })

// Get all assignments for one teacher
export const getTeacherAssignmentsServerFn = createServerFn({ method: 'GET' })
    .inputValidator(validCuidSchema)
    .handler(async ({ data: teacherId }) => {
        return successResponse(await teachersController.getTeacherAssignments(teacherId)
        )
    })

// Get all teachers assigned to one class
export const getTeachersByClassServerFn = createServerFn({ method: 'GET' })
    .inputValidator(classIdSchema)
    .handler(async ({ data }) => {
        return successResponse(await teachersController.getTeachersByClass(data.classId)
        )
    })

export const getTeachersStatsServerFn = createServerFn({ method: "GET" })
    .handler(async () => successResponse(await teachersController.getTeachersStats()))

// export const assignTeacherToClassAndSubjectServerFn = createServerFn({ method: "POST" })
//     .inputValidator(assignTeacherSchema)
//     .handler(async ({ data: body }) => teachersController.assignTeacherToClassAndSubject(body))


export const getTeacherClassesDashboardServerFn = createServerFn({ method: 'GET' })
    .inputValidator(getTeacherClassesSchema)
    .handler(async ({ data }) => {
        return successResponse(await teachersController.getTeacherClassesDashboard(data))
    })