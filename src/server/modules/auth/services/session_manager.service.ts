import crypto from 'node:crypto'

export interface ISessionManager {
    generateSessionToken(): string
    hashSessionToken(token: string): string
    getSessionExpiresAt(): Date
}
class SessionManager implements ISessionManager {
    SESSION_COOKIE_NAME = 'edu_session'

    generateSessionToken() {
        return crypto.randomBytes(32).toString('hex')
    }

    hashSessionToken(token: string) {
        return crypto.createHash('sha256').update(token).digest('hex')
    }

    getSessionExpiresAt() {
        const now = new Date()
        now.setDate(now.getDate() + 7) // 7 days
        return now
    }
}
export const sessionManager = new SessionManager()