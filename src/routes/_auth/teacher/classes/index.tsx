// import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
// import { Skeleton } from 'boneyard-js/react'
// import { ResourceSearchSchema } from './$folderId'
// import type { Resource } from '@/services/api/teacher/types/modelType'
// import { AddOrEditCollectionDialog } from '@/components/teacher/collection/CollectionDialogs'
// import SendResForm from '@/components/teacher/resources/sendResForm'
// import { ResourcesTable } from '@/components/teacher/resources/resources-table'
// import { columns } from '@/components/teacher/resources/columns'
// import { useFilterResource } from '@/hooks/teacher/use-filter-resource.ts'
// import useGetResources, {
//   getAllCollectionsQueryOptions,
//   getResourcesQueryOptions,
//   useGetAllCollections,
// } from '@/services/api/teacher/collection/hooks'

// export const Route = createFileRoute('/teacher/classes/')({
//   component: RouteComponent,
//   pendingComponent: TeacherClassesPending,
//   pendingMs: 0,
//   pendingMinMs: 220,
//   head: () => ({
//     meta: [{ title: 'Teacher | Classes - EduManage' }],
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
//   validateSearch: ResourceSearchSchema,
// })

// function TeacherClassesPending() {
//   return (
//     <Skeleton name="teacher-classes-page" loading>
//       <TeacherClassesContent />
//     </Skeleton>
//   )
// }

// function RouteComponent() {
//   return (
//     <Skeleton name="teacher-classes-page" loading={false}>
//       <TeacherClassesContent />
//     </Skeleton>
//   )
// }

// function TeacherClassesContent() {
//   const router = useRouter()
//   /* get state from search params*/
//   const { filters, setFilters } = useFilterResource(Route.id)

//   /* when reload data */
//   const refreshPage = () => {
//     console.log('Refreshing page...')
//     router.invalidate()
//   }
//   /* create pagination state */
//   const paginationState = {
//     pageIndex: filters.pageIndex ?? 1,
//     size: filters.size ?? 5,
//   }
//   /* create */

//   const { data: resourcesData, isLoading: isResourcesLoading } =
//     useGetResources(undefined, filters)

//   const data: Array<Resource> = resourcesData?.data ?? []
//   const rowCount = resourcesData?.rowCount ?? 0

//   /* default search value */
//   /* collections folders*/
//   const {
//     data: folders,
//     isLoading: isFoldersLoading,
//     isError: isFoldersError,
//     isFetching: isFoldersFetching,
//     refetch: refetchFolders,
//   } = useGetAllCollections(false)
//   const hasFolders = (folders?.length ?? 0) > 0
//   const isResourcesInitialLoading = isResourcesLoading && !resourcesData

//   return (
//     <main className="flex-1 flex flex-col min-w-0 ">
//       <div className="px-6 py-4">
//         <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
//           <div className="flex flex-col gap-1">
//             <h1 className="text-3xl font-bold tracking-tight text-foreground dark:text-white">
//               Resource Management Dashboard
//             </h1>
//             <p className="text-muted-foreground max-w-2xl">
//               Upload new content, manage collections, and track shared
//               resources.
//             </p>
//           </div>
//         </div>
//       </div>
//       {isFoldersError || (!isFoldersLoading && !hasFolders) ? (
//         <div className="px-6 mb-8">
//           <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <h4 className="font-semibold text-foreground dark:text-white">
//                 {isFoldersError ? "Couldn't load folders" : 'No folders found'}
//               </h4>
//               <p className="text-sm text-muted-foreground mt-1">
//                 {isFoldersError
//                   ? "We couldn't get folder data. Please try again or refresh the page."
//                   : 'You need at least one folder to upload a resource. Please refresh and try again.'}
//               </p>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => refetchFolders()}
//                 disabled={isFoldersFetching}
//                 className="cursor-pointer rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed"
//               >
//                 Try again
//               </button>
//               <button
//                 onClick={refreshPage}
//                 className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
//               >
//                 Refresh page
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="px-6 mb-8">
//           <Skeleton
//             name="teacher-classes-send-resource"
//             loading={isFoldersLoading}
//           >
//             <SendResForm folders={folders ?? []} />
//           </Skeleton>
//         </div>
//       )}

