import { useForm } from 'react-hook-form'
import { newInfoSchema } from './settingsAuth.schema'
import type { NewInfoSchema } from './settingsAuth.schema'
import { Switch } from '@/components/ui/switch'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { SimpleImageUpload } from '#/components/cloudinary-uploader'
import { UserRoleEnum } from '#/server/db/schema'
import type { StudentUser } from '#/types/studentTypes'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateStudentSettingsServerFn } from '#/server/modules/students/students.server-functions'
import { toast } from 'sonner'
import { useRouter } from '@tanstack/react-router'

function useUpdateSettings({ user }: { user: StudentUser }) {
  const form = useForm<NewInfoSchema>({
    resolver: standardSchemaResolver(newInfoSchema),
    defaultValues: {
      username: user.name,
      telNumber: user.telNumber ?? '',
      about: '',
      image: user.image,
      assignmentDueDates: true,
      newGradesPosted: true,
      schoolAnnouncements: true,
      emailMarketing: false,
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutate: updateStudent } = useMutation({
    mutationFn: async (data: NewInfoSchema) => {
      const response = await updateStudentSettingsServerFn({
        data: {
          studentId: user.info.id,
          name: data.username,
          telNumber: data.telNumber,
          image: data.image ?? null,
        },
      })
      if (!response.success) throw new Error('Error occurred')
      return response.data
    },
    onSuccess: () => {
      toast.success('Settings updated')
      queryClient.invalidateQueries({ queryKey: ['student'] })
      router.invalidate()
    },
    onError: () => {
      toast.error('Error occurred')
    },
  })

  const onSubmit = (data: NewInfoSchema) => {
    updateStudent(data)
  }
  return { form, onSubmit }
}

export default function SettingsComp({
  user,
  userRole,
}: {
  user: StudentUser
  userRole: UserRoleEnum.STUDENT | UserRoleEnum.TEACHER
}) {
  const { form, onSubmit } = useUpdateSettings({ user })
  const isTeacher = userRole === UserRoleEnum.TEACHER

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Account Settings
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your personal information, security preferences, and
              notifications.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-6">
            <input type="hidden" {...form.register('image')} />
            <input type="hidden" {...form.register('assignmentDueDates')} />
            <input type="hidden" {...form.register('newGradesPosted')} />
            <input type="hidden" {...form.register('schoolAnnouncements')} />
            <input type="hidden" {...form.register('emailMarketing')} />

            {/* General Information */}
            <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-white/6 dark:bg-white/2">
              <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-white/6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    General Information
                  </h2>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                    Update your profile photo, personal details, and academic
                    information.
                  </p>
                </div>
                <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600">
                  person
                </span>
              </div>

              <div className="space-y-8 p-6 md:p-8">
                {/* Logo / Profile Picture */}
                <div className="flex flex-col gap-6 md:flex-row md:items-center">
                  <div className="group relative shrink-0">
                    <SimpleImageUpload
                      value={form.watch('image') ?? ''}
                      onChange={(url) => {
                        form.setValue('image', url)
                        form.trigger('image')
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {user.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {isTeacher ? 'Teacher' : 'Student'}
                    </p>
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Full Name
                    </label>
                    <input
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                      type="text"
                      defaultValue={user.name}
                      {...form.register('username')}
                    />
                    {form.formState.errors.username && (
                      <p className="text-xs text-red-500">
                        {form.formState.errors.username.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    <input
                      className="h-11 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 text-slate-500 outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400"
                      readOnly
                      type="email"
                      value={user.email}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Phone Number
                    </label>
                    <input
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                      type="tel"
                      defaultValue={user.telNumber || ''}
                      {...form.register('telNumber')}
                    />
                    {form.formState.errors.telNumber && (
                      <p className="text-xs text-red-500">
                        {form.formState.errors.telNumber.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {userRole} ID
                    </label>
                    <div className="flex h-11 items-center rounded-xl border border-transparent bg-slate-100 px-4 font-mono text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <span>—</span>
                    </div>
                  </div>

                  {isTeacher ? (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                        Subject
                      </label>
                      <div className="flex h-11 items-center rounded-xl border border-transparent bg-slate-100 px-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        <span>—</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                        Current Grade
                      </label>
                      <div className="flex h-11 items-center rounded-xl border border-transparent bg-slate-100 px-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        <span>—</span>
                      </div>
                    </div>
                  )}

                  {isTeacher && (
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
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
                  )}
                </div>
              </div>
            </section>

            {/* Preferences & Security */}
            <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-white/6 dark:bg-white/2">
              <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-white/6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Preferences &amp; Security
                  </h2>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                    Manage notification preferences and account security
                    settings.
                  </p>
                </div>
                <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600">
                  settings
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-white/6">
                <div className="flex items-center justify-between py-4 px-6">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Assignment Due Dates
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Receive alerts 24h before an assignment is due.
                    </p>
                  </div>
                  <Switch
                    checked={form.watch('assignmentDueDates')}
                    onCheckedChange={(checked) => form.setValue('assignmentDueDates', checked)}
                    className="shrink-0"
                  />
                </div>
                {!isTeacher && (
                  <div className="flex items-center justify-between py-4 px-6">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        New Grades Posted
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Get notified immediately when a teacher grades your
                        work.
                      </p>
                    </div>
                    <Switch
                      checked={form.watch('newGradesPosted')}
                      onCheckedChange={(checked) => form.setValue('newGradesPosted', checked)}
                      className="shrink-0"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between py-4 px-6">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      School Announcements
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Important news regarding school closures or events.
                    </p>
                  </div>
                  <Switch
                    checked={form.watch('schoolAnnouncements')}
                    onCheckedChange={(checked) => form.setValue('schoolAnnouncements', checked)}
                    className="shrink-0"
                  />
                </div>
                <div className="flex items-center justify-between py-4 px-6">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Email Marketing
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Receive newsletters and promotional content.
                    </p>
                  </div>
                  <Switch
                    checked={form.watch('emailMarketing')}
                    onCheckedChange={(checked) => form.setValue('emailMarketing', checked)}
                    className="shrink-0"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 p-6 md:p-8 dark:border-white/6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      New Password
                    </label>
                    <input
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-900 outline-none placeholder:text-slate-400 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                      placeholder="••••••••"
                      type="password"
                      {...form.register('newPassword')}
                    />
                    {form.formState.errors.newPassword && (
                      <p className="text-xs text-red-500">
                        {form.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Confirm Password
                    </label>
                    <input
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-900 outline-none placeholder:text-slate-400 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                      placeholder="••••••••"
                      type="password"
                      {...form.register('confirmPassword')}
                    />
                    {form.formState.errors.confirmPassword && (
                      <p className="text-xs text-red-500">
                        {form.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-slate-800">
                      <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">
                        smartphone
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Two-Factor Authentication
                      </p>
                      <p className="text-xs text-slate-500">
                        Add an extra layer of security to your account.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="cursor-pointer text-sm font-bold text-primary hover:underline"
                  >
                    Enable
                  </button>
                </div>
              </div>
            </section>

            <div className="flex items-center justify-end border-t border-slate-200 pt-6 dark:border-slate-700/50">
              <button
                disabled={form.formState.isSubmitting}
                className="cursor-pointer rounded-xl bg-slate-900 px-6 py-2.5 font-bold text-white shadow-lg transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
