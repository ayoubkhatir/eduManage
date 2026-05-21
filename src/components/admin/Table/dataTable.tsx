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
import type { TeacherUser } from '#/types/teacherTypes'
import type { StudentUser } from '#/types/studentTypes'

interface DataTableProps<TData> {
  table: Tab<TData>
}

export default function DataTable<TData>({ table }: DataTableProps<TData>) {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="text-slate-600 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider"
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
                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors duration-150"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-32 text-center"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">
                    inbox
                  </span>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    No results found
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
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
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-slate-50/80 dark:bg-slate-800/60">
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <Skeleton className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-t border-slate-100 dark:border-slate-700"
            >
              {Array.from({ length: cols }).map((__, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <Skeleton className="h-4 w-full bg-slate-100 dark:bg-slate-700 rounded" />
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
