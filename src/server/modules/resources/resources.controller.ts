import { and, asc, desc, eq, ilike, inArray, SQL, count } from 'drizzle-orm'
import { db, type Database } from '#/server/db/db'
import {
    resourcesTable,
    classesTable,
    gradeSubjectsTable,
    subjectsTable,
    studentsTable,
} from '#/server/db/schema'
import type { AddResourceSchema, GetResourcesSchema, ResourceDto } from '#/types/resourcesTypes'

function parseSizeToBytes(size: string): number {
    const normalized = size.trim().toUpperCase()
    const match = normalized.match(/^([\d.]+)\s*(B|KB|MB|GB)$/)

    if (!match) return 0

    const value = Number(match[1])
    const unit = match[2]

    if (Number.isNaN(value)) return 0

    switch (unit) {
        case 'GB':
            return value * 1024 * 1024 * 1024
        case 'MB':
            return value * 1024 * 1024
        case 'KB':
            return value * 1024
        default:
            return value
    }
}

class ResourcesController {
    constructor(private readonly db: Database) { }

    async listResources(
        input: GetResourcesSchema,
    ): Promise<{
        data: ResourceDto[],
        pagination: {
            totalCount: number,
            totalPages: number
        }
    }> {
        const safePage = Math.max(1, input.pageIndex ?? 1)
        const safeSize = Math.max(1, input.pageSize ?? 10)
        const offset = (safePage - 1) * safeSize

        const conditions: SQL<unknown>[] = []

        const normalizedFileName = input.fileName.trim()
        const normalizedType = input.type.trim()

        if (input.schoolId) {
            conditions.push(eq(resourcesTable.schoolId, input.schoolId))
        }

        if (normalizedFileName) {
            conditions.push(ilike(resourcesTable.fileName, `%${normalizedFileName}%`))
        }

        if (normalizedType) {
            conditions.push(eq(resourcesTable.type, normalizedType as any))
        }

        if (input.classId) {
            conditions.push(eq(resourcesTable.classId, input.classId))
        }

        if (input.subjectCode) {
            const subject = await this.db.query.subjectsTable.findFirst({
                where: eq(subjectsTable.code, input.subjectCode),
                columns: { id: true }
            })
            if (!subject) throw new Error("No subject found")
            conditions.push(eq(resourcesTable.subjectId, subject.id))
        }

        if (input.teacherId) {
            conditions.push(eq(resourcesTable.teacherId, input.teacherId))
        }

        if (input.studentId) {
            const student = await this.db.query.studentsTable.findFirst({
                where: eq(studentsTable.id, input.studentId),
                columns: {},
                with: {
                    class: { columns: { id: true } }
                }
            })

            if (!student) {
                throw new Error('Student not found')
            }

            const classRow = await this.db.query.classesTable.findFirst({
                where: eq(classesTable.id, student.class.id),
                columns: {
                    id: true,
                    gradeId: true,
                },
            })

            if (!classRow) {
                throw new Error('Class not found')
            }

            const subjectRows = await this.db
                .select({
                    subjectId: gradeSubjectsTable.subjectId,
                })
                .from(gradeSubjectsTable)
                .where(eq(gradeSubjectsTable.gradeId, classRow.gradeId))

            const subjectIds = subjectRows.map((row) => row.subjectId)

            conditions.push(eq(resourcesTable.classId, student.class.id))

            if (subjectIds.length > 0) {
                conditions.push(inArray(resourcesTable.subjectId, subjectIds))
            }
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined

        const orderByClause =
            input.sortBy === 'oldest'
                ? [asc(resourcesTable.dateAdded)]
                : input.sortBy === 'name'
                    ? [asc(resourcesTable.fileName)]
                    : [desc(resourcesTable.dateAdded)]

        const [rows, totalResult] = await Promise.all([
            this.db
                .select({
                    id: resourcesTable.id,
                    fileName: resourcesTable.fileName,
                    type: resourcesTable.type,
                    dateAdded: resourcesTable.dateAdded,
                    size: resourcesTable.size,
                    fileUrl: resourcesTable.fileUrl,
                })
                .from(resourcesTable)
                .where(whereClause)
                .orderBy(...orderByClause)
                .limit(safeSize)
                .offset(offset),

            this.db
                .select({
                    total: count(),
                })
                .from(resourcesTable)
                .where(whereClause),
        ])

        let data: ResourceDto[] = rows.map((row) => ({
            id: row.id,
            fileName: row.fileName,
            type: row.type,
            dateAdded: row.dateAdded.toISOString(),
            size: row.size,
            fileUrl: row.fileUrl ?? '',
        }))

        if (input.sortBy === 'size') {
            data = [...data].sort(
                (a, b) => parseSizeToBytes(b.size) - parseSizeToBytes(a.size),
            )
        }

        const totalCount = Number(totalResult[0]?.total ?? 0)
        const totalPages = Math.ceil(totalCount / safeSize)
        return {
            data,
            pagination: { totalCount, totalPages }
        }
    }

    async addResource({
        classId,
        visibility,
        fileUrl,
        type,
        teacherId,
        description,
        fileName,
        subjectCode,
        size,
        status,
        schoolId
    }: AddResourceSchema) {
        const subject = await this.db.query.subjectsTable.findFirst({
            where: eq(subjectsTable.code, subjectCode),
            columns: { id: true }
        })
        if (!subject) throw new Error("Error occured")
        const subjectId = subject.id

        const [resource] = await this.db
            .insert(resourcesTable)
            .values({
                visibility,
                teacherId,
                status,
                fileUrl,
                description,
                classId,
                type,
                subjectId,
                size,
                schoolId,
                fileName,
            })
            .returning()
        return resource
    }

    async deleteResource(resourceId: string) {
        const [deletedResource] = await this.db
            .delete(resourcesTable)
            .where(eq(resourcesTable.id, resourceId))
            .returning()

        return deletedResource
    }
}

export const resourcesController = new ResourcesController(db)