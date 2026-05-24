import z from "zod/v4";
import { genderSchema, paginationQueriesSchema, phoneNumberSchema } from "./shared.schema";
import { StatusEnum } from "#/server/db/schema";

export const getUsersSchema = paginationQueriesSchema.extend({
    sortBy: z.enum(['name', 'email']).nullable().default(null),
    sortOrder: z.enum(['asc', 'desc']).nullable().default(null),
    status: z.enum(StatusEnum).nullable().optional(),
});


export const addUserSchema = z.object({
    name: z.string()
        .nonempty({ message: "Name is required" })
        .max(50, { message: 'Name must be at most 50 characters' }),
    email: z
        .email({ message: 'Invalid email address' })
        .nonempty({ message: 'Email is required' })
        .max(255, { message: "Email must be at most 255 characters." }),
    image: z.string().optional(),
    telNumber: phoneNumberSchema,
    gender: genderSchema,
})

export const editUserSchema = addUserSchema;