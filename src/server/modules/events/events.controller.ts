import { db, type Database } from '#/server/db/db'
import {
    eventsTable,
    teachersTable,
} from '#/server/db/schema'
import type { AddEventSchema, GetEventsSchema } from '#/types/eventsTypes';
import { and, asc, eq } from 'drizzle-orm'

class EventsController {
    constructor(private readonly db: Database) { }

    async listEvents({
        classId,
        teacherUserId,
        isOwner,
        // startDate,
        // endDate,
    }: GetEventsSchema) {
        const conditions = []
        let teacherId: string;
        if (!classId && teacherUserId) {
            teacherId = await this.db.query.teachersTable.findFirst({
                where: eq(teachersTable.userId, teacherUserId),
                columns: { id: true }
            }).then(r => r!.id)
        } else {
            teacherId = ""
        }
        if (!isOwner) {
            // if (startDate) {
            //     conditions.push(gte(eventsTable.start, new Date(startDate)))
            // }

            // if (endDate) {
            //     conditions.push(lte(eventsTable.end, new Date(endDate)))
            // }

            if (classId) {
                conditions.push(eq(eventsTable.classId, classId))
            } else if (!!teacherId) {
                conditions.push(eq(eventsTable.teacherId, teacherId))
            }
        }

        const whereClause = conditions.length ? and(...conditions) : undefined

        const events = await this.db.query.eventsTable.findMany({
            where: whereClause,
            orderBy: asc(eventsTable.start),
            with: {
                class: {
                    columns: {
                        id: true,
                        name: true
                    }
                },
                teacher: {
                    columns: { id: true },
                    with: {
                        user: {
                            columns: {
                                name: true
                            }
                        }
                    }
                }
            }
        })

        const rows: {
            id: string;
            title: string;
            start: Date;
            end: Date;
            color: string;
            description: string | null;
            allDay: boolean;
            repeatWeekly: boolean;
            isClass: boolean;
            classId: string | null;
            className: string | null;
            teacherId: string | null;
            teacherName: string | null;
        }[] = events.map(e => ({
            id: e.id,
            title: e.title,
            start: e.start,
            end: e.end,
            color: e.color,
            description: e.description,
            allDay: e.allDay,
            repeatWeekly: e.repeatWeekly,
            isClass: e.isClass,
            classId: e.class?.id ?? null,
            className: e.class?.name ?? "",
            teacherName: e.teacher?.user.name ?? "",
            teacherId: e.teacher?.id ?? null
        }))

        // const rows = await this.db
        //     .select({
        //         id: eventsTable.id,
        //         title: eventsTable.title,
        //         start: eventsTable.start,
        //         end: eventsTable.end,
        //         color: eventsTable.color,
        //         description: eventsTable.description,
        //         allDay: eventsTable.allDay,
        //         repeatWeekly: eventsTable.repeatWeekly,
        //         isClass: eventsTable.isClass,

        //         classId: classesTable.id,
        //         className: classesTable.name,

        //         teacherId: teachersTable.id,
        //         teacherName: usersTable.username,
        //     })
        //     .from(eventsTable)
        //     .leftJoin(classesTable, eq(eventsTable.classId, classesTable.id))
        //     .leftJoin(teachersTable, eq(eventsTable.teacherId, teachersTable.id))
        //     .leftJoin(usersTable, eq(teachersTable.userId, usersTable.id))
        //     .where(whereClause)
        //     .orderBy(asc(eventsTable.start))

        return rows.map((row) => ({
            id: row.id,
            title: row.title,
            start: row.start.toISOString(),
            end: row.end.toISOString(),
            color: row.color,
            description: row.description ?? '',
            allDay: row.allDay,
            repeatWeekly: row.repeatWeekly,
            isClass: row.isClass,
            className: row.className ?? '',
            teacherName: row.teacherName ?? '',
            teacherId: row.teacherId ?? null,
        }))
    }

    async createEvent(input: AddEventSchema) {
        const [created] = await this.db
            .insert(eventsTable)
            .values({
                schoolId: input.schoolId,
                classId: input.classId,
                teacherId: input.teacherId,
                subjectId: input.subjectId,
                title: input.title,
                description: input.description,
                color: input.color,
                start: new Date(input.start),
                end: new Date(input.end),
                allDay: input.allDay,
                repeatWeekly: input.repeatWeekly,
                isClass: input.isClass,
                status: input.status,
            })
            .returning()

        return created
    }
}

export const eventsController = new EventsController(db)