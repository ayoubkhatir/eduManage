import { refreshServerFn } from '#/server/modules/auth/auth.server-function'
// import type { InitialAuthProps } from '#/store/auth_store'

import type { AuthUser } from '../types/authTypes'

export type AuthState = {
  user: AuthUser | null
  token: string | null
  setToken: (token: string | null) => void
  setUser: (user: AuthUser | null) => void
  logout: () => void
}

export type InitialAuthProps = Omit<AuthState, 'setToken' | 'setUser' | 'logout'>

export async function syncAuthSession(): Promise<InitialAuthProps> {

  try {
    const { data } = await refreshServerFn()
    if (!data) {
      console.warn('[ Auth ] Refresh returned no data')
      return {
        user: null,
        token: null,
      }
    }

    const { user, token } = data

    if (typeof token === 'string' && token.length > 0) {
      console.log('[ Auth ] Session successfully refreshed')
      return {
        user,
        token,
      }
    }
    console.warn('[ Auth ] Token invalid or missing after refresh')
    return {
      user: null,
      token: null,
    }
  } catch (error) {
    console.error('[ Auth ] Session refresh error:', error)
    return {
      user: null,
      token: null,
    }
  }
}