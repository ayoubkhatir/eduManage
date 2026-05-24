import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { Fragment } from 'react'
import { SideBar } from '@/components/sideBar/SideBar'
import TopNav from '@/components/top_nav'
import { UserRoleEnum } from '#/server/db/schema'
import { redirect } from '@tanstack/react-router'
import { FetchCurrentUserServerFn } from '../-fetchAuthStateInBeforeLoad'

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
    const currentUser = await FetchCurrentUserServerFn({
      data: context.authState.user!,
    })
    return { currentUser }
  },
  component: Admin,
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
  const location = useLocation()
  const path = location.pathname.split('/')

  return (
    <Skeleton name="admin-layout" loading={false}>
      <div className="flex h-screen overflow-hidden bg-background text-slate-900 dark:text-slate-100">
        <SideBar currentUser={currentUser} info={info} />
        <main className="relative flex min-w-0 flex-1 flex-col overflow-y-auto">
          <TopNav />
          {/* Breadcrumb */}
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
          <Outlet />
        </main>
      </div>
    </Skeleton>
  )
}
