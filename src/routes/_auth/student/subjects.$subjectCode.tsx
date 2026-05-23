// import { createFileRoute } from '@tanstack/react-router'
// import { Skeleton } from 'boneyard-js/react'

// import type { Resource } from '@/services/api/teacher/types/modelType'
// import { columns } from '@/components/teacher/resources/columns'
// import {
//   getAllCollectionsQueryOptions,
//   getResourcesQueryOptions,
// } from '@/services/api/teacher/collection/hooks.ts'
// import { getResourcesSchema } from '#/schemas/resources.schema'
// import { useQuery } from '@tanstack/react-query'
// import DataTable from '#/components/admin/Table/dataTable'
// import { getCoreRowModel, useReactTable } from '@tanstack/react-table'

// export const Route = createFileRoute('/student/subjects')({
//   component: Courses,
//   pendingComponent: CoursesPending,
//   head: () => ({
//     meta: [{ title: 'Student | Subjects - EduManage' }],
//   }),
//   loaderDeps: ({ search }) => search,
//   loader: async ({ context, deps }) => {
//     // await new Promise((resolve) => setTimeout(resolve, 2000))
//     return Promise.all([
//       context.queryClient.ensureQueryData(getAllCollectionsQueryOptions(false)),
//       context.queryClient.ensureQueryData(
//         getResourcesQueryOptions(undefined, deps),
//       ),
//     ])
//   },
//   validateSearch: getResourcesSchema,
// })

// function CoursesPending() {
//   return (
//     <Skeleton name="student-courses-page" loading>
//       <CoursesContent />
//     </Skeleton>
//   )
// }

// function Courses() {
//   return (
//     <Skeleton name="student-courses-page" loading={false}>
//       <CoursesContent />
//     </Skeleton>
//   )
// }

// function CoursesContent() {
//   return (
//     // <div className="overflow-auto min-h-screen bg-background-light dark:bg-background-dark text-[#0d121b] dark:text-white flex flex-col p-6 md:p-10">
//     <main className="flex-1 overflow-y-auto bg-background-light p-4 dark:bg-background-dark md:p-8">
//       {/* Breadcrumbs */}
//       {/* <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
//         <a className="hover:text-primary" href="#">
//           Home
//         </a>
//         <span className="material-symbols-outlined text-[16px]">
//           chevron_right
//         </span>
//         <a className="hover:text-primary" href="#">
//           Student
//         </a>
//         <span className="material-symbols-outlined text-[16px]">
//           chevron_right
//         </span>
//         <span className="font-medium text-[#0d121b] dark:text-white">
//           Resources
//         </span>
//       </nav> */}
//       {/* Page Header */}
//       <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
//         <div>
//           <h1 className="text-3xl font-black tracking-tight text-[#0d121b] dark:text-white md:text-4xl">
//             Learning Resources
//           </h1>
//           <p className="mt-2 text-base text-[#4c669a] dark:text-gray-400">
//             Access educational materials, assignments, and reference docs shared
//             by your teachers.
//           </p>
//         </div>
//       </div>

//       <div className="px-6 pb-12 py-5">
//         {/* <Skeleton name="resources-table" loading={isResourcesInitialLoading}> */}
//         <CoursesTableFetchWrapper />
//         {/* </Skeleton> */}
//       </div>
//     </main>
//     // </div>
//   )
// }

// function CoursesTableFetchWrapper() {
//   const { dateAdded, fileName, pageIndex, pageSize, size, sortBy, type } =
//     Route.useSearch()
//   const { data: resourcesData, status: fetchStatus } = useQuery({
//     ...getResourcesQueryOptions(undefined, {
//       dateAdded,
//       fileName,
//       pageIndex,
//       pageSize,
//       size,
//       sortBy,
//       type,
//     }),
//   })
//   console.log({ resourcesData })
//   // const paginationState = { pageIndex, pageSize }
//   // const rowCount = (resourcesData || { rowCount: 0 }).rowCount
//   // return (
//   //   <ResourcesTable
//   //     data={resourcesData}
//   //     columns={columns}
//   //     pagination={paginationState}
//   //     paginationOptions={{
//   //       onPaginationChange: (pagination) => {
//   //         setFilters(
//   //           typeof pagination === 'function'
//   //             ? pagination(paginationState)
//   //             : pagination,
//   //         )
//   //       },
//   //       rowCount,
//   //     }}
//   //     filters={filters}
//   //     onFilterChange={setFilters}
//   //   />
//   // )

//   if (fetchStatus === 'pending') {
//     return 'Pending'
//   }
//   if (fetchStatus === 'error') {
//     return 'Error'
//   }
//   return <CoursesTable data={resourcesData.data} />
// }

// function CoursesTable({ data }: { data: Resource[] }) {
//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//   })
//   return <DataTable table={table} />
// }

import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { zodValidator } from '@tanstack/zod-adapter'
import { useQuery } from '@tanstack/react-query'

import { getResourcesSchema } from '#/schemas/resources.schema'
import { columns } from '@/components/resources/columns'
import { ResourcesTable } from '#/components/teacher/resources/resources-table'
import { getResourcesQueryOptions } from '#/hooks/resources/hooks'
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

  function setFilters(nextFilters: Partial<typeof search>) {
    navigate({
      to: '.',
      search: (prev) => ({
        ...prev,
        ...nextFilters,
      }),
      replace: true,
    })
  }

  return (
    <motion.main initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="flex-1 overflow-y-auto bg-background-light p-4 dark:bg-background-dark md:p-8">
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
        <div className="text-sm text-muted-foreground">Loading resources...</div>
      ) : status === 'error' ? (
        <div className="text-sm text-red-500">Failed to load resources.</div>
      ) : (
        <ResourcesTable
          data={data.data}
          columns={columns}
          pagination={pagination}
          paginationOptions={{
            rowCount: data.pagination.totalCount,
            onPaginationChange: (paginationState) => {
              const nextPagination =
                typeof paginationState === 'function'
                  ? paginationState(pagination)
                  : paginationState

              setFilters({
                pageIndex: nextPagination.pageIndex,
                pageSize: nextPagination.pageSize,
              })
            },
          }}
          filters={{ ...search, subjectCode }}
          onFilterChange={setFilters}
        />
      )}
    </motion.main>
  )
}
