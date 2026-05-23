import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from 'boneyard-js/react'
import { getTeacherSubjectsQueryOptions } from '#/hooks/subjects/hooks'
import { motion } from 'framer-motion'

type SubjectItem = {
  id: string
  name: string
  createdAt: Date
  status: string
  updatedAt: Date
  schoolId: string
  code: string
}

export const Route = createFileRoute('/_auth/teacher/subjects/')({
  component: TeacherSubjectsPage,
  pendingComponent: TeacherSubjectsPending,
  head: () => ({
    meta: [{ title: 'Teacher | Subjects - EduManage' }],
  }),
  loader: async ({ context }) => {
    const teacherUserId = context.authState.user?.id
    if (!teacherUserId) return

    await context.queryClient.ensureQueryData({
      ...getTeacherSubjectsQueryOptions(teacherUserId),
    })
  },
})

function TeacherSubjectsPending() {
  return (
    <Skeleton name="teacher-subjects-page" loading>
      <TeacherSubjectsContent />
    </Skeleton>
  )
}

function TeacherSubjectsPage() {
  return (
    <Skeleton name="teacher-subjects-page" loading={false}>
      <TeacherSubjectsContent />
    </Skeleton>
  )
}

function TeacherSubjectsContent() {
  const { authState } = Route.useRouteContext()
  const teacherUserId = authState.user?.id

  if (!teacherUserId) return null

  const { data, status } = useQuery({
    ...getTeacherSubjectsQueryOptions(teacherUserId),
  })

  const subjects = (data ?? []) as SubjectItem[]

  return (
    <motion.main initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="flex-1 overflow-y-auto p-4 pt-2 md:p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Subjects
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Subjects you are teaching this academic year.
          </p>
        </div>

        {/* Content */}
        {status === 'pending' ? (
          <SubjectsGridSkeleton />
        ) : status === 'error' ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-card p-10 text-center">
            <span className="material-symbols-outlined text-4xl text-red-400">
              error
            </span>
            <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">
              Failed to load subjects.
            </p>
          </div>
        ) : subjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-muted-foreground">
              menu_book
            </span>
            <p className="mt-4 text-sm font-medium text-muted-foreground">
              You don&apos;t have any subjects yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {subjects.map((subject) => (
              <Link
                key={subject.id}
                to="/teacher/subjects/$subjectCode"
                params={{ subjectCode: subject.code }}
              >
                <SubjectCard subject={subject} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </motion.main>
  )
}

function SubjectCard({ subject }: { subject: SubjectItem }) {
  const isActive = subject.status === 'Active'

  return (
    <div className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-lg font-bold text-foreground">
              {subject.name}
            </h2>
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isActive
                  ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {subject.status}
            </span>
          </div>
          <p className="mt-1 text-sm font-mono text-muted-foreground">
            {subject.code || 'No code'}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
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
    <div className="rounded-xl bg-muted p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">
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
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="mb-5 flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-5 w-28 animate-pulse rounded bg-muted" />
              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-11 w-11 animate-pulse rounded-xl bg-muted" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-16 animate-pulse rounded-xl bg-muted" />
            <div className="h-16 animate-pulse rounded-xl bg-muted" />
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
