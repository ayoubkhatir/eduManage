
import { createFileRoute} from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { zodValidator } from '@tanstack/zod-adapter'
import { useQuery } from '@tanstack/react-query'

import {
  getResourcesSchema,
} from '#/schemas/resources.schema'
import { SearchInput } from '#/components/admin/SearchInput'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '#/components/ui/select'
import { getResourceColumns } from '@/components/resources/columns'
import { ResourcesTable } from '#/components/teacher/resources/resources-table'
import { getResourcesQueryOptions } from '#/hooks/resources/hooks'

import {
  Search,
  FileType,
  HardDrive,
  Calendar,
  ArrowUpDown,
  X,
  FilterX,
  AlertCircle,
  BookOpen,
} from 'lucide-react'
import { ResourceTypeEnum} from '#/server/db/schema'

import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FetchCurrentUserServerFn } from '#/routes/-fetchAuthStateInBeforeLoad'
import type { StudentUser } from '#/types/studentTypes'
import useDebounce from '#/hooks/use-debounce'

export const Route = createFileRoute('/_auth/student/subjects/$subjectCode')({
  component: StudentResourcesPage,
  pendingComponent: StudentResourcesPending,
  validateSearch: zodValidator(
    getResourcesSchema.omit({ studentId: true, subjectCode: true }),
  ),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, params: { subjectCode }, deps }) => {
      const currentUser = (await FetchCurrentUserServerFn({
                          data: context.authState.user!,
                          })) as StudentUser
          
      if (!currentUser) throw new Error('Unauthorized')

    await context.queryClient.ensureQueryData(
      getResourcesQueryOptions({
        ...deps,
        subjectCode,
        studentId: currentUser.info.id,
      }),
    )
    return { currentUser }
  },
})

function StudentResourcesPending() {
  return (
    <Skeleton name="student-resources-page" loading>
      <StudentResourcesContent />
    </Skeleton>
  )
}

function StudentResourcesPage() {
  return (
    <Skeleton name="student-resources-page" loading={false}>
      <StudentResourcesContent />
    </Skeleton>
  )
}

const typeOptions = [
  { value: 'all', label: 'All types' },
  ...Object.values(ResourceTypeEnum).map((t) => ({ value: t, label: t.toUpperCase() })),
]

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'size', label: 'Size' },
] as const

