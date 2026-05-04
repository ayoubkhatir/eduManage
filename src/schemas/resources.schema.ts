import z from 'zod/v4'
import { sortOptionsSchema, statusSchema, validCuidSchema } from './shared.schema'
import { ResourceTypeEnum } from '#/server/db/schema'

export const getResourcesSchema = z.object({
    fileName: z.string().default(''),
    type: z.string().default(''),
    dateAdded: z.string().default(''),
    size: z.string().default(''),
    sortBy: sortOptionsSchema.default('oldest'),
    pageIndex: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),

    classId: validCuidSchema.optional(),
    subjectCode: z.string(),
    teacherId: validCuidSchema.optional(),
    studentId: validCuidSchema.optional(),
    schoolId: validCuidSchema.optional(),
})

export type GetResourcesSchema = z.infer<typeof getResourcesSchema>

export type ResourceDto = {
    id: string
    fileName: string
    type: string
    dateAdded: string
    size: string
}

export type PaginationData<T> = {
    data: Array<T>
    rowCount: number
}

export const addResourceSchema = z.object({
    subjectCode: z.string(),
    schoolId: validCuidSchema,
    classId: validCuidSchema.optional(),
    teacherId: validCuidSchema,
    fileName: z.string().max(255),
    type: z.enum(ResourceTypeEnum),
    size: z.string(),
    fileUrl: z.string(),
    description: z.string(),
    visibility: z.string(),
    status: statusSchema
})
export type AddResourceSchema = z.infer<typeof addResourceSchema>

export const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024; // Utilisez 1024 pour les vrais Ko (binaire) ou 1000 selon votre besoin
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};