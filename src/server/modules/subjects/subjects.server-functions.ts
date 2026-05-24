import { createServerFn } from "@tanstack/react-start";
import { subjectsController } from "./subjects.controller";
import { successResponse, type APIResponse } from "#/server/utils/response.type";
import { addSubjectSchema } from "#/schemas/subjects.schema";
import { validCuidSchema } from "#/schemas/shared.schema";
import type { SubjectWithGrade } from "#/types/subjectsTypes";

export const getAllSchoolSubjectsServerFn = createServerFn({ method: "GET" })
    .inputValidator(validCuidSchema)
    .handler(async ({ data: schoolId }) => successResponse(subjectsController.listAllSubjects(schoolId)) as APIResponse<SubjectWithGrade[]>)


export const addSubjectServerFn = createServerFn({ method: 'POST' })
    .inputValidator(addSubjectSchema)
    .handler(async ({ data }) => successResponse(subjectsController.addSubject(data)))

export const getStudentSubjectsServerFn = createServerFn({ method: "GET" })
    .inputValidator(validCuidSchema)
    .handler(async ({ data }) => {
        return successResponse(await subjectsController.listStudentSubjectsByUserId(data))
    })

export const getTeacherSubjectsServerFn = createServerFn({ method: "GET" })
    .inputValidator(validCuidSchema)
    .handler(async ({ data }) => {
        return successResponse(await subjectsController.listTeacherSubjectsByUserId(data))
    })