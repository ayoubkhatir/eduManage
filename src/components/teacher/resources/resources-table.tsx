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
