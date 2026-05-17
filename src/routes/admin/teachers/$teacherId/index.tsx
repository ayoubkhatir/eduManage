// import {
//   Link,
//   Navigate,
//   createFileRoute,
//   useNavigate,
// } from '@tanstack/react-router'

// import { useState } from 'react'
// import type { AddStudentModel } from '@/services/api/admin/student/schemas'
// import {
//   useEditTeacher,
//   useGetTeacher,
// } from '@/services/api/admin/teacher/hooks'
// import ProfilePicWrapper from '@/components/admin/ProfilePicWrapper'

// export const Route = createFileRoute('/admin/teachers/$teacherId')({
//   component: RouteComponent,
// })

// function RouteComponent() {
//   const { teacherId } = Route.useParams()
//   const { data: teacherData } = useGetTeacher(teacherId)

//   const { teacherForm,onSubmit} = useEditTeacher(teacherData)

//   const [showPassword, setShowPassword] = useState(false)
//   const [allowAccess, setAllowAccess] = useState(true)

//   function togglePassword() {
//     setShowPassword(!showPassword)
//   }
//   function toggleAllowAccess() {
//     setAllowAccess(!allowAccess)
//   }

//   const navigate = useNavigate()

//   return (
//     <div className="flex h-full w-full">
//       <main className="flex-1 flex flex-col h-full min-w-0 bg-background-light dark:bg-background-dark overflow-hidden relative">
//         <div className="flex-1 overflow-x-hidden p-8 pb-32">
//           <div className="flex flex-col gap-6 pb-12">
//             <div className="flex flex-col gap-1">
//               <h1 className="text-[#111318] dark:text-white text-3xl md:text-4xl font-bold tracking-tight">
//                 Edit Teacher Profile
//               </h1>
//               <p className="text-[#616f89] dark:text-gray-400 text-base">
//                 Update the information below and press submit to save changes.
//               </p>
//             </div>

//             <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-[#f0f2f4] dark:border-gray-800 overflow-hidden">
//               <form className="flex flex-col">
//                 <ProfilePicWrapper<AddStudentModel> form={teacherForm} />

//                 <div className="p-8 border-b border-[#f0f2f4] dark:border-gray-800">
//                   <h3 className="text-[#111318] dark:text-white text-lg font-bold mb-6 flex items-center gap-2">
//                     <span className="material-symbols-outlined text-primary">
//                       badge
//                     </span>
//                     Personal Information
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="flex flex-col gap-1.5">
//                       <label className="text-[#111318] dark:text-gray-200 text-sm font-medium">
//                         Full name
//                       </label>
//                       <input
//                         className="w-full h-11 rounded-lg bg-[#f0f2f4] dark:bg-gray-800 border-none px-4 text-[#111318] dark:text-white placeholder:text-[#9ca3af] focus:ring-2 focus:ring-primary/50 transition-all"
//                         placeholder="e.g. John Doe"
//                         type="text"
//                         value={teacherData?.name}
//                       />
//                     </div>

//                     <div className="flex flex-col gap-1.5">
//                       <label className="text-[#111318] dark:text-gray-200 text-sm font-medium">
//                         Date of Birth
//                       </label>
//                       <input
//                         className="w-full h-11 rounded-lg bg-[#f0f2f4] dark:bg-gray-800 border-none px-4 text-[#111318] dark:text-white focus:ring-2 focus:ring-primary/50 transition-all"
//                         type="date"
//                         value={
//                           teacherData?.dateOfBirth
//                             ? new Date(teacherData.dateOfBirth)
//                                 .toISOString()
//                                 .split('T')[0]
//                             : ''
//                         }
//                       />
//                     </div>

