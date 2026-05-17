import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'

import { columns } from '../../../components/teacher/resources/columns.tsx'

import type { Resource } from '@/services/api/teacher/types/modelType.ts'

import { ResourcesTable } from '@/components/teacher/resources/resources-table.tsx'
import { useFilterResource } from '@/hooks/teacher/use-filter-resource.ts'
import useGetResources, {
  getCollectionQueryOptions,
  getResourcesQueryOptions,
  useGetCollection,
} from '@/services/api/teacher/collection/hooks'
import { getResourcesSchema } from '#/schemas/resources.schema.ts'

export const Route = createFileRoute('/teacher/classes/$folderId')({
  component: RouteComponent,
  pendingComponent: TeacherFolderPending,
  loaderDeps: ({ search }) => search,
  loader: async ({ params, deps: searchQueries, context }) => {
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    return Promise.all([
      context.queryClient.ensureQueryData(
        getCollectionQueryOptions(params.folderId),
      ),
      context.queryClient.ensureQueryData(
        getResourcesQueryOptions(params.folderId, searchQueries),
      ),
    ])
  },
  validateSearch: getResourcesSchema,
})

function TeacherFolderPending() {
  return (
    <Skeleton name="teacher-class-folder-page" loading>
      <TeacherFolderContent />
    </Skeleton>
  )
}

function RouteComponent() {
  return (
    <Skeleton name="teacher-class-folder-page" loading={false}>
      <TeacherFolderContent />
    </Skeleton>
  )
}

function TeacherFolderContent() {
  const router = useRouter()
  const { folderId: collectionId } = Route.useParams()

  const { filters, setFilters } = useFilterResource(Route.id)

  const paginationState = {
    pageIndex: filters.pageIndex ?? 1,
    pageSize: filters.pageSize ?? 5,
  }
  /* useQuery to get data */

  const { data: collectionData, isLoading: isCollectionLoading } =
    useGetCollection(collectionId)
  const { data: resourcesData, isLoading: isResourcesLoading } =
    useGetResources(collectionId, filters)
  const isResourcesInitialLoading = isResourcesLoading && !resourcesData

  /* fix time */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
    return date.toLocaleDateString(undefined, options)
  }

  /* fix data to table*/
  const data: Array<Resource> = resourcesData?.data ?? []
  const rowCount = resourcesData?.rowCount ?? 0

  /* */
  return !isCollectionLoading && collectionData === undefined ? (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-sm text-slate-500">Collection not found.</p>
      <button
        className="cursor-pointer ml-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        onClick={() => router.history.back()}
      >
        Go Back
      </button>
      <button
        className="cursor-pointer ml-4 px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark transition-colors"
        onClick={() => router.invalidate()}
      >
        View All Collections
      </button>
    </div>
  ) : (
    <Skeleton name="teacher-class-folder-detail" loading={isCollectionLoading}>
      <main className="flex-1 flex flex-col min-w-0 ">
        <div className="px-6 py-4">
          <div className="flex flex-col gap-4">
            <Link
              className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors group w-fit"
              to="/teacher/classes"
              replace
            >
              <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">
                arrow_back
              </span>
              <span className="text-sm font-medium">Go Back</span>
            </Link>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <span className="material-symbols-outlined filled text-3xl">
                    folder
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {collectionData?.name ?? ''}
                  </h1>
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 dark:text-slate-400">
                    <span>
                      {collectionData?.createdAt
                        ? `Created ${formatDate(collectionData.createdAt)}`
                        : ''}
                    </span>
                    <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    <span>
                      {collectionData?.updatedAt
                        ? `Last updated ${formatDate(collectionData.updatedAt)}`
                        : ''}
                    </span>
                    <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    <span>{collectionData?.filesCount ?? 0} files</span>
                    <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    <span>{collectionData?.sizeMB ?? 0} MB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 pb-12">
          <Skeleton name="resources-table" loading={isResourcesInitialLoading}>
            <ResourcesTable
              data={data}
              columns={columns}
              pagination={paginationState}
              paginationOptions={{
                onPaginationChange: (pagination) => {
                  setFilters(
                    typeof pagination === 'function'
                      ? pagination(paginationState)
                      : pagination,
                  )
                },
                rowCount,
              }}
              filters={filters}
              onFilterChange={setFilters}
            />
          </Skeleton>
        </div>
      </main>
    </Skeleton>
  )
}
