import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { zodValidator } from '@tanstack/zod-adapter'
import { CustomPagination } from '@/components/admin/PaginationComp'
import { SearchInput } from '@/components/admin/SearchInput'
import { SelectPageSize } from '@/components/admin/SelectPageSize'
import IndexPageComponent from '@/components/admin/IndexPageComponent'
import { Suspense } from 'react'
import { StudentsStatCards } from '#/components/admin/cards/UICard'
import {
  CustomDataTableSkeleton,
  StudentsTable,
} from '#/components/admin/Table/dataTable'
import { getAllGradesQueryOptions } from '#/hooks/grades/hooks'
import { motion } from 'framer-motion'
import { StatusFilter } from '#/components/admin/FilterComp'
import { getStudentsSchema } from '#/schemas/students.schema'
import { StatusEnum } from '#/server/db/schema'
import { getStudentsQueryOptions } from '#/hooks/students/hooks'

export const Route = createFileRoute('/_auth/admin/students/')({
  component: RouteComponent,
  pendingComponent: AdminStudentsPending,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    context.queryClient.ensureQueryData(getAllGradesQueryOptions())
    context.queryClient.ensureQueryData(getStudentsQueryOptions(deps))
  },
  validateSearch: zodValidator(getStudentsSchema),
  staticData: {
    breadcrumb: 'Students',
  },
})

function RouteComponent() {
  return (
    <Skeleton name="admin-students-page" loading={false}>
      <AdminStudentsContent />
    </Skeleton>
  )
}

function AdminStudentsPending() {
  return (
    <Skeleton name="admin-students-page" loading>
      <AdminStudentsContent />
    </Skeleton>
  )
}

function AdminStudentsContent() {
  const navigate = Route.useNavigate()
  // const { data } = useQuery(getAllGradesQueryOptions())
  // this should be for the filter

  const { size, search, status } = Route.useSearch({
    select: (s) => ({
      size: s.size,
      search: s.search,
      status: s.status,
    }),
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 w-full overflow-x-auto flex flex-col gap-6"
    >
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
            <StatusFilter
              value={status}
              onChange={(value) =>
                navigate({
                  search: (s) => ({
                    ...s,
                    status:
                      value === 'all'
                        ? undefined
                        : StatusEnum[
                            value.toUpperCase() as keyof typeof StatusEnum
                          ],
                  }),
                })
              }
            />
          </div>
        </div>

        <Suspense fallback={<CustomDataTableSkeleton rows={size} cols={6} />}>
          <MainPageContent />
        </Suspense>
      </IndexPageComponent>
    </motion.div>
  )
}

function MainPageContent() {
  const { size, page, search, sortBy, sortOrder, status, grade, classe } =
    Route.useSearch({
      select: (s) => ({
        size: s.size,
        page: s.page,
        search: s.search,
        sortBy: s.sortBy,
        sortOrder: s.sortOrder,
        grade: s.grade,
        classe: s.classe,
        status: s.status,
      }),
    })
  const { data: studentsData, status: fetchStatus } = useSuspenseQuery({
    ...getStudentsQueryOptions({
      size,
      page,
      search,
      sortBy,
      sortOrder,
      status,
      grade,
      classe,
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
