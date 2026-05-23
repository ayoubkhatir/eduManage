import z from "zod/v4";
import { validCuidSchema } from "./shared.schema";
import { AnnouncementAudienceEnum } from "#/server/db/schema";

export const createAnnouncementSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(3).max(1000),
    audience: z.enum(AnnouncementAudienceEnum),
    schoolId: validCuidSchema,
    authorId: validCuidSchema,
})


