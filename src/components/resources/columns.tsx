import type { ResourceDto } from '#/types/resourcesTypes'
import type { ColumnDef } from '@tanstack/react-table'
import { Download, Trash2 } from 'lucide-react'

type ResourceColumnActions = {
  onDownload?: (resource: ResourceDto) => void
  onDelete?: (resource: ResourceDto) => void
}

const typeConfig: Record<string, { label: string; bg: string; text: string; ring: string }> = {
  pdf: {
    label: 'PDF',
    bg: 'bg-red-50 dark:bg-red-950/40',
    text: 'text-red-600 dark:text-red-400',
    ring: 'ring-red-500/20 dark:ring-red-400/20',
  },
  docx: {
    label: 'DOCX',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-600 dark:text-blue-400',
    ring: 'ring-blue-500/20 dark:ring-blue-400/20',
  },
  xlsx: {
    label: 'XLSX',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-600 dark:text-emerald-400',
    ring: 'ring-emerald-500/20 dark:ring-emerald-400/20',
  },
  png: {
    label: 'PNG',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-600 dark:text-amber-400',
    ring: 'ring-amber-500/20 dark:ring-amber-400/20',
  },
  zip: {
    label: 'ZIP',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    text: 'text-violet-600 dark:text-violet-400',
    ring: 'ring-violet-500/20 dark:ring-violet-400/20',
  },
  mp4: {
    label: 'MP4',
    bg: 'bg-pink-50 dark:bg-pink-950/40',
    text: 'text-pink-600 dark:text-pink-400',
    ring: 'ring-pink-500/20 dark:ring-pink-400/20',
  },
  pptx: {
    label: 'PPTX',
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    text: 'text-orange-600 dark:text-orange-400',
    ring: 'ring-orange-500/20 dark:ring-orange-400/20',
  },
  txt: {
    label: 'TXT',
    bg: 'bg-slate-50 dark:bg-slate-800',
    text: 'text-slate-600 dark:text-slate-400',
    ring: 'ring-slate-400/20 dark:ring-slate-500/20',
  },
}

function getTypeConfig(type: string) {
  return typeConfig[type] ?? {
    label: type.toUpperCase(),
    bg: 'bg-slate-50 dark:bg-slate-800',
    text: 'text-slate-600 dark:text-slate-400',
    ring: 'ring-slate-400/20 dark:ring-slate-500/20',
  }
}

export function getResourceColumns({
  onDownload,
  onDelete,
}: ResourceColumnActions = {}): Array<ColumnDef<ResourceDto>> {
  return [
  {
    id: 'fileName',
    header: 'File Name',
    cell: ({ row }) => {
      const fileName = row.original.fileName
      const fileType = row.original.type || ''

      return (
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/30">
            <span
              className={`text-xs font-bold ${
                getTypeConfig(fileType).text
              }`}
            >
              {fileType.toUpperCase() || '??'}
            </span>
          </div>
          <span className="truncate text-sm font-medium text-foreground">
            {fileName}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const fileType = row.original.type || ''
      const config = getTypeConfig(fileType)

      return (
        <span
          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${config.bg} ${config.text} ${config.ring}`}
        >
          {config.label}
        </span>
      )
    },
  },
  {
    accessorKey: 'dateAdded',
    header: 'Date Added',
    cell: ({ row }) => {
      const value = row.original.dateAdded
      if (!value) return <span className="text-muted-foreground">—</span>
      const date = new Date(value)
      const formatted = date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
      return (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {formatted}
        </span>
      )
    },
  },
  {
    accessorKey: 'size',
    header: 'Size',
    cell: ({ row }) => {
      const size = row.original.size
      return (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {size || '—'}
        </span>
      )
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const resource = row.original
      const fileName = resource.fileName

      return (
        <div className="flex items-center justify-end gap-1">
          <button
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            title={`Download ${fileName}`}
            type="button"
            onClick={() => {
              if (resource.fileUrl) {
                onDownload?.(resource)
                window.open(resource.fileUrl, '_blank', 'noopener,noreferrer')
              }
            }}
            disabled={!resource.fileUrl}
          >
            <Download className="size-4" />
          </button>

          {onDelete && (
            <button
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              title={`Delete ${fileName}`}
              type="button"
              onClick={() => onDelete(resource)}
            >
              <Trash2 className="size-4" />
            </button>
          )}
        </div>
      )
    },
  },
  ]
}
