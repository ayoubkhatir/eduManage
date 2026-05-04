import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { collectionFetcher } from './fetcher'
import type {
  AddOrEditCollectionPayload,
} from '../types/apiType'
import type { GetResourcesSchema } from '#/schemas/resources.schema'

export const getCollectionQueryOptions = (collectionId: string) =>
  queryOptions({
    queryKey: ['collection', collectionId],
    queryFn: () => collectionFetcher.getCollection(collectionId),
  })

export function useGetCollection(collectionId: string) {
  return useQuery(getCollectionQueryOptions(collectionId))
}

export const getAllCollectionsQueryOptions = (all: boolean) =>
  queryOptions({
    queryKey: ['collections', all],
    queryFn: () => collectionFetcher.getAllCollections(all),
  })

export function useGetAllCollections(all: boolean) {
  return useQuery(getAllCollectionsQueryOptions(all))
}

export const getResourcesQueryOptions = (
  collectionId: string | undefined,
  searchParams: GetResourcesSchema,
) =>
  queryOptions({
    queryKey: ['resources', collectionId, searchParams],
    queryFn: () =>
      collectionFetcher.getResources(collectionId, searchParams),
  })


export default function useGetResources(
  collectionId: string | undefined,
  filterAndPagination: GetResourcesSchema,
) {
  return useQuery({
    ...getResourcesQueryOptions(collectionId, filterAndPagination),
    placeholderData: keepPreviousData,
  })
}

export function useAddOrEditCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, role, id }: AddOrEditCollectionPayload) =>
      collectionFetcher.addOrEditCollection(name, role, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
      queryClient.invalidateQueries({ queryKey: ['collection'] })
    },
  })
}

export function useDeleteCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (collectionId: string) =>
      collectionFetcher.deleteCollection(collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
      queryClient.invalidateQueries({ queryKey: ['resources'] })
      queryClient.invalidateQueries({ queryKey: ['collection'] })
    },
  })
}
