import { createServerFn ,   } from "@tanstack/react-start";
import {getRequestHeaders} from "@tanstack/react-start/server"
import { loginSchema , registerSchema } from "./auth.schema";
import { authController } from "./auth.controller";
import { z } from "zod";




export const loginServerFn = createServerFn({
    method: "POST",
})
.inputValidator(loginSchema)
.handler(({ data }) =>{
    const headers = getRequestHeaders();
    return authController.login(data , headers)
})

export const registerServerFn = createServerFn({
    method: "POST",
})
.inputValidator(registerSchema)
.handler(({ data }) =>{
    const headers = getRequestHeaders();
    return authController.register(data, headers)
})

export const logoutServerFn = createServerFn({
    method: "POST",
})
.handler(() => {
    const headers = getRequestHeaders();
    return authController.logout(headers)
})

export const refreshServerFn = createServerFn({
    method: "POST",
})
.handler(() => {
    const headers = getRequestHeaders();
    return authController.refresh(headers)
})

// * REBUILD THE FULL LOGIC OF THIS FUNCTION :
export const loginOAuthServer = createServerFn({ method: "POST" })
    .inputValidator(z.object({ provider: z.enum(["google", "facebook"]) }))
    .handler(({data})=> {
        const { provider } = data
        return authController.loginOAuth(provider)
    });