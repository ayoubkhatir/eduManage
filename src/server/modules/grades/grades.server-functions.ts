import { createServerFn } from "@tanstack/react-start";
import { gradesController } from "./grades.controller";
import { successResponse } from "#/server/utils/response.type";
import { addGradeSchema } from "#/schemas/grades.schema";

export const getAllGradesServerFn = createServerFn({ method: "GET" })
    .handler(async () => successResponse(await gradesController.getAllGrades()))

export const getAllGradesWithClassesAndSubjectsServerFn = createServerFn({ method: "GET" })
    .handler(async () => successResponse(await gradesController.getAllGradesWithClassesAndSubjects()))

export const addGradeServerFn = createServerFn({ method: "POST" })
    .inputValidator(addGradeSchema)
    .handler(async ({ data }) => successResponse(await gradesController.addGrade(data)))