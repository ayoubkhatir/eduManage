import z, { coerce } from "zod/v4";
import { statusSchema, validCuidSchema } from "./shared.schema";

export const addGradeSchema = z.object({
    schoolId: validCuidSchema,
    name: z.string().max(50),
    levelOrder: coerce.number<number>().int().positive(),
    status: statusSchema
})

export type AddGradeSchema = z.infer<typeof addGradeSchema>