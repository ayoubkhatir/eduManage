import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { zodValidator } from '@tanstack/zod-adapter'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  addResourceSchema,
  formatFileSize,
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
import { Button } from '#/components/ui/button'
import {
  PlusCircleIcon,
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
import { useForm } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog'
import { ResourceTypeEnum, StatusEnum } from '#/server/db/schema'
import {
  addResourceServerFn,
  deleteResourceServerFn,
} from '#/server/modules/resources/resources.server-functions'
import { toast } from 'sonner'
import { useMemo, useState, useEffect } from 'react'
import { SimpleDocumentUpload } from '#/components/cloudinary-uploader'
import { motion } from 'framer-motion'
import z from 'zod'
import type { AddResourceSchema } from '#/types/resourcesTypes'
import { FetchCurrentUserServerFn } from '#/routes/-fetchAuthStateInBeforeLoad'
import type { TeacherUser } from '#/types/teacherTypes'
import useDebounce from '#/hooks/use-debounce'

export const Route = createFileRoute('/_auth/teacher/subjects/$subjectCode')({
  component: StudentResourcesPage,
  pendingComponent: StudentResourcesPending,
  validateSearch: zodValidator(
    getResourcesSchema.omit({ teacherId: true, subjectCode: true }),
  ),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, params: { subjectCode }, deps }) => {
      const currentUser = (await FetchCurrentUserServerFn({
            data: context.authState.user!,
          })) as TeacherUser
    
    if (!currentUser) throw new Error('Unauthorized')

    await context.queryClient.ensureQueryData(
      getResourcesQueryOptions({
        ...deps,
        subjectCode,
        teacherId: currentUser.info.id,
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
  const queryClient = useQueryClient()
  const { currentUser } = Route.useLoaderData()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [resourceToDelete, setResourceToDelete] = useState<
    { id: string; fileName: string } | undefined
  >(undefined)
  const [localSize, setLocalSize] = useState(search.size)
  const debouncedSize = useDebounce(localSize, 500)
  const [localClassId, setLocalClassId] = useState(search.classId ?? '')
  const debouncedClassId = useDebounce(localClassId, 500)

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

  const activeFilterCount = useMemo(
    () =>
      [search.fileName, search.type, search.size, search.dateAdded].filter(Boolean).length +
      (search.classId ? 1 : 0),
    [search],
  )

  const hasActiveFilters = useMemo(
    () =>
      search.fileName !== '' ||
      search.type !== '' ||
      search.size !== '' ||
      search.dateAdded !== '' ||
      search.classId !== undefined,
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

  const { mutate: deleteResource, isPending: isDeleting } = useMutation({
    mutationFn: async (resourceId: string) => {
      const response = await deleteResourceServerFn({ data: resourceId })
      if (response.success) return response.data
      throw new Error('Failed to delete resource')
    },
    onSuccess: async () => {
      toast.success('Resource deleted')
      await queryClient.invalidateQueries({ queryKey: ['resources'] })
      setDeleteOpen(false)
      setResourceToDelete(undefined)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete resource')
    },
  })

  const columns = useMemo(
    () =>
      getResourceColumns({
        onDelete: (resource) => {
          setResourceToDelete({
            id: resource.id,
            fileName: resource.fileName,
          })
          setDeleteOpen(true)
        },
      }),
    [deleteResource],
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
          <AddResourceDialog
            teacherId={currentUser.info.id}
            schoolId={currentUser.info.schoolId}
            subjectCode={subjectCode}
          />
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

        <AlertDialog
          open={deleteOpen}
          onOpenChange={(open) => {
            setDeleteOpen(open)
            if (!open) setResourceToDelete(undefined)
          }}
        >
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              
              <AlertDialogTitle>
                Delete {resourceToDelete?.fileName ?? 'this resource'}?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-700 dark:text-slate-300">
                This will permanently delete the resource. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="space-x-2">
              <AlertDialogCancel
                variant="outline"
                className="cursor-pointer"
                disabled={isDeleting}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="cursor-pointer bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500"
                disabled={isDeleting || !resourceToDelete}
                onClick={() => {
                  if (!resourceToDelete) return
                  deleteResource(resourceToDelete.id)
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.main>
  )
}

function useAddResource(
  teacherId: string,
  schoolId: string,
  subjectCode: string,
  onCreated?: () => void,
) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const customSchema = addResourceSchema
    .omit({ type: true })
    .extend({ type: z.string() })

  const form = useForm<z.infer<typeof customSchema>>({
    resolver: standardSchemaResolver(customSchema),
    defaultValues: {
      visibility: 'class',
      fileUrl: '',
      type: ResourceTypeEnum.PDF,
      teacherId,
      schoolId,
      subjectCode,
      classId: undefined,
      size: '',
      status: StatusEnum.NEW,
      description: '',
      fileName: '',
    },
  })

  const { mutate: addResource, isPending } = useMutation({
    mutationFn: async (input: AddResourceSchema) => {
      const response = await addResourceServerFn({ data: input })
      if (response.success) return response.data
      throw new Error('Error occured')
    },
    onSuccess: async () => {
      toast.success('Resource added')

      await queryClient.invalidateQueries({
        queryKey: ['resources'],
      })

      router.invalidate()

      form.reset({
        visibility: 'class',
        fileUrl: '',
        type: ResourceTypeEnum.PDF,
        teacherId,
        schoolId,
        subjectCode,
        classId: undefined,
        size: '',
        status: StatusEnum.NEW,
        description: '',
        fileName: '',
      })

      onCreated?.()
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to add resource',
      )
    },
  })

  function onSubmit(data: AddResourceSchema) {
    addResource(data)
  }

  return { form, onSubmit, isPending }
}

function AddResourceDialog({
  teacherId,
  schoolId,
  subjectCode,
}: {
  teacherId: string
  schoolId: string
  subjectCode: string
}) {
  const [open, setOpen] = useState(false)

  const { form, onSubmit, isPending } = useAddResource(
    teacherId,
    schoolId,
    subjectCode,
    () => setOpen(false),
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircleIcon className="mr-2 size-4" />
          Add Resource
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80%] sm:max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Resource</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit as any)}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <div className="flex flex-col gap-2 md:col-span-2">
            <SimpleDocumentUpload
              label="File"
              onChange={({ bytes, format, original_filename, url }) => {
                form.setValue('type', format as any)
                form.setValue('fileName', original_filename)
                form.setValue('size', formatFileSize(bytes))
                form.setValue('fileUrl', url)
              }}
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium">File name</label>
            <input
              type="text"
              placeholder="Algebra Basics.pdf"
              {...form.register('fileName')}
              className="h-11 rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-primary"
            />
            {form.formState.errors.fileName ? (
              <p className="text-sm text-red-500">
                {form.formState.errors.fileName.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Type</label>
            <select
              value={form.watch('type')}
              onChange={(e) =>
                form.setValue(
                  'type',
                  e.target.value as AddResourceSchema['type'],
                  {
                    shouldValidate: true,
                    shouldDirty: true,
                  },
                )
              }
              className="h-11 rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-primary"
            >
              {Object.values(ResourceTypeEnum).map((type) => (
                <option key={type} value={type}>
                  {type.toUpperCase()}
                </option>
              ))}
            </select>
            {form.formState.errors.type ? (
              <p className="text-sm text-red-500">
                {form.formState.errors.type.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Size</label>
            <input
              type="text"
              placeholder="2.4 MB"
              {...form.register('size')}
              className="h-11 rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-primary"
            />
            {form.formState.errors.size ? (
              <p className="text-sm text-red-500">
                {form.formState.errors.size.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium">File URL</label>
            <input
              type="text"
              placeholder="https://..."
              {...form.register('fileUrl')}
              className="h-11 rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-primary"
            />
            {form.formState.errors.fileUrl ? (
              <p className="text-sm text-red-500">
                {form.formState.errors.fileUrl.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Visibility</label>
            <select
              value={form.watch('visibility')}
              onChange={(e) =>
                form.setValue('visibility', e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              className="h-11 rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-primary"
            >
              <option value="class">Class</option>
              <option value="subject">Subject</option>
              <option value="school">School</option>
            </select>
            {form.formState.errors.visibility ? (
              <p className="text-sm text-red-500">
                {form.formState.errors.visibility.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Status</label>
            <select
              value={form.watch('status')}
              onChange={(e) =>
                form.setValue(
                  'status',
                  e.target.value as AddResourceSchema['status'],
                  {
                    shouldValidate: true,
                    shouldDirty: true,
                  },
                )
              }
              className="h-11 rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-primary"
            >
              {Object.values(StatusEnum).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {form.formState.errors.status ? (
              <p className="text-sm text-red-500">
                {form.formState.errors.status.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium">Class ID (optional)</label>
            <input
              type="text"
              placeholder="Paste class id if this file is for one class only"
              value={form.watch('classId') ?? ''}
              onChange={(e) =>
                form.setValue('classId', e.target.value || undefined, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              className="h-11 rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-primary"
            />
            {form.formState.errors.classId ? (
              <p className="text-sm text-red-500">
                {form.formState.errors.classId.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              rows={4}
              placeholder="Short note about this resource..."
              {...form.register('description')}
              className="rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
            />
            {form.formState.errors.description ? (
              <p className="text-sm text-red-500">
                {form.formState.errors.description.message}
              </p>
            ) : null}
          </div>

          <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Resource'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