//                     <div className="flex flex-col gap-1.5">
//                       <label className="text-[#111318] dark:text-gray-200 text-sm font-medium">
//                         Gender
//                       </label>
//                       <select className="w-full h-11 rounded-lg bg-[#f0f2f4] dark:bg-gray-800 border-none px-4 text-[#111318] dark:text-white focus:ring-2 focus:ring-primary/50 appearance-none transition-all">
//                         <option disabled selected value="">
//                           Select Gender
//                         </option>
//                         <option value="female">Female</option>
//                         <option value="male">Male</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="p-8 border-b border-[#f0f2f4] dark:border-gray-800">
//                   <h3 className="text-[#111318] dark:text-white text-lg font-bold mb-6 flex items-center gap-2">
//                     <span className="material-symbols-outlined text-primary">
//                       contact_mail
//                     </span>
//                     Contact Details
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="flex flex-col gap-1.5">
//                       <label className="text-[#111318] dark:text-gray-200 text-sm font-medium">
//                         Email Address <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         className="w-full h-11 rounded-lg bg-[#f0f2f4] dark:bg-gray-800 border-none px-4 text-[#111318] dark:text-white placeholder:text-[#9ca3af] focus:ring-2 focus:ring-primary/50 transition-all"
//                         placeholder="john.doe@school.edu"
//                         type="email"
//                         value={teacherData?.email}
//                       />
//                     </div>
//                     <div className="flex flex-col gap-1.5">
//                       {/* <label className="text-[#111318] dark:text-gray-200 text-sm font-medium">
//                           Phone Number
//                         </label>
//                         <input
//                           className="w-full h-11 rounded-lg bg-[#f0f2f4] dark:bg-gray-800 border-none px-4 text-[#111318] dark:text-white placeholder:text-[#9ca3af] focus:ring-2 focus:ring-primary/50 transition-all"
//                           placeholder="+1 (555) 000-0000"
//                           type="tel"
//                           value={teacherData?.phone}
//                         /> */}
//                     </div>
//                     <div className="flex flex-col gap-1.5 md:col-span-2">
//                       <label className="text-[#111318] dark:text-gray-200 text-sm font-medium">
//                         Residential Address
//                       </label>
//                       <input
//                         className="w-full h-11 rounded-lg bg-[#f0f2f4] dark:bg-gray-800 border-none px-4 text-[#111318] dark:text-white placeholder:text-[#9ca3af] focus:ring-2 focus:ring-primary/50 transition-all"
//                         placeholder="123 Main Street, Springfield"
//                         type="text"
//                         value={teacherData?.address}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="p-8 border-b border-[#f0f2f4] dark:border-gray-800">
//                   <h3 className="text-[#111318] dark:text-white text-lg font-bold mb-6 flex items-center gap-2">
//                     <span className="material-symbols-outlined text-primary">
//                       school
//                     </span>
//                     Academic Information
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="flex flex-col gap-1.5">
//                       <label className="text-[#111318] dark:text-gray-200 text-sm font-medium">
//                         Employee ID
//                       </label>
//                       <input
//                         className="w-full h-11 rounded-lg bg-[#f0f2f4] dark:bg-gray-800/50 border-none px-4 text-[#616f89] dark:text-gray-400 cursor-not-allowed"
//                         readOnly
//                         type="text"
//                         value={teacherData?.id}
//                       />
//                       <p className="text-xs text-[#616f89] dark:text-gray-500">
//                         Auto-generated teacher ID
//                       </p>
//                     </div>
//                     {/* <div className="flex flex-col gap-1.5">
//                         <label className="text-[#111318] dark:text-gray-200 text-sm font-medium">
//                           Department / Subject
//                         </label>
//                         <input
//                           className="w-full h-11 rounded-lg bg-[#f0f2f4] dark:bg-gray-800 border-none px-4 text-[#111318] dark:text-white focus:ring-2 focus:ring-primary/50 transition-all"
//                           placeholder="e.g. Mathematics"
//                           value={teacherData?.department}
//                         />
//                       </div> */}
//                   </div>
//                 </div>

//                 <div className="p-8">
//                   <h3 className="text-[#111318] dark:text-white text-lg font-bold mb-6 flex items-center gap-2">
//                     <span className="material-symbols-outlined text-primary">
//                       lock
//                     </span>
//                     Account Settings
//                   </h3>
//                   <div className="flex flex-col gap-4">
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#f0f2f4] dark:bg-gray-800">
//                       <div>
//                         <p className="text-[#111318] dark:text-white font-medium">
//                           System Access
//                         </p>
//                         <p className="text-[#616f89] dark:text-gray-400 text-sm">
//                           Allow this teacher to log in to the portal.
//                         </p>
//                       </div>
//                       <label className="relative inline-flex items-center cursor-pointer">
//                         <input
//                           checked={allowAccess}
//                           onClick={toggleAllowAccess}
//                           className="sr-only peer"
//                           type="checkbox"
//                         />
//                         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
//                       </label>
//                     </div>

