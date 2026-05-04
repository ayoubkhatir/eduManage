import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import * as z from 'zod'
import { useRouter } from '@tanstack/react-router'
import { createContext, type PropsWithChildren, use } from 'react'
import { type T as Theme } from '#/lib/theme'

const postThemeValidator = z.union([z.literal('light'), z.literal('dark')])
export type T = z.infer<typeof postThemeValidator>
const storageKey = '_preferred-theme'

export const getThemeServerFn = createServerFn().handler(
  async () => (getCookie(storageKey) || 'light') as T,
)

export const setThemeServerFn = createServerFn({ method: 'POST' })
  .inputValidator(postThemeValidator)
  .handler(async ({ data }) => setCookie(storageKey, data))

type ThemeContextVal = { theme: Theme; setTheme: (val: Theme) => void }
type Props = PropsWithChildren<{ theme: Theme }>

const ThemeContext = createContext<ThemeContextVal | null>(null)

export function ThemeProvider({ children, theme }: Props) {
  const router = useRouter()

  function setTheme(val: Theme) {
    setThemeServerFn({ data: val }).then(() => router.invalidate())
  }

  return <ThemeContext value={{ theme, setTheme }}> {children} </ThemeContext>
}

export function useTheme() {
  const val = use(ThemeContext)
  if (!val) throw new Error('useTheme called outside of ThemeProvider!')
  return val
}
