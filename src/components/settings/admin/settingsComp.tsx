import { useForm } from 'react-hook-form'
import { Switch } from '@/components/ui/switch'
import { SimpleImageUpload } from '#/components/cloudinary-uploader'
import type { AdminUser } from '#/types/usersTypes'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { newInfoOwnerSchema, type NewInfoOwnerFields } from './settings.schema'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAdminServerFn } from '#/server/modules/admin/admin.server-functions'

function useEditSettings({ admin }: { admin: AdminUser }) {
  const form = useForm<NewInfoOwnerFields>({
    resolver: standardSchemaResolver(newInfoOwnerSchema),
    defaultValues: {
      id: admin.info.id,
      name: admin.name,
      description: '',
      email: admin.email,
      phoneNumber: admin.telNumber ?? '',
      SchoolName: admin.info.schoolName,
      teacherNotifications: true,
      schoolAnnouncements: true,
      sharedCalendar: true,
      paymentsModule: false,
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })
  const queryClient = useQueryClient()

  const { mutate: editAdmin } = useMutation({
    mutationFn: async (data: NewInfoOwnerFields) => {
      try {
        const response = await updateAdminServerFn({ data })
        if (!response.success) {
          throw new Error('Error has occured')
        }
        return response.data
      } catch (error) {
        console.log({ error })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
    },
  })

  function onSubmit(data: NewInfoOwnerFields) {
    editAdmin(data, {
      onSuccess: () => {
        toast.success('Admin updated')
      },
      onError: () => {
        toast.error('Error occured')
      },
    })
  }

  return { form, onSubmit }
}

export default function SettingsComp({ admin }: { admin: AdminUser }) {
  const { form, onSubmit } = useEditSettings({ admin })

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Page heading */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              School Profile
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage application-wide settings and school identity.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <input type="hidden" {...form.register('id')} />
            <input type="hidden" {...form.register('name')} />
            {/* General Information */}
            <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-white/6 dark:bg-white/2">
              <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-white/6">
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
                    {/* <div className="flex size-28 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-100 bg-cover bg-center transition-colors hover:border-primary dark:border-slate-600 dark:bg-slate-800"> */}
                    <SimpleImageUpload
                      value={admin.image ?? ''}
                      onChange={(url) => {
                        form.setValue('image', url)
                        form.trigger('image')
                      }}
                      // value={admin.image ?? ''}
                      // onChange={(url) => {
                      //   url && form.setValue('image', url)
                      //   form.trigger('image')
                      // }}
                    />
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
                      {...form.register('SchoolName')}
                    />
                    {form.formState.errors.SchoolName && (
                      <p className="text-xs text-red-500">
                        {form.formState.errors.SchoolName.message}
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
                        value={admin.info.id}
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
                      {...form.register('description')}
                    />
                    {form.formState.errors.description && (
                      <p className="text-xs text-red-500">
                        {form.formState.errors.description.message}
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
                      {...form.register('email')}
                    />
                    {form.formState.errors.email && (
                      <p className="text-xs text-red-500">
                        {form.formState.errors.email.message}
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
                      {...form.register('phoneNumber')}
                    />
                    {form.formState.errors.phoneNumber && (
                      <p className="text-xs text-red-500">
                        {form.formState.errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Feature Toggles */}
            <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-white/6 dark:bg-white/2">
              <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-white/6">
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
                    name: 'teacherNotifications' as const,
                  },
                  {
                    title: 'School Announcements',
                    desc: 'Show school-wide announcements to the people included in each post audience.',
                    name: 'schoolAnnouncements' as const,
                  },
                  {
                    title: 'Shared Calendar Access',
                    desc: 'Make school events visible across owner, teacher, and student calendar views.',
                    name: 'sharedCalendar' as const,
                  },
                  {
                    title: 'Payments Module',
                    desc: 'Keep the billing and payment management area available in the owner dashboard.',
                    name: 'paymentsModule' as const,
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
                      checked={form.watch(item.name)}
                      onCheckedChange={(checked) =>
                        form.setValue(item.name, checked)
                      }
                      className="shrink-0"
                    />
                  </div>
                ))}
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
