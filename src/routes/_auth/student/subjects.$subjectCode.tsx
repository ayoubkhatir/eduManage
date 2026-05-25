

import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { zodValidator } from '@tanstack/zod-adapter'
import { useQuery } from '@tanstack/react-query'

import { getResourcesSchema } from '#/schemas/resources.schema'
import { getResourceColumns } from '@/components/resources/columns'
import { getResourcesQueryOptions } from '#/hooks/resources/hooks'
import { ResourcesTable } from '#/components/teacher/resources/resources-table'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/_auth/student/subjects/$subjectCode')({
  component: StudentResourcesPage,
  pendingComponent: StudentResourcesPending,
  validateSearch: zodValidator(
    getResourcesSchema.omit({ studentId: true, subjectCode: true }),
  ),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, params: { subjectCode }, deps }) => {
    // IMPORTANT:
    // replace this with the real student profile id if authState.user.id is only the auth user id

    await context.queryClient.ensureQueryData(
      getResourcesQueryOptions({
        ...deps,
        subjectCode,
        // studentId: context.authState.user.roleId,
      }),
    )
  },
})

function StudentResourcesPending() {
  return (
    <Skeleton name="student-resources-page" loading>
      <StudentResourcesContent />
    </Skeleton>
  )
}

function StudentResourcesPage() {
  return (
    <Skeleton name="student-resources-page" loading={false}>
      <StudentResourcesContent />
    </Skeleton>
  )
}

function StudentResourcesContent() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  // const { authState } = Route.useRouteContext()
  const { subjectCode } = Route.useParams()

  const { data, status } = useQuery(
    getResourcesQueryOptions({
      ...search,
      subjectCode,
      // studentId: authState.user.roleId,
    }),
  )

  const pagination = {
    pageIndex: search.pageIndex,
    pageSize: search.pageSize,
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 overflow-y-auto bg-background-light p-4 dark:bg-background-dark md:p-8"
    >
      <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#0d121b] dark:text-white md:text-4xl">
            Learning Resources
          </h1>
          <p className="mt-2 text-base text-[#4c669a] dark:text-gray-400">
            Access educational materials, assignments, and reference docs shared
            by your teachers.
          </p>
        </div>
      </div>

      {status === 'pending' ? (
        <div className="text-sm text-muted-foreground">
          Loading resources...
        </div>
      ) : status === 'error' ? (
        <div className="text-sm text-red-500">Failed to load resources.</div>
      ) : (
        <ResourcesTable
          data={data.data}
          columns={getResourceColumns()}
          pagination={pagination}
          paginationOptions={{
            rowCount: data.pagination.totalCount,
            onPaginationChange: (paginationState) => {
              const nextPagination =
                typeof paginationState === 'function'
                  ? paginationState(pagination)
                  : paginationState

              navigate({
                search: (s) => ({
                  ...s,
                  pageIndex: nextPagination.pageIndex,
                  pageSize: nextPagination.pageSize,
                }),
              })
            },
          }}
        />
      )}
    </motion.main>
  )
}
