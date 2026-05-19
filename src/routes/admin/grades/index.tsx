import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '#/components/ui/skeleton'
import { getAllGradesWithClassesAndSubjectsQueryOptions } from '#/hooks/grades/hooks'
import { Link } from '@tanstack/react-router'
import { AddGradeDialog } from './-add-grade.form'
import { useAuth } from '#/store/auth_store'

export const Route = createFileRoute('/admin/grades/')({
  component: RouteComponent,
  pendingComponent: () => <GradesCardsSkeleton />,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      ...getAllGradesWithClassesAndSubjectsQueryOptions(),
    })
  },
})

function RouteComponent() {
  const { data: grades } = useSuspenseQuery({
    ...getAllGradesWithClassesAndSubjectsQueryOptions(),
  })

  const user = useAuth((s) => s.user)

  return (
    <div className="flex h-full w-full overflow-y-hidden">
      <main className="flex flex-1 flex-col bg-background-light dark:bg-background-dark">
        <div className="flex-1 overflow-x-hidden p-6 pt-2">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            {/* Page heading */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                  Grades
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Browse grades with their classes and subjects.
                </p>
              </div>
              <AddGradeDialog schoolId={user?.info?.id ?? ''} />
            </div>

            {/* Content */}
            {grades.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-white/2">
                <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">
                  stairs_2
                </span>
                <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  No grades found.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {grades.map((grade) => (
                  <Link
                    key={grade.id}
                    to="/admin/grades/$name"
                    params={{ name: grade.name }}
                  >
                    <GradeCard grade={grade} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

type GradeCardProps = {
  grade: {
    id: string
    name: string
    levelOrder: number
    status: string
    classes: Array<{
      id: string
      name: string
    }>
    subjects: Array<{
      id: string
      name: string
      code?: string | null
    }>
  }
}

function GradeCard({ grade }: GradeCardProps) {
  const isActive = grade.status === 'Active'

  return (
    <div className="group rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md dark:border-white/6 dark:bg-white/2 dark:hover:border-primary/40">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {grade.name}
            </h2>
            <Badge
              variant="secondary"
              className={
                isActive
                  ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }
            >
              {grade.status}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
            Level #{grade.levelOrder}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white dark:bg-primary/10">
          <span className="material-symbols-outlined">school</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Classes
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {grade.classes.length}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Subjects
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {grade.subjects.length}
          </p>
        </div>
      </div>

      {/* Classes */}
      <div className="mt-5 space-y-4">
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Classes
          </p>
          {grade.classes.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">
              No classes assigned.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {grade.classes.map((classe) => (
                <span
                  key={classe.id}
                  className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  {classe.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Subjects */}
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Subjects
          </p>
          {grade.subjects.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">
              No subjects assigned.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {grade.subjects.length > 3 ? (
                <>
                  {grade.subjects.slice(0, 3).map((subject) => (
                    <span
                      key={subject.id}
                      className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                    >
                      {subject.name}
                      {subject.code ? ` (${subject.code})` : ''}
                    </span>
                  ))}
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    +{grade.subjects.length - 3} more
                  </span>
                </>
              ) : (
                grade.subjects.map((subject) => (
                  <span
                    key={subject.id}
                    className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                  >
                    {subject.name}
                    {subject.code ? ` (${subject.code})` : ''}
                  </span>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function GradesCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mb-5 flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-11 w-11 rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-14 rounded-full" />
                <Skeleton className="h-6 w-18 rounded-full" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
