import type { createAnnouncementSchema } from "#/schemas/announcement.schema";
import { announcementsTable, UserGenderEnum, UserRoleEnum } from "#/server/db/schema";
import { z } from "zod/v4";

export type AnnouncementType = typeof announcementsTable.$inferSelect
export type AnnouncementWithAuthor = AnnouncementType & {
    author: {
        name: string;
        email: string;
        image: string | null;
        gender: UserGenderEnum;
        telNumber: string | null;
        role: UserRoleEnum;
    }
}

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