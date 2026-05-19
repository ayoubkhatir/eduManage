import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
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
import { StudentColumns, TeacherColumns } from './columnsData'
import type { TeacherUser } from '#/server/modules/teachers/teachers.types'
import type { StudentUser } from '#/server/modules/students/students.types'

interface DataTableProps<TData> {
  table: Tab<TData>
}

export default function DataTable<TData>({ table }: DataTableProps<TData>) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="text-slate-700 dark:text-slate-300 font-semibold text-sm"
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
                data-state={row.getIsSelected() && 'selected'}
                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center text-slate-500 dark:text-slate-400"
              >
                No results found.
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

// teachers Table

export function TeachersTable({ data }: { data: Array<TeacherUser> }) {
  const table = useReactTable({
    data,
    columns: TeacherColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  return <DataTable table={table} />
}

// students Table
export function StudentsTable({ data }: { data: Array<StudentUser> }) {
  const table = useReactTable({
    data,
    columns: StudentColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  return <DataTable table={table} />
}
