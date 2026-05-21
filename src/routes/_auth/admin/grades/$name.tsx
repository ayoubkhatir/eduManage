import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '#/components/ui/skeleton'
import { getAllGradesWithClassesAndSubjectsQueryOptions } from '#/hooks/grades/hooks'
import { AddClassDialog } from '../teachers/$teacherId/-add-class.form-dialog'
import { AddSubjectDialog } from '../teachers/$teacherId/-add-subject.form'
import { FetchCurrentUserServerFn } from '#/routes/-fetchAuthStateInBeforeLoad'
import type { AdminUser } from '#/types/usersTypes'
// import { useAuth } from '#/store/auth_store'

export const Route = createFileRoute('/_auth/admin/grades/$name')({
  component: RouteComponent,
  pendingComponent: () => <GradeDetailsSkeleton />,
  loader: async ({ context, params }) => {
    const grades = await context.queryClient.ensureQueryData({
      ...getAllGradesWithClassesAndSubjectsQueryOptions(),
    })

    const grade = grades.find(
      (item) =>
        normalizeGradeName(item.name) === normalizeGradeName(params.name),
    )

    if (!grade) {
      throw notFound()
    }

    const currentUser = await FetchCurrentUserServerFn({
      data: context.authState.user!,
    }) as AdminUser
    return { currentUser }
  },
})

