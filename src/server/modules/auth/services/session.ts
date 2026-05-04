import { getCookie } from '@tanstack/react-start/server'
import { redirect } from '@tanstack/react-router'
import { sessionManager } from '#/server/modules/auth/services/session_manager.service'
import { authController } from '#/server/modules/auth/auth.controller'
import { createServerFn } from '@tanstack/react-start'
import type { UserRoleEnum } from '#/server/db/schema'

export const getCurrentUser = createServerFn({ method: "GET" })
    .handler(async () => {
        const token = getCookie(sessionManager.SESSION_COOKIE_NAME)
        if (!token) return null

        return await authController.getCurrentUser(token)
    })

export async function requireUser() {
    const session = await getCurrentUser()

    if (!session) {
        throw redirect({ to: '/auth/login' })
    }

    return session
}

export async function requireRole(role: UserRoleEnum, redirectUrl: string) {
    const session = await requireUser()

    if (session.user.role !== role) {
        throw redirect({ to: '/auth/login', search: (s) => ({ ...s, redirectUrl }) })
    }

    return session
}