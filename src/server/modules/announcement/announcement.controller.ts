import { db } from "#/server/db/db";
import { adminsTable, announcementsTable, users } from "#/server/db/schema";
import type { CreateAnnouncementType } from "#/types/announcementTypes";
import { eq } from "drizzle-orm";


class AnnouncementController {
    async createAnnouncement(announcement: CreateAnnouncementType) {
        const school = await db.query.adminsTable.findFirst({
            where: eq(adminsTable.id, announcement.schoolId),
        })
        if (!school) {
            throw new Error("School not found");
        }
        const author = await db.query.users.findFirst({
            where: eq(users.id, announcement.authorId),
        })

        if (!author) {
            throw new Error("Author not found");
        }

        const announcementId = await db.insert(announcementsTable).values({
            schoolId: announcement.schoolId,
            authorId: announcement.authorId,
            title: announcement.title,
            description: announcement.description,
        }).returning({ id: announcementsTable.id })

        return announcementId
    }

    async getAnnouncementsBySchool(schoolId: string) {
        const announcements = await db.query.announcementsTable.findMany({
            where: eq(announcementsTable.schoolId, schoolId),
            limit: 10
        })
        return announcements
    }
}

export const announcementsController = new AnnouncementController();