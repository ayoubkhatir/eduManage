import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { Activity, useMemo } from 'react'
import { SideBar } from '@/components/sideBar/SideBar'
import TopNav from '@/components/top_nav'
import { requireRole } from '#/server/modules/auth/services/session'
import { UserRoleEnum } from '#/server/db/schema'

export const Route = createFileRoute('/teacher')({
  component: Teacher,
  head: () => ({
    meta: [{ title: 'Teacher - EduManage' }],
  }),
  beforeLoad: async ({ location }) => {
    const authState = await requireRole(UserRoleEnum.TEACHER, location.pathname)
    return { authState }
  },
})

const info = {
  layout: 'teacher',
  list: [
    { name: 'Calendar', icon: 'calendar_month' },
    { name: 'Classes', icon: 'class' },
    { name: 'Subjects', icon: 'subject' },
    { name: 'Notifications', icon: 'notifications' },
    { name: 'Settings', icon: 'settings' },
  ],
}

function Teacher() {
  const location = useLocation()
  const path: Array<string> = useMemo(
    () => [...location.pathname.split('/')],
    [location],
  )
  const { authState } = Route.useRouteContext()

  return (
    <Skeleton name="teacher-layout" loading={false}>
      <div className="bg-background-light dark:bg-background-dark text-[#0d121b] dark:text-gray-100 h-screen overflow-hidden flex flex-row">
        <SideBar authState={authState} info={info} />
        <main className="flex-1 flex flex-col h-full overflow-y-auto relative">
          <TopNav />
          <nav className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 px-6 pt-3 mb-2.5">
            <span className="capitalize text-slate-450 dark:text-slate-400">
              {path[1]}
            </span>
            <span className="mx-2 text-slate-400 dark:text-slate-600">
              {' '}
              &gt;
            </span>
            <span
              className={` ${path[3] ? 'text-slate-450 dark:text-slate-400' : 'text-slate-900 dark:text-white'} capitalize`}
            >
              {path[2]}
            </span>
            <Activity mode={path[3] ? 'visible' : 'hidden'}>
              <span className="mx-2 text-slate-400 dark:text-slate-600">
                &gt;
              </span>
              <span className="text-slate-900 dark:text-white capitalize">
                {path[3]}
              </span>
            </Activity>
          </nav>
          <Outlet />
        </main>
      </div>
    </Skeleton>
  )
}
