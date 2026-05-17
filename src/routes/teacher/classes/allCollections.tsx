import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { CollectionCard } from '@/components/teacher/collection/CollectionCard'
import {
  AddOrEditCollectionDialog,
  DeleteCollectionDialog,
} from '@/components/teacher/collection/CollectionDialogs'
import { getAllCollectionsQueryOptions } from '@/services/api/teacher/collection/hooks'
import { useCollectionsPage } from '@/hooks/teacher/use-collections-page'

export const Route = createFileRoute('/teacher/classes/allCollections')({
  component: RouteComponent,
  pendingComponent: AllCollectionsPending,
  loader: async ({ context }) => {
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    return context.queryClient.ensureQueryData(
      getAllCollectionsQueryOptions(true),
    )
  },
})

function AllCollectionsPending() {
  return (
    <Skeleton name="teacher-collections-page" loading>
      <AllCollectionsContent />
    </Skeleton>
  )
}

function RouteComponent() {
  return (
    <Skeleton name="teacher-collections-page" loading={false}>
      <AllCollectionsContent />
    </Skeleton>
  )
}

function AllCollectionsContent() {
  console.log('Rendering All Collections Page')
  const router = useRouter()
  const {
    folders,
    isFoldersLoading,
    isFoldersError,
    isFoldersFetching,
    refetchFolders,
    selectedDeleteId,
    isAlertOpen,
    selectedEditCollection,
    isEditDialogOpen,
    openDeleteDialog,
    onDeleteDialogChange,
    confirmDelete,
    openEditDialog,
    onEditDialogChange,
  } = useCollectionsPage()

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-300 mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight">
              Resource Folders
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              Organize and manage your classroom materials and student
              collections.
            </p>
          </div>
        </div>

        {/* Folders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Create New Card  */}
          <AddOrEditCollectionDialog role={'add'} />
          {isFoldersError || (!isFoldersLoading && !folders) ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-slate-500">
                Failed to load collections.
              </p>
              <button
                className="cursor-pointer ml-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                onClick={() => refetchFolders()}
                disabled={isFoldersFetching}
              >
                Retry
              </button>
              <button
                className="cursor-pointer ml-4 px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark transition-colors"
                onClick={() => router.history.back()}
              >
                View All Collections
              </button>
            </div>
          ) : (
            <Skeleton
              name="teacher-collections-grid"
              loading={isFoldersLoading}
            >
              {folders?.map((folder) => (
                <CollectionCard
                  key={folder.id}
                  folder={folder}
                  onDelete={openDeleteDialog}
                  onEdit={openEditDialog}
                />
              ))}
            </Skeleton>
          )}
        </div>
        <AddOrEditCollectionDialog
          role={'edit'}
          id={selectedEditCollection?.id}
          defaultName={selectedEditCollection?.name}
          open={isEditDialogOpen}
          onOpenChange={onEditDialogChange}
          hideTrigger
        />
        <DeleteCollectionDialog
          open={isAlertOpen}
          hasSelection={Boolean(selectedDeleteId)}
          onOpenChange={onDeleteDialogChange}
          onConfirm={confirmDelete}
        />
      </div>
    </main>
  )
}
