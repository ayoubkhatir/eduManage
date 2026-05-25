import { createFileRoute, notFound } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { useMemo, useRef } from 'react'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { MoreHorizontalIcon, Trash2Icon } from 'lucide-react'
import {
  getTeacherQueryOptions,
  useAssignTeacher,
  useDeleteTeacherAssignement,
} from '#/hooks/teachers/hooks'
import SelectWrapper from '#/components/admin/Wrappers/SelectWrapper'
import { FormProvider, useFormContext } from 'react-hook-form'
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import DataTable, {
  CustomDataTableSkeleton,
} from '#/components/admin/Table/dataTable'
import { getTeacherAssignmentsServerFn } from '#/server/modules/teachers/teachers.server-functions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '#/components/ui/alert-dialog'
import { Checkbox } from '#/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { Button } from '#/components/ui/button'
import { getAllGradesQueryOptions } from '#/hooks/grades/hooks'
import type { StatusEnum } from '#/server/db/schema'
import { UserAvatar } from '#/components/admin/Table/columnsData'
import { type AssignTeacherSchema } from '#/schemas/teachers.schema'
import { motion } from 'framer-motion'
import { getAllSchoolSubjectsServerFn } from '#/server/modules/subjects/subjects.server-functions'
import type { AdminUser } from '#/types/usersTypes'
import { FetchCurrentUserServerFn } from '#/routes/-fetchAuthStateInBeforeLoad'
import {
  StudentClassSelector,
  StudentGradeSelector,
} from '#/components/studentsSelectors'
import { AddSubjectDialog } from '#/routes/_auth/admin/teachers/$teacherId/AddSubjectDialog'

export const Route = createFileRoute(
  '/_auth/admin/teachers/$teacherId/assignements',
)({
  component: RouteComponent,
  pendingComponent: () => (
    <Skeleton name="admin-teacher-assignments-page" loading>
      <div className="flex h-full w-full" />
    </Skeleton>
  ),
  pendingMs: 0,
  pendingMinMs: 220,
  loader: async ({ context, params: { teacherId } }) => {
    const teacher = await context.queryClient.ensureQueryData({
      ...getTeacherQueryOptions({ fetchBy: 'teacherId', teacherId }),
    })

    const currentUser = (await FetchCurrentUserServerFn({
      data: context.authState.user!,
    })) as AdminUser

    if (!teacher) throw notFound()
    context.queryClient.ensureQueryData({ ...getAllGradesQueryOptions() })
    context.queryClient.ensureQueryData({
      ...getTeacherAssignementsQueryOptions(teacherId),
    })
    return { currentUser }
  },
})

function RouteComponent() {
  return (
    <Skeleton name="admin-teacher-assignments-page" loading={false}>
      <TeacherAssignmentsPage />
    </Skeleton>
  )
}

