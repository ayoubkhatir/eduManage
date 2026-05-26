import { createServerFn, } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server"
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from "./auth.schema";
import { authController } from "./auth.controller";
import { z } from "zod";
import { auth } from "#/server/utils/auth.server";




export const loginServerFn = createServerFn({ method: "POST" })
    .inputValidator(loginSchema)
    .handler(({ data }) => {
        const headers = getRequestHeaders();
        return authController.login(data, headers)
    })

export const registerServerFn = createServerFn({ method: "POST" })
    .inputValidator(registerSchema)
    .handler(({ data }) => {
        const headers = getRequestHeaders();
        return authController.register(data, headers)
    })

export const logoutServerFn = createServerFn({ method: "POST" })
    .handler(async () => {
        const headers = getRequestHeaders();
        // return authController.logout(headers)
        return await auth.api.signOut({ headers })
    })

export const refreshServerFn = createServerFn({ method: "POST" })
    .handler(() => {
        const headers = getRequestHeaders();
        return authController.refresh(headers)
    })

// * REBUILD THE FULL LOGIC OF THIS FUNCTION :
export const loginOAuthServer = createServerFn({ method: "POST" })
    .inputValidator(z.object({ provider: z.enum(["google", "facebook"]) }))
    .handler(({ data }) => {
        const { provider } = data
        return authController.loginOAuth(provider)
    });

export const forgotPasswordServerFn = createServerFn({ method: "POST" })
    .inputValidator(forgotPasswordSchema)
    .handler(({ data }) => {
        const headers = getRequestHeaders();
        return authController.forgotPassword(data, headers)
    })

export const resetPasswordServerFn = createServerFn({ method: "POST" })
    .inputValidator(resetPasswordSchema)
    .handler(({ data }) => {
        const headers = getRequestHeaders();
        return authController.resetPassword(data, headers)
    })