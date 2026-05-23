import z from "zod/v4";
import { validCuidSchema } from "./shared.schema";

export const createAnnouncementSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(3).max(1000),
    schoolId: validCuidSchema,
    authorId: validCuidSchema
})


