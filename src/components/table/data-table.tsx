import { flexRender } from '@tanstack/react-table'
import type { ColumnDef, Table as Tab } from '@tanstack/react-table'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type Props<T> = {
  table: Tab<T>
  columns: Array<ColumnDef<T>>
  shownPages: Array<number>
  firstShownPage: number
  pageCount: number
  hasActiveFilters: boolean
  clearFilters: () => void
}

export function DataTable<T extends Record<string, unknown>>({
  table,
  columns,
  shownPages,
  firstShownPage,
  pageCount,
  hasActiveFilters,
  clearFilters,
}: Props<T>) {
  const tableMeta = table.options.meta as
    | { onRowClick?: (rowData: T) => void }
    | undefined
  const hasRowClick = Boolean(tableMeta?.onRowClick)

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
        <Table className="w-full table-fixed border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
          <TableHeader className="bg-slate-50  text-xs uppercase text-slate-500  dark:bg-gray-800 dark:text-slate-200 ">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="px-3 py-3 font-semibold overflow-hidden"
                      style={
                        header.column.columnDef.size
                          ? { width: `${header.column.columnDef.size}%` }
                          : undefined
                      }
                      scope="col"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={`dark:border-gray-700 dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    hasRowClick ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => {
                    tableMeta?.onRowClick?.(row.original)
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-3 py-3 overflow-hidden"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center space-y-2"
                >
                  <p>No results.</p>
                  {hasActiveFilters && (
                    <button
                      className="text-sm font-medium text-primary hover:underline cursor-pointer"
                      onClick={clearFilters}
                      type="button"
                    >
                      Clear filters
                    </button>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200  bg-white  px-4 py-3 sm:px-6 mt-4 rounded-xl shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white ">
        <div className="hidden sm:flex flex-1 items-center justify-between">
          <div></div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                />
              </PaginationItem>
              {firstShownPage > 0 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {shownPages.map((pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    isActive={
                      table.getState().pagination.pageIndex === pageNumber
                    }
                    onClick={() => table.setPageIndex(pageNumber)}
                  >
                    {pageNumber + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {shownPages[shownPages.length - 1] < pageCount - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  )
}
