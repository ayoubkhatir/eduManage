import type { PaginationData, ResourceFilter } from '../types/apiType'
import type { Resource } from '../types/modelType'

type ResourceApiModel = Resource & {
  collectionId?: string | number
}

const parseDateAdded = (dateValue: string): number => {
  const timestamp = Date.parse(dateValue)
  return Number.isNaN(timestamp) ? 0 : timestamp
}

const parseSizeToBytes = (sizeValue: string): number => {
  const [amount, unit = 'B'] = sizeValue.trim().split(/\s+/)
  const normalizedAmount = Number(amount)

  if (Number.isNaN(normalizedAmount)) {
    return 0
  }

  const multipliers: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
  }

  const multiplier = multipliers[unit.toUpperCase()] ?? 1
  return normalizedAmount * multiplier
}

export const filterResources = (
  resources: Array<ResourceApiModel>,
  collectionId: string | undefined,
  searchParams: ResourceFilter,
): PaginationData<Resource> => {
  const {
    pageIndex = 1,
    pageSize = 5,
    sortBy = 'newest',
    ...filters
  } = searchParams

  const normalizedFilters = Object.entries(filters).reduce<
    Partial<Record<keyof Resource, string>>
  >((acc, [key, value]) => {
    if (!value) {
      return acc
    }

    acc[key as keyof Resource] = String(value).toLowerCase()
    return acc
  }, {})

  const filtered = resources
    .filter((resource) => {
      if (collectionId === undefined) {
        return true
      }

      return String(resource.collectionId) === String(collectionId)
    })
    .filter((resource) => {
      return Object.entries(normalizedFilters).every(([key, value]) => {
        const currentValue = String(
          resource[key as keyof Resource],
        ).toLowerCase()
        return currentValue.includes(value)
      })
    })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'oldest') {
      return parseDateAdded(a.dateAdded) - parseDateAdded(b.dateAdded)
    }

    if (sortBy === 'name') {
      return a.fileName.localeCompare(b.fileName)
    }

    if (sortBy === 'size') {
      return parseSizeToBytes(b.size) - parseSizeToBytes(a.size)
    }

    return parseDateAdded(b.dateAdded) - parseDateAdded(a.dateAdded)
  })

  const start = (pageIndex - 1) * pageSize
  const end = start + pageSize

  return {
    data: sorted
      .slice(start, end)
      .map(({ collectionId: _collectionId, ...resource }) => resource),
    rowCount: sorted.length,
  }
}
