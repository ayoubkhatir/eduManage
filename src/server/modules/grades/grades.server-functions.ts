import { createServerFn } from "@tanstack/react-start";
import { gradesController } from "./grades.controller";
import { successResponse } from "#/server/utils/response.type";
import { addGradeSchema } from "#/schemas/grades.schema";
import { validCuidSchema } from "#/schemas/shared.schema";

export const getAllGradesServerFn = createServerFn({ method: "GET" })
    .inputValidator(validCuidSchema)
    .handler(async ({ data: schoolId }) => successResponse(await gradesController.getAllGrades(schoolId)))

export const getAllGradesWithClassesAndSubjectsServerFn = createServerFn({ method: "GET" })
    .handler(async () => successResponse(await gradesController.getAllGradesWithClassesAndSubjects()))

export const addGradeServerFn = createServerFn({ method: "POST" })
    .inputValidator(addGradeSchema)
    .handler(async ({ data }) => successResponse(await gradesController.addGrade(data)))

export const deleteGradeServerFn = createServerFn({ method: "POST" })
    .inputValidator(validCuidSchema)
    .handler(async ({ data: gradeId }) => successResponse(await gradesController.deleteGrade(gradeId)))
