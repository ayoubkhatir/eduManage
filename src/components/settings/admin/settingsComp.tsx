import { useForm } from 'react-hook-form'

// import type { SchoolLogoState } from '@/services/store/school_logo'
import type { NewInfoOwnerFields } from './settings.schema'
import { Switch } from '@/components/ui/switch'
import { UserAvatar } from '#/components/admin/Table/columnsData'
import type { AuthUser } from '#/server/modules/auth/auth.controller'

// import useSchoolLogoStore from '@/services/store/school_logo'

export default function SettingsComp({ admin }: { admin: AuthUser }) {
  // const setSchoolLogoSrc = useSchoolLogoStore(
  //   (state: SchoolLogoState) => state.setSchoolLogoSrc,
  // )

  /* information form */
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewInfoOwnerFields>({
    defaultValues: {
      email: admin.email,
      description: '',
      phoneNumber: '',
      SchoolName: admin.username,
    },
    // resolver: zodResolver(newInfoOwnerSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  const onSubmit = async () =>
    //data: NewInfoOwnerFields
    {
      // const { confirmPassword, ...rest } = data
    }

  return (
    <main className="flex-1 overflow-y-auto  p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Heading */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            School Profile
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage application-wide settings and school identity.
          </p>
        </div>
        <div className="flex flex-col gap-8">
          {/* Section: General Info & Logo */}
          <section className="bg-white dark:bg-[#151f2b] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  General Information
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Update your school's branding and primary details.
                </p>
              </div>
              <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-3xl">
                domain
              </span>
            </div>
            <div className="p-6 md:p-8 space-y-8">
              {/* Logo Upload */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="relative group shrink-0">
                  <div
                    className="w-32 h-32 rounded-lg bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden bg-cover bg-center cursor-pointer hover:border-primary"
                    data-alt="School logo preview placeholder"
                  >
                    <UserAvatar image={admin.image} size={25} />

                    {/* <IconButton type="schoolLogo" /> */}
                    <div
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none"
                      style={{ transition: 'opacity 0.2s ease-in-out' }}
                    >
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
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      This logo will appear on report cards, emails, and the
                      dashboard header.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      // onClick={() => setSchoolLogoSrc(defaultSchoolLogo)}
                      className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-semibold rounded-lg cursor-pointer"
                    >
                      Remove Photo
                    </button>
                  </div>
                  <p className="text-xs text-slate-400">
                    JPG, GIF or PNG. Max size of 2MB.
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    School Name
                  </label>
                  <input
                    className="w-full h-11 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder:text-slate-400"
                    type="text"
                    placeholder="Sunnydale Academy"
                    {...register('SchoolName')}
                  />
                  {errors.SchoolName && (
                    <p className="text-red-500 text-xs mt-1">
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
                      className="w-full h-11 pl-3 pr-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                      readOnly
                      type="text"
                      defaultValue="#882910"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 text-lg">
                      lock
                    </span>
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Description / Motto
                  </label>
                  <textarea
                    className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none placeholder:text-slate-400"
                    rows={3}
                    placeholder="Where bright futures begin."
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    className="w-full h-11 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    type="email"
                    placeholder="admin@sunnydale.edu"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Phone Number
                  </label>
                  <input
                    className="w-full h-11 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    {...register('phoneNumber')}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Section: Feature Toggles */}
          <section className="bg-white dark:bg-[#151f2b] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Access &amp; Feature Controls
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Enable the parts of the platform that already exist in your
                  school portal.
                </p>
              </div>
              <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-3xl">
                toggle_on
              </span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              <div className="p-4 md:px-6 md:py-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Teacher Notifications
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Allow teachers to publish classroom and administrative
                    notifications.
                  </p>
                </div>
                <Switch defaultChecked className="shrink-0" />
              </div>
              <div className="p-4 md:px-6 md:py-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    School Announcements
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Show school-wide announcements to the people included in
                    each post audience.
                  </p>
                </div>
                <Switch defaultChecked className="shrink-0" />
              </div>
              <div className="p-4 md:px-6 md:py-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Shared Calendar Access
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Make school events visible across owner, teacher, and
                    student calendar views.
                  </p>
                </div>
                <Switch defaultChecked className="shrink-0" />
              </div>
              <div className="p-4 md:px-6 md:py-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Payments Module
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Keep the billing and payment management area available in
                    the owner dashboard.
                  </p>
                </div>
                <Switch className="shrink-0" />
              </div>
            </div>
          </section>
          {/* Security section */}
          <section className="bg-white dark:bg-[#151f2b] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Security
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Update passwords and security options.
                </p>
              </div>
              <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-3xl">
                security
              </span>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    New Password
                  </label>
                  <input
                    className="w-full h-11 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder:text-slate-400"
                    placeholder="••••••••"
                    type="password"
                    {...register('newPassword')}
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.newPassword.message}
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
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword.message}
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
            </div>
          </section>
          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20 transform hover:scale-[1.02] cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          {/* Section: Danger Zone */}
          <section className="border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-red-100 dark:border-red-900/30 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-red-700 dark:text-red-400">
                  Danger Zone
                </h2>
                <p className="text-sm text-red-600/70 dark:text-red-400/70 mt-1">
                  Irreversible actions. Proceed with caution.
                </p>
              </div>
              <span className="material-symbols-outlined text-red-300 dark:text-red-800 text-3xl">
                warning
              </span>
            </div>
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Delete School Account
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  This will remove all the data from the current academic year
                </p>
              </div>
              <button className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 whitespace-nowrap cursor-pointer">
                Delete School
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
