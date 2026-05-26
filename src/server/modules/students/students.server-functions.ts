import { createServerFn } from "@tanstack/react-start";
import { studentsController } from "./students.controller";
import { paginatedSuccessResponse, successResponse, type APIResponse, type APIErrorResponses } from "#/server/utils/response.type";
import { addStudentSchema, editStudentSchema, getStudentsSchema } from "#/schemas/students.schema";
import { validCuidSchema } from "#/schemas/shared.schema";
import { mapDbError } from "#/server/utils/db_error_handling";

export const getAllStudentsServerFn = createServerFn({ method: "GET" })
    .inputValidator(getStudentsSchema)
    .handler(async ({ data: search_queries }) => {
        const { data, pagination } = await studentsController.listStudents(search_queries);
        return paginatedSuccessResponse(data, pagination);
    })

export const getStudentByIdServerFn = createServerFn({ method: "GET" })
    .inputValidator(validCuidSchema)
    .handler(async ({ data: studentId }) => {
        const data = await studentsController.getStudent(studentId);
        return successResponse(data)
    })

export const addStudentServerFn = createServerFn({ method: "POST" })
    .inputValidator(addStudentSchema)
    .handler(async ({ data: body }) => {
        try {
            const data = await studentsController.addStudent(body);
            return successResponse(data) as APIResponse<typeof data>
        } catch (error) {
            console.log("\x1b[36m[server]\x1b[0m " + error)
            return mapDbError(error) as APIErrorResponses
        }
    })

export const editStudentServerFn = createServerFn({ method: "POST" })
    .inputValidator(editStudentSchema)
    .handler(async ({ data: body }) => {
        try {
            const data = await studentsController.editStudent(body);
            return successResponse(data) as APIResponse<typeof data>
        }
        catch (error) {
            console.log("\x1b[36m[server]\x1b[0m " + error)
            return mapDbError(error) as APIErrorResponses
        }
    })

export const deleteStudentServerFn = createServerFn({ method: "POST" })
    .inputValidator(validCuidSchema)
    .handler(async ({ data: studentId }) => await studentsController.deleteStudent(studentId))

export const getStudentsStatsServerFn = createServerFn({ method: "GET" })
    .handler(async () => successResponse(await studentsController.getStudentsStats()))

export const getDashboardStatsServerFn = createServerFn({ method: "GET" })
    .inputValidator(validCuidSchema)
    .handler(async ({ data: schoolId }) => successResponse(await studentsController.getDashboardStats(schoolId)))