
import { db } from "#/server/db/db.js";
import { UserRoleEnum } from "#/server/db/schema.js";
import { auth } from "../../utils/auth.server.js";
import type { LoginBody, RegisterBody } from "./auth.schema.js";
import { authService } from "./auth.service.js";
import { deleteCookie, getCookie, } from '@tanstack/react-start/server'


interface IAuthController {
    login: (input: LoginBody, headers: Headers) => Promise<Record<string, any>>
    register: (payload: RegisterBody, headers: Headers) => Promise<Record<string, any>>
    logout: (headers: Headers) => Promise<Record<string, any>>
    refresh: (headers: Headers) => Promise<Record<string, any>>
    loginOAuth: (provider: "google" | "facebook") => Promise<Record<string, any>>
}




class AuthController implements IAuthController {

    async login(input: LoginBody, headers: Headers) {

        try {
            const data = await auth.api.signInEmail({
                body: {
                    email: input.email,
                    password: input.password,
                    rememberMe: input.rememberMe,
                    callbackURL: input.callbackURL,
                },
                headers: headers,
            });
            // Normalize role comparison: input is lowercase, database role is PascalCase
            const normalizedInputRole = input.role.charAt(0).toUpperCase() + input.role.slice(1);
            if (normalizedInputRole != data.user.role) {
                return (
                    {
                        success: false,
                        message: "Invalid role for the user",
                        status: 403
                    }
                )
            }

            const loginFailure = authService.resolveLoginFailure(data);
            if (loginFailure) {
                return {
                    success: false,
                    message: loginFailure.message,
                    status: loginFailure.status,
                };
            }

            if (typeof data?.token !== "string" || !data.token) {
                return {
                    success: false,
                    message: "Authentication succeeded but session token is missing",
                    status: 500,
                };
            }

            const userAgent = headers.get("user-agent") || "";
            const { accessToken } = await authService.generateToken(
                { userId: data.user.id },
                data.token,
                userAgent,
            );
            const response = await authService.enrichUserWithInfo({ ...data, token: accessToken });
            return {
                success: true,
                status: 200,
                data: response,
            };
        } catch (error: any) {
            console.log("\x1b[36m[server]\x1b[0m " + error)
            return {
                success: false,
                message: authService.getErrorMessage(error, "Authentication failed"),
                status: 401,
            };
        }
    }

    async register(payload: RegisterBody, headers: Headers) {
        const { fullName, schoolName, email, password, rememberMe, callbackURL } =
            payload;

        try {
            const existingUser = await authService.findUserByEmail(email);
            if (existingUser) {
                return {
                    success: false,
                    message: "User already exists",
                    status: 409,
                };
            }

            const data = await auth.api.signUpEmail({
                body: {
                    name: fullName,
                    email,
                    password,
                    rememberMe,
                    callbackURL,
                    role: UserRoleEnum.ADMIN,
                    telNumber: null!
                },

            });

            await authService.addAdmin(data, schoolName);

            if (typeof data?.token !== "string" || !data.token) {
                return {
                    success: false,
                    message: "Registration succeeded but session token is missing",
                    status: 500
                };
            }

            const userAgent = headers.get("user-agent") || "";
            const { accessToken } = await authService.generateToken(
                { userId: data.user.id },
                data.token,
                userAgent,
            );
            const response = await authService.enrichUserWithInfo({ ...data, token: accessToken });
            return {
                success: true,
                message: "User registered successfully",
                status: 201,
                data: response
            };
        } catch (error: any) {
            console.log("\x1b[36m[server]\x1b[0m " + error)
            if (authService.isUserAlreadyExistsError(error)) {
                return {
                    success: false,
                    message: "User already exists",
                    status: 409
                };
            }

            return {
                success: false,
                message: authService.getErrorMessage(error, "Registration failed"),
                status: authService.getErrorStatus(error, 400)
            };

        }
    }

