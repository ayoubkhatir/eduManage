import { createServerFn } from '@tanstack/react-start'
import { loginSchema } from '#/schemas/auth.schema'
import { authController } from './auth.controller'
import { successResponse, type APIResponse } from '#/server/utils/response.type'
import { sessionManager } from './services/session_manager.service'
import { deleteCookie, getCookie, setCookie } from '@tanstack/react-start/server'

export const loginServerFn = createServerFn({ method: 'POST' })
    .inputValidator(loginSchema)
    .handler(async ({ data }) => {
        try {
            const result = await authController.login(data)
            console.log({ result })
            setCookie(sessionManager.SESSION_COOKIE_NAME, result.token, {
                httpOnly: true,
                sameSite: 'lax',
                secure: false, // true in production with https
                expires: result.expiresAt,
                path: '/',
            })

            return successResponse({
                user: result.user,
            }) as APIResponse<{
                user: {
                    id: string
                    username: string
                    email: string
                    role: string
                    image: string | null
                }
            }>
        } catch (error) {
            console.log({ error })
            return {
                success: false,
                message:
                    error instanceof Error ? error.message : 'Failed to login',
            } as APIResponse<{
                user: {
                    id: string
                    username: string
                    email: string
                    role: string
                    image: string | null
                }
            }>
        }
    })

export const logoutServerFn = createServerFn({ method: 'POST' })
    .handler(
        async () => {
            const token = getCookie(sessionManager.SESSION_COOKIE_NAME)

            if (token) {
                await authController.logout(token)
            }

            deleteCookie(sessionManager.SESSION_COOKIE_NAME, { path: '/' })

            return { success: true }
        },
    )

export const getCurrentSessionServerFn = createServerFn({ method: 'GET' })
    .handler(async () => {
        const token = getCookie(sessionManager.SESSION_COOKIE_NAME)

        if (!token) {
            return successResponse(null)
        }

        const session = await authController.getCurrentUser(token)
        return successResponse(session)
    })