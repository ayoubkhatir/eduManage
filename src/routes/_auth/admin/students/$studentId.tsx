import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Skeleton } from 'boneyard-js/react'
import { getStudentQueryOptions, useEditStudent } from '#/hooks/students/hooks'
import InputWrapper from '@/components/admin/Wrappers/InputWrapper'
import DatePickerField from '@/components/admin/DatePickerField'
import SelectWrapper from '@/components/admin/Wrappers/SelectWrapper'
import {
  StudentClassSelector,
  StudentGradeSelector,
} from './-students.selectors'
import { FormProvider } from 'react-hook-form'
import { AvatarUploadCard } from './-student.avatar-editor'

export const Route = createFileRoute('/_auth/admin/students/$studentId')({
  component: RouteComponent,
  pendingComponent: () => (
    <Skeleton name="admin-student-detail-page" loading>
      <div className="flex h-full w-full" />
    </Skeleton>
  ),
  pendingMs: 0,
  pendingMinMs: 220,
  loader: async ({ params: { studentId }, context }) => {
    const student = await context.queryClient.ensureQueryData(
      getStudentQueryOptions(studentId),
    )
    if (!student) {
      throw notFound()
    }
  },
})

function RouteComponent() {
  return (
    <Skeleton name="admin-student-detail-page" loading={false}>
      <OwnerStudentDetailContent />
    </Skeleton>
  )
}

function OwnerStudentDetailContent() {
  const { studentId } = Route.useParams()

  const { data: studentData } = useSuspenseQuery(
    getStudentQueryOptions(studentId),
  )

  // will never be executed because error is already thrown in loader
  if (!studentData) {
    throw notFound()
  }

  const { studentForm, onSubmit } = useEditStudent(studentData)

  return (
    <div className="flex h-full w-full">
      <main className="flex-1 flex flex-col h-full min-w-0 bg-background-light dark:bg-background-dark overflow-hidden relative">
        <div className="flex-1 overflow-x-hidden p-8 pb-32">
          <div className="flex flex-col gap-6 pb-12">
            <div className="flex flex-col gap-1">
              <h1 className="text-[#111318] dark:text-white text-3xl md:text-4xl font-bold tracking-tight">
                Edit Student Profile
              </h1>
              <p className="text-[#616f89] dark:text-gray-400 text-base">
                Edit the informations below and press submit to accept changes
              </p>
            </div>
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-[#f0f2f4] dark:border-gray-800 overflow-hidden">
              <FormProvider {...studentForm}>
                <form
                  className="flex flex-col"
                  onSubmit={studentForm.handleSubmit(onSubmit)}
                >
                  <div className="p-8 border-b border-[#f0f2f4] dark:border-gray-800">
                    <h3 className="text-[#111318] dark:text-white text-lg font-bold mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">
                        badge
                      </span>
                      Personal Information
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px] gap-8 items-start">
                      {/* Avatar panel */}
                      <aside className="order-1 lg:order-2">
                        <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#f0f2f4] bg-[#f8f9fc] p-6 dark:border-gray-800 dark:bg-[#151a25]">
                          <AvatarUploadCard
                            form={studentForm}
                            imageField="image"
                            title="Profile Picture"
                            description="Click the avatar to update the picture"
                          />
                        </div>
                      </aside>

                      {/* Inputs */}
                      <div className="order-2 lg:order-1 grid grid-cols-1 gap-6">
                        <InputWrapper
                          form={studentForm}
                          name="name"
                          label="name"
                          placeholder="Student's Name"
                        />

                        <DatePickerField
                          form={studentForm}
                          name="dateOfBirth"
                          label="Birth Date"
                        />

                        <SelectWrapper
                          form={studentForm}
                          label="Gender"
                          name="gender"
                          placeholder="pick your gender"
                          values={['Female', 'Male']}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-8 border-b border-[#f0f2f4] dark:border-gray-800">
                    <h3 className="text-[#111318] dark:text-white text-lg font-bold mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">
                        contact_mail
                      </span>
                      Contact Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputWrapper
                        form={studentForm}
                        name="email"
                        label="email"
                        placeholder="Student's Email"
                        type="email"
                      />
                      <InputWrapper
                        form={studentForm}
                        name="telNumber"
                        label="Phone Number"
                        placeholder="Parent Phone Number"
                      />
                      <InputWrapper
                        form={studentForm}
                        name="parentName"
                        label="Parent Name"
                        placeholder="Parent Name"
                      />
                      <InputWrapper
                        form={studentForm}
                        name="parentPhoneNumber"
                        label="Parent Phone Number"
                        placeholder="Parent Phone Number"
                      />
                      <InputWrapper
                        form={studentForm}
                        name="address"
                        label="Address"
                        placeholder="Student's Address"
                      />
                    </div>
                  </div>
                  <div className="p-8 border-b border-[#f0f2f4] dark:border-gray-800">
                    <h3 className="text-[#111318] dark:text-white text-lg font-bold mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">
                        school
                      </span>
                      Academic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <DatePickerField
                        name="enrollmentDate"
                        label="Enrollment Date"
                        form={studentForm}
                      />
                      <StudentGradeSelector />
                      <StudentClassSelector />
                    </div>
                  </div>
                  <div className="p-6 bg-[#f8f9fc] dark:bg-[#151a25] border-t border-[#f0f2f4] dark:border-gray-800 flex flex-col-reverse sm:flex-row items-center justify-end gap-4 rounded-b-xl">
                    <Link to="/admin/students">
                      <button
                        type="button"
                        className="w-full sm:w-auto h-10 px-6 rounded-lg border border-transparent text-[#616f89] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-bold text-sm transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </Link>
                    <button
                      type="submit"
                      className="w-full sm:w-auto h-10 px-6 rounded-lg bg-primary hover:bg-blue-600 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        check
                      </span>
                      Edit Student Account
                    </button>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
