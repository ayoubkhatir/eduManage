// import { createContext, useContext, useEffect, useMemo, useState } from 'react'

// type Theme = 'dark' | 'light' | 'system'

// type ThemeProviderProps = {
//   children: React.ReactNode
//   defaultTheme?: Theme
//   storageKey?: string
// }

// type ThemeProviderState = {
//   theme: Theme
//   setTheme: (theme: Theme) => void
// }

// const initialState: ThemeProviderState = {
//   theme: 'system',
//   setTheme: () => null,
// }

// const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

// export function ThemeProvider({
//   children,
//   defaultTheme = 'system',
//   storageKey = 'theme',
// }: ThemeProviderProps) {
//   const [theme, setTheme] = useState<Theme>(defaultTheme)

//   useEffect(() => {
//     if (typeof window === 'undefined') return

//     const stored = window.localStorage.getItem(storageKey)
//     if (stored === 'light' || stored === 'dark' || stored === 'system') {
//       setTheme(stored)
//     }
//   }, [storageKey])

//   useEffect(() => {
//     if (typeof window === 'undefined') return

//     const root = window.document.documentElement
//     root.classList.remove('light', 'dark')

//     if (theme === 'system') {
//       const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
//         .matches
//         ? 'dark'
//         : 'light'

//       root.classList.add(systemTheme)
//       root.style.colorScheme = systemTheme
//       root.removeAttribute('data-theme')
//       return
//     }

//     root.classList.add(theme)
//     root.style.colorScheme = theme
//     root.setAttribute('data-theme', theme)
//   }, [theme])

//   const value = useMemo(
//     () => ({
//       theme,
//       setTheme: (newTheme: Theme) => {
//         const applyTheme = () => {
//           if (typeof window !== 'undefined') {
//             window.localStorage.setItem(storageKey, newTheme)
//           }
//           setTheme(newTheme)
//         }

//         if (
//           typeof document !== 'undefined' &&
//           'startViewTransition' in document &&
//           typeof document.startViewTransition === 'function'
//         ) {
//           document.startViewTransition(applyTheme)
//         } else {
//           applyTheme()
//         }
//       },
//     }),
//     [theme, storageKey],
//   )

//   return (
//     <ThemeProviderContext.Provider value={value}>
//       {children}
//     </ThemeProviderContext.Provider>
//   )
// }

// export const useTheme = () => {
//   const context = useContext(ThemeProviderContext)
//   return context
// }
import * as React from 'react'

type Theme = 'dark' | 'light' | 'system'
type ResolvedTheme = 'dark' | 'light'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = React.createContext<
  ThemeProviderState | undefined
>(undefined)

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function applyThemeToDocument(theme: Theme) {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme

  root.classList.remove('light', 'dark')
  root.classList.add(resolvedTheme)
  root.style.colorScheme = resolvedTheme

  if (theme === 'system') {
    root.setAttribute('data-theme', 'system')
  } else {
    root.setAttribute('data-theme', theme)
  }
}

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> }
}

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] =
    React.useState<ResolvedTheme>('light')

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = window.localStorage.getItem(storageKey)
    const nextTheme: Theme =
      stored === 'light' || stored === 'dark' || stored === 'system'
        ? stored
        : defaultTheme

    setThemeState(nextTheme)
    const nextResolved = nextTheme === 'system' ? getSystemTheme() : nextTheme
    setResolvedTheme(nextResolved)
    applyThemeToDocument(nextTheme)
  }, [defaultTheme, storageKey])

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = () => {
      const nextResolved = getSystemTheme()
      setResolvedTheme(nextResolved)
      applyThemeToDocument('system')
    }

    handleChange()

    mediaQuery.addEventListener('change', handleChange)
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  React.useEffect(() => {
    const nextResolved = theme === 'system' ? getSystemTheme() : theme
    setResolvedTheme(nextResolved)
    applyThemeToDocument(theme)
  }, [theme])

  const setTheme = React.useCallback(
    (newTheme: Theme) => {
      const apply = () => {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(storageKey, newTheme)
        }
        setThemeState(newTheme)
      }

      const doc =
        typeof document !== 'undefined'
          ? (document as DocumentWithViewTransition)
          : undefined

      if (doc?.startViewTransition) {
        doc.startViewTransition(apply)
      } else {
        apply()
      }
    },
    [storageKey],
  )

  const value = React.useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme, setTheme],
  )

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeProviderContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
