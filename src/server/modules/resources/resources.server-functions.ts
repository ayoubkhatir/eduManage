import { createServerFn } from '@tanstack/react-start'
import { addResourceSchema, getResourcesSchema } from '#/schemas/resources.schema'
import type { ResourceDto } from '#/types/resourcesTypes'
import { resourcesController } from './resources.controller'
import {
    paginatedSuccessResponse,
    successResponse,
    type PaginatedAPIResponse,
} from '#/server/utils/response.type'
import { mapDbError } from '#/server/utils/db_error_handling'
import { validCuidSchema } from '#/schemas/shared.schema'

export const getResourcesServerFn = createServerFn({ method: 'GET' })
    .inputValidator(getResourcesSchema)
    .handler(async ({ data: input }) => {
        try {
            const { data, pagination } = await resourcesController.listResources(input)
            return paginatedSuccessResponse(data, pagination)
        } catch (error) {
            console.log("\x1b[36m[server]\x1b[0m " + error)
            return mapDbError(error) as PaginatedAPIResponse<ResourceDto[]>
        }
    })

export const addResourceServerFn = createServerFn({ method: "POST" })
    .inputValidator(addResourceSchema)
    .handler(async ({ data }) => {
        return successResponse(await resourcesController.addResource(data))
    })

export const deleteResourceServerFn = createServerFn({ method: 'POST' })
    .inputValidator(validCuidSchema)
    .handler(async ({ data: resourceId }) => successResponse(await resourcesController.deleteResource(resourceId)))