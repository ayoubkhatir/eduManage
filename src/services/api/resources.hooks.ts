import { queryOptions } from '@tanstack/react-query'
import { getResourcesServerFn } from '#/server/modules/resources/resources.server-functions'
import type { GetResourcesSchema } from '#/schemas/resources.schema'

export const getResourcesQueryOptions = (searchParams: GetResourcesSchema) =>
  queryOptions({
    queryKey: ['resources', searchParams],
    queryFn: async () => {
      const response = await getResourcesServerFn({ data: searchParams })

      if (response.success) {
        const { data, pagination } = response
        return { data, pagination }
      }
      throw new Error('Failed to fetch resources')
    },
  })