function RouteComponent() {
  const { currentUser } = Route.useLoaderData()
  const adminId = currentUser.info.id

  const { name } = Route.useParams()
  // const user = useAuth((s)=>s.user)
  const { data: grades } = useSuspenseQuery({
    ...getAllGradesWithClassesAndSubjectsQueryOptions(),
  })

  const grade = grades.find(
    (item) => normalizeGradeName(item.name) === normalizeGradeName(name),
  )

  if (!grade) {
    return (
      <div className="flex h-full w-full overflow-y-hidden">
        <main className="flex flex-1 flex-col bg-background-light dark:bg-background-dark">
          <div className="flex-1 overflow-x-hidden p-6">
            <div className="mx-auto flex max-w-7xl flex-col gap-6">
              <Link
                to="/admin/grades"
                className="w-fit text-sm font-medium text-primary hover:underline"
              >
                ← Back to grades
              </Link>

              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Grade not found
                </h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  We couldn&apos;t find a grade matching “{name}”.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const isActive = grade.status === 'Active'

  return (
    <div className="flex h-full w-full overflow-y-hidden">
      <main className="flex flex-1 flex-col bg-background-light dark:bg-background-dark">
        <div className="flex-1 overflow-x-hidden p-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            <Link
              to="/admin/grades"
              className="w-fit text-sm font-medium text-primary hover:underline"
            >
              ← Back to grades
            </Link>

            <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
                      {grade.name}
                    </h1>
                    <Badge
                      variant="secondary"
                      className={
                        isActive
                          ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }
                    >
                      {grade.status}
                    </Badge>
                  </div>

                  <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400 md:text-base">
                    Overview of classes and subjects assigned to this grade.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <StatPill
                      label="Level Order"
                      value={`#${grade.levelOrder}`}
                    />
                    <StatPill
                      label="Classes"
                      value={String(grade.classes.length)}
                    />
                    <StatPill
                      label="Subjects"
                      value={String(grade.subjects.length)}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2 space-y-6">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        Classes
                      </h2>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        All classes currently linked to this grade.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {grade.classes.length} total
                      </div>
                      <AddClassDialog
                        defaultGradeId={grade.id}
                        lockGradeSelection
                        triggerTitle="Add class"
                        buttonSize="sm"
                      />
                    </div>
                  </div>

                  {grade.classes.length === 0 ? (
                    <EmptyBlock message="No classes assigned to this grade yet." />
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {grade.classes.map((classe) => (
                        <div
                          key={classe.id}
                          className="rounded-2xl border border-slate-200/80 bg-slate-50 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-700"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Class {classe.name}
                              </h3>
                              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Belongs to grade {grade.name}
                              </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                              <span className="material-symbols-outlined">
                                groups
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        Subjects
                      </h2>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Curriculum subjects available in this grade.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                        {grade.subjects.length} total
                      </div>
                      <AddSubjectDialog
                        schoolId={adminId}
                        defaultGradeIds={[grade.id]}
                        lockGradeSelection
                        triggerTitle="Add subject"
                      />
                    </div>{' '}
                  </div>

                  {grade.subjects.length === 0 ? (
                    <EmptyBlock message="No subjects assigned to this grade yet." />
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {grade.subjects.map((subject) => (
                        <div
                          key={subject.id}
                          className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm dark:border-blue-500/10 dark:bg-blue-500/5"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                {subject.name}
                              </h3>
                              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                {subject.code
                                  ? `Code: ${subject.code}`
                                  : 'No code'}
                              </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm dark:bg-slate-900 dark:text-blue-400">
                              <span className="material-symbols-outlined">
                                menu_book
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <aside className="space-y-6">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Quick Summary
                  </h2>

                  <div className="mt-5 space-y-4">
                    <SummaryRow label="Grade Name" value={grade.name} />
                    <SummaryRow
                      label="Status"
                      value={grade.status}
                      valueClassName={
                        isActive
                          ? 'text-green-700 dark:text-green-400'
                          : 'text-slate-700 dark:text-slate-300'
                      }
                    />
                    <SummaryRow
                      label="Level Order"
                      value={`#${grade.levelOrder}`}
                    />
                    <SummaryRow
                      label="Total Classes"
                      value={String(grade.classes.length)}
                    />
                    <SummaryRow
                      label="Total Subjects"
                      value={String(grade.subjects.length)}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Class Names
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {grade.classes.length === 0 ? (
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        No classes available.
                      </p>
                    ) : (
                      grade.classes.map((classe) => (
                        <span
                          key={classe.id}
                          className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {classe.name}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Subject Codes
                  </h2>

                  <div className="mt-4 space-y-2">
                    {grade.subjects.length === 0 ? (
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        No subjects available.
                      </p>
                    ) : (
                      grade.subjects.map((subject) => (
                        <div
                          key={subject.id}
                          className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60"
                        >
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {subject.name}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {subject.code ?? '—'}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </aside>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

function normalizeGradeName(value: string) {
  return decodeURIComponent(value).trim().toLowerCase()
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-100 px-4 py-3 dark:bg-slate-800/70">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  )
}

function SummaryRow({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span
        className={`text-sm font-semibold text-slate-900 dark:text-white ${valueClassName ?? ''}`}
      >
        {value}
      </span>
    </div>
  )
}

function EmptyBlock({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/40">
      <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  )
}

function GradeDetailsSkeleton() {
  return (
    <div className="flex h-full w-full overflow-y-hidden">
      <main className="flex flex-1 flex-col bg-background-light dark:bg-background-dark">
        <div className="flex-1 overflow-x-hidden p-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            <Skeleton className="h-5 w-32" />

            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <Skeleton className="h-10 w-48" />
                  <Skeleton className="h-5 w-72" />
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Skeleton className="h-14 w-28 rounded-xl" />
                    <Skeleton className="h-14 w-24 rounded-xl" />
                    <Skeleton className="h-14 w-24 rounded-xl" />
                  </div>
                </div>
                <Skeleton className="h-16 w-16 rounded-2xl" />
              </div>
            </div>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2 space-y-6">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-7 w-28" />
                      <Skeleton className="h-4 w-52" />
                    </div>
                    <Skeleton className="h-10 w-20 rounded-xl" />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-28 rounded-2xl" />
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-7 w-32" />
                      <Skeleton className="h-4 w-56" />
                    </div>
                    <Skeleton className="h-10 w-20 rounded-xl" />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-28 rounded-2xl" />
                    ))}
                  </div>
                </div>
              </div>

              <aside className="space-y-6">
                <Skeleton className="h-72 rounded-2xl" />
                <Skeleton className="h-44 rounded-2xl" />
                <Skeleton className="h-56 rounded-2xl" />
              </aside>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
