import { createServerFn } from '@tanstack/react-start'
import { announcementsController } from './announcement.controller'
import {
  paginatedSuccessResponse,
  successResponse,
  type APIResponse,
  type APIErrorResponses,
} from '#/server/utils/response.type'
import {
  AnnouncementSearchSchema,
  CreateAnnouncementSchema,
  EditAnnouncementSchema,
} from '#/schemas/announcement.schemas'
import { validCuidSchema } from '#/schemas/shared.schema'
import { z } from 'zod'

export const getAllAnnouncementsServerFn = createServerFn({ method: 'GET' })
  .inputValidator(AnnouncementSearchSchema)
  .handler(async ({ data: search_queries }) => {
    const { data, pagination } =
      await announcementsController.listAnnouncements(search_queries)
    return paginatedSuccessResponse(data, pagination)
  })

export const getAnnouncementByIdServerFn = createServerFn({ method: 'GET' })
  .inputValidator(validCuidSchema)
  .handler(async ({ data: announcementId }) => {
    const data = await announcementsController.getAnnouncement(announcementId)
    return successResponse(data)
  })

export const addAnnouncementServerFn = createServerFn({ method: 'POST' })
  .inputValidator(CreateAnnouncementSchema)
  .handler(async ({ data: body }) => {
    try {
      const data = await announcementsController.addAnnouncement(body)
      return successResponse(data) as APIResponse<typeof data>
    } catch (error) {
      console.log('\x1b[36m[server]\x1b[0m ' + error)
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Error adding announcement',
      } as APIErrorResponses
    }
  })

export const editAnnouncementServerFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      id: validCuidSchema,
      data: EditAnnouncementSchema,
    }),
  )
  .handler(async ({ data: { id, data: body } }) => {
    try {
      const data = await announcementsController.editAnnouncement(id, body)
      return successResponse(data) as APIResponse<typeof data>
    } catch (error) {
      console.log('\x1b[36m[server]\x1b[0m ' + error)
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Error editing announcement',
      } as APIErrorResponses
    }
  })

export const deleteAnnouncementServerFn = createServerFn({ method: 'POST' })
  .inputValidator(validCuidSchema)
  .handler(async ({ data: announcementId }) => {
    try {
      return successResponse(
        await announcementsController.deleteAnnouncement(announcementId),
      )
    } catch (error) {
      console.log('\x1b[36m[server]\x1b[0m ' + error)
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Error deleting announcement',
      } as APIErrorResponses
    }
  })
