import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FetchCurrentUserServerFn } from '#/routes/-fetchAuthStateInBeforeLoad'
import type { StudentUser } from '#/types/studentTypes'
import { getStudentSubjectAssessmentsQueryOptions } from '#/hooks/student/hooks'
import { Skeleton } from 'boneyard-js/react'

export const Route = createFileRoute(
  '/_auth/student/subjects/$subjectCode/assessments',
)({
  component: StudentAssessmentsPage,
  pendingComponent: StudentAssessmentsPending,
  loader: async ({ context }) => {
    const currentUser = (await FetchCurrentUserServerFn({
      data: context.authState.user!,
    })) as StudentUser

    if (!currentUser) throw new Error('Unauthorized')

    return { currentUser }
  },
  staticData: {
    breadcrumb: [
      'Assessments',
      (match) =>
        (match.loaderData as { subject?: { name: string } })?.subject?.name ??
        `Assessments`,
    ],
  },
})

function StudentAssessmentsPending() {
  return (
    <Skeleton name="student-assessments-page" loading>
      <StudentAssessmentsContent />
    </Skeleton>
  )
}

function StudentAssessmentsPage() {
  return (
    <Skeleton name="student-assessments-page" loading={false}>
      <StudentAssessmentsContent />
    </Skeleton>
  )
}

const typeIcons: Record<string, string> = {
  Homework: 'assignment',
  Quiz: 'quiz',
  Test: 'fact_check',
  Exam: 'description',
  Project: 'folder',
  Participation: 'groups',
}

const typeStyles: Record<string, string> = {
  Homework: 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800',
  Quiz: 'bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-800',
  Test: 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800',
  Exam: 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800',
  Project: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800',
  Participation:
    'bg-teal-50 border-teal-200 dark:bg-teal-950/20 dark:border-teal-800',
}

const typeBadge: Record<string, string> = {
  Homework: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Quiz: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Test: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Exam: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  Project:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Participation:
    'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
}