//       <div className="px-6 mb-8">
//         <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center justify-between">
//           <span>Collections</span>
//           <Link
//             to={'/teacher/classes/allCollections'}
//             className="cursor-pointer text-primary text-xs font-semibold hover:underline"
//           >
//             View All
//           </Link>
//         </h3>
//         {isFoldersError ? (
//           <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <h4 className="font-semibold text-foreground dark:text-white">
//                 Couldn&apos;t load folders
//               </h4>
//               <p className="text-sm text-muted-foreground mt-1">
//                 We couldn&apos;t get folder data. Please try again or refresh
//                 the page.
//               </p>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => refetchFolders()}
//                 disabled={isFoldersFetching}
//                 className="cursor-pointer rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed"
//               >
//                 Try again
//               </button>
//               <button
//                 onClick={refreshPage}
//                 className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
//               >
//                 Refresh page
//               </button>
//             </div>
//           </div>
//         ) : !isFoldersLoading && !hasFolders ? (
//           <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <h4 className="font-semibold text-foreground dark:text-white">
//                 No folders found
//               </h4>
//               <p className="text-sm text-muted-foreground mt-1">
//                 Folder data is empty. Please refresh and try again.
//               </p>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => refetchFolders()}
//                 disabled={isFoldersFetching}
//                 className="cursor-pointer rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed"
//               >
//                 Try again
//               </button>
//               <button
//                 onClick={refreshPage}
//                 className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
//               >
//                 Refresh page
//               </button>
//             </div>
//           </div>
//         ) : (
//           <Skeleton
//             name="teacher-classes-collections-grid"
//             loading={isFoldersLoading}
//           >
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//               {folders?.map((folder) => (
//                 <div key={folder.id} className="relative">
//                   <Link
//                     to={`/teacher/classes/$folderId`}
//                     params={{ folderId: folder.id.toString() }}
//                     search={undefined}
//                   >
//                     <div className="group cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 py-9 transition-all hover:border-primary/50 hover:shadow-md">
//                       <div className="flex items-start justify-between mb-3">
//                         <span className="material-symbols-outlined text-4xl text-primary/80 group-hover:text-primary transition-colors filled">
//                           folder
//                         </span>
//                       </div>
//                       <h4 className="font-semibold text-foreground dark:text-white group-hover:text-primary transition-colors">
//                         {folder.name}
//                       </h4>
//                       <p className="text-xs text-muted-foreground mt-1">
//                         {folder.filesCount} files • {folder.sizeMB}MB
//                       </p>
//                     </div>
//                   </Link>
//                 </div>
//               ))}
//               <AddOrEditCollectionDialog
//                 role="add"
//                 className="group cursor-pointer rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-transparent p-4 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-all min-h-32"
//               />
//             </div>
//           </Skeleton>
//         )}
//       </div>
//       <div className="sticky top-0 z-10 bg-background-light dark:bg-background-dark/95 backdrop-blur px-6 py-2 pb-6">
//         <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center justify-between">
//           <span>All Resources</span>
//         </h3>
//       </div>
//       <div className="px-6 pb-12 py-5">
//         <Skeleton name="resources-table" loading={isResourcesInitialLoading}>
//           <ResourcesTable
//             data={data}
//             columns={columns}
//             pagination={paginationState}
//             paginationOptions={{
//               onPaginationChange: (pagination) => {
//                 setFilters(
//                   typeof pagination === 'function'
//                     ? pagination(paginationState)
//                     : pagination,
//                 )
//               },
//               rowCount,
//             }}
//             filters={filters}
//             onFilterChange={setFilters}
//           />
//         </Skeleton>
//       </div>
//     </main>
//   )
// }

