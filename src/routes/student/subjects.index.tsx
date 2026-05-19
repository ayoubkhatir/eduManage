import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from 'boneyard-js/react'
import { getStudentSubjectsQueryOptions } from '#/hooks/subjects/hooks'

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
    const studentId = context.authState.user?.id
    if (!studentId) return

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
  const studentId = authState.user?.id

  if (!studentId) return null

  const { data, status } = useQuery({
    ...getStudentSubjectsQueryOptions(studentId),
  })

  const subjects = (data ?? []) as SubjectItem[]

  return (
    <main className="flex-1 overflow-y-auto p-4 pt-2 md:p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            My Subjects
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Here are the subjects you need to study this year.
          </p>
        </div>

        {/* Content */}
        {status === 'pending' ? (
          <SubjectsGridSkeleton />
        ) : status === 'error' ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-white p-10 text-center dark:border-red-900/40 dark:bg-white/[0.02]">
            <span className="material-symbols-outlined text-4xl text-red-400">
              error
            </span>
            <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">
              Failed to load subjects.
            </p>
          </div>
        ) : subjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-white/[0.02]">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">
              menu_book
            </span>
            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              No subjects found for your class.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {subjects.map((subject) => (
              <Link
                key={subject.id}
                to="/student/subjects/$subjectCode"
                params={{ subjectCode: subject.code }}
              >
                <SubjectCard subject={subject} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

function SubjectCard({ subject }: { subject: SubjectItem }) {
  const isActive = subject.status === 'Active'

  return (
    <div className="group rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:border-primary/40">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-lg font-bold text-slate-900 dark:text-white">
              {subject.name}
            </h2>
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isActive
                  ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {subject.status}
            </span>
          </div>
          <p className="mt-1 text-sm font-mono text-slate-400 dark:text-slate-500">
            {subject.code || 'No code'}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white dark:bg-primary/10">
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

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
        {value}
      </p>
    </div>
  )
}

function SubjectsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mb-5 flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-5 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-16 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
            <div className="h-16 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      ))}
    </div>
  )
}

function formatDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString()
}
