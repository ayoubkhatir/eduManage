import type { ColumnDef } from '@tanstack/react-table'

import type { Notification } from '@/services/api/teacher/types/modelType'
import { notificationFetcher } from '@/services/api/teacher/notification/fetcher'

const getColors = (type: string) => {
  switch (type) {
    case 'Urgent':
      return {
        bg: 'bg-red-50',
        text: 'text-red-500',
        darkBg: 'dark:bg-red-500/10',
        ring: 'ring-red-500/20',
        border: 'border-red-500',
      }
    case 'Book':
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-500',
        darkBg: 'dark:bg-purple-500/10',
        ring: 'ring-purple-500/20',
        border: 'border-purple-500',
      }
    case 'Teacher':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-500',
        darkBg: 'dark:bg-blue-500/10',
        ring: 'ring-blue-500/20',
        border: 'border-blue-500',
      }
    case 'Grade':
      return {
        bg: 'bg-green-50',
        text: 'text-green-500',
        darkBg: 'dark:bg-green-500/10',
        ring: 'ring-green-500/20',
        border: 'border-green-500',
      }
    case 'User':
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-500',
        darkBg: 'dark:bg-orange-500/10',
        ring: 'ring-orange-500/20',
        border: 'border-orange-500',
      }
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-500',
        darkBg: 'dark:bg-gray-500/10',
        ring: 'ring-gray-500/20',
        border: 'border-gray-500',
      }
  }
}
export const columns: Array<ColumnDef<Notification>> = [
  {
    accessorKey: 'title',
    header: 'Title',
    size: 40,
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1 min-w-0">
          <span className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">
            {row.original.title}
          </span>
          <span className="text-slate-400 text-xs mt-1">
            {row.original.time}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'audience',
    header: 'Audience',
    size: 25,
    cell: ({ row }) => {
      return (
        <div className="flex flex-wrap gap-1">
          <div className="flex items-center justify-center px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium border border-blue-100 dark:border-blue-800">
            {row.original.sendTo?.[0]}
          </div>
          {row.original.sendTo?.[1] && (
            <div className="flex items-center justify-center px-2 py-1 rounded bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-medium border border-purple-100 dark:border-purple-800">
              {row.original.sendTo[1]}
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    size: 18,
    cell: ({ row }) => {
      const type = row.original.type
      const colors = getColors(type)
      return (
        <span
          className={`inline-flex items-center rounded-md ${colors.bg} ${colors.darkBg} px-2 py-0.5 text-xs font-medium ${colors.text} ring-1 ring-inset ${colors.ring}`}
        >
          {type}
        </span>
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    size: 17,
    cell: ({ row }) => {
      const id = row.original.id
      return (
        <div className="flex items-center justify-end gap-2">
          <button
            className="rounded p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors cursor-pointer"
            title={`Edit ${id}`}
            type="button"
            onClick={(event) => {
              event.stopPropagation()
            }}
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </button>
          <button
            className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors cursor-pointer"
            title={`Delete ${id}`}
            type="button"
            onClick={async (event) => {
              event.stopPropagation()
              await notificationFetcher.deleteOwnNotification(id)
            }}
          >
            <span className="material-symbols-outlined text-[20px]">
              delete
            </span>
          </button>
        </div>
      )
    },
  },
]
