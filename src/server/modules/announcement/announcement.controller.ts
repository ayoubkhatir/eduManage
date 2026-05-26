import { db } from "#/server/db/db";
import { adminsTable, AnnouncementAudienceEnum, announcementsTable, users } from "#/server/db/schema";
import { ToSlug } from "#/server/utils/Slugify";
import type { AnnouncementWithAuthor, CreateAnnouncementType, GetAnnouncementsFiltersSchema } from "#/types/announcementTypes";
import { and, eq, ilike, or } from "drizzle-orm";

class AnnouncementController {
    async createAnnouncement({ audience, authorId, description, schoolId, title }: CreateAnnouncementType) {
        const school = await db.query.adminsTable.findFirst({
            where: eq(adminsTable.id, schoolId),
        })
        if (!school) {
            throw new Error("School not found");
        }
        const author = await db.query.users.findFirst({
            where: eq(users.id, authorId),
        })

        if (!author) {
            throw new Error("Author not found");
        }

        const announcementId = await db
            .insert(announcementsTable)
            .values({
                schoolId,
                authorId,
                title,
                description,
                audience,
                slug: ToSlug(title),
            })
            .returning({ id: announcementsTable.id })

        return announcementId
    }

    async getAnnouncementsBySchool(schoolId: string, filters: GetAnnouncementsFiltersSchema) {
        const announcements: AnnouncementWithAuthor[] = await db.query.announcementsTable.findMany({
            where: and(
                eq(announcementsTable.schoolId, schoolId),
                filters.audience !== AnnouncementAudienceEnum.PUBLIC
                    ? eq(
                        announcementsTable.audience,
                        filters.audience,
                    )
                    : undefined,
                filters.search
                    ? or(
                        ilike(
                            announcementsTable.title,
                            `%${filters.search}%`,
                        ),

                        ilike(
                            announcementsTable.slug,
                            `%${filters.search}%`,
                        ),

                        ilike(
                            announcementsTable.description,
                            `%${filters.search}%`,
                        ),
                    )
                    : undefined,
            ),
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