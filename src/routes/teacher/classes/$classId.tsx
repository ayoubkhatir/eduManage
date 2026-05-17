// import { createFileRoute, Link } from '@tanstack/react-router'
// import { useQuery, queryOptions } from '@tanstack/react-query'
// import { Skeleton } from 'boneyard-js/react'
// import { getTeachersByClassServerFn } from '#/server/modules/teachers/teachers.server-functions'

// type TeacherInClass = {
//   assignmentId: string
//   teacherId: string
//   subjectId: string
//   subjectName: string
//   subjectCode: string | null
//   isPrimaryTeacher: boolean
//   assignmentStatus: string

//   userId: string
//   username: string
//   email: string
//   telNumber: string
//   image: string | null
//   gender: string

//   teacherStatus: string
//   joiningDate: string
// }

// const getClassTeachersQueryOptions = (classId: string) =>
//   queryOptions({
//     queryKey: ['class-teachers', classId],
//     queryFn: async () => {
//       const res = await getTeachersByClassServerFn({
//         data: { classId },
//       })

//       if (!res.success) {
//         throw new Error('Failed to fetch class teachers')
//       }

//       return res.data as TeacherInClass[]
//     },
//   })

// export const Route = createFileRoute('/teacher/classes/$classId')({
//   component: RouteComponent,
//   loader: async ({ context, params }) => {
//     await context.queryClient.ensureQueryData(
//       getClassTeachersQueryOptions(params.classId),
//     )
//   },
// })

// function RouteComponent() {
//   const { classId } = Route.useParams()

//   const { data, isLoading, isError, refetch } = useQuery(
//     getClassTeachersQueryOptions(classId),
//   )

//   const teachers = data ?? []

//   const subjects = Array.from(
//     new Map(teachers.map((t) => [t.subjectId, t.subjectName])).values(),
//   )

//   return (
//     <main className="flex-1 flex flex-col min-w-0 overflow-y-auto px-6 py-6">
//       {/* Header */}
//       <div className="mb-6">
//         <Link
//           to="/teacher/classes"
//           className="text-sm text-primary hover:underline"
//         >
//           ← Back to classes
//         </Link>

//         <h1 className="text-3xl font-bold mt-2">Class Details</h1>

//         <p className="text-slate-500 mt-1">Class ID: {classId}</p>
//       </div>

//       {/* Error */}
//       {isError && (
//         <div className="p-4 border rounded-lg bg-red-50 text-red-600">
//           Failed to load class data.
//           <button onClick={() => refetch()} className="cursor-pointer ml-3 underline">
//             Retry
//           </button>
//         </div>
//       )}

//       {/* Content */}
//       <Skeleton loading={isLoading && !data}>
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Teachers */}
//           <section className="lg:col-span-2">
//             <h2 className="text-lg font-semibold mb-4">Teachers</h2>

//             <div className="space-y-3">
//               {teachers.map((t) => (
//                 <div
//                   key={t.assignmentId}
//                   className="border rounded-xl p-4 flex justify-between items-center"
//                 >
//                   <div>
//                     <p className="font-semibold">{t.username}</p>
//                     <p className="text-sm text-slate-500">{t.subjectName}</p>
//                     <p className="text-xs text-slate-400">
//                       {t.isPrimaryTeacher
//                         ? 'Primary Teacher'
//                         : 'Supporting Teacher'}
//                     </p>
//                   </div>

//                   <span
//                     className={`text-xs px-2 py-1 rounded-full ${
//                       t.assignmentStatus === 'Active'
//                         ? 'bg-green-100 text-green-700'
//                         : 'bg-slate-100 text-slate-600'
//                     }`}
//                   >
//                     {t.assignmentStatus}
//                   </span>
//                 </div>
//               ))}

//               {teachers.length === 0 && (
//                 <p className="text-sm text-slate-500">
//                   No teachers assigned to this class.
//                 </p>
//               )}
//             </div>
//           </section>

//           {/* Sidebar */}
//           <aside className="space-y-6">
//             {/* Subjects */}
//             <div className="border rounded-xl p-4">
//               <h3 className="font-semibold mb-2">Subjects</h3>

//               <ul className="text-sm space-y-1">
//                 {subjects.map((s) => (
//                   <li key={s}>{s}</li>
//                 ))}

