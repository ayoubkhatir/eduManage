// import { createFileRoute } from '@tanstack/react-router'
// import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
// import { keepPreviousData, useQuery } from '@tanstack/react-query'
// import z from 'zod'
// import { fallback, zodValidator } from '@tanstack/zod-adapter'
// import type { StudentModel } from '@/services/api/owner/student/schemas'
// import type { Filters } from '@/services/api/owner/types/apiTypes'
// import { StudentColumns } from '@/components/owner/Table/columnsData'
// import { studentFetcher } from '@/services/api/owner/student/fetcher'

// import DataTable, {
//   CustomDataTableSkeleton,
// } from '@/components/owner/Table/dataTable'
// import { CustomPagination } from '@/components/owner/PaginationComp'
// import { SearchInput } from '@/components/owner/SearchInput'
// import { SelectPageSize } from '@/components/owner/SelectPageSize'

// type QueryOptionsType = Filters<StudentModel>
// export type StudentSortOption = 'age' | 'name' | 'email'

// export type StudentFilter = Filters<StudentModel> & {
//   sortBy?: StudentSortOption
// }

// export const StudentSearchSchema = z.object({
//   search: fallback(z.string(), '').default(''),
//   email: fallback(z.string().email(), '').default(''),
//   status: fallback(z.string(), '').default(''),
//   grade: fallback(z.string(), '').default(''),
//   sortBy: fallback(z.enum(['age', 'name', 'email']), 'name').default('name'),
//   sortOrder: fallback(z.enum(['asc', 'desc']).nullable(), 'asc').default('asc'),
//   page: fallback(z.number(), 1).default(1),
//   size: fallback(z.number(), 10).default(10),
// })

// // export async function sleep() {
// //   return // await new Promise((resolve) => setTimeout(resolve, 3000))
// // }

// const getStudentsQueryOptions = ({
//   page,
//   search,
//   size,
//   status,
//   sortOrder,
//   sortBy,
// }: QueryOptionsType) => ({
//   queryKey: ['students', page, search, size, sortOrder, sortBy, status],
//   queryFn: async () => {
//     const response = await studentFetcher.getStudents({
//       page,
//       search,
//       size,
//       status,
//       sortOrder,
//       sortBy,
//     })
//     console.log({ response })
//     if (response.success)
//       return {
//         data: response.data,
//         pagination: response.pagination,
//       }
//     else throw new Error(response.message)
//   },
//   placeholderData: keepPreviousData,
// })

// export const Route = createFileRoute('/owner/payments')({
//   component: RouteComponent,
//   loaderDeps: ({ search }) => search,
//   loader: ({ context, deps }) => {
//     context.queryClient.ensureQueryData(getStudentsQueryOptions(deps))
//   },
//   validateSearch: zodValidator(StudentSearchSchema),
// })

// function RouteComponent() {
//   const navigate = Route.useNavigate()
//   const { size, page, search, sortBy, sortOrder } = Route.useSearch()
//   const { data: studentsData, status: fetchStatus } = useQuery({
//     ...getStudentsQueryOptions({
//       page,
//       size,
//       search,
//       sortBy,
//       sortOrder,
//     }),
//     placeholderData: keepPreviousData,
//   })

//   return (
//     <div className="flex-1 overflow-y-scroll w-full overflow-x-auto flex flex-col gap-4 px-6 p-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-xl md:text-2xl font-black leading-tight tracking-[-0.033em]">
//           Payments
//         </h1>
//       </div>

//       {fetchStatus === 'pending' ? (
//         <CustomDataTableSkeleton rows={size} cols={6} />
//       ) : fetchStatus === 'error' ? (
//         <p>Error</p>
//       ) : (
//         <>
//           <div className="flex items-center justify-between">
//             <SearchInput
//               value={search}
//               onSearch={(value) =>
//                 navigate({ search: (s) => ({ ...s, search: value }) })
//               }
//             />
//             <div className="flex items-center gap-4">
//               <SelectPageSize
//                 value={size}
//                 onChange={(value) =>
//                   navigate({ search: (s) => ({ ...s, size: value }) })
//                 }
//               />
//             </div>
//           </div>
//           <PayementsTable data={studentsData.data} />
//           <div className="flex items-center justify-between">
//             <p className="w-fit">
//               Showing {size} of {studentsData.pagination.totalElements}
//             </p>
//             <CustomPagination
//               currentPage={page}
//               totalPages={studentsData.pagination.totalPages}
//               onPageChange={(p) =>
//                 navigate({ search: (s) => ({ ...s, page: p }) })
//               }
//             />
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

// function PayementsTable({ data }: { data: Array<StudentModel> }) {
//   const table = useReactTable({
//     data,
//     columns: StudentColumns,
//     getCoreRowModel: getCoreRowModel(),
//   })

//   return <DataTable table={table} />
// }
