import { createServerFn } from '@tanstack/react-start'
import { addResourceSchema, getResourcesSchema, type ResourceDto } from '#/schemas/resources.schema'
import { resourcesController } from './resources.controller'
import {
    paginatedSuccessResponse,
    successResponse,
    type PaginatedAPIResponse,
} from '#/server/utils/response.type'
import { mapDbError } from '#/server/utils/db_error_handling'

export const getResourcesServerFn = createServerFn({ method: 'GET' })
    .inputValidator(getResourcesSchema)
    .handler(async ({ data: input }) => {
        try {
            const { data, pagination } = await resourcesController.listResources(input)
            return paginatedSuccessResponse(data, pagination)
        } catch (error) {
            console.log({ error })
            return mapDbError(error) as PaginatedAPIResponse<ResourceDto[]>
        }
    })

export const addResourceServerFn = createServerFn({ method: "POST" })
    .inputValidator(addResourceSchema)
    .handler(async ({ data }) => {
        return successResponse(await resourcesController.addResource(data))
    })