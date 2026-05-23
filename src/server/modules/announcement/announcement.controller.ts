import { db } from "#/server/db/db";
import { adminsTable, announcementsTable, users } from "#/server/db/schema";
import { ToSlug } from "#/server/utils/Slugify";
import type { AnnouncementWithAuthor, CreateAnnouncementType } from "#/types/announcementTypes";
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

        const announcementId = await db
            .insert(announcementsTable)
            .values({
                schoolId: announcement.schoolId,
                authorId: announcement.authorId,
                title: announcement.title,
                description: announcement.description,
                slug: ToSlug(announcement.title),
            })
            .returning({ id: announcementsTable.id })

        return announcementId
    }

    async getAnnouncementsBySchool(schoolId: string) {
        const announcements: AnnouncementWithAuthor[] = await db.query.announcementsTable.findMany({
            where: eq(announcementsTable.schoolId, schoolId),
            limit: 10,
            with: {
                author: {
                    columns: {
                        name: true,
                        role: true,
                        image: true,
                        email: true,
                        gender: true,
                        telNumber: true,
                    }
                }
            }
        })
        return announcements
    }

    async getAnnouncementById(AnnouncementId: string) {
        const announcement = await db.query.announcementsTable.findFirst({
            where: eq(announcementsTable.id, AnnouncementId),
            with: {
                author: {
                    columns: {
                        name: true,
                        role: true,
                        image: true,
                        email: true,
                        gender: true,
                        telNumber: true,
                    }
                }
            }
        })
        if (!announcement) {
            throw new Error('Announcement not found')
        }
        return announcement
    }

    async getAnnouncementByTitleSlug(AnnouncementTitleSlug: string) {
        const announcement = await db.query.announcementsTable.findFirst({
            where: eq(announcementsTable.slug, AnnouncementTitleSlug),
            with: {
                author: {
                    columns: {
                        name: true,
                        role: true,
                        image: true,
                        email: true,
                        gender: true,
                        telNumber: true,
                    }
                }
            }
        })
        if (!announcement) {
            throw new Error('Announcement not found')
        }
        return announcement
    }
}

export const announcementsController = new AnnouncementController();