import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { queryOptions, useQuery, keepPreviousData } from '@tanstack/react-query'
import { useMemo } from 'react'
import { zodValidator } from '@tanstack/zod-adapter'
import type { TeacherClassItem } from '#/types/teacherTypes'
import { getTeacherClassesDashboardServerFn } from '#/server/modules/teachers/teachers.server-functions'
import { getTeacherClassesSchema, type GetTeacherClassesSchema } from '#/schemas/teachers.schema'
import { motion } from 'framer-motion'

/**
 * Route: /teacher/classes
 *
 * This replaces the old "collections/resources" page with a real
 * teacher classes dashboard.
 *
 * Expected API response:
 * GET /teacher/classes?search=&page=1&size=10&status=Active
 *
 * {
 *   data: [
 *     {
 *       assignmentId: string
 *       classId: string
 *       className: string           // e.g. "A"
 *       gradeId: string
 *       gradeName: string           // e.g. "1AM"
 *       subjectId: string
 *       subjectName: string         // e.g. "Mathematics"
 *       studentCount: number
 *       isPrimaryTeacher: boolean
 *       status: "Active" | "Inactive" | "Pending" | "New"
 *     }
 *   ],
 *   rowCount: number,
 *   summary: {
 *     totalClasses: number,
 *     totalStudents: number,
 *     totalSubjects: number
 *   }
 * }
 */

// async function getTeacherClasses(
//   search: GetTeacherClassesSchema,
// ): Promise<TeacherClassesResponse> {
//   const response = await axios.get<TeacherClassesResponse>(
//     `${API_URL}/teacher/classes`,
//     {
//       params: {
//         search: search.search,
//         page: search.page,
//         size: search.size,
//         status: search.status,
//       },
//     },
//   )

//   return response.data
// }
const teacherId = 'cjeqi4oqhvn5'
const getTeacherClassesQueryOptions = ({
  page,
  search,
  size,
  status,
}: GetTeacherClassesSchema) =>
  queryOptions({
    queryKey: ['teacher-classes', page, search, size, status],
    queryFn: async () => {
      const response = await getTeacherClassesDashboardServerFn({
        data: { page, search, size, status, teacherId },
      })
      if (response.success) return response.data
      throw new Error('Error occured')
    },
    placeholderData: keepPreviousData,
  })

export const Route = createFileRoute('/_auth/teacher/classes/')({
  component: RouteComponent,
  pendingComponent: TeacherClassesPending,
  pendingMs: 0,
  pendingMinMs: 220,
  validateSearch: zodValidator(
    getTeacherClassesSchema.omit({ teacherId: true }),
  ),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    await context.queryClient.ensureQueryData(
      getTeacherClassesQueryOptions({ ...deps, teacherId }),
    )
  },
  head: () => ({
    meta: [{ title: 'Teacher | Classes - EduManage' }],
  }),
})

function TeacherClassesPending() {
  return (
    <Skeleton name="teacher-classes-page" loading>
      <TeacherClassesContent />
    </Skeleton>
  )
}

function RouteComponent() {
  return (
    <Skeleton name="teacher-classes-page" loading={false}>
      <TeacherClassesContent />
    </Skeleton>
  )
}

