import { createAuthClient } from "better-auth/client"

const baseURL = process.env.BETTER_AUTH_URL;
const basePath = "/api/better-auth";

export const authClient = createAuthClient({
    baseURL,
    basePath,
});
