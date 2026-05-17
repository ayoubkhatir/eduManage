


import {refreshServerFn} from '#/server/modules/auth/auth.server-function'
import type { InitialAuthProps } from '#/services/store/auth_store'



export async function syncAuthSession(): Promise<InitialAuthProps> {


  try {
    
    const {data} = await refreshServerFn()
    if (!data) {
      
      return {
        user: null,
        token: null,
      }
    }

    const { user, token } = data 
    

    if (typeof token === 'string' && token.length > 0) {
      return {
        user,
        token,
      }
    }
    return {
      user: null,
      token: null,
    }
  } catch {
    return {
      user: null,
      token: null,
    }
  }
}