    async logout(headers: Headers) {
        try {
            const currentRefreshToken = getCookie("refreshToken");
            if (!currentRefreshToken) {
                return {
                    success: true,
                    message: "Logged out successfully",
                    status: 200,
                    redirectURL: "/",
                };
            }

            headers.set("Authorization", `Bearer ${currentRefreshToken}`);

            await auth.api.signOut({
                headers
            });
            deleteCookie("refreshToken");
            return {
                success: true,
                message: "Logged out successfully",
                redirectURL: "/",
                status: 200,
            };
        } catch (error: any) {
            console.log("\x1b[36m[server]\x1b[0m " + error)
            return {
                success: false,
                message: authService.getErrorMessage(error, "Logout failed"),
                redirectURL: "/",
                status: authService.getErrorStatus(error, 400),
            };
        }
    }
    async refresh(headers: Headers) {
        const currentRefreshToken = getCookie("refreshToken");

        if (!currentRefreshToken) {
            console.warn('[ Auth ] No refresh token found in cookies')
            return {
                success: false,
                message: "no session token provided",
                status: 401
            };
        }

        try {
            const userAgent = headers.get("user-agent") || "";
            const refreshResult = await authService.rotateSessionToken(currentRefreshToken, userAgent);

            if (!refreshResult) {
                console.warn('[ Auth ] Session rotation failed')
                return {
                    success: false,
                    message: "Invalid or expired session token",
                    status: 401
                };
            }

            console.log('[ Auth ] Session token rotated successfully')
            return {
                success: true,
                message: "Session refreshed successfully",
                status: 200,
                data: {
                    token: refreshResult.accessToken,
                    user: refreshResult.user,
                }
            };
        } catch (error: any) {
            console.error('[ Auth ] Session refresh error:', error)
            return {
                success: false,
                message: authService.getErrorMessage(error, "Session refresh failed"),
                status: authService.getErrorStatus(error, 400)
            };
        }
    }
    async loginOAuth(provider: "google" | "facebook") {
        const data = await auth.api.signInSocial({
            body: {
                provider,
                callbackURL: "/admin/dashboard",
            },
        });


        if (data?.url) {
            return {
                success: true,
                status: 200,
                data: {
                    url: data.url,
                },
            };
        }

        return {
            success: false,
            message: "Failed to initiate social login",
        }

    }

    async fetchUserRoleData(userId: string, role: UserRoleEnum) {
        switch (role) {
            case UserRoleEnum.ADMIN:
                const admin = await db.query.adminsTable.findFirst({
                    where: (admins, { eq }) => eq(admins.userId, userId),
                });
                return { role, admin: admin!, teacher: null, student: null };
            case UserRoleEnum.STUDENT:
                const rawStudent = await db.query.studentsTable.findFirst({
                    where: (students, { eq }) => eq(students.userId, userId),
                    with: {
                        class: {
                            columns: {
                                id: true,
                                name: true
                            },
                            with: {
                                grade: {
                                    columns: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                })!;

                const student = {
                    ...rawStudent!,
                    grade: {
                        id: rawStudent!.class.grade.id,
                        name: rawStudent!.class.grade.name
                    },
                    class: {
                        id: rawStudent!.class.id,
                        name: rawStudent!.class.name
                    },
                }
                return { role, admin: null, teacher: null, student: student! };
            case UserRoleEnum.TEACHER:
                const rawTeacher = await db.query.teachersTable.findFirst({
                    where: (teachers, { eq }) => eq(teachers.userId, userId),
                    with: {
                        assignments: {
                            with: {
                                subject: {
                                    columns: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                })!;
                const { assignments, ...restRawTeacher } = rawTeacher!;
                const teacher = { subjects: assignments.map(ass => ass.subject), ...restRawTeacher }
                return { role, admin: null, teacher: teacher!, student: null };
            // case UserRoleEnum.STUDENT:

            // case UserRoleEnum.TEACHER:
            //     return
        }
    }
}

export const authController = new AuthController();
