import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Skeleton } from 'boneyard-js/react'
import DatePickerField from '@/components/admin/DatePickerField'
import InputWrapper from '@/components/admin/Wrappers/InputWrapper'
import SelectWrapper from '@/components/admin/Wrappers/SelectWrapper'
import { useAddStudent } from '#/hooks/students/hooks'
import { getAllGradesQueryOptions } from '#/hooks/grades/hooks'
import { getAllClassesQueryOptions } from '#/hooks/classes/hooks'
import {
  StudentClassSelector,
  StudentGradeSelector,
} from './-students.selectors'
import { FormProvider } from 'react-hook-form'
import { SimpleImageUpload } from '#/components/cloudinary-uploader'

export const Route = createFileRoute('/admin/students/add')({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: 'Admin | Add Student - EduManage' }],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData({ ...getAllGradesQueryOptions() })
    context.queryClient.ensureQueryData({ ...getAllClassesQueryOptions() })
  },
})

function RouteComponent() {
  const [showPassword, setShowPassword] = useState(false)
  const [allowAccess, setAllowAccess] = useState(true)

  function togglePassword() {
    setShowPassword(!showPassword)
  }
  function toggleAllowAccess() {
    setAllowAccess(!allowAccess)
  }

  const { studentForm, onSubmit } = useAddStudent('r0akyppqt5jl')
  return (
    <Skeleton name="admin-add-student-page" loading={false}>
      <FormProvider {...studentForm}>
        <div className="flex h-full w-full">
          <main className="flex-1 flex flex-col h-full min-w-0 bg-background-light dark:bg-background-dark overflow-hidden relative">
            <div className="flex-1 overflow-x-hidden p-8 pb-32">
              <div className="flex flex-col gap-6 pb-12">
                <div className="flex flex-col gap-1">
                  <h1 className="text-[#111318] dark:text-white text-3xl md:text-4xl font-bold tracking-tight">
                    Add New Student
                  </h1>
                  <p className="text-[#616f89] dark:text-gray-400 text-base">
                    Enter the details below to create a new student account and
                    assign access
                  </p>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-[#f0f2f4] dark:border-gray-800 overflow-hidden">
                  <form
                    className="flex flex-col"
                    onSubmit={studentForm.handleSubmit(onSubmit)}
                  >
                    {/* <ProfilePicWrapper<AddStudentSchema>
                      form={studentForm}
                      imageField="image"
                    /> */}

                    <div className="p-8 border-b border-t border-[#f0f2f4] dark:border-gray-800">
                      <h3 className="text-[#111318] dark:text-white text-lg font-bold mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">
                          badge
                        </span>
                        Personal Information
                      </h3>
                      <div className="mb-4">
                        <SimpleImageUpload
                          value={studentForm.watch('image')}
                          onChange={(publicId) => {
                            studentForm.setValue('image', publicId, {
                              shouldDirty: true,
                              shouldTouch: true,
                              shouldValidate: true,
                            })
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputWrapper
                          form={studentForm}
                          name="name"
                          label="name"
                          placeholder="Student's Name"
                        />
                        <DatePickerField
                          form={studentForm}
                          name="dateOfBirth"
                          label="Birth Date "
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
                          placeholder="Phone Number"
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
                    <div className="p-8">
                      <h3 className="text-[#111318] dark:text-white text-lg font-bold mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">
                          lock
                        </span>
                        Account Settings
                      </h3>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#f0f2f4] dark:bg-gray-800">
                          <div>
                            <p className="text-[#111318] dark:text-white font-medium">
                              System Access
                            </p>
                            <p className="text-[#616f89] dark:text-gray-400 text-sm">
                              Allow this student to log in to the portal.
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              checked={allowAccess}
                              onChange={toggleAllowAccess}
                              className="sr-only peer"
                              type="checkbox"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                          </label>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[#111318] dark:text-gray-200 text-sm font-medium">
                            Temporary Password
                          </label>
                          <div className="relative">
                            <input
                              className="w-full h-11 rounded-lg bg-[#f0f2f4] dark:bg-gray-800 border-none px-4 text-[#111318] dark:text-white focus:ring-2 focus:ring-primary/50 transition-all"
                              type={showPassword ? 'text' : 'password'}
                            />
                            <button
                              type="button"
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#616f89] hover:text-[#111318] dark:hover:text-white dark:text-gray-400 cursor-pointer"
                              onClick={togglePassword}
                            >
                              <span className="material-symbols-outlined">
                                {showPassword ? 'visibility_off' : 'visibility'}
                              </span>
                            </button>
                          </div>
                          <p className="text-xs text-[#616f89] dark:text-gray-500">
                            The student will be asked to change this password
                            upon first login.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-[#f8f9fc] dark:bg-[#151a25] border-t border-[#f0f2f4] dark:border-gray-800 flex flex-col-reverse sm:flex-row items-center justify-end gap-4 rounded-b-xl">
                      <Link
                        to="/admin/students"
                        className="w-full sm:w-auto h-10 px-6 rounded-lg border border-transparent text-[#616f89] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-bold text-sm transition-colors cursor-pointer inline-flex items-center justify-center"
                      >
                        Cancel
                      </Link>
                      <button
                        type="submit"
                        className="w-full sm:w-auto h-10 px-6 rounded-lg bg-primary hover:bg-blue-600 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          check
                        </span>
                        Create Student Account
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </main>
        </div>
      </FormProvider>
    </Skeleton>
  )
}
