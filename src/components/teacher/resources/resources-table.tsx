<<<<<<< HEAD
// import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
// import { MdSearch } from 'react-icons/md'
// import { useEffect, useState } from 'react'
// import type {
//   ColumnDef,
//   PaginationOptions,
//   PaginationState,
// } from '@tanstack/react-table'
// /* filter types*/

// import { useDebounce } from '@/hooks/use-debounce'
// import { DataTable } from '@/components/table/data-table'

// type Props<T extends Record<string, string | number>> = {
//   data: Array<T>
//   columns: Array<ColumnDef<T>>
//   pagination: PaginationState
//   paginationOptions: {
//     onPaginationChange: NonNullable<PaginationOptions['onPaginationChange']>
//     rowCount: number
//   }
//   filters: ResourceFilter
//   onFilterChange: (dataFilters: Partial<ResourceFilter>) => void
// }

// export function ResourcesTable<T extends Record<string, string | number>>({
//   data,
//   columns,
//   pagination,
//   paginationOptions,
//   filters,
//   onFilterChange,
// }: Props<T>) {
//   /* handling table */
//   const tablePagination = {
//     pageIndex: Math.max(pagination.pageIndex - 1, 0),
//     pageSize: pagination.pageSize,
//   }
//   const pageCount = Math.max(
//     1,
//     Math.ceil(paginationOptions.rowCount / tablePagination.pageSize),
//   )

//   const visiblePages = 3
//   const currentPageIndex = tablePagination.pageIndex
//   const firstShownPage = Math.max(
//     0,
//     Math.min(currentPageIndex - 1, pageCount - visiblePages),
//   )

//   const shownPages = Array.from(
//     {
//       length: Math.min(visiblePages, pageCount - firstShownPage),
//     },
//     (_, index) => firstShownPage + index,
//   )

//   const hasActiveFilters = Object.entries(filters).some(
//     ([key, value]) =>
//       key !== 'pageIndex' && key !== 'pageSize' && Boolean(value),
//   )

//   const clearFilters = () => {
//     const cleanedFilters = Object.keys(filters).reduce<
//       Record<string, undefined>
//     >((acc, key) => {
//       if (key !== 'pageIndex' && key !== 'pageSize') {
//         acc[key] = undefined
//       }
//       return acc
//     }, {})

//     onFilterChange(cleanedFilters)
//   }

//   const table = useReactTable({
//     data,
//     columns,
//     manualPagination: true,
//     rowCount: paginationOptions.rowCount,
//     state: {
//       pagination: tablePagination,
//     },
//     onPaginationChange: (updater) => {
//       const nextPagination =
//         typeof updater === 'function' ? updater(tablePagination) : updater

//       paginationOptions.onPaginationChange({
//         pageIndex: nextPagination.pageIndex + 1,
//         pageSize: nextPagination.pageSize,
//       })
//     },
//     getCoreRowModel: getCoreRowModel(),
//   })
//   /* Search logic */

//   const [localSearch, setLocalSearch] = useState(filters.fileName ?? '')
//   const debouncedSearch = useDebounce(localSearch)

//   useEffect(() => {
//     setLocalSearch(filters.fileName ?? '')
//   }, [filters.fileName])

//   useEffect(() => {
//     const nextFileName = debouncedSearch.trim()

//     if (nextFileName !== localSearch.trim()) {
//       return
//     }

//     if ((filters.fileName ?? '') === nextFileName) {
//       return
//     }

//     onFilterChange({
//       fileName: nextFileName || undefined,
//       pageIndex: 1,
//     })
//   }, [debouncedSearch, filters.fileName, onFilterChange])

//   return (
//     <>
//       <div className="mb-8 flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-surface-dark md:flex-row md:items-center md:justify-between">
//         <div className="relative h-10 w-full ">
//           <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]" />
//           <input
//             className="h-full w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-[#0d121b] focus:border-primary focus:ring-0 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
//             placeholder="Search files..."
//             type="text"
//             value={localSearch}
//             onChange={(event) => {
//               setLocalSearch(event.target.value)
//             }}
//             onKeyDown={(event) => {
//               if (event.key !== 'Enter') {
//                 return
//               }

