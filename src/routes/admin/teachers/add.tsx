import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Skeleton } from 'boneyard-js/react'
import { useAddTeacher } from '@/services/api/admin/teacher/hooks'
import ProfilePicWrapper from '@/components/admin/Wrappers/ProfilePicWrapper'
import InputWrapper from '@/components/admin/Wrappers/InputWrapper'
import SelectWrapper from '@/components/admin/Wrappers/SelectWrapper'
import DatePickerField from '@/components/admin/DatePickerField'
import type { AddTeacherSchema } from '#/schemas/teachers.schema'
import { SimpleImageUpload } from '#/components/cloudinary-uploader'
import { useAuth } from '#/services/store/auth_store'

export const Route = createFileRoute('/admin/teachers/add')({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: 'Admin | Add Teacher - EduManage' }],
  }),
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
  const user = useAuth((s) => s.user)
  const { onSubmit, form } = useAddTeacher(user?.id!)
  // const subjects = form.watch('subjects')

  // function addSubjects(subject: string) {
  //   if (!subject) {
  //     return
  //   }
  //   if (subjects.includes(subject)) {
  //     return
  //   }
  //   form.setValue('subjects', [...subjects, subject], {
  //     shouldValidate: true,
  //     shouldDirty: true,
  //   })
  // }

  // function removeSubjects(value: string) {
  //   form.setValue(
  //     'subjects',
  //     subjects.filter((s) => s !== value),
  //     { shouldValidate: true },
  //   )
  // }

  // function onSubmit(data: TeacherModel | undefined, errors: any) {
  //   if (errors) {
  //     console.log('Errors : ', errors)
  //   } else if (data) {
  //     console.log('Data : ', data)
  //     addTeacher(data)
  //   }
  // }

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
                  {/* <ProfilePicWrapper<AddTeacherSchema>
                    form={form}
                    imageField="image"
                  /> */}

                  <div className="p-8 border-b border-t border-gray-100 dark:border-gray-800">
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
                  {/* <div className="p-8 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-neutral-900 dark:text-white text-lg font-bold mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">
                        school
                      </span>
                      Academic Role
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* <DatePickerField
                        form={form}
                        name="joiningDate"
                        label="Joining Date"
                        placeholder="enter the teacher joining date"
                      /> */}

                  {/* <SelectWrapper
                        form={form}
                        label="Department"
                        name="de"
                        placeholder="select the teacher department"
                        values={['science', 'math', 'literature', 'arts']}
                      /> */}

                  {/* this needs a special component since it's doing so much problems here */}

                  {/* <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-neutral-900 dark:text-gray-200 text-sm font-medium">
                        Subjects Specialization
                      </label>
                      <div className="w-full min-h-11 rounded-lg bg-gray-100 dark:bg-gray-800 border-none p-2 flex flex-wrap gap-2 items-center">
                        {subjects.map((subject) => (
                          <div
                            key={subject}
                            className="bg-white dark:bg-gray-700 text-neutral-900 dark:text-white text-sm font-medium px-2 py-1 rounded flex items-center gap-1 shadow-sm"
                          >
                            {subject}
                            <button
                              type="button"
                              className="hover:text-red-500 flex items-center justify-center"
                              onClick={() => {
                                removeSubjects(subject)
                              }}
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                close
                              </span>
                            </button>
                          </div>
                        ))}
                        <input
                          className="bg-transparent border-none text-sm p-1 placeholder:text-gray-400 focus:ring-0 flex-1 min-w-50 text-neutral-900 dark:text-white"
                          placeholder="Type and press Enter to add..."
                          type="text"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addSubjects(e.currentTarget.value.trim())
                              e.currentTarget.value = ''
                            }
                          }}
                        />
                      </div>
                    </div> 
                    </div>
                  </div> */}
                  <div className="p-8">
                    <h3 className="text-neutral-900 dark:text-white text-lg font-bold mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">
                        lock
                      </span>
                      Account Settings
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
                        <div>
                          <p className="text-neutral-900 dark:text-white font-medium">
                            System Access
                          </p>
                          <p className="text-slate-500 dark:text-gray-400 text-sm">
                            Allow this teacher to log in to the portal
                            immediately.
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
                        <label className="text-neutral-900 dark:text-gray-200 text-sm font-medium">
                          Temporary Password
                        </label>
                        <div className="relative">
                          <input
                            className="w-full h-11 rounded-lg bg-gray-100 dark:bg-gray-800 border-none px-4 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary/50 transition-all"
                            // {...form.register('password')}
                            type={showPassword ? 'text' : 'password'}
                            value="Teacher@2026"
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-6 -translate-y-1/2 text-slate-500 hover:text-neutral-900 dark:hover:text-white dark:text-gray-400 cursor-pointer self-center"
                            onClick={togglePassword}
                          >
                            <span className="material-symbols-outlined">
                              {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-gray-500">
                          The teacher will be asked to change this password upon
                          first login.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex flex-col-reverse sm:flex-row items-center justify-end gap-4 rounded-b-xl">
                    <Link to="/admin/teachers">
                      <button
                        type="button"
                        className="w-full sm:w-auto h-10 px-6 rounded-lg border border-transparent text-slate-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-bold text-sm transition-colors cursor-pointer"
                      >
                        previous
                      </button>
                    </Link>

                    <button
                      type="submit"
                      className="w-full sm:w-auto h-10 px-6 rounded-lg bg-primary hover:bg-blue-600 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        check
                      </span>
                      Create Teacher Account
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
