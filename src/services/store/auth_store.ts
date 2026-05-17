
import { create , useStore } from 'zustand'
import {  useContext } from "react"
import {AuthStoreContext} from "#/providers/authProvider"
import type { AuthUser }  from '../../schemas/auth.schema'

export type AuthState = {
  user: AuthUser | null
  token: string | null
  setToken: (token: string | null) => void
  setUser: (user: AuthUser | null) => void
  logout: () => void
}

export type InitialAuthProps = Omit<AuthState, 'setToken' | 'setUser' | 'logout'>

export const createAuthStore = (initialProps? : Partial<InitialAuthProps>) => { 
  
  return create<AuthState>((set) => ({
    user: initialProps?.user || null,
    token: initialProps?.token || null,
    setToken: (token) => set({ token }),
    setUser: (user) => set({ user }),
    logout: () => set({ user: null, token: null }),
  }))
}

export function useAuth<T>(
  selector: (state: ReturnType<AuthStore['getState']>) => T
) {
  const store = useContext(AuthStoreContext)

  if (!store) {
    throw new Error('Missing AuthProvider')
  }

  return useStore(store, selector)
}

export type AuthStore = ReturnType<typeof createAuthStore>