//               event.preventDefault()
//               const nextFileName = localSearch.trim()
//               setLocalSearch(nextFileName)
//               onFilterChange({
//                 fileName: nextFileName || undefined,
//                 pageIndex: 1,
//               })
//             }}
//           />
//         </div>
//         <div className="flex gap-3">
//           <select
//             className="h-10 rounded-lg border-none bg-gray-50 px-4 py-0 pr-8 text-sm font-medium text-gray-600 focus:ring-0 dark:bg-gray-800 dark:text-gray-300 cursor-pointer"
//             onChange={(event) => {
//               const nextType = event.target.value
//               onFilterChange({
//                 type: nextType || undefined,
//                 pageIndex: 1,
//               })
//             }}
//           >
//             <option value="">All Types</option>
//             <option value="pdf">PDF</option>
//             <option value="docx">DOCX</option>
//             <option value="xlsx">XLSX</option>
//             <option value="png">PNG</option>
//             <option value="zip">ZIP</option>
//             <option value="pptx">PPTX</option>
//             <option value="mp4">MP4</option>
//             <option value="txt">TXT</option>
//           </select>
//           <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
//           <select
//             className="h-10 rounded-lg border-none bg-gray-50 px-4 py-0 pr-8 text-sm font-medium text-gray-600 focus:ring-0 dark:bg-gray-800 dark:text-gray-300 cursor-pointer"
//             value={filters.sortBy ?? 'newest'}
//             onChange={(event) => {
//               const nextSortBy = event.target.value as ResourceSortOption
//               onFilterChange({
//                 sortBy: nextSortBy,
//                 pageIndex: 1,
//               })
//             }}
//           >
//             <option value="newest">Newest First</option>
//             <option value="oldest">Oldest First</option>
//             <option value="name">Name A-Z</option>
//             <option value="size">Size</option>
//           </select>
//         </div>
//       </div>
//       <DataTable
//         table={table}
//         columns={columns}
//         firstShownPage={firstShownPage}
//         pageCount={pageCount}
//         shownPages={shownPages}
//         hasActiveFilters={hasActiveFilters}
//         clearFilters={clearFilters}
//       />
//     </>
//   )
// }
=======
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import type {
  ColumnDef,
  PaginationOptions,
  PaginationState,
} from '@tanstack/react-table'
import { CustomPagination } from '@/components/admin/PaginationComp'
import DataTable from '@/components/admin/Table/dataTable'

type Props<T extends Record<string, string | number>> = {
  data: Array<T>
  columns: Array<ColumnDef<T>>
  pagination: PaginationState
  paginationOptions: {
    onPaginationChange: NonNullable<PaginationOptions['onPaginationChange']>
    rowCount: number
  }
}

export function ResourcesTable<T extends Record<string, string | number>>({
  data,
  columns,
  pagination,
  paginationOptions,
}: Props<T>) {
  const tablePagination = {
    pageIndex: Math.max(pagination.pageIndex - 1, 0),
    pageSize: pagination.pageSize,
  }
  const pageCount = Math.max(
    1,
    Math.ceil(paginationOptions.rowCount / tablePagination.pageSize),
  )

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    rowCount: paginationOptions.rowCount,
    state: {
      pagination: tablePagination,
    },
    onPaginationChange: (updater) => {
      const nextPagination =
        typeof updater === 'function' ? updater(tablePagination) : updater

      paginationOptions.onPaginationChange({
        pageIndex: nextPagination.pageIndex + 1,
        pageSize: nextPagination.pageSize,
      })
    },
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <DataTable table={table} />
      </div>

      <div className="flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          Showing{' '}
          <span className="font-medium text-foreground">
            {Math.min(
              pagination.pageSize,
              Math.max(
                paginationOptions.rowCount -
                  (pagination.pageIndex - 1) * pagination.pageSize,
                0,
              ),
            )}
          </span>{' '}
          of{' '}
          <span className="font-medium text-foreground">
            {paginationOptions.rowCount}
          </span>{' '}
          results
        </p>

        <CustomPagination
          currentPage={pagination.pageIndex}
          totalPages={pageCount}
          onPageChange={(page) => {
            paginationOptions.onPaginationChange({
              pageIndex: page,
              pageSize: pagination.pageSize,
            })
          }}
        />
      </div>
    </div>
  )
}
>>>>>>> 7ff135d38c22c2539512238e28a6aa428b9eea01
