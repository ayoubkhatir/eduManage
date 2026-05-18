import type { addResourceSchema, getResourcesSchema } from '#/schemas/resources.schema';
import * as schema from '#/server/db/schema';
import z from "zod";



export type Resource = typeof schema.resourcesTable.$inferSelect

export type ResourceType = typeof schema.ResourceTypeEnum

export type GetResourcesSchema = z.infer<typeof getResourcesSchema>

export type ResourceDto = {
    id: string
    fileName: string
    type: string
    dateAdded: string
    size: string
}

export type AddResourceSchema = z.infer<typeof addResourceSchema>