//                 {subjects.length === 0 && (
//                   <li className="text-slate-500">No subjects</li>
//                 )}
//               </ul>
//             </div>

//             {/* Quick Actions */}
//             <div className="border rounded-xl p-4">
//               <h3 className="font-semibold mb-2">Actions</h3>

//               <div className="flex flex-col gap-2">
//                 <Link
//                   to="/teacher/attendance/$classId"
//                   params={{ classId }}
//                   className="text-sm text-primary hover:underline"
//                 >
//                   Take Attendance
//                 </Link>

//                 <Link
//                   to="/teacher/marks/$classId"
//                   params={{ classId }}
//                   className="text-sm text-primary hover:underline"
//                 >
//                   Enter Marks
//                 </Link>
//               </div>
//             </div>
//           </aside>
//         </div>
//       </Skeleton>
//     </main>
//   )
// }

import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, queryOptions } from '@tanstack/react-query'
import { Skeleton } from 'boneyard-js/react'
import { getTeachersByClassServerFn } from '#/server/modules/teachers/teachers.server-functions'
import { UserAvatar } from '#/components/admin/Table/columnsData'

type TeacherInClass = {
  assignmentId: string
  teacherId: string
  subjectId: string
  subjectName: string
  subjectCode: string | null
  isPrimaryTeacher: boolean
  assignmentStatus: string

  userId: string
  username: string
  email: string
  telNumber: string
  image: string | null
  gender: string

  teacherStatus: string
  joiningDate: string
}

const getClassTeachersQueryOptions = (classId: string) =>
  queryOptions({
    queryKey: ['class-teachers', classId],
    queryFn: async () => {
      const res = await getTeachersByClassServerFn({
        data: { classId },
      })

      if (!res.success) {
        throw new Error('Failed to fetch class teachers')
      }

      return res.data as TeacherInClass[]
    },
  })

export const Route = createFileRoute('/teacher/classes/$classId')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      getClassTeachersQueryOptions(params.classId),
    )
  },
})

