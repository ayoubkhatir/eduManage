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
import { Inbox } from 'lucide-react'

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
              className="border-b border-border bg-muted/40"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="text-muted-foreground font-semibold text-xs uppercase tracking-wider"
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
                className="border-b border-border transition-colors hover:bg-muted/30"
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
                className="h-48 text-center"
              >
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted/50">
                    <Inbox className="size-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      No resources found
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
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
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-muted/40">
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <Skeleton className="h-3 w-16 bg-muted rounded" />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-t border-border"
            >
              {Array.from({ length: cols }).map((__, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <Skeleton className="h-4 w-full bg-muted rounded" />
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
