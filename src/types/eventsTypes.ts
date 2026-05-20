
import type { getEventsSchema  , addEventSchema} from '#/schemas/events.schema';
import z from "zod";
import * as schema from '#/server/db/schema';




export type Event = typeof schema.eventsTable.$inferSelect

export type GetEventsType = z.infer<typeof getEventsSchema> 
export type AddEventType = z.infer<typeof addEventSchema>