import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from 'boneyard-js/react'
import { getStudentSubjectsQueryOptions } from '#/services/api/subjects.hooks'

type SubjectItem = {
  id: string
  name: string
  createdAt: Date
  status: string
  updatedAt: Date
  schoolId: string
  code: string
}

export const Route = createFileRoute('/student/subjects/')({
  component: StudentSubjectsPage,
  pendingComponent: StudentSubjectsPending,
  head: () => ({
    meta: [{ title: 'Student | Subjects - EduManage' }],
  }),
  loader: async ({ context }) => {
    const studentId = context.authState.user.id

    await context.queryClient.ensureQueryData({
      ...getStudentSubjectsQueryOptions(studentId),
    })
  },
})

function StudentSubjectsPending() {
  return (
    <Skeleton name="student-subjects-page" loading>
      <StudentSubjectsContent />
    </Skeleton>
  )
}

function StudentSubjectsPage() {
  return (
    <Skeleton name="student-subjects-page" loading={false}>
      <StudentSubjectsContent />
    </Skeleton>
  )
}

function StudentSubjectsContent() {
  const { authState } = Route.useRouteContext()
  const studentId = authState.user.id

  const { data, status } = useQuery({
    ...getStudentSubjectsQueryOptions(studentId),
  })

  const subjects = (data ?? []) as SubjectItem[]

  return (
    <main className="flex-1 overflow-y-auto bg-background-light p-4 dark:bg-background-dark md:p-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight text-[#0d121b] dark:text-white md:text-4xl">
            My Subjects
          </h1>
          <p className="text-base text-[#4c669a] dark:text-gray-400">
            Here are the subjects you need to study this year.
          </p>
        </div>

        {status === 'pending' ? (
          <SubjectsGridSkeleton />
        ) : status === 'error' ? (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center dark:border-red-900/40 dark:bg-slate-900">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              Failed to load subjects.
            </p>
          </div>
        ) : subjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
            <span className="material-symbols-outlined text-4xl text-slate-400">
              menu_book
            </span>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              No subjects found for your class.
            </p>
          </div>
        ) : (
          <>
            {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                title="Total Subjects"
                value={subjects.length}
                icon="menu_book"
              />
              <SummaryCard
                title="Active Subjects"
                value={subjects.filter((s) => s.status === 'Active').length}
                icon="task_alt"
              />
              <SummaryCard
                title="Pending Subjects"
                value={subjects.filter((s) => s.status === 'Pending').length}
                icon="hourglass_empty"
              />
              <SummaryCard
                title="School Curriculum"
                value={subjects.length}
                icon="school"
              />
            </div> */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {subjects.map((subject) => (
                <Link
                  to="/student/subjects/$subjectCode"
                  params={{ subjectCode: subject.code }}
                >
                  <SubjectCard key={subject.id} subject={subject} />
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}

function SubjectCard({ subject }: { subject: SubjectItem }) {
  const isActive = subject.status === 'Active'

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-xl font-bold text-slate-900 dark:text-white">
              {subject.name}
            </h2>
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                isActive
                  ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {subject.status}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {subject.code || 'No code'}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          <span className="material-symbols-outlined">menu_book</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <InfoBox label="Created" value={formatDate(subject.createdAt)} />
        <InfoBox label="Updated" value={formatDate(subject.updatedAt)} />
      </div>
    </div>
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
          <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {value}
          </h3>
        </div>
        <span className="material-symbols-outlined text-primary">{icon}</span>
      </div>
    </div>
  )
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800/60">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  )
}

function SubjectsGridSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5"
          >
            <div className="h-5 w-24 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="mt-3 h-8 w-16 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-5 flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-6 w-32 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
              </div>
              <div className="h-11 w-11 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="h-20 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="h-20 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function formatDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString()
}
