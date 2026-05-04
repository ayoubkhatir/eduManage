import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { zodValidator } from '@tanstack/zod-adapter'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  addResourceSchema,
  formatFileSize,
  getResourcesSchema,
  type AddResourceSchema,
} from '#/schemas/resources.schema'
import { columns } from '@/components/resources/columns'
import { ResourcesTable } from '#/components/teacher/resources/resources-table'
import { getResourcesQueryOptions } from '#/services/api/resources.hooks'
import { Button } from '#/components/ui/button'
import { PlusCircleIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { ResourceTypeEnum, StatusEnum } from '#/server/db/schema'
import { addResourceServerFn } from '#/server/modules/resources/resources.server-functions'
import { toast } from 'sonner'
import { useState } from 'react'
import { SimpleDocumentUpload } from '#/components/cloudinary-uploader'
import z from 'zod'

export const Route = createFileRoute('/teacher/subjects/$subjectCode')({
  component: StudentResourcesPage,
  pendingComponent: StudentResourcesPending,
  validateSearch: zodValidator(
    getResourcesSchema.omit({ teacherId: true, subjectCode: true }),
  ),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, params: { subjectCode }, deps }) => {
    // IMPORTANT:
    // replace this with the real student profile id if authState.user.id is only the auth user id

    await context.queryClient.ensureQueryData(
      getResourcesQueryOptions({
        ...deps,
        subjectCode,
        teacherId: context.authState.user.roleId,
      }),
    )
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

function StudentResourcesContent() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const { authState } = Route.useRouteContext()

  const { subjectCode } = Route.useParams()
  const { data, status } = useQuery(
    getResourcesQueryOptions({
      ...search,
      subjectCode,
      teacherId: authState.user.roleId,
    }),
  )

  const pagination = {
    pageIndex: search.pageIndex,
    pageSize: search.pageSize,
  }

  function setFilters(nextFilters: Partial<typeof search>) {
    navigate({
      to: '.',
      search: (prev) => ({
        ...prev,
        ...nextFilters,
      }),
      replace: true,
    })
  }

  return (
    <main className="flex-1 overflow-y-auto bg-background-light p-4 dark:bg-background-dark md:p-8">
      <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="flex items-center justify-between flex-1">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#0d121b] dark:text-white md:text-4xl">
              Learning Resources
            </h1>
            <p className="mt-2 text-base text-[#4c669a] dark:text-gray-400">
              Access educational materials, assignments, and reference docs
              shared by your teachers.
            </p>
          </div>
          <AddResourceDialog
            teacherId={authState.user.roleId}
            schoolId={'r0akyppqt5jl'}
            subjectCode={subjectCode}
          />
        </div>
      </div>

      {status === 'pending' ? (
        <div className="text-sm text-slate-500">Loading resources...</div>
      ) : status === 'error' ? (
        <div className="text-sm text-red-500">Failed to load resources.</div>
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

              setFilters({
                pageIndex: nextPagination.pageIndex,
                pageSize: nextPagination.pageSize,
              })
            },
          }}
          filters={search}
          onFilterChange={setFilters}
        />
      )}
    </main>
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

  const [file, setFile] = useState<File | null>(null)
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
            {/* <label className="text-sm font-medium">File name</label> */}
            {/* <input
              type="file"
              placeholder="Algebra Basics.pdf"
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            /> */}
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
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
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
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
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
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
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
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
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
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
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
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
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
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
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
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
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