function TeacherAssignmentsPage() {
  const { teacherId } = Route.useParams()
  const { currentUser } = Route.useLoaderData()

  const { data: teacherData, status: fetchStatus } = useSuspenseQuery({
    ...getTeacherQueryOptions({ fetchBy: 'teacherId', teacherId: teacherId }),
  })

  const { form, onSubmit } = useAssignTeacher(teacherId, currentUser.id)
  console.log({ errors: form.formState.errors })

  if (fetchStatus === 'error' || !teacherData) throw notFound()
  const ref = useRef<HTMLFormElement | null>(null)
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full w-full"
    >
      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-background-light dark:bg-background-dark">
        <div className="flex-1 overflow-x-hidden p-8 pb-32">
          <div className="flex flex-col gap-6 pb-12">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold tracking-tight text-[#111318] dark:text-white md:text-4xl">
                Assign Teachers
              </h1>
              <p className="text-base text-[#616f89] dark:text-gray-400">
                Assign teachers to classes and subjects, and manage existing
                teaching assignments.
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#f0f2f4] bg-card shadow-sm dark:border-gray-800 dark:bg-surface-dark">
              <div className="border-b border-[#f0f2f4] p-8 dark:border-gray-800">
                <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-[#111318] dark:text-white">
                  <span className="material-symbols-outlined text-primary">
                    assignment_ind
                  </span>
                  New Assignment
                </h3>

                <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
                  <aside className="order-1 lg:order-2 lg:w-72">
                    <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#f0f2f4] bg-[#f8f9fc] p-6 dark:border-gray-800 dark:bg-[#151a25]">
                      <UserAvatar image={teacherData.image} size={28} />

                      <p className="text-center text-sm font-medium text-[#111318] dark:text-white">
                        {teacherData.name}
                      </p>
                    </div>
                  </aside>
                  <FormProvider {...form}>
                    <form
                      ref={ref}
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="order-2 flex flex-1 flex-col gap-6 lg:order-1"
                    >
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col gap-2.5">
                          <StudentGradeSelector />
                          <div className="flex items-start gap-1">
                            <SubjectsSelector schoolId={currentUser.info.id} />
                            <AddSubjectDialog
                              schoolId={currentUser.info.id}
                              onCreated={(subjectId) => {
                                form.setValue('subjectId', subjectId, {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                })
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2.5">
                          <StudentClassSelector
                            schoolId={currentUser.info.id}
                          />
                          <IsPrimaryTeacherCheckboxInput />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={form.formState.isSubmitting}
                          className="cursor-pointer inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                          onClick={form.handleSubmit(onSubmit)}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            add_task
                          </span>
                          {form.formState.isSubmitting
                            ? 'Assigning...'
                            : 'Create Assignment'}
                        </button>
                      </div>
                    </form>
                  </FormProvider>
                </div>
              </div>

              <CurrentAssignementsTableWrapper teacherName={teacherData.name} />
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  )
}
const getAllSubjectsQueryOptions = (schoolId: string) => ({
  queryKey: ['subjects'],
  queryFn: async () => {
    const response = await getAllSchoolSubjectsServerFn({ data: schoolId })
    if (response.success) return response.data
    else return []
  },
})

function SubjectsSelector({ schoolId }: { schoolId: string }) {
  const form = useFormContext<AssignTeacherSchema>()

  const { data: subjectsData, status: fetchStatus } = useSuspenseQuery({
    ...getAllSubjectsQueryOptions(schoolId),
  })

  const gradeId = form.watch('gradeId')
  const subjectOptions = useMemo(
    () =>
      subjectsData
        .filter((s) => s.grades.map((g) => g.id).includes(gradeId))
        .map((s) => ({ label: s.name, value: s.id })),
    [subjectsData, gradeId],
  )

  if (fetchStatus === 'error') return null

  return (
    <SelectWrapper
      form={form}
      name="subjectId"
      label="Subject"
      values={subjectOptions}
    />
  )
}

export type TeacherAssignmentRow = {
  id: string
  teacherId: string
  teacherName: string
  subjectId: string
  subjectName: string
  classId: string
  className: string
  gradeName: string
  isPrimaryTeacher: boolean
  status: StatusEnum
}

function getTeacherAssignmentColumns(
  onDelete: (id: string) => void,
): Array<ColumnDef<TeacherAssignmentRow>> {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      size: 5,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'subjectName',
      header: 'Subject',
      cell: ({ row }) => (
        <span className="font-medium text-foreground dark:text-white">
          {row.original.subjectName}
        </span>
      ),
    },
    {
      accessorKey: 'gradeName',
      header: 'Grade',
      cell: ({ row }) => (
        <span className="text-foreground dark:text-slate-300">
          {row.original.gradeName}
        </span>
      ),
    },
    {
      accessorKey: 'className',
      header: 'Class',
      cell: ({ row }) => (
        <span className="text-foreground dark:text-slate-300">
          {row.original.className}
        </span>
      ),
    },
    {
      accessorKey: 'isPrimaryTeacher',
      header: 'Type',
      cell: ({ row }) =>
        row.original.isPrimaryTeacher ? (
          <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
            Primary
          </span>
        ) : (
          <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground dark:bg-card dark:text-slate-300">
            Regular
          </span>
        ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status
        const bgColor =
          status === 'Active'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            : status === 'Inactive'
              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              : status === 'Pending'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'

        return (
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${bgColor}`}
          >
            {status}
          </span>
        )
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const assignment = row.original

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className=" h-8 w-8 p-0 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="min-w-44 bg-card dark:bg-card"
              >
                <DropdownMenuLabel className="text-foreground dark:text-white">
                  Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-black" />
                <DropdownMenuItem asChild>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <div className="flex items-center gap-2 cursor-pointer text-center text-red-600 dark:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-700 py-1.5 rounded-sm px-2">
                        <Trash2Icon size="18" />
                        <p className="text-sm">Delete Assignement</p>
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent size="sm">
                      <AlertDialogHeader>
                        <AlertDialogMedia className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400">
                          <Trash2Icon className="h-6 w-6" />
                        </AlertDialogMedia>
                        <AlertDialogTitle>Delete Assignement?</AlertDialogTitle>
                        <AlertDialogDescription className="text-foreground dark:text-slate-300">
                          This will permanently delete this assignement record.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter className="space-x-2">
                        <AlertDialogCancel
                          variant="outline"
                          className="cursor-pointer"
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="cursor-pointer bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500"
                          onClick={() => onDelete(assignment.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}

const getTeacherAssignementsQueryOptions = (teacherId: string) => ({
  queryKey: ['teachers', teacherId, 'assignements'],
  queryFn: async () => {
    const response = await getTeacherAssignmentsServerFn({ data: teacherId })
    if (response.success) return response.data
    throw new Error('Error occured during fetching teacher assignements')
  },
})

function CurrentAssignementsTableWrapper({
  teacherName,
}: {
  teacherName: string
}) {
  const { teacherId } = Route.useParams()
  const { data: teacherAssignments, status: fetchStatus } = useQuery({
    ...getTeacherAssignementsQueryOptions(teacherId),
  })

  if (fetchStatus === 'pending')
    return <CustomDataTableSkeleton cols={7} rows={6} />
  if (fetchStatus === 'error')
    return <p>Error occured when fetching teacher assignements</p>

  return (
    <CurrentAssignementsTable
      data={teacherAssignments}
      teacherName={teacherName}
    />
  )
}
function CurrentAssignementsTable({
  data,
  teacherName,
}: {
  data: Array<TeacherAssignmentRow>
  teacherName: string
}) {
  const { teacherId } = Route.useParams()

  const { mutate: onDelete } = useDeleteTeacherAssignement()

  const table = useReactTable({
    data,
    columns: getTeacherAssignmentColumns(onDelete),
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-[#111318] dark:text-white">
          <span className="material-symbols-outlined text-primary">
            list_alt
          </span>
          Current Assignments
        </h3>

        <div className="text-sm text-[#616f89] dark:text-gray-400">
          {teacherId
            ? `Showing assignments for ${teacherName}`
            : 'Showing all teacher assignments'}
        </div>
      </div>
      <DataTable table={table} />
    </div>
  )
}

function IsPrimaryTeacherCheckboxInput() {
  const form = useFormContext<AssignTeacherSchema>()
  const isPrimaryTeacher = form.watch('isPrimaryTeacher')
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#111318] dark:text-gray-200">
        Assignment Type
      </label>

      <div className="flex h-11 items-center rounded-xl bg-[#f0f2f4] px-4 dark:bg-gray-800">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={isPrimaryTeacher}
            onChange={(v) =>
              form.setValue('isPrimaryTeacher', v.target.checked)
            }
            className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm text-[#111318] dark:text-white">
            Primary teacher for this class
          </span>
        </label>
      </div>
    </div>
  )
}
