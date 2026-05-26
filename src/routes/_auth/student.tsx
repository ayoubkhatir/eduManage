import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { SideBar } from '@/components/sideBar/SideBar'
import TopNav from '@/components/top_nav'
import { UserRoleEnum } from '#/server/db/schema'
import { FetchCurrentUserServerFn } from '../-fetchAuthStateInBeforeLoad'
import { LayoutBreadcrumb } from '#/components/LayoutBraedCrumb'

export const Route = createFileRoute('/_auth/student')({
  beforeLoad: async ({ context }) => {
    const { user } = context.authState!
    if (user.role !== UserRoleEnum.STUDENT) {
      throw redirect({
        to: user.role === UserRoleEnum.ADMIN ? '/admin' : '/teacher',
      })
    }
  },
  loader: async ({ context }) => {
    const currentUser = await FetchCurrentUserServerFn({
      data: context.authState.user!,
    })
    return { currentUser }
  },
  component: Student,
  staticData: {
    breadcrumb: 'Student',
  },
  head: () => ({
    meta: [{ title: 'Student - EduManage' }],
  }),
})

const info = {
  layout: 'student',
  list: [
    { name: 'Calendar', icon: 'calendar_month' },
    { name: 'Subjects', icon: 'menu_book' },
    { name: 'Announcements', icon: 'announcement' },
    { name: 'Settings', icon: 'settings' },
  ],
}

function Student() {
  const { currentUser } = Route.useLoaderData()

  return (
    <Skeleton name="student-layout" loading={false}>
      <div className="flex h-screen overflow-hidden bg-background text-slate-900 dark:text-slate-100">
        <SideBar currentUser={currentUser} info={info} />
        <main className="relative flex min-w-0 flex-1 flex-col overflow-y-auto">
          <TopNav />
          <LayoutBreadcrumb />
          <Outlet />
        </main>
      </div>
    </Skeleton>
  )
}
