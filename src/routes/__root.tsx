import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'

// import appCss from '../styles.css?url'
import '../styles.css'
import '../styles/react-big-calendar.css'
import '../styles/calendar.css'
import '../styles/_variables.scss'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import { QueryClientProvider } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { queryClient } from '#/lib/query-client'
import { Toaster } from '#/components/ui/sonner'
import { ThemeProvider } from '#/features/theme/theme-provider'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        {
          charSet: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          title: 'TanStack Start Starter',
        },
      ],
      links: [
        // {
        //   rel: 'stylesheet',
        //   href: appCss,
        // },
      ],
    }),

    shellComponent: RootDocument,
  },
)

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body
        suppressHydrationWarning
        className="font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)]"
      >
        <Toaster richColors closeButton position="top-center" />

        <Root>{children}</Root>
        <Scripts />
        <script
          src="https://upload-widget.cloudinary.com/2.72.5/global/all.js"
          type="text/javascript"
        />
      </body>
    </html>
  )
}

// function getRouteSkeletonName(pathname: string) {
//   const uuidPattern =
//     /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

//   const parts = pathname
//     .split('/')
//     .filter(Boolean)
//     .map((part) => {
//       if (/^\d+$/.test(part) || uuidPattern.test(part)) {
//         return 'id'
//       }

//       const cleaned = part.toLowerCase().replace(/[^a-z0-9-]/g, '')
//       return cleaned || 'segment'
//     })

//   return parts.length ? `route-${parts.join('-')}` : 'route-home'
// }

function Root({ children }: { children: ReactNode }) {
  // const routeSkeletonName = getRouteSkeletonName(location.pathname)
  return (
    <>
      {/* <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme"> */}
      <QueryClientProvider client={queryClient}>
        {/* <AuthProvider initialProps={authState}> */}
        <ThemeProvider>
          {/* <Skeleton name={routeSkeletonName} loading={false}> */}
          {children}
          {/* </Skeleton> */}
        </ThemeProvider>
        {/* </AuthProvider> */}
      </QueryClientProvider>
      {/* </ThemeProvider> */}
    </>
  )
}
