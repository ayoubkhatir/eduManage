import {createContext ,  useRef} from "react"
import { createAuthStore, type AuthStore, type InitialAuthProps  } from "#/services/store/auth_store"

export const AuthStoreContext = createContext<AuthStore | null>(null)

export default function AuthProvider({ children, initialProps }: { children: React.ReactNode, initialProps: InitialAuthProps }) {
  const storeRef = useRef<AuthStore | null>(null)

  if (!storeRef.current) {
    storeRef.current = createAuthStore(initialProps)
  }
  
  return (
    <AuthStoreContext.Provider value={storeRef.current} >
      {children}
    </AuthStoreContext.Provider>
  )
}

