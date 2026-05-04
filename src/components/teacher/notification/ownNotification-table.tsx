import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import DOMPurify from 'dompurify'

import { useEffect, useState } from 'react'
import type {
  ColumnDef,
  PaginationOptions,
  PaginationState,
} from '@tanstack/react-table'
/* filter types*/
import type { NotificationFilter } from '../../../services/api/teacher/types/apiType'
import type {
  Notification,
  NotificationAttachment,
} from '../../../services/api/teacher/types/modelType'

import { useDebounce } from '@/hooks/use-debounce'
import { DataTable } from '@/components/table/data-table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function OwnNotificationTable({
  data,
  columns,
  pagination,
  paginationOptions,
  filters,
  onFilterChange,
}: {
  data: Array<Notification>
  columns: Array<ColumnDef<Notification>>
  pagination: PaginationState
  paginationOptions: {
    onPaginationChange: NonNullable<PaginationOptions['onPaginationChange']>
    rowCount: number
  }
  filters: NotificationFilter
  onFilterChange: (dataFilters: Partial<NotificationFilter>) => void
}) {
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  /* handling table */
  const tablePagination = {
    pageIndex: Math.max(pagination.pageIndex - 1, 0),
    pageSize: pagination.pageSize,
  }
  const pageCount = Math.max(
    1,
    Math.ceil(paginationOptions.rowCount / tablePagination.pageSize),
  )

  const visiblePages = 3
  const currentPageIndex = tablePagination.pageIndex
  const firstShownPage = Math.max(
    0,
    Math.min(currentPageIndex - 1, pageCount - visiblePages),
  )

  const shownPages = Array.from(
    {
      length: Math.min(visiblePages, pageCount - firstShownPage),
    },
    (_, index) => firstShownPage + index,
  )

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) =>
      key !== 'pageIndex' && key !== 'pageSize' && Boolean(value),
  )

  const clearFilters = () => {
    const cleanedFilters = Object.keys(filters).reduce<
      Record<string, undefined>
    >((acc, key) => {
      if (key !== 'pageIndex' && key !== 'pageSize') {
        acc[key] = undefined
      }
      return acc
    }, {})

    onFilterChange(cleanedFilters)
  }

  const table = useReactTable({
    data,
    columns,
    meta: {
      onRowClick: (notification: Notification) => {
        setSelectedNotification(notification)
        setIsDialogOpen(true)
      },
      onViewNotification: (notification: Notification) => {
        setSelectedNotification(notification)
        setIsDialogOpen(true)
      },
    },
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

  const [localSearch, setLocalSearch] = useState(filters.title ?? '')
  const debouncedSearch = useDebounce(localSearch)

  useEffect(() => {
    setLocalSearch(filters.title ?? '')
  }, [filters.title])

  useEffect(() => {
    const nextTitle = debouncedSearch.trim()
    if ((filters.title ?? '') === nextTitle) {
      return
    }

    onFilterChange({
      title: nextTitle || undefined,
      pageIndex: 1,
    })
  }, [debouncedSearch, filters.title, onFilterChange])

  const sanitizeNotificationContent = (content?: string): string | null => {
    if (!content) {
      return null
    }

    const sanitized = DOMPurify.sanitize(content, {
      USE_PROFILES: { html: true },
    })

    const parser = new DOMParser()
    const documentFragment = parser.parseFromString(sanitized, 'text/html')
    const plainText = documentFragment.body.textContent.trim()

    if (!plainText) {
      return null
    }

    return sanitized
  }

  const extractContentAssets = (
    sanitizedHtml: string | null,
    persistedAttachments?: Array<NotificationAttachment>,
  ) => {
    // Start with attachments already stored on the notification.
    const persistedAttachmentMap = new Map(
      (persistedAttachments ?? []).map((attachment) => [
        attachment.href,
        attachment,
      ]),
    )

    if (!sanitizedHtml) {
      return {
        cleanedContent: null,
        attachments: Array.from(persistedAttachmentMap.values()),
      }
    }

    const parser = new DOMParser()
    const documentFragment = parser.parseFromString(sanitizedHtml, 'text/html')

    const attachmentMap = new Map<string, NotificationAttachment>(
      persistedAttachmentMap,
    )

    const imageExtensionRegex = /\.(png|jpe?g|gif|webp|svg|bmp|avif)$/i
    const videoExtensionRegex = /\.(mp4|webm|ogg|mov)$/i
    const docExtensionRegex = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|zip|rar)$/i

    const inferKindFromUrl = (url: string): NotificationAttachment['kind'] => {
      if (imageExtensionRegex.test(url)) {
        return 'image'
      }

      if (videoExtensionRegex.test(url)) {
        return 'video'
      }

      return 'document'
    }

    const inferExtensionFromUrl = (url: string): string => {
      return url.split('.').pop()?.toUpperCase() ?? 'FILE'
    }

    // Add one attachment only once, and auto-generate missing label/metadata.
    const addAttachment = (href: string, label?: string) => {
      const normalizedHref = href.trim()
      if (!normalizedHref) {
        return
      }

      const existing = attachmentMap.get(normalizedHref)
      if (existing) {
        return
      }

      const inferredLabel =
        label?.trim() ||
        normalizedHref.split('/').pop() ||
        `${inferKindFromUrl(normalizedHref).toUpperCase()} Attachment`

      attachmentMap.set(normalizedHref, {
        href: normalizedHref,
        label: inferredLabel,
        extension: inferExtensionFromUrl(normalizedHref),
        kind: inferKindFromUrl(normalizedHref),
      })
    }

    documentFragment.querySelectorAll('img').forEach((image) => {
      const src = image.getAttribute('src')?.trim()
      if (!src) {
        return
      }

      addAttachment(src, image.getAttribute('alt') ?? undefined)
      image.remove()
    })

    documentFragment.querySelectorAll('video').forEach((video) => {
      const directSource = video.getAttribute('src')?.trim()
      if (directSource) {
        addAttachment(directSource)
      }

      video.querySelectorAll('source').forEach((sourceElement) => {
        const nestedSource = sourceElement.getAttribute('src')?.trim()
        if (!nestedSource) {
          return
        }

        addAttachment(nestedSource)
      })

      video.remove()
    })

    documentFragment.querySelectorAll('a').forEach((anchor) => {
      const href = anchor.getAttribute('href')?.trim()
      if (!href) {
        return
      }

      if (
        !imageExtensionRegex.test(href) &&
        !videoExtensionRegex.test(href) &&
        !docExtensionRegex.test(href)
      ) {
        return
      }

      addAttachment(href, anchor.textContent)
      // Remove media/document links from rich text so they are shown only in the attachment list.
      anchor.remove()
    })

    const cleanedContent = documentFragment.body.innerHTML.trim()

    return {
      cleanedContent: cleanedContent || null,
      attachments: Array.from(attachmentMap.values()),
    }
  }

  const sanitizedContent = sanitizeNotificationContent(
    selectedNotification?.content,
  )
  const { cleanedContent, attachments } = extractContentAssets(
    sanitizedContent,
    selectedNotification?.attachments,
  )

  const getAttachmentIcon = (attachment: NotificationAttachment) => {
    if (attachment.kind === 'image') {
      return 'image'
    }

    if (attachment.kind === 'video') {
      return 'video_file'
    }

    if (attachment.extension === 'PDF') {
      return 'picture_as_pdf'
    }

    return 'description'
  }

  return (
    <>
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="material-symbols-outlined text-slate-400">
              search
            </span>
          </div>
          <input
            className="block w-full rounded-lg border-none bg-white dark:bg-slate-800 py-2.5 pl-10 pr-3 text-sm text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-primary"
            placeholder="Search notifications by title..."
            type="text"
            value={localSearch}
            onChange={(event) => {
              setLocalSearch(event.target.value)
            }}
            onKeyDown={(event) => {
              if (event.key !== 'Enter') {
                return
              }

              event.preventDefault()
              const nextTitle = localSearch.trim()
              setLocalSearch(nextTitle)
              onFilterChange({
                title: nextTitle || undefined,
                pageIndex: 1,
              })
            }}
          />
        </div>
        <div className="flex gap-3">
          <select
            className="block w-full sm:w-40 rounded-lg border-none bg-white dark:bg-slate-800 py-2.5 pl-3 pr-10 text-sm text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary cursor-pointer"
            value={filters.type ?? ''}
            onChange={(event) => {
              const nextType = event.target.value as NotificationFilter['type']
              onFilterChange({
                type: nextType || undefined,
                pageIndex: 1,
              })
            }}
          >
            <option value="">All Types</option>
            <option value="Urgent">Urgent</option>
            <option value="Teacher">Teacher</option>
            <option value="Administrative">Administrative</option>
            <option value="User">User</option>
            <option value="Grade">Grade</option>
            <option value="Book">Book</option>
          </select>
        </div>
      </div>
      <DataTable
        table={table}
        columns={columns}
        shownPages={shownPages}
        firstShownPage={firstShownPage}
        pageCount={pageCount}
        hasActiveFilters={hasActiveFilters}
        clearFilters={clearFilters}
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {selectedNotification?.title ?? 'Notification Details'}
            </DialogTitle>
            <DialogDescription>
              {selectedNotification?.time ?? ''}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Type
              </p>
              <p className="mt-1 text-sm text-slate-900 dark:text-white">
                {selectedNotification?.type ?? '-'}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Audience
              </p>
              <p className="mt-1 text-sm text-slate-900 dark:text-white">
                {selectedNotification?.sendTo?.join(', ') || '-'}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Subject
              </p>
              <p className="mt-1 text-sm text-slate-900 dark:text-white">
                {selectedNotification?.subject ?? '-'}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Content
              </p>
              {cleanedContent ? (
                <div
                  className="mt-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/30 p-3 text-sm text-slate-700 dark:text-slate-200 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:text-base [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:leading-6 [&_p+*]:mt-2 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{
                    __html: cleanedContent,
                  }}
                />
              ) : (
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">
                  No content available.
                </p>
              )}
            </div>

            {attachments.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Attachments
                </p>
                <div className="mt-2 space-y-2">
                  {attachments.map((attachment) => (
                    <a
                      key={attachment.href}
                      href={attachment.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 px-3 py-2 hover:border-primary/40 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="min-w-0 flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-[20px]">
                          {getAttachmentIcon(attachment)}
                        </span>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                            {attachment.label}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {attachment.extension}
                          </p>
                        </div>
                      </div>

                      <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-[18px]">
                        open_in_new
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
