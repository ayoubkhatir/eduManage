import { flexRender } from '@tanstack/react-table'
import type { Table as Tab } from '@tanstack/react-table'
import { Skeleton as BoneyardSkeleton } from 'boneyard-js/react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

interface DataTableProps<TData> {
  table: Tab<TData>
}

export default function DataTable<TData>({ table }: DataTableProps<TData>) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

type SkeletonTableProps = {
  rows: number
  cols: number
}

export function CustomDataTableSkeleton({ rows, cols }: SkeletonTableProps) {
  const renderTablePreview = () => (
    <div className="overflow-hidden rounded-md border">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-gray-100 dark:bg-slate-800">
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-4 py-2 text-left">
                <Skeleton className="h-4 w-20 bg-gray-300 dark:bg-slate-700 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-t border-gray-200 dark:border-slate-700"
            >
              {Array.from({ length: cols }).map((__, colIndex) => (
                <td key={colIndex} className="px-4 py-2">
                  <Skeleton className="h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <BoneyardSkeleton
      name="admin-data-table"
      loading
      animate="shimmer"
      fallback={renderTablePreview()}
    >
      {renderTablePreview()}
    </BoneyardSkeleton>
  )
}
