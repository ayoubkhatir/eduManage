import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import type { UICardType } from '@/components/admin/UICard'
import DashboardChart from '@/components/admin/dashboardChart'
import UICardComponent from '@/components/admin/UICard'

export const Route = createFileRoute('/admin/dashboard')({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: 'Admin | Dashboard - EduManage' }],
  }),
})

const UICardList: Array<UICardType> = [
  {
    id: '0',
    iconName: 'school',
    iconColor: 'blue',
    stateIcon: 'trending_up',
    percentage: 5,
    cardTitle: 'Total Students',
    info: '1,240',
  },
  {
    id: '1',
    iconName: 'group',
    iconColor: 'purple',
    stateIcon: 'trending_up',
    percentage: 2,
    cardTitle: 'Total Teachers',
    info: '85',
  },
  {
    id: '2',
    iconName: 'payments',
    iconColor: 'green',
    stateIcon: 'trending_up',
    percentage: 12,
    cardTitle: 'Monthly Revenue',
    info: '$120,500',
  },
  {
    id: '3',
    iconName: 'fact_check',
    iconColor: 'orange',
    stateIcon: 'trending_down',
    percentage: -1,
    cardTitle: 'Attendance Rate',
    info: '94%',
  },
]

function RouteComponent() {
  const [year, setYear] = useState<boolean>(false)

  function changeChart() {
    setYear((state) => !state)
  }

  return (
    <Skeleton name="admin-dashboard-page" loading={false}>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 p-6 pt-4">
          {/* Welcome header */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Overview of your school&apos;s performance
            </p>
          </div>

          {/* KPI Cards */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {UICardList.map((card, i) => (
              <UICardComponent {...card} key={i} />
            ))}
          </section>

          {/* Chart + Quick Actions */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Enrollment Chart */}
            <section className="lg:col-span-2 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
              <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Enrollment Growth
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Academic Year 2023-2024
                  </p>
                </div>
                <select
                  className="mt-2 cursor-pointer rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm text-slate-600 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 sm:mt-0"
                  onChange={changeChart}
                  value={year ? 'year' : '6months'}
                >
                  <option value="6months">Last 6 Months</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
              <DashboardChart props={year} />
            </section>

            {/* Side Panel */}
            <section className="flex flex-col gap-6">
              {/* Quick Actions */}
              <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
                <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/admin/students/add"
                    className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary dark:border-slate-700/50 dark:bg-slate-800 dark:hover:border-primary/40 dark:hover:bg-primary/10"
                  >
                    <span className="material-symbols-outlined text-3xl text-slate-400 transition-colors group-hover:text-primary dark:text-slate-500">
                      person_add
                    </span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Add Student
                    </span>
                  </Link>
                  <Link
                    to="/admin/teachers/add"
                    className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary dark:border-slate-700/50 dark:bg-slate-800 dark:hover:border-primary/40 dark:hover:bg-primary/10"
                  >
                    <span className="material-symbols-outlined text-3xl text-slate-400 transition-colors group-hover:text-primary dark:text-slate-500">
                      group_add
                    </span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Add Teacher
                    </span>
                  </Link>
                  <button
                    type="button"
                    className="cursor-pointer group flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary dark:border-slate-700/50 dark:bg-slate-800 dark:hover:border-primary/40 dark:hover:bg-primary/10"
                  >
                    <span className="material-symbols-outlined text-3xl text-slate-400 transition-colors group-hover:text-primary dark:text-slate-500">
                      campaign
                    </span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Announce
                    </span>
                  </button>
                  <button
                    type="button"
                    className="cursor-pointer group flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary dark:border-slate-700/50 dark:bg-slate-800 dark:hover:border-primary/40 dark:hover:bg-primary/10"
                  >
                    <span className="material-symbols-outlined text-3xl text-slate-400 transition-colors group-hover:text-primary dark:text-slate-500">
                      description
                    </span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Report
                    </span>
                  </button>
                </div>
              </div>

              {/* System Status */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-blue-800 p-6 shadow-lg">
                <div className="absolute inset-0 bg-blue-600/10" />
                <div className="relative z-10">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-yellow-300">
                      verified
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                      System Status
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    All Systems Normal
                  </h4>
                  <p className="mt-1 text-sm text-blue-100/80">
                    Server maintenance scheduled for Sunday, 2:00 AM.
                  </p>
                </div>
                <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-[120px] text-white/10">
                  dns
                </span>
              </div>
            </section>
          </div>

          {/* Recent Activities */}
          <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
            <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-white/[0.06]">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Recent Activities
              </h3>
              <button
                type="button"
                className="cursor-pointer text-sm font-semibold text-primary transition-colors hover:text-blue-700 dark:hover:text-blue-300"
              >
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-white/[0.04] dark:bg-white/[0.02] dark:text-slate-400">
                    <th className="px-6 py-4">User / Event</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Action Type</th>
                    <th className="px-6 py-4 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                  <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02] group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                          JD
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            John Doe
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            New Registration
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-500/20 dark:text-blue-300">
                        Student
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Completed enrollment form
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm text-slate-500">2 mins ago</p>
                    </td>
                  </tr>
                  <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02] group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
                          SM
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            Sarah Miller
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Fee Payment
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-500/20 dark:text-purple-300">
                        Parent
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Paid tuition for Q3
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm text-slate-500">15 mins ago</p>
                    </td>
                  </tr>
                  <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02] group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300">
                          <span className="material-symbols-outlined text-lg">
                            campaign
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            Admin System
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Announcement
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-700/50 dark:text-slate-300">
                        System
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Published &quot;Holiday Schedule&quot;
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm text-slate-500">1 hour ago</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </Skeleton>
  )
}