function TeacherClassesContent() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const router = useRouter()
  const filters = {
    search: search.search ?? '',
    page: search.page ?? 1,
    size: search.size ?? 8,
    status: search.status ?? 'All',
  }

  const setFilters = (patch: Partial<GetTeacherClassesSchema>) => {
    navigate({
      to: '.',
      search: (prev) => ({
        ...prev,
        ...patch,
        page:
          patch.search !== undefined || patch.status !== undefined
            ? 1
            : (patch.page ?? prev.page ?? 1),
      }),
      replace: true,
    })
  }

  const refreshPage = () => router.invalidate()

  const { data, isLoading, isError, isFetching, refetch } = useQuery(
    getTeacherClassesQueryOptions({ ...filters, teacherId }),
  )

  const classes = data?.data ?? []
  const rowCount = data?.rowCount ?? 0
  const summary = data?.summary ?? {
    totalClasses: 0,
    totalStudents: 0,
    totalSubjects: 0,
  }

  const totalPages = Math.max(1, Math.ceil(rowCount / filters.size))

  const groupedByGrade = useMemo(() => {
    return classes.reduce<Record<string, TeacherClassItem[]>>((acc, item) => {
      const key = item.gradeName
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    }, {})
  }, [classes])

  return (
    <motion.main initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="flex-1 flex flex-col min-w-0">
      <div className="px-6 py-4 pt-2">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground dark:text-white sm:text-3xl">
              My Classes
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
              View all classes assigned to you, grouped by grade and subject,
              with student counts and quick access to details.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="cursor-pointer rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:border-border dark:border-border dark:text-slate-300 dark:hover:bg-accent disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Refresh
            </button>
            <button
              onClick={refreshPage}
              className="cursor-pointer rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary/90 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-accent"
            >
              Revalidate
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <SummaryCard
            title="Assigned Classes"
            value={summary.totalClasses}
            icon="school"
          />
          <SummaryCard
            title="Total Students"
            value={summary.totalStudents}
            icon="groups"
          />
          <SummaryCard
            title="Subjects"
            value={summary.totalSubjects}
            icon="menu_book"
          />
          <SummaryCard
            title="Primary Assignments"
            value={classes.filter((item) => item.isPrimaryTeacher).length}
            icon="verified"
          />
        </div>
      </div>

      <div className="px-6 mb-6">
        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm dark:border-white/6 dark:bg-white/2">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:max-w-3xl">
              <input
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
                placeholder="Search by grade, class, or subject..."
                className="w-full rounded-xl border border-border bg-muted px-3 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-card dark:border-border dark:bg-card/50 dark:placeholder:text-muted-foreground dark:focus:border-primary dark:focus:bg-card"
              />

              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({
                    status: e.target.value as GetTeacherClassesSchema['status'],
                  })
                }
                className="rounded-xl border border-border bg-muted px-3 py-2.5 text-sm outline-none transition-all focus:border-primary dark:border-border dark:bg-card/50 dark:focus:border-primary"
              >
                <option value="all">All statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
                <option value="New">New</option>
              </select>

              <select
                value={filters.size}
                onChange={(e) => setFilters({ size: Number(e.target.value) })}
                className="rounded-xl border border-border bg-muted px-3 py-2.5 text-sm outline-none transition-all focus:border-primary dark:border-border dark:bg-card/50 dark:focus:border-primary"
              >
                <option value={8}>8 / page</option>
                <option value={12}>12 / page</option>
                <option value={20}>20 / page</option>
              </select>
            </div>

            <div className="text-sm text-muted-foreground">
              {rowCount} assignment{rowCount === 1 ? '' : 's'}
            </div>
          </div>
        </div>
      </div>

      {isError ? (
        <div className="px-6 mb-8">
          <div className="rounded-xl border border-border dark:border-border bg-card dark:bg-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h4 className="font-semibold text-foreground dark:text-white">
                Couldn&apos;t load classes
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                We couldn&apos;t fetch your assigned classes. Try again or
                revalidate the route.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground dark:text-slate-200 hover:bg-accent dark:hover:bg-accent disabled:opacity-60"
              >
                Try again
              </button>
              <button
                onClick={refreshPage}
                className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Refresh page
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="px-6 mb-8">
            <Skeleton name="teacher-classes-grid" loading={isLoading && !data}>
              {classes.length === 0 ? (
                <div className="rounded-xl border border-border dark:border-border bg-card dark:bg-card p-8 text-center">
                  <span className="material-symbols-outlined text-4xl text-muted-foreground mb-2">
                    school
                  </span>
                  <h4 className="font-semibold text-foreground dark:text-white">
                    No assigned classes found
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    No class assignments match your current filters.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(groupedByGrade).map(([gradeName, items]) => (
                    <section key={gradeName}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                          {gradeName}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {items.length} assignment
                          {items.length === 1 ? '' : 's'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {items.map((item) => (
                          <ClassCard key={item.assignmentId} item={item} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </Skeleton>
          </div>

          <div className="px-6 pb-12 mb-4">
            <div className="rounded-xl border border-border dark:border-border bg-card dark:bg-card overflow-hidden">
              <div className="px-4 py-4 border-b border-border dark:border-border">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Class Assignments Table
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted dark:bg-card/40">
                    <tr className="text-left">
                      <th className="px-4 py-3 font-semibold text-muted-foreground">
                        Grade
                      </th>
                      <th className="px-4 py-3 font-semibold text-muted-foreground">
                        Class
                      </th>
                      <th className="px-4 py-3 font-semibold text-muted-foreground">
                        Subject
                      </th>
                      <th className="px-4 py-3 font-semibold text-muted-foreground">
                        Students
                      </th>
                      <th className="px-4 py-3 font-semibold text-muted-foreground">
                        Role
                      </th>
                      <th className="px-4 py-3 font-semibold text-muted-foreground">
                        Status
                      </th>
                      <th className="px-4 py-3 font-semibold text-muted-foreground text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {classes.map((item) => (
                      <tr
                        key={item.assignmentId}
                        className="border-t border-border"
                      >
                        <td className="px-4 py-3">{item.gradeName}</td>
                        <td className="px-4 py-3">{item.className}</td>
                        <td className="px-4 py-3">{item.subjectName}</td>
                        <td className="px-4 py-3">{item.studentCount}</td>
                        <td className="px-4 py-3">
                          {item.isPrimaryTeacher ? 'Primary' : 'Supporting'}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            to="/teacher/classes/$classId"
                            params={{ classId: item.classId }}
                            className="text-primary font-medium hover:underline"
                          >
                            View class
                          </Link>
                        </td>
                      </tr>
                    ))}

                    {classes.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-10 text-center text-muted-foreground"
                        >
                          No class assignments to display.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between px-4 py-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  Page {filters.page} of {totalPages}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={filters.page <= 1}
                    onClick={() =>
                      setFilters({ page: (filters.page || 1) - 1 })
                    }
                    className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    disabled={filters.page >= totalPages}
                    onClick={() =>
                      setFilters({ page: (filters.page || 1) + 1 })
                    }
                    className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.main>
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
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm dark:border-white/6 dark:bg-white/2">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="mt-1 text-2xl font-bold text-foreground dark:text-white">
            {value}
          </h3>
        </div>
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/10">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
    </div>
  )
}

function ClassCard({ item }: { item: TeacherClassItem }) {
  return (
    <div className="group rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md dark:border-white/6 dark:bg-white/2 dark:hover:border-primary/40">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {item.gradeName}
          </p>
          <h4 className="mt-1 text-lg font-semibold text-foreground dark:text-white">
            Class {item.className}
          </h4>
          <p className="mt-1 text-sm text-muted-foreground">
            {item.subjectName}
          </p>
        </div>

        <StatusBadge status={item.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <InfoPill label="Students" value={String(item.studentCount)} />
        <InfoPill
          label="Assignment"
          value={item.isPrimaryTeacher ? 'Primary' : 'Supporting'}
        />
      </div>

      <div className="mt-5 flex items-center justify-between">
        <Link
          to="/teacher/classes/$classId"
          params={{ classId: item.classId }}
          className="text-sm font-semibold text-primary transition-colors hover:underline"
        >
          Open class
        </Link>

        <Link
          to="/teacher/attendance/$classId"
          params={{ classId: item.classId }}
          className="text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          Attendance
        </Link>
      </div>
    </div>
  )
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted px-3 py-2.5 dark:bg-card/50">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 font-medium text-foreground dark:text-white">
        {value}
      </p>
    </div>
  )
}

type TeacherClassStatus = TeacherClassItem['status']

function StatusBadge({ status }: { status: TeacherClassStatus }) {
  const map: Record<TeacherClassStatus, string> = {
    Active:
      'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400',
    Inactive:
      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    Pending:
      'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    New: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  }

  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[status]}`}
    >
      {status}
    </span>
  )
}
