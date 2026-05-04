import { useState } from 'react'
import { toast } from 'sonner'
import type { Collection } from '@/services/api/teacher/types/modelType'
import {
  useDeleteCollection,
  useGetAllCollections,
} from '@/services/api/teacher/collection/hooks'

export function useCollectionsPage() {
  const {
    data: folders,
    isLoading: isFoldersLoading,
    isError: isFoldersError,
    isFetching: isFoldersFetching,
    refetch: refetchFolders,
  } = useGetAllCollections(true)

  const deleteCollectionMutation = useDeleteCollection()

  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const [selectedEditCollection, setSelectedEditCollection] = useState<Pick<
    Collection,
    'id' | 'name'
  > | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const openDeleteDialog = (id: string) => {
    setSelectedDeleteId(id)
    setIsAlertOpen(true)
  }

  const onDeleteDialogChange = (open: boolean) => {
    setIsAlertOpen(open)
    if (!open) {
      setSelectedDeleteId(null)
    }
  }

  const confirmDelete = async () => {
    if (!selectedDeleteId) return

    try {
      await deleteCollectionMutation.mutateAsync(selectedDeleteId)
      toast.success('Collection deleted')
    } catch {
      toast.error('Failed to delete collection')
    } finally {
      setIsAlertOpen(false)
      setSelectedDeleteId(null)
    }
  }

  const openEditDialog = (folder: Pick<Collection, 'id' | 'name'>) => {
    setSelectedEditCollection(folder)
    setIsEditDialogOpen(true)
  }

  const onEditDialogChange = (open: boolean) => {
    setIsEditDialogOpen(open)
    if (!open) {
      setSelectedEditCollection(null)
    }
  }

  return {
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
  }
}