function RouteComponent() {
  const { classId } = Route.useParams()

  const { data, isLoading, isError, refetch, isFetching } = useQuery(
    getClassTeachersQueryOptions(classId),
  )

  const teachers = data ?? []

  const subjects = Array.from(
    new Map(teachers.map((teacher) => [teacher.subjectId, teacher])).values(),
  )

  const primaryTeachers = teachers.filter((t) => t.isPrimaryTeacher)
  const activeAssignments = teachers.filter(
    (t) => t.assignmentStatus === 'Active',
  )

  return (
    <main className="flex-1 min-w-0 ">
      <div className="px-6 py-6 space-y-6">
        <div className="flex flex-col gap-3">
          <Link
            to="/teacher/classes"
            className="text-sm font-medium text-primary hover:underline w-fit"
          >
            ← Back to classes
          </Link>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Class Details
                </p>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                  Class Overview
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                  View assigned teachers, covered subjects, and quick class
                  actions.
                </p>
                <p className="text-xs text-slate-400 mt-3">
                  Class ID: {classId}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="cursor-pointer rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        <Skeleton
          loading={isLoading && !data}
          name="teacher-class-details-page"
        >
          {isError ? (
            <div className="rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 p-6">
              <h3 className="font-semibold text-red-700 dark:text-red-300">
                Failed to load class details
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                Something went wrong while loading teachers and subjects for
                this class.
              </p>
              <button
                onClick={() => refetch()}
                className="cursor-pointer mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <SummaryCard
                  title="Assigned Teachers"
                  value={teachers.length}
                  icon="groups"
                />
                <SummaryCard
                  title="Subjects"
                  value={subjects.length}
                  icon="menu_book"
                />
                <SummaryCard
                  title="Primary Teachers"
                  value={primaryTeachers.length}
                  icon="verified"
                />
                <SummaryCard
                  title="Active Assignments"
                  value={activeAssignments.length}
                  icon="task_alt"
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <section className="xl:col-span-2">
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Assigned Teachers
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Teachers currently assigned to this class and the
                        subjects they handle.
                      </p>
                    </div>

                    <div className="p-5">
                      {teachers.length === 0 ? (
                        <EmptyState
                          title="No teachers assigned"
                          description="This class does not have any teacher assignments yet."
                          icon="school"
                        />
                      ) : (
                        <div className="space-y-4">
                          {teachers.map((teacher) => (
                            <TeacherCard
                              key={teacher.assignmentId}
                              teacher={teacher}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                <aside className="space-y-6">
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        Subjects
                      </h3>
                    </div>

                    <div className="p-5">
                      {subjects.length === 0 ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          No subjects found for this class.
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {subjects.map((subject) => (
                            <span
                              key={subject.subjectId}
                              className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium"
                            >
                              {subject.subjectName}
                              {subject.subjectCode
                                ? ` (${subject.subjectCode})`
                                : ''}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        Quick Actions
                      </h3>
                    </div>

                    <div className="p-5 flex flex-col gap-3">
                      <ActionLink
                        to="/teacher/attendance/$classId"
                        params={{ classId }}
                        label="Take Attendance"
                        icon="fact_check"
                      />
                      <ActionLink
                        to="/teacher/marks/$classId"
                        params={{ classId }}
                        label="Enter Marks"
                        icon="grading"
                      />
                      <ActionLink
                        to="/teacher/classes"
                        params={{}}
                        label="Back to Classes"
                        icon="arrow_back"
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        Notes
                      </h3>
                    </div>

                    <div className="p-5">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        This page is currently powered by class teacher
                        assignments. It can be upgraded later with full class
                        info, student count, roster, schedule, and marks
                        summaries.
                      </p>
                    </div>
                  </div>
                </aside>
              </div>
            </>
          )}
        </Skeleton>
      </div>
    </main>
  )
}

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string
  value: number
  icon: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {value}
          </h3>
        </div>
        <span className="material-symbols-outlined text-primary">{icon}</span>
      </div>
    </div>
  )
}

function TeacherCard({ teacher }: { teacher: TeacherInClass }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/30 p-4">
      <div className="flex items-start gap-4">
        {/* {teacher.image ? (
          <img
            src={teacher.image}
            alt={teacher.username}
            className="h-12 w-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold border border-primary/20">
            {teacher.username.slice(0, 1).toUpperCase()}
          </div>
        )}
         */}
        <UserAvatar image={teacher.image} size={12} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">
                {teacher.username}
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {teacher.subjectName}
                {teacher.subjectCode ? ` • ${teacher.subjectCode}` : ''}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                <MiniBadge
                  label={
                    teacher.isPrimaryTeacher
                      ? 'Primary Teacher'
                      : 'Supporting Teacher'
                  }
                  variant={teacher.isPrimaryTeacher ? 'primary' : 'neutral'}
                />
                <StatusBadge status={teacher.assignmentStatus} />
                <MiniBadge label={teacher.teacherStatus} variant="neutral" />
              </div>
            </div>

            <div className="text-sm text-slate-500 dark:text-slate-400 md:text-right">
              <p>{teacher.email}</p>
              <p>{teacher.telNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    Inactive:
      'bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-300',
    Pending:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    New: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        map[status] ??
        'bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-300'
      }`}
    >
      {status}
    </span>
  )
}

function MiniBadge({
  label,
  variant,
}: {
  label: string
  variant: 'primary' | 'neutral'
}) {
  const styles =
    variant === 'primary'
      ? 'bg-primary/10 text-primary'
      : 'bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-300'

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles}`}
    >
      {label}
    </span>
  )
}

function EmptyState({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: string
}) {
  return (
    <div className="py-10 text-center">
      <span className="material-symbols-outlined text-4xl text-slate-400">
        {icon}
      </span>
      <h4 className="mt-3 font-semibold text-slate-900 dark:text-white">
        {title}
      </h4>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  )
}

function ActionLink({
  to,
  params,
  label,
  icon,
}: {
  to: string
  params: Record<string, string>
  label: string
  icon: string
}) {
  return (
    <Link
      to={to as never}
      params={params as never}
      className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 hover:border-primary/40 hover:bg-primary/5 transition-all"
    >
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">{icon}</span>
        <span className="text-sm font-medium text-slate-900 dark:text-white">
          {label}
        </span>
      </div>
      <span className="material-symbols-outlined text-slate-400">
        chevron_right
      </span>
    </Link>
  )
}
