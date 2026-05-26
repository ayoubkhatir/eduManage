import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { SideBar } from '@/components/sideBar/SideBar'
import TopNav from '@/components/top_nav'
import { UserRoleEnum } from '#/server/db/schema'
import { redirect } from '@tanstack/react-router'
import { FetchCurrentUserServerFn } from '../-fetchAuthStateInBeforeLoad'
import type { AdminUser } from '#/types/usersTypes'
import { LayoutBreadcrumb } from '#/components/LayoutBraedCrumb'

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
          <LayoutBreadcrumb />
          <Outlet />
        </main>
      </div>
    </Skeleton>
  )
}