function StudentAssessmentsContent() {
  const { subjectCode } = Route.useParams()
  const { currentUser } = Route.useLoaderData()

  const { data, status } = useQuery({
    ...getStudentSubjectAssessmentsQueryOptions({
      classId: currentUser.info.classId,
      subjectCode,
      studentId: currentUser.info.id,
      schoolId: currentUser.info.schoolId,
    }),
  })

  const assessments = data?.assessments ?? []
  const subject = data?.subject

  const totalScore = assessments.reduce(
    (sum: number, a: { score?: number | null; weight: number }) =>
      sum + (a.score ?? 0) * a.weight,
    0,
  )
  const totalMax = assessments.reduce(
    (sum: number, a: { maxScore: number; weight: number }) =>
      sum + a.maxScore * a.weight,
    0,
  )
  const averagePercent =
    totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : null

  const gradedCount = assessments.filter(
    (a: { score: number | null; absent: boolean | null; excused: boolean | null }) =>
      a.score !== null || a.absent || a.excused,
  ).length
  const pendingCount = assessments.length - gradedCount

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {subject?.name ?? subjectCode}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {assessments.length} assessment{assessments.length !== 1 ? 's' : ''}{' '}
            &middot; {gradedCount} graded &middot; {pendingCount} pending
          </p>
        </div>

        {/* Stats cards */}
        {averagePercent !== null && (
          <div className="mb-8 grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Average
              </p>
              <p
                className={`mt-1 text-2xl font-black ${
                  averagePercent >= 70
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : averagePercent >= 50
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-red-600 dark:text-red-400'
                }`}
              >
                {averagePercent}%
              </p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${
                    averagePercent >= 70
                      ? 'bg-emerald-500'
                      : averagePercent >= 50
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(averagePercent, 100)}%` }}
                />
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Graded
              </p>
              <p className="mt-1 text-2xl font-black text-foreground">
                {gradedCount}
                <span className="text-sm font-semibold text-muted-foreground">
                  /{assessments.length}
                </span>
              </p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${
                      assessments.length > 0
                        ? (gradedCount / assessments.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Score
              </p>
              <p className="mt-1 text-2xl font-black text-foreground">
                {totalScore.toFixed(0)}
                <span className="text-sm font-semibold text-muted-foreground">
                  /{totalMax.toFixed(0)}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Content */}
        {status === 'pending' ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                  </div>
                  <div className="h-10 w-14 animate-pulse rounded-lg bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : status === 'error' ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 p-16 text-center dark:border-red-900/50 dark:bg-red-950/10">
            <span className="material-symbols-outlined text-5xl text-red-400">
              error
            </span>
            <p className="mt-4 text-sm font-medium text-red-600 dark:text-red-400">
              Failed to load assessments.
            </p>
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">
              Please try refreshing the page.
            </p>
          </div>
        ) : assessments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-16 text-center">
            <span className="material-symbols-outlined text-5xl text-muted-foreground">
              library_books
            </span>
            <p className="mt-4 text-sm font-medium text-muted-foreground">
              No assessments yet for this subject.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Assessments will appear here once your teacher creates them.
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            {assessments.map(
              (
                assessment: {
                  id: string
                  title: string
                  type: string
                  maxScore: number
                  weight: number
                  assessmentDate: Date | string | null
                  score: number | null
                  absent: boolean | null
                  excused: boolean | null
                  comment: string | null
                }) => {
                const hasMark =
                  assessment.score !== null ||
                  assessment.absent ||
                  assessment.excused
                const scorePercent =
                  assessment.maxScore > 0 && assessment.score !== null
                    ? Math.round(
                        (assessment.score / assessment.maxScore) * 100,
                      )
                    : null

                const isGraded =
                  assessment.score !== null
                    ? scorePercent !== null && scorePercent >= 70
                      ? 'high'
                      : scorePercent !== null && scorePercent >= 50
                        ? 'mid'
                        : 'low'
                    : assessment.absent || assessment.excused
                      ? 'none'
                      : 'ungraded'

                return (
                  <motion.div
                    key={assessment.id}
                    variants={itemVariants}
                    className={`rounded-xl border p-4 shadow-sm transition-all hover:shadow-md ${
                      hasMark
                        ? isGraded === 'high'
                          ? 'border-emerald-200 bg-card hover:border-emerald-300 dark:border-emerald-800 dark:hover:border-emerald-700'
                          : isGraded === 'mid'
                            ? 'border-amber-200 bg-card hover:border-amber-300 dark:border-amber-800 dark:hover:border-amber-700'
                            : isGraded === 'low'
                              ? 'border-red-200 bg-card hover:border-red-300 dark:border-red-800 dark:hover:border-red-700'
                              : 'border-border bg-card hover:border-sky-300 dark:hover:border-sky-700'
                        : 'border-border bg-card hover:border-muted-foreground/30'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Type icon */}
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-lg border ${
                          typeStyles[assessment.type] ??
                          'bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-700'
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-lg ${
                            typeBadge[assessment.type]?.split(' ')[1] ??
                            'text-slate-600'
                          }`}
                        >
                          {typeIcons[assessment.type] ?? 'assignment'}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                              typeBadge[assessment.type] ??
                              'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {assessment.type}
                          </span>
                          {assessment.absent && (
                            <span className="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
                              Absent
                            </span>
                          )}
                          {assessment.excused && (
                            <span className="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                              Excused
                            </span>
                          )}
                          {!hasMark && (
                            <span className="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                              Pending
                            </span>
                          )}
                        </div>
                        <h3 className="mt-1 font-bold text-foreground truncate">
                          {assessment.title}
                        </h3>
                        <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                          {assessment.assessmentDate && (
                            <span>
                              {new Date(
                                assessment.assessmentDate,
                              ).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          )}
                          <span>Weight: {assessment.weight}</span>
                          <span>Max: {assessment.maxScore}</span>
                        </div>

                        {assessment.comment && (
                          <p className="mt-1.5 text-xs italic text-muted-foreground/80 line-clamp-2">
                            &ldquo;{assessment.comment}&rdquo;
                          </p>
                        )}
                      </div>

                      {/* Score */}
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <div
                          className={`flex size-12 items-center justify-center rounded-xl font-bold text-base shadow-sm transition-all ${
                            isGraded === 'high'
                              ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-800'
                              : isGraded === 'mid'
                                ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-800'
                                : isGraded === 'low'
                                  ? 'bg-red-50 text-red-600 ring-1 ring-red-200 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-800'
                                  : isGraded === 'none'
                                    ? 'bg-slate-50 text-slate-400 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:ring-slate-700'
                                    : 'bg-muted text-muted-foreground ring-1 ring-border'
                          }`}
                        >
                          {hasMark
                            ? assessment.absent || assessment.excused
                              ? '—'
                              : assessment.score
                            : '?'}
                        </div>
                        {scorePercent !== null && (
                          <span
                            className={`text-[10px] font-semibold ${
                              scorePercent >= 70
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : scorePercent >= 50
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {scorePercent}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Score progress bar */}
                    {hasMark && !assessment.absent && !assessment.excused && scorePercent !== null && (
                      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all ${
                            scorePercent >= 70
                              ? 'bg-emerald-500'
                              : scorePercent >= 50
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(scorePercent, 100)}%` }}
                        />
                      </div>
                    )}
                  </motion.div>
                )
              },
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
