import { UserGenderEnum, UserRoleEnum } from "#/server/db/schema"
import type { AuthUser } from "#/types/authTypes"
import type { StudentUser } from "#/types/studentTypes"
import type { TeacherUser } from "#/types/teacherTypes"
import type { AdminUser } from "#/types/usersTypes"
import { createServerFn } from "@tanstack/react-start"
import { z } from "zod/v4"

const AuthUserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    emailVerified: z.boolean(),
    image: z.string().nullable().nullish(),
    gender: z.enum(UserGenderEnum),
    telNumber: z.string().nullable(),
    role: z.enum(UserRoleEnum),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const FetchCurrentUserServerFn = createServerFn({ method: "GET" })
    .inputValidator(AuthUserSchema)
    .handler(async ({ data: user }) => {
        const { authController } = await import("#/server/modules/auth/auth.controller")
        const info = await authController.fetchUserRoleData(user.id, user.role)!

        let currentUser: AuthUser;

        if (user.role === UserRoleEnum.ADMIN) {
            currentUser = {
                ...user,
                info: info.admin!,
            } as AdminUser;
        } else if (user.role === UserRoleEnum.STUDENT) {
            currentUser = {
                ...user,
                info: info.student!,
            } as StudentUser;
        } else {
            currentUser = {
                ...user,
                info: info.teacher!,
            } as TeacherUser;
        }

        return currentUser;
    });
