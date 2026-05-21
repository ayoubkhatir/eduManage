import { useForm } from 'react-hook-form'
import type { NewInfoOwnerFields } from './settings.schema'
import { Switch } from '@/components/ui/switch'
import { UserAvatar } from '#/components/admin/Table/columnsData'
import type { AuthUser } from '#/types/authTypes'

export default function SettingsComp({ admin }: { admin: AuthUser }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewInfoOwnerFields>({
    defaultValues: {
      email: admin.email,
      description: '',
      phoneNumber: '',
      SchoolName: admin.name,
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  const onSubmit = async () => {}

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            School Profile
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage application-wide settings and school identity.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* General Information */}
          <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
            <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-white/[0.06]">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  General Information
                </h2>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  Update your school&apos;s branding and primary details.
                </p>
              </div>
              <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600">
                domain
              </span>
            </div>

            <div className="space-y-8 p-6 md:p-8">
              {/* Logo */}
              <div className="flex flex-col gap-6 md:flex-row md:items-start">
                <div className="group relative shrink-0">
                  <div className="flex size-28 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-100 bg-cover bg-center transition-colors hover:border-primary dark:border-slate-600 dark:bg-slate-800">
                    <UserAvatar image={admin.image} size={25} />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="material-symbols-outlined text-white">
                        edit
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      School Logo
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Will appear on report cards, emails, and the dashboard
                      header.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    Remove Photo
                  </button>
                  <p className="text-xs text-slate-400">
                    JPG, GIF or PNG. Max size of 2MB.
                  </p>
                </div>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    School Name
                  </label>
                  <input
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    type="text"
                    placeholder="Sunnydale Academy"
                    {...register('SchoolName')}
                  />
                  {errors.SchoolName && (
                    <p className="text-xs text-red-500">
                      {errors.SchoolName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    School ID
                  </label>
                  <div className="relative">
                    <input
                      className="h-11 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 text-slate-500 outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400"
                      readOnly
                      type="text"
                      defaultValue="#882910"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-2.5 text-lg text-slate-400">
                      lock
                    </span>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Description / Motto
                  </label>
                  <textarea
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    rows={3}
                    placeholder="Where bright futures begin."
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    type="email"
                    placeholder="admin@sunnydale.edu"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Phone Number
                  </label>
                  <input
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    {...register('phoneNumber')}
                  />
                  {errors.phoneNumber && (
                    <p className="text-xs text-red-500">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Feature Toggles */}
          <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
            <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-white/[0.06]">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Access &amp; Feature Controls
                </h2>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  Enable the parts of the platform that exist in your school
                  portal.
                </p>
              </div>
              <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600">
                toggle_on
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {[
                {
                  title: 'Teacher Notifications',
                  desc: 'Allow teachers to publish classroom and administrative notifications.',
                  defaultChecked: true,
                },
                {
                  title: 'School Announcements',
                  desc: 'Show school-wide announcements to the people included in each post audience.',
                  defaultChecked: true,
                },
                {
                  title: 'Shared Calendar Access',
                  desc: 'Make school events visible across owner, teacher, and student calendar views.',
                  defaultChecked: true,
                },
                {
                  title: 'Payments Module',
                  desc: 'Keep the billing and payment management area available in the owner dashboard.',
                  defaultChecked: false,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between gap-4 p-4 md:px-6 md:py-5"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {item.title}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {item.desc}
                    </p>
                  </div>
                  <Switch
                    defaultChecked={item.defaultChecked}
                    className="shrink-0"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Security */}
          <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
            <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-white/[0.06]">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Security
                </h2>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  Update passwords and security options.
                </p>
              </div>
              <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600">
                security
              </span>
            </div>

            <div className="space-y-6 p-6 md:p-8">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    New Password
                  </label>
                  <input
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-900 outline-none placeholder:text-slate-400 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    placeholder="••••••••"
                    type="password"
                    {...register('newPassword')}
                  />
                  {errors.newPassword && (
                    <p className="text-xs text-red-500">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Confirm Password
                  </label>
                  <input
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-900 outline-none placeholder:text-slate-400 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    placeholder="••••••••"
                    type="password"
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
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

          {/* Save button */}
          <div className="flex items-center justify-end border-t border-slate-200 pt-6 dark:border-slate-700/50">
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="cursor-pointer rounded-xl bg-slate-900 px-6 py-2.5 font-bold text-white shadow-lg transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Danger Zone */}
          <section className="overflow-hidden rounded-2xl border border-red-200 bg-red-50/50 shadow-sm dark:border-red-900/50 dark:bg-red-900/10">
            <div className="flex items-center justify-between border-b border-red-100 p-6 dark:border-red-900/30">
              <div>
                <h2 className="text-lg font-bold text-red-700 dark:text-red-400">
                  Danger Zone
                </h2>
                <p className="mt-0.5 text-sm text-red-600/70 dark:text-red-400/70">
                  Irreversible actions. Proceed with caution.
                </p>
              </div>
              <span className="material-symbols-outlined text-3xl text-red-300 dark:text-red-800">
                warning
              </span>
            </div>

            <div className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Delete School Account
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  This will remove all data from the current academic year.
                </p>
              </div>
              <button
                type="button"
                className="cursor-pointer whitespace-nowrap rounded-xl border border-red-200 bg-white px-5 py-2.5 font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Delete School
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
