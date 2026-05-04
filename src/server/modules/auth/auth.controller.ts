import { db, type Database } from '#/server/db/db'
import { sessionsTable, UserRoleEnum, usersTable, type UserGenderEnum } from '#/server/db/schema'
import { eq } from 'drizzle-orm'
import { passwordHasher, type IPasswordHasher } from '../auth/services/password_hasher.service'
import type { LoginSchema } from '#/schemas/auth.schema'
import { sessionManager, type ISessionManager } from './services/session_manager.service'

export type AuthSession = {
    id: string,
    expiresAt: Date,
    createdAt: Date
}

export type AuthUser = {
    id: string
    username: string
    email: string
    role: UserRoleEnum
    image: string | null
    gender: UserGenderEnum
    roleId: string
}

export type AuthState = {
    session: AuthSession,
    user: AuthUser
}

class AuthController {
    constructor(
        private readonly db: Database,
        private readonly passwordHasher: IPasswordHasher,
        private readonly sessionManager: ISessionManager
    ) { }

    async login(input: LoginSchema) {
        const user = await this.db.query.usersTable.findFirst({
            where: eq(usersTable.email, input.email),
            with: {
                teacher: { columns: { id: true } },
                student: { columns: { id: true } },
                admin: { columns: { id: true } }
            }
        })
        console.log({ user })

        if (!user) {
            throw new Error('Invalid email or password')
        }

        const isValidPassword = await this.passwordHasher.comparePassword(
            input.password,
            user.passwordHash,
        )
        console.log({ isValidPassword })
        if (!isValidPassword) {
            throw new Error('Invalid email or password')
        }

        const roleId = this.getRoleId(user);

        const rawToken = this.sessionManager.generateSessionToken()
        const hashedSessionID = this.sessionManager.hashSessionToken(rawToken)
        const expiresAt = this.sessionManager.getSessionExpiresAt()

        await this.db.insert(sessionsTable).values({
            id: hashedSessionID,
            userId: user.id,
            expiresAt,
        })

        return {
            token: rawToken,
            expiresAt,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                image: user.image,
                roleId
            },
        }
    }

    async logout(token: string) {
        const hashedSessionID = this.sessionManager.hashSessionToken(token)

        await this.db.delete(sessionsTable).where(eq(sessionsTable.id, hashedSessionID))

        return { success: true }
    }

    async getCurrentUser(token: string): Promise<AuthState | null> {
        const hashedSessionID = this.sessionManager.hashSessionToken(token)

        const session = await this.db.query.sessionsTable.findFirst({
            where: eq(sessionsTable.id, hashedSessionID),
            with: {
                user: {
                    with: {
                        student: { columns: { id: true } },
                        teacher: { columns: { id: true } },
                        admin: { columns: { id: true } }
                    }
                },
            },
        })

        if (!session) return null

        if (session.expiresAt < new Date()) {
            await this.db.delete(sessionsTable).where(eq(sessionsTable.id, hashedSessionID))
            return null
        }

        const roleId = this.getRoleId(session.user)
        return {
            session: {
                id: session.id,
                expiresAt: session.expiresAt,
                createdAt: session.createdAt,
            },
            user: {
                id: session.user.id,
                username: session.user.username,
                email: session.user.email,
                role: session.user.role,
                image: session.user.image,
                gender: session.user.gender,
                roleId
            },
        }
    }

    private getRoleId(user: {
        role: UserRoleEnum
        student: {
            id: string;
        } | null;
        teacher: {
            id: string;
        } | null;
        admin: {
            id: string;
        } | null;
    }) {

        let roleId: string
        switch (user.role) {
            case UserRoleEnum.ADMIN:
                roleId = user.admin?.id!;
                break
            case UserRoleEnum.STUDENT:
                roleId = user.student?.id!;
                break;
            case UserRoleEnum.TEACHER:
                roleId = user.teacher?.id!
                break;
        }
        return roleId;
    }
}

export const authController = new AuthController(db, passwordHasher, sessionManager);