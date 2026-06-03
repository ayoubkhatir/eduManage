import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { SideBar } from '@/components/sideBar/SideBar'
import TopNav from '@/components/top_nav'
import { UserRoleEnum } from '#/server/db/schema'
import { FetchCurrentUserServerFn } from '../-fetchAuthStateInBeforeLoad'
import { LayoutBreadcrumb } from '#/components/LayoutBraedCrumb'

export const Route = createFileRoute('/_auth/teacher')({
  beforeLoad: async ({ context }) => {
    const { user } = context.authState!
    if (user.role !== UserRoleEnum.TEACHER) {
      throw redirect({
        to: user.role === UserRoleEnum.ADMIN ? '/admin' : '/student',
      })
    }
  },
  loader: async ({ context }) => {
    const currentUser = await FetchCurrentUserServerFn({
      data: context.authState.user!,
    })
    return { currentUser }
  },
  component: Teacher,
  head: () => ({
    meta: [{ title: 'Teacher - EduManage' }],
  }),
})

const info = {
  layout: 'teacher',
  list: [
    { name: 'Calendar', icon: 'calendar_month' },
    { name: 'Classes', icon: 'class' },
    { name: 'Subjects', icon: 'subject' },
    { name: 'Announcements', icon: 'announcement' },
    { name: 'Settings', icon: 'settings' },
  ],
}

function Teacher() {
  const { currentUser } = Route.useLoaderData()
  return (
    <Skeleton name="teacher-layout" loading={false}>
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
