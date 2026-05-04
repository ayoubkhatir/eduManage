import { createServerFn } from '@tanstack/react-start'
import { addEventSchema, getEventsSchema } from '#/schemas/events.schema'
import { eventsController } from './events.controller'
import { successResponse, type APIResponse } from '#/server/utils/response.type'
import { mapDbError } from '#/server/utils/db_error_handling'
import type { StatusEnum } from '#/server/db/schema'

export const getEventsServerFn = createServerFn({ method: 'GET' })
    .inputValidator(getEventsSchema)
    .handler(async ({ data }) => {
        try {
            return successResponse(await eventsController.listEvents(data))
        } catch (error) {
            return mapDbError(error) as APIResponse<{
                id: string;
                title: string;
                start: string;
                end: string;
                color: string;
                description: string;
                allDay: boolean;
                repeatWeekly: boolean;
                isClass: boolean;
                className: string;
                teacherName: string;
                teacherId: string | null;
            }[]>
        }
    })

export const addEventServerFn = createServerFn({ method: 'POST' })
    .inputValidator(addEventSchema)
    .handler(async ({ data }) => {
        try {
            return successResponse(await eventsController.createEvent(data))
        } catch (error) {
            return mapDbError(error) as APIResponse<{
                classId: string | null;
                teacherId: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                schoolId: string;
                status: StatusEnum;
                subjectId: string | null;
                title: string;
                description: string | null;
                color: string;
                start: Date;
                end: Date;
                allDay: boolean;
                repeatWeekly: boolean;
                isClass: boolean;
            }>
        }
    })