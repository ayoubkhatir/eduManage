import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'

import { Activity } from 'react'
import { SideBar } from '@/components/sideBar/SideBar'
import TopNav from '@/components/top_nav'


export const Route = createFileRoute('/admin')({
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
    { name: 'Payments', icon: 'payment' },
    { name: 'Settings', icon: 'settings' },
  ],
}

function Admin() {
  const location = useLocation()
  const path: Array<string> = [...location.pathname.split('/')]

  return (
    <Skeleton name="admin-layout" loading={false}>
      <div className="bg-background-light dark:bg-background-dark text-[#0d121b] dark:text-gray-100 h-screen overflow-y-hidden flex flex-row">
        <SideBar info={info} />
        <main className="flex-1 flex flex-col h-full overflow-y-auto relative">
          <TopNav />
          <nav className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 px-6 pt-3 mb-3">
            <span className="capitalize text-slate-450 dark:text-slate-400">
              {path[1]}
            </span>
            <span className="mx-2 text-slate-400 dark:text-slate-600">/</span>
            <span className="text-slate-900 dark:text-white capitalize">
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
          <div className="flex-1">
            <Outlet />
          </div>
        </main>
      </div>
    </Skeleton>
  )
}
