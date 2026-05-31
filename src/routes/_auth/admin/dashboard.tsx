import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { motion } from 'framer-motion'
import DashboardChart from '@/components/admin/dashboardChart'
import ActionCards from '#/components/admin/cards/ActionCards'
import type { AdminUser } from '#/types/usersTypes'
import { FetchCurrentUserServerFn } from '#/routes/-fetchAuthStateInBeforeLoad'
import { DashboardStatCards } from '#/components/admin/cards/UICard'

export const Route = createFileRoute('/_auth/admin/dashboard')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const currentUser = (await FetchCurrentUserServerFn({
      data: context.authState.user!,
    })) as AdminUser
    return { currentUser }
  },
  head: () => ({
    meta: [{ title: 'Admin | Dashboard - EduManage' }],
  }),
})

function RouteComponent() {
  const [year, setYear] = useState<boolean>(false)

  function changeChart() {
    setYear((state) => !state)
  }

  const { currentUser } = Route.useLoaderData()

  return (
    <Skeleton name="admin-dashboard-page" loading={false}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 overflow-y-auto"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-8 p-6 pt-2">
          {/* Welcome header */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0ms' }}>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Overview of your school&apos;s performance
            </p>
          </div>

          <DashboardStatCards schoolId={currentUser.info.id} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
            >
              <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Enrollment Growth
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Academic Year 2023-2024
                  </p>
                </div>
                <select
                  className="mt-2 cursor-pointer rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary sm:mt-0"
                  onChange={changeChart}
                  value={year ? 'year' : '6months'}
                >
                  <option value="6months">Last 6 Months</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
              <DashboardChart props={year} />
            </motion.section>
            <section className="flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
              >
                <h3 className="mb-4 text-lg font-bold text-foreground">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <ActionCards
                    label="Add Teacher"
                    icon="group_add"
                    navigateTo="/admin/teachers/add"
                  />
                  <ActionCards
                    label="Add Student"
                    icon="group_add"
                    navigateTo="/admin/students/add"
                  />
                  <ActionCards
                    label="Add Announcement"
                    icon="group_add"
                    navigateTo="/admin/announcements/add"
                  />
                  <ActionCards
                    label="Add Grade"
                    icon="group_add"
                    navigateTo="/admin/grades/add"
                  />
                </div>
              </motion.div>

              {/* System Status */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.25,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary to-primary-deep p-6 shadow-lg shadow-primary/20"
              >
                <div className="absolute inset-0 bg-white/5" />
                <div className="relative z-10">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-yellow-300">
                      verified
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary-foreground/70">
                      System Status
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-primary-foreground">
                    All Systems Normal
                  </h4>
                  <p className="mt-1 text-sm text-primary-foreground/70">
                    Server maintenance scheduled for Sunday, 2:00 AM.
                  </p>
                </div>
                <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-[120px] text-white/10">
                  dns
                </span>
              </motion.div>
            </section>
          </div>

          {/* Recent Activities */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-border/60 p-6">
              <h3 className="text-lg font-bold text-foreground">
                Recent Activities
              </h3>
              <button
                type="button"
                className="cursor-pointer text-sm font-semibold text-primary transition-all hover:text-primary/80 active:scale-95"
              >
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/20 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 sm:px-6 sm:py-4">User / Event</th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4">Role</th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4">Action Type</th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {[
                    {
                      initials: 'JD',
                      bg: 'bg-indigo-100 dark:bg-indigo-900/40',
                      text: 'text-indigo-600 dark:text-indigo-300',
                      name: 'John Doe',
                      detail: 'New Registration',
                      role: 'Student',
                      roleBg: 'bg-blue-100 dark:bg-blue-500/20',
                      roleText: 'text-blue-800 dark:text-blue-300',
                      action: 'Completed enrollment form',
                      time: '2 mins ago',
                    },
                    {
                      initials: 'SM',
                      bg: 'bg-emerald-100 dark:bg-emerald-900/40',
                      text: 'text-emerald-600 dark:text-emerald-300',
                      name: 'Sarah Miller',
                      detail: 'Fee Payment',
                      role: 'Parent',
                      roleBg: 'bg-purple-100 dark:bg-purple-500/20',
                      roleText: 'text-purple-800 dark:text-purple-300',
                      action: 'Paid tuition for Q3',
                      time: '15 mins ago',
                    },
                    {
                      initials: '',
                      bg: 'bg-orange-100 dark:bg-orange-900/40',
                      text: 'text-orange-600 dark:text-orange-300',
                      name: 'Admin System',
                      detail: 'Announcement',
                      role: 'System',
                      roleBg: 'bg-slate-100 dark:bg-slate-700/50',
                      roleText: 'text-slate-800 dark:text-slate-300',
                      action: 'Published "Holiday Schedule"',
                      time: '1 hour ago',
                      icon: 'campaign',
                    },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      className="transition-all hover:bg-muted/30 group cursor-pointer"
                    >
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <div className="flex items-center gap-3 min-w-0 flex-nowrap">
                          <div
                            className={`flex size-8 sm:size-9 items-center justify-center rounded-full ${row.bg} ${row.text} text-sm font-bold flex-shrink-0`}
                          >
                            {row.icon ? (
                              <span className="material-symbols-outlined text-lg">
                                {row.icon}
                              </span>
                            ) : (
                              row.initials
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">
                              {row.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {row.detail}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <span
                          className={`inline-flex items-center rounded-full ${row.roleBg} ${row.roleText} px-2.5 py-0.5 text-xs font-medium whitespace-nowrap`}
                        >
                          {row.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <p className="text-sm text-foreground/80 truncate">{row.action}</p>
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4 text-right">
                        <p className="text-sm text-muted-foreground whitespace-nowrap">{row.time}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </Skeleton>
  )
}
