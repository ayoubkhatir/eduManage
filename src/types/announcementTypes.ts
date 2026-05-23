import type { createAnnouncementSchema } from "#/schemas/announcement.schema";
import { announcementsTable } from "#/server/db/schema";
import { z } from "zod/v4";

export type AnnouncementType = typeof announcementsTable.$inferSelect

export type CreateAnnouncementType = z.infer<typeof createAnnouncementSchema>

export type GetAnnouncementType = {
    id: string,
    title: string,
    description: string,
    schoolId: string,
    authorId: string,
    createdAt: Date,
    updatedAt: Date
}