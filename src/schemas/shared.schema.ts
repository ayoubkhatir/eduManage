import { StatusEnum, UserGenderEnum, UserRoleEnum } from "#/server/db/schema";
import z from "zod/v4";

export const validCuidSchema = z.cuid2();


export const paginationQueriesSchema = z.object({
    search: z.string().trim().default(""),
    page: z.coerce.number<number>().int().default(1),
    size: z.coerce.number<number>().int().default(10),
});


export const phoneNumberSchema = z.string().regex(/^(?:06|05|07)\d{8}$/, 'Phone number is not valid')

export const roleSchema = z.enum(UserRoleEnum)
export const authRoleSchema = z.enum(UserRoleEnum)
export const genderSchema = z.enum(UserGenderEnum , {
    error : "Invalid gender"
})
export const statusSchema = z.enum(StatusEnum)



export const sortOptionsSchema = z.enum(['newest', 'oldest', 'name', 'size'])
