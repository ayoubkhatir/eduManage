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
      <div className="flex-1 mb-10 h-full w-full overflow-y-auto">
        <main className="flex-1 flex flex-col h-full  bg-background-light dark:bg-background-dark relative">
          <div className="flex-1 min-h-full p-6 scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {UICardList.map((card, i) => (
                  <UICardComponent {...card} key={i} />
                ))}
              </section>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <section className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-[#111318] dark:text-white">
                        Enrollment Growth
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Academic Year 2023-2024
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select className="bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 outline-none cursor-pointer">
                        <option>Last 6 Months</option>
                        <option onClick={changeChart}>Last Year</option>
                      </select>
                    </div>
                  </div>
                  <DashboardChart props={year} />
                </section>
                <section className="flex flex-col gap-6">
                  <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-[#111318] dark:text-white mb-4">
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to="/admin/students/add"
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-slate-100 dark:border-gray-700/50 bg-slate-50 dark:bg-gray-800 hover:bg-primary/5 dark:hover:bg-primary/10 hover:border-primary/30 dark:hover:border-primary/40 hover:text-primary dark:hover:text-blue-400 group cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-3xl text-slate-400 dark:text-slate-400 group-hover:text-primary dark:group-hover:text-blue-400">
                          person_add
                        </span>
                        <span className="text-xs font-semibold dark:text-slate-300">
                          Add Student
                        </span>
                      </Link>
                      <Link
                        to="/admin/teachers/add"
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-slate-100 dark:border-gray-700/50 bg-slate-50 dark:bg-gray-800 hover:bg-primary/5 dark:hover:bg-primary/10 hover:border-primary/30 dark:hover:border-primary/40 hover:text-primary dark:hover:text-blue-400 group cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-3xl text-slate-400 dark:text-slate-400 group-hover:text-primary dark:group-hover:text-blue-400">
                          group_add
                        </span>
                        <span className="text-xs font-semibold dark:text-slate-300">
                          Add Teacher
                        </span>
                      </Link>
                      <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-slate-100 dark:border-gray-700/50 bg-slate-50 dark:bg-gray-800 hover:bg-primary/5 dark:hover:bg-primary/10 hover:border-primary/30 dark:hover:border-primary/40 hover:text-primary dark:hover:text-blue-400 group cursor-pointer">
                        <span className="material-symbols-outlined text-3xl text-slate-400 dark:text-slate-400 group-hover:text-primary dark:group-hover:text-blue-400">
                          campaign
                        </span>
                        <span className="text-xs font-semibold dark:text-slate-300">
                          Alert
                        </span>
                      </button>
                      <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-slate-100 dark:border-gray-700/50 bg-slate-50 dark:bg-gray-800 hover:bg-primary/5 dark:hover:bg-primary/10 hover:border-primary/30 dark:hover:border-primary/40 hover:text-primary dark:hover:text-blue-400 group cursor-pointer">
                        <span className="material-symbols-outlined text-3xl text-slate-400 dark:text-slate-400 group-hover:text-primary dark:group-hover:text-blue-400">
                          description
                        </span>
                        <span className="text-xs font-semibold dark:text-slate-300">
                          Report
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="bg-linear-to-br from-primary to-blue-800 rounded-xl shadow-lg shadow-blue-500/20 p-6 text-white relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-600/20 dark:bg-black/10"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-yellow-300">
                          verified
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
                          System Status
                        </span>
                      </div>
                      <h4 className="text-lg font-bold mb-1">
                        All Systems Normal
                      </h4>
                      <p className="text-sm text-blue-100/90">
                        Server maintenance scheduled for Sunday, 2:00 AM.
                      </p>
                    </div>
                    <div className="absolute -bottom-4 -right-4 text-white/10 group-hover:text-white/20">
                      <span className="material-symbols-outlined text-[120px]">
                        dns
                      </span>
                    </div>
                  </div>
                </section>
              </div>
              <section className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-gray-800 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-[#111318] dark:text-white">
                    Recent Activities
                  </h3>
                  <button className="text-sm font-semibold text-primary dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer">
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-gray-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                        <th className="px-6 py-4 font-semibold">
                          User / Event
                        </th>
                        <th className="px-6 py-4 font-semibold">Role</th>
                        <th className="px-6 py-4 font-semibold">Action Type</th>
                        <th className="px-6 py-4 font-semibold text-right">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                      <tr className="hover:bg-slate-50 dark:hover:bg-gray-800 group cursor-pointer">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-sm font-bold border border-transparent dark:border-indigo-500/30">
                              JD
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#111318] dark:text-white">
                                John Doe
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                New Registration
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 border border-transparent dark:border-blue-500/20">
                            Student
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            Completed enrollment form
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-sm text-slate-500 dark:text-slate-500">
                            2 mins ago
                          </p>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-gray-800 group cursor-pointer">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-9 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-sm font-bold border border-transparent dark:border-emerald-500/30">
                              SM
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#111318] dark:text-white">
                                Sarah Miller
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                Fee Payment
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 border border-transparent dark:border-purple-500/20">
                            Parent
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            Paid tuition for Q3
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-sm text-slate-500 dark:text-slate-500">
                            15 mins ago
                          </p>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-gray-800 group cursor-pointer">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-9 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300 flex items-center justify-center text-sm font-bold border border-transparent dark:border-orange-500/30">
                              <span className="material-symbols-outlined text-lg">
                                campaign
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#111318] dark:text-white">
                                Admin System
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                Announcement
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700/50 dark:text-slate-300 border border-transparent dark:border-slate-600/30">
                            System
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            Published "Holiday Schedule"
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-sm text-slate-500 dark:text-slate-500">
                            1 hour ago
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </Skeleton>
  )
}
