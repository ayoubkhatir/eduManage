import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { useUpdateTeacherSettings } from '#/hooks/teachers/hooks'
import { FormProvider } from 'react-hook-form'
import { UserAvatar } from '#/components/admin/Table/columnsData'
import { Switch } from '#/components/ui/switch'
import type { TeacherUser } from '#/types/teacherTypes'
// import { useAuth } from '#/store/auth_store'

export const Route = createFileRoute('/_auth/teacher/settings')({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: 'Teacher | Settings - EduManage' }],
  }),
  loader: async () => {
    // const user = context.authState.user
    // if (!user) throw new Error('Unauthorized')
    // const userId = user.id
    // await context.queryClient.prefetchQuery({
    //   ...getTeacherQueryOptions({ fetchBy: 'userId', userId }),
    // })
  },
})

function RouteComponent() {
  // const user = useAuth((s) => s.user) as TeacherUser | null
  // if (!user) throw new Error('Unauthorized')
  // const { data: teacherData } = useSuspenseQuery({
  //   ...getTeacherQueryOptions({ fetchBy: 'userId', userId: user.id }),
  // })

  const { currentUser } = Route.useRouteContext()
  return (
    <Skeleton name="teacher-settings-page" loading={false}>
      <SettingsComp teacher={currentUser} />
    </Skeleton>
  )
}

function SettingsComp({ teacher }: { teacher: TeacherUser }) {
  const { form, onSubmit } = useUpdateTeacherSettings(teacher)

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Account Settings
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your personal information, security preferences, and
            notifications.
          </p>
        </div>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8 lg:flex-row"
          >
            {/* Main form area */}
            <div className="flex-1 space-y-6">
              {/* Profile */}
              <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-white/6 dark:bg-white/2">
                <div className="border-b border-slate-100 p-6 dark:border-white/6">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Profile Picture
                  </h2>
                </div>
                <div className="flex flex-col items-center gap-6 p-6 sm:flex-row">
                  <div className="shrink-0">
                    <UserAvatar image={teacher.image} size={25} />
                  </div>
                  <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {teacher.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {teacher.role}
                    </p>
                    <button
                      type="button"
                      className="mt-3 rounded-lg px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 cursor-pointer"
                    >
                      Remove Photo
                    </button>
                  </div>
                </div>
              </section>

              {/* Personal Information */}
              <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-white/6 dark:bg-white/2">
                <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-white/6">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Personal Information
                  </h2>
                  <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold uppercase text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Verified
                  </span>
                </div>

                <div className="space-y-5 p-6 md:p-8">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Name
                      </label>
                      <input
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                        type="text"
                        placeholder="Name"
                        {...form.register('name')}
                      />
                      {form.formState.errors.name && (
                        <p className="text-xs text-red-500">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Email Address
                      </label>
                      <div className="flex h-11 items-center justify-between rounded-xl border border-transparent bg-slate-100 px-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        <span>{teacher.email}</span>
                        <span className="material-symbols-outlined text-lg">
                          lock
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Phone Number
                      </label>
                      <input
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                        type="tel"
                        {...form.register('telNumber')}
                      />
                      {form.formState.errors.telNumber && (
                        <p className="text-xs text-red-500">
                          {form.formState.errors.telNumber.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Date of Birth
                      </label>
                      <div className="flex h-11 items-center justify-between rounded-xl border border-transparent bg-slate-100 px-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        <span>{teacher.info?.dateOfBirth}</span>
                        <span className="material-symbols-outlined text-lg">
                          lock
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Home Address
                      </label>
                      <div className="flex h-11 items-center justify-between rounded-xl border border-transparent bg-slate-100 px-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        <span>{teacher.info?.address}</span>
                        <span className="material-symbols-outlined text-lg">
                          lock
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        About Me
                      </label>
                      <textarea
                        className="w-full resize-none rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                        rows={3}
                        placeholder="Tell us a bit about yourself..."
                        {...form.register('about')}
                      />
                      {form.formState.errors.about && (
                        <p className="text-xs text-red-500">
                          {form.formState.errors.about.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Academic Details */}
              <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
                <div className="border-b border-slate-100 p-6 dark:border-white/[0.06]">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Academic Details
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-3 md:p-8">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {teacher.role} ID
                    </label>
                    <div className="flex h-11 items-center justify-between rounded-xl border border-transparent bg-slate-100 px-4 font-mono text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <span className="truncate">{teacher.id}</span>
                      <span className="material-symbols-outlined shrink-0 text-lg">
                        lock
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Subject
                    </label>
                    <div className="flex h-11 items-center justify-between rounded-xl border border-transparent bg-slate-100 px-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <span>Mathematics</span>
                      <span className="material-symbols-outlined text-lg">
                        lock
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Notification Preferences */}
              <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
                <div className="border-b border-slate-100 p-6 dark:border-white/[0.06]">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Notification Preferences
                  </h2>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                    Choose how you want to be notified about school activities.
                  </p>
                </div>
                <div className="divide-y divide-slate-100 p-6 dark:divide-white/[0.06]">
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        Assignment Due Dates
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Receive alerts 24h before an assignment is due.
                      </p>
                    </div>
                    <Switch defaultChecked className="shrink-0" />
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        School Announcements
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Important news regarding school closures or events.
                      </p>
                    </div>
                    <Switch defaultChecked className="shrink-0" />
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        Email Marketing
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Receive newsletters and promotional content.
                      </p>
                    </div>
                    <Switch className="shrink-0" />
                  </div>
                </div>
              </section>

              {/* Save button */}
              <div className="flex items-center justify-end gap-4 border-t border-slate-200 pt-6 dark:border-slate-700/50">
                <button
                  type="button"
                  className="cursor-pointer rounded-xl border border-slate-300 px-6 py-2.5 font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="cursor-pointer rounded-xl bg-slate-900 px-6 py-2.5 font-bold text-white shadow-lg transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </main>
  )
}