function StudentResourcesContent() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  
  const { currentUser } = Route.useLoaderData()
  const [localSize, setLocalSize] = useState(search.size)
  const debouncedSize = useDebounce(localSize, 500)
  const [localClassId, setLocalClassId] = useState(search.classId ?? '')
  const debouncedClassId = useDebounce(localClassId, 500)

  function updateSearch(nextSearch: Partial<typeof search>) {
    navigate({
      search: (current) => ({
        ...current,
        ...nextSearch,
      }),
    })
  }

  useEffect(() => {
    if (debouncedSize !== search.size) {
      updateSearch({ size: debouncedSize, pageIndex: 1 })
    }
  }, [debouncedSize])

  useEffect(() => {
    const classIdToUpdate = debouncedClassId || undefined
    if (classIdToUpdate !== search.classId) {
      updateSearch({ classId: classIdToUpdate, pageIndex: 1 })
    }
  }, [debouncedClassId])

  const { subjectCode } = Route.useParams()
  const { data, status } = useQuery(
    getResourcesQueryOptions({
      ...search,
      subjectCode,
      teacherId: currentUser.info.id,
    }),
  )

  const pagination = {
    pageIndex: search.pageIndex,
    pageSize: search.pageSize,
  }

  const hasActiveFilters = useMemo(
    () =>
      search.fileName !== '' ||
      search.type !== '' ||
      search.size !== '' ||
      search.dateAdded !== '' ||
      search.classId !== undefined,
    [search],
  )

  const activeFilterCount = useMemo(
    () =>
      [search.fileName, search.type, search.size, search.dateAdded].filter(Boolean).length +
      (search.classId ? 1 : 0),
    [search],
  )

  function clearAllFilters() {
    navigate({
      search: {
        fileName: '',
        type: '',
        dateAdded: '',
        size: '',
        sortBy: search.sortBy,
        pageIndex: 1,
        pageSize: search.pageSize,
        classId: undefined,
      },
    })
  }

  

  const columns = useMemo(
      () => getResourceColumns(),
      [],
  )

  return (
    <motion.main
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 overflow-y-auto bg-background-light p-4 dark:bg-background-dark md:p-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#0d121b] dark:text-white md:text-4xl">
              Learning Resources
            </h1>
            <p className="mt-2 text-base text-[#4c669a] dark:text-gray-400">
              Manage and organize educational materials, assignments, and reference documents.
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            <div className="relative sm:col-span-2 lg:col-span-1 xl:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
              <SearchInput
                className="h-10 rounded-lg border-border bg-muted/30 pl-9 text-sm shadow-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring/40"
                placeholder="Search by file name..."
                value={search.fileName}
                onSearch={(value) =>
                  updateSearch({ fileName: value, pageIndex: 1 })
                }
              />
            </div>

            <Select
              
              value={search.type || 'all'}
              onValueChange={(v) =>
                updateSearch({ type: v === 'all' ? '' : v, pageIndex: 1 })
              }
            >
              <SelectTrigger className="h-10 w-full rounded-lg border-border bg-muted/30 text-sm shadow-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring/40 ">
                <FileType className="mr-2 size-4 shrink-0 text-muted-foreground" />
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent className="border-border bg-card">
                {typeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <HardDrive className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="number"
                inputMode="decimal"
                min="0"
                value={localSize ? localSize.replace(/\s*mb$/i, '') : ''}
                onChange={(e) =>
                  setLocalSize(e.target.value ? `${e.target.value} MB` : '')
                }
                className="h-9 w-full rounded-lg border border-border bg-muted/30 pl-9 pr-12 text-sm text-foreground outline-none transition-[color,box-shadow,background-color] placeholder:text-muted-foreground hover:bg-muted/50 focus:border-ring focus:ring-[3px] focus:ring-ring/40 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder="Size"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                MB
              </span>
            </div>

            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="date"
                value={search.dateAdded}
                onChange={(e) =>
                  updateSearch({ dateAdded: e.target.value, pageIndex: 1 })
                }
                className="h-9 w-full rounded-lg border border-border bg-muted/30 pl-9 pr-8 text-sm text-foreground outline-none transition-[color,box-shadow,background-color] hover:bg-muted/50 focus:border-ring focus:ring-[3px] focus:ring-ring/40"
              />
              {search.dateAdded && (
                <button
                  type="button"
                  onClick={() => updateSearch({ dateAdded: '', pageIndex: 1 })}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <Select
              value={search.sortBy}
              onValueChange={(v) =>
                updateSearch({ sortBy: v as typeof search.sortBy, pageIndex: 1 })
              }
            >
              <SelectTrigger className="h-10 w-full rounded-lg border-border bg-muted/30 text-sm shadow-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring/40">
                <ArrowUpDown className="mr-2 size-4 shrink-0 text-muted-foreground" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="border-border bg-card">
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <BookOpen className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="h-10 w-full rounded-lg border border-border bg-muted/30 pl-9 pr-8 text-sm text-foreground outline-none transition-[color,box-shadow,background-color] placeholder:text-muted-foreground hover:bg-muted/50 focus:border-ring focus:ring-[3px] focus:ring-ring/40"
                placeholder="Class ID"
                value={localClassId}
                onChange={(event) =>
                  setLocalClassId(event.target.value)
                }
              />
              {localClassId && (
                <button
                  type="button"
                  onClick={() => setLocalClassId('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
              <span className="text-xs font-medium text-muted-foreground">
                {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
              </span>
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <FilterX className="size-3.5" />
                Clear all
              </button>
            </div>
          )}
        </div>

        {status === 'pending' ? (
          <div className="rounded-xl border border-border bg-card p-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-3 flex-1 animate-pulse rounded bg-muted" />
                ))}
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-1/6 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-1/6 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-1/6 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-1/12 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        ) : status === 'error' ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-12 text-center dark:border-red-900 dark:bg-red-950/30">
            <AlertCircle className="mx-auto mb-3 size-10 text-red-400" />
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              Failed to load resources.
            </p>
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">
              Please try refreshing the page.
            </p>
          </div>
        ) : (
          <ResourcesTable
            data={data.data}
            columns={columns}
            pagination={pagination}
            paginationOptions={{
              rowCount: data.pagination.totalCount,
              onPaginationChange: (paginationState) => {
                const nextPagination =
                  typeof paginationState === 'function'
                    ? paginationState(pagination)
                    : paginationState

                navigate({
                  search: (s) => ({
                    ...s,
                    pageIndex: nextPagination.pageIndex,
                    pageSize: nextPagination.pageSize,
                  }),
                })
              },
            }}
          />
        )}
      </div>
    </motion.main>
  )
}