//                     <div className="flex flex-col gap-1.5">
//                       <label className="text-[#111318] dark:text-gray-200 text-sm font-medium">
//                         Temporary Password
//                       </label>
//                       <div className="relative">
//                         <input
//                           className="w-full h-11 rounded-lg bg-[#f0f2f4] dark:bg-gray-800 border-none px-4 text-[#111318] dark:text-white focus:ring-2 focus:ring-primary/50 transition-all"
//                           type={showPassword ? 'text' : 'password'}
//                           placeholder="Enter temporary password"
//                           value="TempPass123!"
//                         />
//                         <button
//                           type="button"
//                           className="absolute right-4 top-1/2 -translate-y-1/2 text-[#616f89] hover:text-[#111318] dark:hover:text-white dark:text-gray-400 cursor-pointer"
//                           onClick={togglePassword}
//                         >
//                           <span className="material-symbols-outlined">
//                             {showPassword ? 'visibility_off' : 'visibility'}
//                           </span>
//                         </button>
//                       </div>
//                       <p className="text-xs text-[#616f89] dark:text-gray-500">
//                         The teacher will be asked to change this password upon
//                         first login.
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="p-6 bg-[#f8f9fc] dark:bg-[#151a25] border-t border-[#f0f2f4] dark:border-gray-800 flex flex-col-reverse sm:flex-row items-center justify-end gap-4 rounded-b-xl">
//                   <Link to="/admin/teachers">
//                     <button
//                       type="button"
//                       className="w-full sm:w-auto h-10 px-6 rounded-lg border border-transparent text-[#616f89] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-bold text-sm transition-colors cursor-pointer"
//                     >
//                       Cancel
//                     </button>
//                   </Link>
//                   <button
//                     type="button"
//                     className="w-full sm:w-auto h-10 px-6 rounded-lg bg-primary hover:bg-blue-600 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
//                   >
//                     <span className="material-symbols-outlined text-[18px]">
//                       check
//                     </span>
//                     Edit Teacher Account
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Skeleton } from 'boneyard-js/react'
import {
  getTeacherQueryOptions,
  useEditTeacher,
} from '@/services/api/admin/teacher/hooks'
import InputWrapper from '@/components/admin/Wrappers/InputWrapper'
import DatePickerField from '@/components/admin/DatePickerField'
import SelectWrapper from '@/components/admin/Wrappers/SelectWrapper'
import type { TeacherUser } from '#/server/modules/teachers/teachers.types'
import { AvatarUploadCard } from '../../students/-student.avatar-editor'

export const Route = createFileRoute('/admin/teachers/$teacherId/')({
  component: RouteComponent,
  pendingComponent: () => (
    <Skeleton name="admin-teacher-detail-page" loading>
      <div className="flex h-full w-full" />
    </Skeleton>
  ),
  pendingMs: 0,
  pendingMinMs: 220,
  loader: async ({ params: { teacherId }, context }) => {
    const teacher = await context.queryClient.ensureQueryData(
      getTeacherQueryOptions({ fetchBy: 'teacherId', teacherId }),
    )
    if (!teacher) throw notFound()
  },
})

function RouteComponent() {
  return (
    <Skeleton name="admin-teacher-detail-page" loading={false}>
      <OwnerTeacherDetailContent />
    </Skeleton>
  )
}

