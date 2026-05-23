import { createAnnouncementSchema } from "#/schemas/announcement.schema";
import { successResponse } from "#/server/utils/response.type";
import { createServerFn } from "@tanstack/react-start";
import { announcementsController } from "./announcement.controller";
import { validCuidSchema } from "#/schemas/shared.schema";


export const createAnnouncementServerFn = createServerFn({ method: "POST" })
    .inputValidator(createAnnouncementSchema)
    .handler(({ data }) => successResponse(announcementsController.createAnnouncement(data)))

export const getAnnouncementsServerFn = createServerFn({ method: "GET" })
    .inputValidator(validCuidSchema)
    .handler(({ data: schoolId }) => successResponse(announcementsController.getAnnouncementsBySchool(schoolId)))