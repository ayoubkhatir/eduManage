import { createAnnouncementSchema } from "#/schemas/announcement.schema";
import { internalServerErrorResponse, successResponse, type APIResponse } from "#/server/utils/response.type";
import { createServerFn } from "@tanstack/react-start";
import { announcementsController } from "./announcement.controller";
import { validCuidSchema, validSlugSchema } from "#/schemas/shared.schema";
import type { AnnouncementWithAuthor } from "#/types/announcementTypes";
import { z } from "zod/v4";
import { AnnouncementAudienceEnum } from "#/server/db/schema";


export const createAnnouncementServerFn = createServerFn({ method: "POST" })
    .inputValidator(createAnnouncementSchema)
    .handler(({ data }) => {
        try {
            return successResponse(announcementsController.createAnnouncement(data)) as APIResponse<{
                id: string;
            }[]>
        } catch (e) {
            console.log({ error: e })
            return internalServerErrorResponse() as APIResponse<{
                id: string;
            }[]>
        }
    })

export const getAnnouncementsFiltersSchema = z.object({
    search: z.string().default(''),
    audience: z
        .enum(AnnouncementAudienceEnum)
        .default(AnnouncementAudienceEnum.ALL),
})
export type GetAnnouncementsFiltersSchema = z.infer<typeof getAnnouncementsFiltersSchema>


const getAnnouncementsSchema = z.object({
    schoolId: validCuidSchema,
    filters: getAnnouncementsFiltersSchema.default({
        search: '',
        audience: AnnouncementAudienceEnum.ALL
    })
})
export type GetAnnouncementsSchema = z.infer<typeof getAnnouncementsSchema>

export const getAnnouncementsServerFn = createServerFn({ method: "GET" })
    .inputValidator(getAnnouncementsSchema)
    .handler(({ data: { schoolId, filters } }) => {
        try {
            return successResponse(announcementsController.getAnnouncementsBySchool(schoolId, filters)) as APIResponse<AnnouncementWithAuthor[]>
        } catch (error) {
            console.log({ error })
            return internalServerErrorResponse() as APIResponse<AnnouncementWithAuthor[]>
        }
    })


export const getAnnouncementByIdServerFn = createServerFn({ method: "GET" })
    .inputValidator(validCuidSchema)
    .handler(({ data: AnnouncementId }) => successResponse(announcementsController.getAnnouncementByTitleSlug(AnnouncementId)))


export const getAnnouncementByTitleSlugServerFn = createServerFn({ method: "GET" })
    .inputValidator(validSlugSchema())
    .handler(({ data: AnnouncementTitleSlug }) => {
        console.log({ AnnouncementTitleSlug })
        try {
            return successResponse(announcementsController.getAnnouncementByTitleSlug(AnnouncementTitleSlug)) as APIResponse<AnnouncementWithAuthor>
        } catch (error) {
            console.log({ error })
            return internalServerErrorResponse() as APIResponse<AnnouncementWithAuthor>
        }
    })