function OwnerTeacherDetailContent() {
  const { teacherId } = Route.useParams()

  // const [showPassword, setShowPassword] = useState(false)

  const { data: teacherData } = useSuspenseQuery(
    getTeacherQueryOptions({ fetchBy: 'teacherId', teacherId }),
  )

  if (!teacherData) throw notFound()

  // function togglePassword() {
  //   setShowPassword(!showPassword)
  // }

  return (
    <div className="flex h-full w-full">
      <main className="flex-1 flex flex-col h-full min-w-0 bg-background-light dark:bg-background-dark overflow-hidden relative">
        <div className="flex-1 overflow-x-hidden p-8 pb-32">
          <div className="flex flex-col gap-6 pb-12">
            <div className="flex flex-col gap-1">
              <h1 className="text-[#111318] dark:text-white text-3xl md:text-4xl font-bold tracking-tight">
                Edit Teacher Profile
              </h1>
              <p className="text-[#616f89] dark:text-gray-400 text-base">
                Update the information below and press submit to save changes.
              </p>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-[#f0f2f4] dark:border-gray-800 overflow-hidden">
              {teacherData.teacherId && (
                <EditTeacherForm teacherData={teacherData} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function EditTeacherForm({ teacherData }: { teacherData: TeacherUser }) {
  const [allowAccess, setAllowAccess] = useState(true)

  function toggleAllowAccess() {
    setAllowAccess(!allowAccess)
  }
  const { form: teacherForm, onSubmit } = useEditTeacher(teacherData)
  return (
    <form
      className="flex flex-col"
      onSubmit={teacherForm.handleSubmit(onSubmit)}
    >
      {/* <ProfilePicWrapper<EditTeacherSchema> form={teacherForm} /> */}

      <div className="p-8 border-b border-[#f0f2f4] dark:border-gray-800">
        <h3 className="text-[#111318] dark:text-white text-lg font-bold mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">badge</span>
          Personal Information
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px] gap-8 items-start">
          {/* Avatar panel */}
          <aside className="order-1 lg:order-2">
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#f0f2f4] bg-[#f8f9fc] p-6 dark:border-gray-800 dark:bg-[#151a25]">
              {/* {teacherData.image ? (
                <AdvancedImage
                  cldImg={cld
                    .image(teacherData.image)
                    .resize(thumbnail().width(160).height(160))
                    .roundCorners(byRadius(999))}
                  className="size-40 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="size-40 text-gray-300 dark:text-gray-600" />
              )} */}
              <AvatarUploadCard
                form={teacherForm}
                imageField="image"
                title="Profile Picture"
                description="Click the avatar to update the picture"
              />

              <div className="text-center">
                <p className="text-sm font-medium text-[#111318] dark:text-white">
                  Profile Picture
                </p>
                <p className="text-xs text-[#616f89] dark:text-gray-400">
                  Student avatar preview
                </p>
              </div>
            </div>
          </aside>

          {/* Inputs */}
          <div className="order-2 lg:order-1 grid grid-cols-1 gap-6">
            <InputWrapper
              form={teacherForm}
              name="name"
              label="name"
              placeholder="Student's Name"
            />

            <DatePickerField
              form={teacherForm}
              name="dateOfBirth"
              label="Birth Date"
            />

            <SelectWrapper
              form={teacherForm}
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
            form={teacherForm}
            name="email"
            label="Email"
            placeholder="Teacher's Email"
            type="email"
          />
          <InputWrapper
            form={teacherForm}
            name="address"
            label="Address"
            placeholder="Teacher's Address"
          />
          <textarea
            {...teacherForm.register('about')}
            placeholder="About the teacher"
            className="border border-[#f0f2f4] dark:border-gray-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* <div className="p-8 border-b border-[#f0f2f4] dark:border-gray-800">
        <h3 className="text-[#111318] dark:text-white text-lg font-bold mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">school</span>
          Academic Information
        </h3>
      </div> */}

      <div className="p-8">
        <h3 className="text-[#111318] dark:text-white text-lg font-bold mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">lock</span>
          Account Settings
        </h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#f0f2f4] dark:bg-gray-800">
            <div>
              <p className="text-[#111318] dark:text-white font-medium">
                System Access
              </p>
              <p className="text-[#616f89] dark:text-gray-400 text-sm">
                Allow this teacher to log in to the portal.
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

          {/* <InputWrapper
                      form={teacherForm}
                      name="temporaryPassword"
                      label="Temporary Password"
                      placeholder="Enter temporary password"
                      type={showPassword ? 'text' : 'password'}
                    /> */}
        </div>
      </div>

      <div className="p-6 bg-[#f8f9fc] dark:bg-[#151a25] border-t border-[#f0f2f4] dark:border-gray-800 flex flex-col-reverse sm:flex-row items-center justify-end gap-4 rounded-b-xl">
        <Link to="/admin/teachers">
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
          <span className="material-symbols-outlined text-[18px]">check</span>
          Edit Teacher Account
        </button>
      </div>
    </form>
  )
}
