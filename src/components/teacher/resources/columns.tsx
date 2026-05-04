import type { ColumnDef } from '@tanstack/react-table'

import type { Resource } from '@/services/api/teacher/types/modelType'

const typeUrl: Partial<Record<string, { icon: string; color: string }>> = {
  pdf: {
    icon: 'picture_as_pdf',
    color: 'text-red-500 dark:text-red-400',
  },
  docx: {
    icon: 'description',
    color: 'text-blue-500 dark:text-blue-400',
  },
  xlsx: {
    icon: 'grid_on',
    color: 'text-green-500 dark:text-green-400',
  },
  png: {
    icon: 'image',
    color: 'text-yellow-500 dark:text-yellow-400',
  },
  zip: {
    icon: 'folder_zip',
    color: 'text-purple-500 dark:text-purple-400',
  },
  mp4: {
    icon: 'movie',
    color: 'text-pink-500 dark:text-pink-400',
  },
}

export const columns: Array<ColumnDef<Resource>> = [
  {
    id: 'fileName',
    header: 'File Name',
    cell: ({ row }) => {
      const fileName = row.original.fileName
      const fileType = row.original.type || ''
      return (
        <div className="flex items-center gap-2">
          <span
            className={`material-symbols-outlined text-[20px] ${typeUrl[fileType]?.color || 'text-slate-500 dark:text-slate-400'}`}
          >
            {typeUrl[fileType]?.icon}
          </span>
          {fileName}
        </div>
      )
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'dateAdded',
    header: 'Date Added',
  },
  {
    accessorKey: 'size',
    header: 'Size',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const fileName = row.original.fileName

      return (
        <div className="flex items-center justify-end gap-2">
          <button
            className="rounded p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors cursor-pointer"
            title={`Download ${fileName}`}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">
              download
            </span>
          </button>
          <button
            className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors cursor-pointer"
            title={`Delete ${fileName}`}
            type="button"
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
