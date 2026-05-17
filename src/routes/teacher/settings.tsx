import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import {
  getTeacherQueryOptions,
  useUpdateTeacherSettings,
} from '#/services/api/admin/teacher/hooks'
import { useSuspenseQuery } from '@tanstack/react-query'
import { FormProvider } from 'react-hook-form'
import { UserAvatar } from '#/components/admin/Table/columnsData'
import { Switch } from '#/components/ui/switch'
import type { TeacherUser } from '#/server/modules/teachers/teachers.types'

export const Route = createFileRoute('/teacher/settings')({
  component: RouteComponent,
  // pendingComponent: TeacherSettingsPending,
  head: () => ({
    meta: [{ title: 'Teacher | Settings - EduManage' }],
  }),
  loader: async ({ context }) => {
    const userId = context.authState.user.id
    await context.queryClient.prefetchQuery({
      ...getTeacherQueryOptions({ fetchBy: 'userId', userId }),
    })
  },
})

// function TeacherSettingsPending() {
//   const { authState } = Route.useRouteContext()

//   return (
//     <Skeleton name="teacher-settings-page" loading>
//       <SettingsComp user={authState.user} userRole={UserRoleEnum.TEACHER} />
//     </Skeleton>
//   )
// }

function RouteComponent() {
  const { authState } = Route.useRouteContext()
  const { data: teacherData } = useSuspenseQuery({
    ...getTeacherQueryOptions({ fetchBy: 'userId', userId: authState.user.id }),
  })

  return (
    <Skeleton name="teacher-settings-page" loading={false}>
      <SettingsComp teacher={teacherData} />
    </Skeleton>
  )
}

function SettingsComp({ teacher }: { teacher: TeacherUser }) {
  /* Personal information handle */
  const { form, onSubmit } = useUpdateTeacherSettings(teacher)

  return (
    <main className="flex-1 p-4 md:p-8 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Heading */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Account Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage your personal information, security preferences, and
            notifications.
          </p>
        </div>
        {/* Layout: Forms */}
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col lg:flex-row gap-8 mt-6"
          >
            {/* Main Form Area */}
            <div className="flex-1 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 space-y-8">
              {/* Profile Header & Picture */}
              <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  Profile Picture
                </h2>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative group">
                    <UserAvatar image={teacher.image} size={25} />
                    {/* <IconButton type="avatar" /> */}
                  </div>
                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {teacher.name}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                      {teacher.role}
                    </p>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-semibold rounded-lg cursor-pointer">
                        Remove Photo
                      </button>
                    </div>
                  </div>
                </div>
              </section>
              {/* Personal Information */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Personal Information
                  </h2>
                  <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded uppercase">
                    Verified
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Name
                    </label>
                    <input
                      className="w-full h-11 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder:text-slate-400"
                      type="text"
                      placeholder="Name"
                      {...form.register('name')}
                    />
                    {form.formState.errors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Email Address
                    </label>
                    <div className="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent text-slate-500 dark:text-slate-400 text-sm cursor-not-allowed flex items-center justify-between">
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
                      className="w-full h-11 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder:text-slate-400"
                      type="tel"
                      // defaultValue="0659******"
                      {...form.register('telNumber')}
                    />
                    {form.formState.errors.telNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {form.formState.errors.telNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      About Me
                    </label>
                    <textarea
                      className="w-full h-32 p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none placeholder:text-slate-400"
                      placeholder="Tell us a bit about yourself..."
                      {...form.register('about')}
                    />
                    {form.formState.errors.about && (
                      <p className="text-red-500 text-xs mt-1">
                        {form.formState.errors.about.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Date of Birth
                    </label>
                    <div className="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent text-slate-500 dark:text-slate-400 text-sm cursor-not-allowed flex items-center justify-between">
                      <span>{teacher.dateOfBirth}</span>
                      <span className="material-symbols-outlined text-lg">
                        lock
                      </span>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Home Address
                    </label>
                    <div className="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent text-slate-500 dark:text-slate-400 text-sm cursor-not-allowed flex items-center justify-between">
                      <span>{teacher.address}</span>
                      <span className="material-symbols-outlined text-lg">
                        lock
                      </span>
                    </div>
                  </div>
                </div>
              </section>
              {/* Academic Details (Read Only) */}
              <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  Academic Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {teacher.role}
                      ID
                    </label>
                    <div className="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent text-slate-500 dark:text-slate-400 font-mono text-sm cursor-not-allowed flex items-center justify-between">
                      <span>{teacher.id}</span>
                      <span className="material-symbols-outlined text-lg">
                        lock
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Subject
                    </label>
                    <div className="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent text-slate-500 dark:text-slate-400 text-sm cursor-not-allowed flex items-center justify-between">
                      <span>Mathematics</span>
                      <span className="material-symbols-outlined text-lg">
                        lock
                      </span>
                    </div>
                  </div>
                </div>
              </section>
              {/* Notifications settings */}
              <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Notification Preferences
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Choose how you want to be notified about school activities.
                </p>
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
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
                  <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>
                  <div className="flex items-center justify-between">
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
                  <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>
                  <div className="flex items-center justify-between">
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
              {/* Security Section */}
              {/* <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  Security
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      New Password
                    </label>
                    <input
                      className="w-full h-11 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder:text-slate-400"
                      placeholder="••••••••"
                      type="password"
                      {...form.register('newPassword')}
                    />
                    {form.formState.errors.newPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {form.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Confirm Password
                    </label>
                    <input
                      className="w-full h-11 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder:text-slate-400"
                      placeholder="••••••••"
                      type="password"
                      {...form.register('confirmPassword')}
                    />
                    {form.formState.errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {form.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div className="flex gap-3 items-center">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded shadow-sm text-slate-700 dark:text-slate-300">
                      <span className="material-symbols-outlined">
                        smartphone
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Two-Factor Authentication
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Add an extra layer of security to your account.
                      </p>
                    </div>
                  </div>
                  <button className="text-primary text-sm font-bold hover:underline">
                    Enable
                  </button>
                </div>
              </section> */}
              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="px-6 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20 transform hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                >
                  {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
      {/* Footer Spacer */}
      <div className="h-20"></div>
    </main>
  )
}
