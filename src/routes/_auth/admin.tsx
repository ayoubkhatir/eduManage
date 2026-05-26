import {
  Link,
  Outlet,
  createFileRoute,
  useLocation,
  useMatches,
} from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { Fragment } from 'react'
import { SideBar } from '@/components/sideBar/SideBar'
import TopNav from '@/components/top_nav'
import { UserRoleEnum } from '#/server/db/schema'
import { redirect } from '@tanstack/react-router'
import { FetchCurrentUserServerFn } from '../-fetchAuthStateInBeforeLoad'
import type { AdminUser } from '#/types/usersTypes'

export const Route = createFileRoute('/_auth/admin')({
  beforeLoad: async ({ context }) => {
    const { user } = context.authState!
    if (user.role !== UserRoleEnum.ADMIN) {
      throw redirect({
        to: user.role === UserRoleEnum.STUDENT ? '/student' : '/teacher',
      })
    }
  },
  loader: async ({ context }) => {
    const currentUser = (await FetchCurrentUserServerFn({
      data: context.authState.user!,
    })) as AdminUser
    return { currentUser }
  },
  component: Admin,
  staticData: {
    breadcrumb: 'Admin',
  },
  head: () => ({
    meta: [
      {
        title: 'Admin - EduManage',
      },
    ],
  }),
})

const info = {
  layout: 'admin',
  list: [
    { name: 'Dashboard', icon: 'dashboard' },
    { name: 'Calendar', icon: 'calendar_month' },
    { name: 'Grades', icon: 'stairs_2' },
    { name: 'Teachers', icon: 'class' },
    { name: 'Students', icon: 'group' },
    { name: 'Announcements', icon: 'announcement' },
    { name: 'Settings', icon: 'settings' },
  ],
}

function Admin() {
  const { currentUser } = Route.useLoaderData()

  return (
    <Skeleton name="admin-layout" loading={false}>
      <div className="flex h-screen overflow-hidden bg-background text-slate-900 dark:text-slate-100">
        <SideBar currentUser={currentUser} info={info} />
        <main className="relative flex min-w-0 flex-1 flex-col overflow-y-auto">
          <TopNav />

          {/* Breadcrumb */}
          <OldBreadcrumb />

          <LayoutBreadcrumb />
          <Outlet />
        </main>
      </div>
    </Skeleton>
  )
}

function OldBreadcrumb() {
  const location = useLocation()
  const path = location.pathname.split('/')

  return (
    <nav
      className="flex items-center gap-2 px-6 pt-5 pb-2 text-sm font-medium"
      aria-label="Breadcrumb"
    >
      {path
        .slice(1)
        .filter(Boolean)
        .map((segment, i, arr) => (
          <Fragment key={i}>
            {i > 0 && (
              <svg
                className="size-3.5 shrink-0 text-slate-400 dark:text-slate-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
            <span
              className={
                i === arr.length - 1
                  ? 'text-foreground font-semibold capitalize tracking-tight'
                  : 'text-muted-foreground capitalize'
              }
            >
              {segment.replace(/-/g, ' ')}
            </span>
          </Fragment>
        ))}
    </nav>
  )
}

function LayoutBreadcrumb() {
  // 1. Grab all active matching route branches
  const matches = useMatches()

  // 2. Map matches to clean structural breadcrumb elements
  // const breadcrumbs = matches
  //   .filter((match) => match.staticData?.breadcrumb) // Only include routes that explicitly declare a breadcrumb
  //   .map((match) => {
  //     const label =
  //       typeof match.staticData.breadcrumb === 'function'
  //         ? match.staticData.breadcrumb(match)
  //         : match.staticData.breadcrumb

  //     return {
  //       label: label ?? '',
  //       path: match.pathname,
  //     }
  //   })

  const breadcrumbs = matches
    .filter((match) => match.staticData?.breadcrumb)
    .flatMap((match) => {
      const rawBreadcrumb = match.staticData.breadcrumb

      // Normalize everything into an array of items (strings or functions)
      const items = Array.isArray(rawBreadcrumb)
        ? rawBreadcrumb
        : [rawBreadcrumb]

      return items.map((item, index) => {
        // Resolve the label if it's a function or keep it if it's a string
        const label = typeof item === 'function' ? item(match) : item

        // Smart Path Mapping:
        // If it's a multi-item array and we are on the first item ('Teachers'),
        // point the Link to the parent section, otherwise use the full match path.
        const isMultiItemParent = Array.isArray(rawBreadcrumb) && index === 0
        const path = isMultiItemParent
          ? match.pathname.split('/').slice(0, -1).join('/')
          : match.pathname

        return {
          label: label ?? '',
          path: path,
        }
      })
    })
    // Filter out any empty values or intermediate layout anomalies
    .filter((crumb) => crumb.label !== '')

  console.log({ breadcrumbs, matches })
  return (
    <>
      {breadcrumbs.length > 0 && (
        <nav
          className="flex items-center gap-2 px-6 pt-5 pb-2 text-sm font-medium"
          aria-label="Breadcrumb"
        >
          {breadcrumbs.map((crumb, i) => {
            const isLast = i === breadcrumbs.length - 1

            return (
              <Fragment key={crumb.path}>
                {i > 0 && (
                  <svg
                    className="size-3.5 shrink-0 text-slate-400 dark:text-slate-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}

                {isLast ? (
                  <span className="text-foreground font-semibold tracking-tight">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </Fragment>
            )
          })}
        </nav>
      )}
    </>
  )
}
