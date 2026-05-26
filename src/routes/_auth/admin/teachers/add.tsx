import { Link, createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { useAddTeacher } from '#/hooks/teachers/hooks'
import InputWrapper from '@/components/admin/Wrappers/InputWrapper'
import SelectWrapper from '@/components/admin/Wrappers/SelectWrapper'
import DatePickerField from '@/components/admin/DatePickerField'
import { FetchCurrentUserServerFn } from '#/routes/-fetchAuthStateInBeforeLoad'
import type { AdminUser } from '#/types/usersTypes'
import { SimpleImageUpload } from '#/components/cloudinary-uploader'

export const Route = createFileRoute('/_auth/admin/teachers/add')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const currentUser = (await FetchCurrentUserServerFn({
      data: context.authState.user!,
    })) as AdminUser
    return { currentUser }
  },
  staticData: {
    breadcrumb: ['Teachers', 'Add'],
  },
  head: () => ({
    meta: [{ title: 'Admin | Add Teacher - EduManage' }],
  }),
})

function RouteComponent() {
  const { currentUser } = Route.useLoaderData()
  const adminId = currentUser.info.id
  const { onSubmit, form } = useAddTeacher(adminId)

  return (
    <Skeleton name="admin-add-teacher-page" loading={false}>
      <div className="flex h-full w-full pb-12">
        <main className="flex-1 flex flex-col h-full min-w-0 bg-background-light dark:bg-background-dark overflow-hidden relative">
          <div className="flex-1 overflow-x-hidden p-8">
            <div className="flex flex-col gap-6 pb-12">
              <div className="flex flex-col gap-1">
                <h1 className="text-neutral-900 dark:text-white text-3xl md:text-4xl font-bold tracking-tight">
                  Add New Teacher
                </h1>
                <p className="text-slate-500 dark:text-gray-400 text-base">
                  Enter the details below to create a new faculty account and
                  assign permissions.
                </p>
              </div>
              <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <form
                  className="flex flex-col"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="p-8 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-neutral-900 dark:text-white text-lg font-bold mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">
                        badge
                      </span>
                      Personal Information
                    </h3>

                    <div className="mb-4">
                      <SimpleImageUpload
                        value={form.watch('image')}
                        onChange={(publicId) => {
                          form.setValue('image', publicId, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          })
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputWrapper
                        form={form}
                        name="name"
                        label="Name"
                        placeholder="enter the teacher name"
                      />

                      <DatePickerField
                        form={form}
                        name="dateOfBirth"
                        label="Date of Birth"
                        placeholder="enter the teacher date of birth"
                      />
                      <SelectWrapper
                        form={form}
                        label="Gender"
                        name="gender"
                        placeholder="select the teacher gender"
                        values={['Female', 'Male']}
                      />
                    </div>
                  </div>
                  <div className="p-8 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-neutral-900 dark:text-white text-lg font-bold mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">
                        contact_mail
                      </span>
                      Contact Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputWrapper
                        form={form}
                        name="email"
                        label="Email"
                        placeholder="enter the teacher email"
                      />

                      <InputWrapper
                        form={form}
                        name="telNumber"
                        label="Phone Number"
                        placeholder="enter the teacher phone number"
                      />

                      <InputWrapper
                        form={form}
                        name="address"
                        label="Address"
                        placeholder="enter the teacher address"
                      />
                    </div>
                  </div>
                  <div className="p-8 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[20px]">
                          edit_note
                        </span>
                        About Teacher
                      </label>

                      <span className="text-xs text-slate-400 dark:text-gray-500">
                        {form.watch('about')?.length || 0}/500
                      </span>
                    </div>

                    <div className="relative">
                      <textarea
                        rows={6}
                        maxLength={500}
                        placeholder="Write a short biography, teaching experience, skills, or anything important about the teacher..."
                        className="
                          w-full rounded-2xl border border-gray-200 dark:border-gray-700
                          bg-gray-50 dark:bg-gray-900/60
                          px-4 py-4
                          text-sm text-gray-800 dark:text-gray-200
                          placeholder:text-gray-400 dark:placeholder:text-gray-500
                          shadow-sm
                          outline-none
                          transition-all duration-200
                          focus:border-primary
                          focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30
                          resize-none
                        "
                        value={form.watch('about')}
                        onChange={(e) => form.setValue('about', e.target.value)}
                      />

                      <div className="absolute bottom-3 right-3 text-xs text-slate-400 dark:text-gray-500">
                        Professional summary
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex flex-col-reverse sm:flex-row items-center justify-end gap-4 rounded-b-xl">
                    <Link
                      to="/admin/teachers"
                      className="w-full sm:w-auto h-10 px-6 rounded-lg border border-transparent text-slate-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-bold text-sm transition-colors cursor-pointer"
                    >
                      previous
                    </Link>

                    <button
                      type="submit"
                      className="w-full sm:w-auto h-10 px-6 rounded-lg bg-primary hover:bg-blue-600 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        check
                      </span>
                      {form.formState.isSubmitting
                        ? 'Creating...'
                        : 'Create Teacher Account'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Skeleton>
  )
}
