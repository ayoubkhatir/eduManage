import { createFileRoute, Link } from '@tanstack/react-router'
import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { Skeleton } from 'boneyard-js/react'
import { useEffect, useMemo, useState } from 'react'
import {
  createAssessmentServerFn,
  getAssessmentMarksServerFn,
  getTeacherClassMarksPageServerFn,
  saveStudentMarksServerFn,
} from '@/server/modules/marks/marks.server-functions'
import { AssessmentTypeEnum, StatusEnum } from '#/server/db/schema'
import { motion } from 'framer-motion'

type AssessmentMarksData = {
  assessment: {
    id: string
    title: string
    type: string
    maxScore: number
    weight: number
    classId: string
    subjectId: string
    status: string
  }
  entries: Array<{
    studentId: string
    name: string
    email: string
    image: string | null
    markId: string | null
    score: number | null
    absent: boolean
    excused: boolean
    comment: string | null
    updatedAt: string | null
  }>
  summary: {
    totalStudents: number
    enteredMarks: number
  }
}

const getMarksPageQueryOptions = (input: {
  classId: string
  teacherId: string
  schoolId: string
  subjectId?: string
  periodId?: string
}) =>
  queryOptions({
    queryKey: ['teacher-class-marks-page', input],
    queryFn: async () => {
      const res = await getTeacherClassMarksPageServerFn({ data: input })
      if (!res.success) {
        throw new Error('Failed to fetch marks page')
      }
      return res.data
    },
    placeholderData: keepPreviousData,
  })

const getAssessmentMarksQueryOptions = (assessmentId?: string) =>
  queryOptions({
    queryKey: ['assessment-marks', assessmentId],
    enabled: !!assessmentId,
    queryFn: async () => {
      if (!assessmentId) throw new Error('Missing assessment id')
      const res = await getAssessmentMarksServerFn({
        data: { assessmentId },
      })
      if (!res.success) {
        throw new Error('Failed to fetch assessment marks')
      }
      return res.data as AssessmentMarksData
    },
  })

