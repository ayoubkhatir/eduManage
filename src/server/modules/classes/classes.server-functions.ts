import { validCuidSchema } from "#/schemas/shared.schema";
import { createServerFn } from "@tanstack/react-start";
import { classesController } from "./classes.controller";
import { addClassSchema } from "#/schemas/classes.schema";
import { successResponse } from "#/server/utils/response.type";

export const getClassesByGradeIdSevrerFn = createServerFn({ method: "GET" })
    .inputValidator(validCuidSchema)
    .handler(({ data: gradeId }) => successResponse(classesController.listClassesByGradeId(gradeId)))

export const getAllClassesServerFn = createServerFn({ method: "GET" })
    .inputValidator(validCuidSchema)
    .handler(({ data: schoolId }) => successResponse(classesController.listClasses(schoolId)))

export const addClassServerFn = createServerFn({ method: "POST" })
    .inputValidator(addClassSchema)
    .handler(({ data }) => successResponse(classesController.addClass(data)))

export const getClassesByTeacherUserIdServerFn = createServerFn({ method: "GET" })
    .inputValidator(validCuidSchema)
    .handler(async ({ data: teacherUserId }) => successResponse(classesController.getClassesByTeacherUserId(teacherUserId)))

export const deleteClassByIdServerFn = createServerFn({ method: "POST" })
    .inputValidator(validCuidSchema)
    .handler(({ data: classId }) => successResponse(classesController.deleteClassById(classId)))