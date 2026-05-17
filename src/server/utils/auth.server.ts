import { betterAuth } from "better-auth";
import { openAPI } from "better-auth/plugins";
import { bearer } from "better-auth/plugins/bearer";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/db.ts";
import { handlePassword } from "./handle-password.ts";

const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:4000";
const basePath = "/api/better-auth";
const SESSION_EXPIRES_IN_SECONDS = 60 * 60 * 24 * 7;
const SESSION_UPDATE_AGE_SECONDS = 60 * 60 * 24;

const socialProviders = {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ? {
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            },
        }
        : {}),
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
        ? {
            facebook: {
                clientId: process.env.FACEBOOK_CLIENT_ID,
                clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            },
        }
        : {}),
};

export const auth = betterAuth({
    baseURL,
    basePath,
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    plugins: [bearer(), openAPI()],
    user: {
        modelName: "users",
        additionalFields: {
            role: {
                type: ["Student", "Teacher", "Admin"],
                required: true,
                defaultValue: "Admin",
                input: true,
            },
            gender: {
                type: ["Male", "Female"],
                required: true,
                defaultValue: "Male",
            }
        },
    },
    emailAndPassword: {
        password: {
            hash: (password: string) => handlePassword.hash(password),
            verify: ({ hash, password }: { hash: string; password: string }) =>
                handlePassword.verify(password, hash),
        },
        enabled: true,
        requireEmailVerification: false,
        minPasswordLength: 8,
        customSyntheticUser: ({ coreFields, additionalFields, id }) => ({
            ...coreFields,
            ...additionalFields,
            id,
        }),
    },
    socialProviders,
    session: {
        expiresIn: SESSION_EXPIRES_IN_SECONDS,
        updateAge: SESSION_UPDATE_AGE_SECONDS,
    },
});
