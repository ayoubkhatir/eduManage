import z from "zod/v4";
import { statusSchema, validCuidSchema } from "./shared.schema";

export const addClassSchema = z.object({
    schoolId: validCuidSchema,
    gradeId: validCuidSchema,
    name: z.string().max(40),
    status: statusSchema
})