export const Route = createFileRoute('/_auth/teacher/marks/$classId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { classId } = Route.useParams()
  const queryClient = useQueryClient()

  // Replace these with auth/session values
  const teacherId = 'cjeqi4oqhvn5'
  const schoolId = 'r0akyppqt5jl'

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('')
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('')
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('')

  const [newAssessment, setNewAssessment] = useState({
    title: '',
    type: 'Test',
    maxScore: 20,
    weight: 1,
    assessmentDate: '',
    notes: '',
  })

  const marksPageQuery = useQuery(
    getMarksPageQueryOptions({
      classId,
      teacherId,
      schoolId,
      subjectId: selectedSubjectId || undefined,
      periodId: selectedPeriodId || undefined,
    }),
  )

  const pageData = marksPageQuery.data
  const assignments = pageData?.teacherAssignments ?? []
  const assessments = pageData?.assessments ?? []
  const classInfo = pageData?.class
  const students = pageData?.students ?? []

  useEffect(() => {
    if (!selectedSubjectId && assignments.length > 0) {
      setSelectedSubjectId(assignments[0]!.subjectId)
    }
  }, [assignments, selectedSubjectId])

  useEffect(() => {
    if (assessments.length > 0) {
      setSelectedAssessmentId((prev) =>
        prev && assessments.some((a) => a.id === prev)
          ? prev
          : assessments[0]!.id,
      )
    } else {
      setSelectedAssessmentId('')
    }
  }, [assessments])

  const assessmentMarksQuery = useQuery(
    getAssessmentMarksQueryOptions(selectedAssessmentId || undefined),
  )

  const [draftMarks, setDraftMarks] = useState<
    Record<
      string,
      {
        score: string
        absent: boolean
        excused: boolean
        comment: string
      }
    >
  >({})

  useEffect(() => {
    const entries = assessmentMarksQuery.data?.entries ?? []
    const next: Record<
      string,
      {
        score: string
        absent: boolean
        excused: boolean
        comment: string
      }
    > = {}

    for (const entry of entries) {
      next[entry.studentId] = {
        score: entry.score == null ? '' : String(entry.score),
        absent: entry.absent,
        excused: entry.excused,
        comment: entry.comment ?? '',
      }
    }

    setDraftMarks(next)
  }, [assessmentMarksQuery.data])

  const selectedAssignment = useMemo(
    () => assignments.find((a) => a.subjectId === selectedSubjectId),
    [assignments, selectedSubjectId],
  )

  const createAssessmentMutation = useMutation({
    mutationFn: async () => {
      const res = await createAssessmentServerFn({
        data: {
          schoolId,
          classId,
          subjectId: selectedSubjectId,
          teacherAssignmentId: selectedAssignment?.assignmentId,
          periodId: selectedPeriodId || undefined,
          title: newAssessment.title,
          type: newAssessment.type as unknown as AssessmentTypeEnum,
          maxScore: Number(newAssessment.maxScore),
          weight: Number(newAssessment.weight),
          assessmentDate: newAssessment.assessmentDate
            ? new Date(newAssessment.assessmentDate).toISOString()
            : undefined,
          notes: newAssessment.notes || undefined,
          status: StatusEnum.ACTIVE,
        },
      })

      if (!res.success) {
        throw new Error('Failed to create assessment')
      }

      return res.data
    },
    onSuccess: async (created) => {
      await queryClient.invalidateQueries({
        queryKey: ['teacher-class-marks-page'],
      })
      setSelectedAssessmentId(created.id)
      setNewAssessment({
        title: '',
        type: 'Test',
        maxScore: 20,
        weight: 1,
        assessmentDate: '',
        notes: '',
      })
    },
  })

  const saveMarksMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAssessmentId) {
        throw new Error('Choose an assessment first')
      }

      const res = await saveStudentMarksServerFn({
        data: {
          schoolId,
          assessmentId: selectedAssessmentId,
          marks: students.map((student) => {
            const draft = draftMarks[student.studentId] ?? {
              score: '',
              absent: false,
              excused: false,
              comment: '',
            }

            return {
              studentId: student.studentId,
              score: draft.score.trim() === '' ? null : Number(draft.score),
              absent: draft.absent,
              excused: draft.excused,
              comment: draft.comment.trim() === '' ? null : draft.comment,
            }
          }),
        },
      })

      if (!res.success) {
        throw new Error('Failed to save marks')
      }

      return res.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['assessment-marks', selectedAssessmentId],
      })
    },
  })

  const maxScore = assessmentMarksQuery.data?.assessment.maxScore ?? 20

  return (
    <motion.main initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="flex-1 min-w-0 ">
      <div className="px-6 py-6 space-y-6">
        <div className="flex flex-col gap-3">
          <Link
            to="/teacher/classes/$classId"
            params={{ classId }}
            className="text-sm font-medium text-primary hover:underline w-fit"
          >
            ← Back to class
          </Link>

          <div className="rounded-2xl border border-border dark:border-border bg-card dark:bg-card p-6">
            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Marks Management
                </p>
                <h1 className="text-3xl font-bold tracking-tight text-foreground dark:text-white mt-1">
                  {classInfo
                    ? `${classInfo.gradeName} - Class ${classInfo.className}`
                    : 'Class Gradebook'}
                </h1>
                <p className="text-muted-foreground mt-2">
                  Create assessments and record marks for students in this
                  class.
                </p>
              </div>

              <div className="text-sm text-muted-foreground">
                {assessmentMarksQuery.data?.assessment ? (
                  <div className="rounded-xl bg-muted dark:bg-card/40 px-4 py-3">
                    <div className="font-medium text-foreground dark:text-white">
                      {assessmentMarksQuery.data.assessment.title}
                    </div>
                    <div className="mt-1">
                      Max score: {assessmentMarksQuery.data.assessment.maxScore}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <Skeleton
          loading={marksPageQuery.isLoading && !pageData}
          name="marks-page"
        >
          {marksPageQuery.isError ? (
            <ErrorCard
              title="Failed to load marks page"
              description="Could not load class subjects, assessments, or students."
              onRetry={() => marksPageQuery.refetch()}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <SummaryCard
                  title="Students"
                  value={pageData?.summary.totalStudents ?? 0}
                  icon="groups"
                />
                <SummaryCard
                  title="Subjects"
                  value={pageData?.summary.totalSubjects ?? 0}
                  icon="menu_book"
                />
                <SummaryCard
                  title="Assessments"
                  value={pageData?.summary.totalAssessments ?? 0}
                  icon="assignment"
                />
                <SummaryCard
                  title="Entered Marks"
                  value={assessmentMarksQuery.data?.summary.enteredMarks ?? 0}
                  icon="grading"
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <section className="xl:col-span-2 space-y-6">
                  <div className="rounded-2xl border border-border dark:border-border bg-card dark:bg-card p-5">
                    <h2 className="text-lg font-semibold text-foreground dark:text-white">
                      Assessment Setup
                    </h2>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Field label="Subject">
                        <select
                          value={selectedSubjectId}
                          onChange={(e) => setSelectedSubjectId(e.target.value)}
                          className="w-full rounded-lg border border-border bg-transparent px-3 py-2"
                        >
                          {assignments.map((assignment) => (
                            <option
                              key={assignment.assignmentId}
                              value={assignment.subjectId}
                            >
                              {assignment.subjectName}
                              {assignment.subjectCode
                                ? ` (${assignment.subjectCode})`
                                : ''}
                            </option>
                          ))}
                        </select>
                      </Field>

                      <Field label="Period">
                        <select
                          value={selectedPeriodId}
                          onChange={(e) => setSelectedPeriodId(e.target.value)}
                          className="w-full rounded-lg border border-border bg-transparent px-3 py-2"
                        >
                          <option value="">All periods</option>
                          {(pageData?.periods ?? []).map((period) => (
                            <option key={period.id} value={period.id}>
                              {period.name}
                            </option>
                          ))}
                        </select>
                      </Field>

                      <Field label="Assessment">
                        <select
                          value={selectedAssessmentId}
                          onChange={(e) =>
                            setSelectedAssessmentId(e.target.value)
                          }
                          className="w-full rounded-lg border border-border bg-transparent px-3 py-2"
                        >
                          <option value="">Select assessment</option>
                          {assessments.map((assessment) => (
                            <option key={assessment.id} value={assessment.id}>
                              {assessment.title} - {assessment.type}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border dark:border-border bg-card dark:bg-card p-5">
                    <h2 className="text-lg font-semibold text-foreground dark:text-white">
                      Create New Assessment
                    </h2>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                      <Field label="Title">
                        <input
                          value={newAssessment.title}
                          onChange={(e) =>
                            setNewAssessment((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-border bg-transparent px-3 py-2"
                          placeholder="Math Test 1"
                        />
                      </Field>

                      <Field label="Type">
                        <select
                          value={newAssessment.type}
                          onChange={(e) =>
                            setNewAssessment((prev) => ({
                              ...prev,
                              type: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-border bg-transparent px-3 py-2"
                        >
                          <option value="Homework">Homework</option>
                          <option value="Quiz">Quiz</option>
                          <option value="Test">Test</option>
                          <option value="Exam">Exam</option>
                          <option value="Project">Project</option>
                          <option value="Participation">Participation</option>
                        </select>
                      </Field>

                      <Field label="Max Score">
                        <input
                          type="number"
                          min={1}
                          value={newAssessment.maxScore}
                          onChange={(e) =>
                            setNewAssessment((prev) => ({
                              ...prev,
                              maxScore: Number(e.target.value),
                            }))
                          }
                          className="w-full rounded-lg border border-border bg-transparent px-3 py-2"
                        />
                      </Field>

                      <Field label="Weight">
                        <input
                          type="number"
                          min={1}
                          value={newAssessment.weight}
                          onChange={(e) =>
                            setNewAssessment((prev) => ({
                              ...prev,
                              weight: Number(e.target.value),
                            }))
                          }
                          className="w-full rounded-lg border border-border bg-transparent px-3 py-2"
                        />
                      </Field>

                      <Field label="Date">
                        <input
                          type="date"
                          value={newAssessment.assessmentDate}
                          onChange={(e) =>
                            setNewAssessment((prev) => ({
                              ...prev,
                              assessmentDate: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-border bg-transparent px-3 py-2"
                        />
                      </Field>

                      <Field
                        label="Notes"
                        className="md:col-span-2 xl:col-span-3"
                      >
                        <input
                          value={newAssessment.notes}
                          onChange={(e) =>
                            setNewAssessment((prev) => ({
                              ...prev,
                              notes: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-border bg-transparent px-3 py-2"
                          placeholder="Optional notes"
                        />
                      </Field>
                    </div>

                    <div className="mt-5 flex justify-end">
                      <button
                        onClick={() => createAssessmentMutation.mutate()}
                        disabled={
                          !selectedSubjectId ||
                          !newAssessment.title.trim() ||
                          createAssessmentMutation.isPending
                        }
                        className="cursor-pointer rounded-lg bg-primary px-5 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
                      >
                        {createAssessmentMutation.isPending
                          ? 'Creating...'
                          : 'Create Assessment'}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border dark:border-border bg-card dark:bg-card overflow-hidden">
                    <div className="px-5 py-4 border-b border-border">
                      <h2 className="text-lg font-semibold text-foreground dark:text-white">
                        Student Marks
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Enter scores out of {maxScore}. Mark students absent
                        where needed.
                      </p>
                    </div>

                    {!selectedAssessmentId ? (
                      <div className="p-8">
                        <EmptyState
                          title="Choose or create an assessment"
                          description="Select an existing assessment or create a new one before entering marks."
                          icon="assignment"
                        />
                      </div>
                    ) : assessmentMarksQuery.isLoading ? (
                      <div className="p-8">
                        <Skeleton loading name="assessment-marks-table">
                          <div className="h-40" />
                        </Skeleton>
                      </div>
                    ) : assessmentMarksQuery.isError ? (
                      <div className="p-6">
                        <ErrorCard
                          title="Failed to load marks"
                          description="Could not load current marks for this assessment."
                          onRetry={() => assessmentMarksQuery.refetch()}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-muted dark:bg-card/40">
                              <tr className="text-left">
                                <th className="px-4 py-3 font-semibold">
                                  Student
                                </th>
                                <th className="px-4 py-3 font-semibold">
                                  Score
                                </th>
                                <th className="px-4 py-3 font-semibold">
                                  Absent
                                </th>
                                <th className="px-4 py-3 font-semibold">
                                  Excused
                                </th>
                                <th className="px-4 py-3 font-semibold">
                                  Comment
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {assessmentMarksQuery.data?.entries.map(
                                (entry) => {
                                  const draft = draftMarks[entry.studentId] ?? {
                                    score: '',
                                    absent: false,
                                    excused: false,
                                    comment: '',
                                  }

                                  return (
                                    <tr
                                      key={entry.studentId}
                                      className="border-t border-border"
                                    >
                                      <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                          {entry.image ? (
                                            <img
                                              src={entry.image}
                                              alt={entry.name}
                                              className="h-9 w-9 rounded-full object-cover"
                                            />
                                          ) : (
                                            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                                              {entry.name
                                                .slice(0, 1)
                                                .toUpperCase()}
                                            </div>
                                          )}
                                          <div>
                                            <div className="font-medium text-foreground dark:text-white">
                                              {entry.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                              {entry.email}
                                            </div>
                                          </div>
                                        </div>
                                      </td>

                                      <td className="px-4 py-3">
                                        <input
                                          type="number"
                                          min={0}
                                          max={maxScore}
                                          value={draft.score}
                                          disabled={draft.absent}
                                          onChange={(e) =>
                                            setDraftMarks((prev) => ({
                                              ...prev,
                                              [entry.studentId]: {
                                                ...draft,
                                                score: e.target.value,
                                              },
                                            }))
                                          }
                                          className="w-24 rounded-lg border border-border bg-transparent px-3 py-2 disabled:opacity-50"
                                        />
                                      </td>

                                      <td className="px-4 py-3">
                                        <input
                                          type="checkbox"
                                          checked={draft.absent}
                                          onChange={(e) =>
                                            setDraftMarks((prev) => ({
                                              ...prev,
                                              [entry.studentId]: {
                                                ...draft,
                                                absent: e.target.checked,
                                                score: e.target.checked
                                                  ? ''
                                                  : draft.score,
                                              },
                                            }))
                                          }
                                        />
                                      </td>

                                      <td className="px-4 py-3">
                                        <input
                                          type="checkbox"
                                          checked={draft.excused}
                                          onChange={(e) =>
                                            setDraftMarks((prev) => ({
                                              ...prev,
                                              [entry.studentId]: {
                                                ...draft,
                                                excused: e.target.checked,
                                              },
                                            }))
                                          }
                                        />
                                      </td>

                                      <td className="px-4 py-3">
                                        <input
                                          value={draft.comment}
                                          onChange={(e) =>
                                            setDraftMarks((prev) => ({
                                              ...prev,
                                              [entry.studentId]: {
                                                ...draft,
                                                comment: e.target.value,
                                              },
                                            }))
                                          }
                                          className="w-full rounded-lg border border-border bg-transparent px-3 py-2"
                                          placeholder="Optional comment"
                                        />
                                      </td>
                                    </tr>
                                  )
                                },
                              )}
                            </tbody>
                          </table>
                        </div>

                        <div className="flex justify-end px-5 py-4 border-t border-border">
                          <button
                            onClick={() => saveMarksMutation.mutate()}
                            disabled={saveMarksMutation.isPending}
                            className="cursor-pointer rounded-lg bg-primary px-5 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
                          >
                            {saveMarksMutation.isPending
                              ? 'Saving...'
                              : 'Save Marks'}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </section>

                <aside className="space-y-6">
                  <div className="rounded-2xl border border-border dark:border-border bg-card dark:bg-card p-5">
                    <h3 className="font-semibold text-foreground dark:text-white">
                      Current Selection
                    </h3>

                    <div className="mt-4 space-y-3 text-sm">
                      <InfoRow
                        label="Grade"
                        value={classInfo?.gradeName ?? '—'}
                      />
                      <InfoRow
                        label="Class"
                        value={classInfo?.className ?? '—'}
                      />
                      <InfoRow
                        label="Subject"
                        value={
                          assignments.find(
                            (a) => a.subjectId === selectedSubjectId,
                          )?.subjectName ?? '—'
                        }
                      />
                      <InfoRow
                        label="Assessment"
                        value={
                          assessments.find((a) => a.id === selectedAssessmentId)
                            ?.title ?? '—'
                        }
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border dark:border-border bg-card dark:bg-card p-5">
                    <h3 className="font-semibold text-foreground dark:text-white">
                      Tips
                    </h3>
                    <ul className="mt-3 text-sm text-muted-foreground space-y-2">
                      <li>
                        Use one assessment per test, quiz, exam, or homework.
                      </li>
                      <li>
                        Absent students should not receive a numeric score.
                      </li>
                      <li>Weights help with future average calculations.</li>
                    </ul>
                  </div>
                </aside>
              </div>
            </>
          )}
        </Skeleton>
      </div>
    </motion.main>
  )
}

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-foreground dark:text-slate-300 mb-2">
        {label}
      </label>
      {children}
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
    <div className="rounded-2xl border border-border dark:border-border bg-card dark:bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold text-foreground dark:text-white mt-1">
            {value}
          </h3>
        </div>
        <span className="material-symbols-outlined text-primary">{icon}</span>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground dark:text-white text-right">
        {value}
      </span>
    </div>
  )
}

function ErrorCard({
  title,
  description,
  onRetry,
}: {
  title: string
  description: string
  onRetry: () => void
}) {
  return (
    <div className="rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 p-6">
      <h3 className="font-semibold text-red-700 dark:text-red-300">{title}</h3>
      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
        {description}
      </p>
      <button
        onClick={onRetry}
        className="cursor-pointer mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
      >
        Try again
      </button>
    </div>
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
      <span className="material-symbols-outlined text-4xl text-muted-foreground">
        {icon}
      </span>
      <h4 className="mt-3 font-semibold text-foreground dark:text-white">
        {title}
      </h4>
      <p className="mt-1 text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
