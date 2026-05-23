import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { zodValidator } from '@tanstack/zod-adapter'
import { CustomPagination } from '@/components/admin/PaginationComp'
import { SearchInput } from '@/components/admin/SearchInput'
import { SelectPageSize } from '@/components/admin/SelectPageSize'
import IndexPageComponent from '@/components/admin/IndexPageComponent'
import { studentSearchSchema } from '#/schemas/students.schema'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Suspense, useState } from 'react'
import { StudentsStatCards } from '#/components/admin/cards/UICard'
import {
  CustomDataTableSkeleton,
  StudentsTable,
} from '#/components/admin/Table/dataTable'
import { getAllGradesQueryOptions } from '#/hooks/grades/hooks'
import { getStudentsQueryOptions } from '#/server/db/repo'
import { motion } from 'framer-motion'

// type QueryOptionsType = Filters<StudentModel>

// const StudentSearchSchema = z.object({
//   search: fallback(z.string(), '').default(''),
//   email: fallback(z.string().email(), '').default(''),
//   status: fallback(z.string(), '').default(''),
//   grade: fallback(z.string(), '').default(''),
//   sortBy: fallback(z.enum(['name', 'email']), 'name').default('name'),
//   sortOrder: fallback(z.enum(['asc', 'desc']).nullable(), 'asc').default('asc'),
//   page: fallback(z.coerce.number().int().positive(), 1).default(1),
//   size: fallback(z.coerce.number().int().positive(), 10).default(10),
// })

export const Route = createFileRoute('/_auth/admin/students/')({
  component: RouteComponent,
  pendingComponent: OwnerStudentsPending,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    // // await new Promise((resolve) => setTimeout(resolve, 2000))
    context.queryClient.ensureQueryData(getAllGradesQueryOptions())
    context.queryClient.ensureQueryData(getStudentsQueryOptions(deps))
  },
  validateSearch: zodValidator(studentSearchSchema),
})

function RouteComponent() {
  return (
    <Skeleton name="admin-students-page" loading={false}>
      <OwnerStudentsContent />
    </Skeleton>
  )
}

function OwnerStudentsPending() {
  return (
    <Skeleton name="admin-students-page" loading>
      <OwnerStudentsContent />
    </Skeleton>
  )
}

function OwnerStudentsContent() {
  const navigate = Route.useNavigate()

  const { size, search } = Route.useSearch({
    select: (s) => ({
      size: s.size,
      search: s.search,
    }),
  })

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="flex-1 w-full overflow-x-auto flex flex-col gap-6">
      <IndexPageComponent role="Student">
        <StudentsStatCards />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[20px] pointer-events-none">
              search
            </span>
            <SearchInput
              placeholder="Search by email or name"
              value={search}
              onSearch={(value) =>
                navigate({
                  search: (s) => ({
                    ...s,
                    search: value,
                  }),
                })
              }
            />
          </div>
          <div className="flex items-center gap-3">
            <SelectPageSize
              value={size}
              onChange={(value) =>
                navigate({
                  search: (s) => ({
                    ...s,
                    size: value,
                  }),
                })
              }
            />
            <GradesFilter />
          </div>
        </div>

        <Suspense fallback={<CustomDataTableSkeleton rows={size} cols={6} />}>
          <MainPageContent />
        </Suspense>
      </IndexPageComponent>
    </motion.div>
  )
}

function GradesFilter() {
  const navigate = Route.useNavigate()
  const { data: gradesData, status: fetchStatus } = useQuery(
    getAllGradesQueryOptions(),
  )
  const [open, setOpen] = useState(false)
  if (fetchStatus === 'error') return null
  if (fetchStatus === 'pending')
    return (
      <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
        <span className="material-symbols-outlined text-[18px] text-muted-foreground animate-pulse">
          school
        </span>
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    )
  const gradeOptions = [
    // { label: 'All', value: null },
    ...gradesData.map((g) => ({ label: g.name, value: g.id })),
  ]
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
      <span className="material-symbols-outlined text-[18px] text-muted-foreground">
        school
      </span>
      <Select
        open={open}
        onOpenChange={setOpen}
        defaultValue={''}
        onValueChange={(v) =>
          navigate({ to: '.', search: (s) => ({ ...s, grade: v }) })
        }
      >
        <SelectTrigger className="w-28 border-0 bg-transparent p-0 text-sm font-medium text-muted-foreground shadow-none focus:ring-0 hover:text-foreground">
          <SelectValue placeholder="Grade" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          <SelectItem value={null as any}>All</SelectItem>
          {gradeOptions?.map((option) => (
            <SelectItem
              key={option.value ?? option.label}
              value={option.value}
              className="focus:bg-accent"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function MainPageContent() {
  const { size, page, search, sortBy, sortOrder } = Route.useSearch({
    select: (s) => ({
      size: s.size,
      page: s.page,
      search: s.search,
      sortBy: s.sortBy,
      sortOrder: s.sortOrder,
    }),
  })
  const { data: studentsData, status: fetchStatus } = useSuspenseQuery({
    ...getStudentsQueryOptions({
      size,
      page,
      search,
      sortBy,
      sortOrder,
    }),
    // placeholderData: keepPreviousData,
  })
  const navigate = Route.useNavigate()

  return (
    <>
      {fetchStatus === 'error' ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="material-symbols-outlined text-5xl text-red-400 mb-3">
            error_outline
          </span>
          <p className="text-lg font-medium text-foreground">
            Failed to load students
          </p>
          <p className="text-sm text-muted-foreground">
            Please try again later
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <StudentsTable data={studentsData.data} />
          </div>
          <div className="flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              Showing{' '}
              <span className="font-medium text-foreground">
                {size > studentsData.pagination.totalCount
                  ? studentsData.pagination.totalCount
                  : size}
              </span>{' '}
              of{' '}
              <span className="font-medium text-foreground">
                {studentsData.pagination.totalCount}
              </span>
            </p>
            <CustomPagination
              currentPage={page}
              totalPages={studentsData.pagination.totalPages}
              onPageChange={(p) =>
                navigate({
                  search: (s) => ({ ...s, page: p }),
                })
              }
            />
          </div>
        </div>
      )}
    </>
  )
}
