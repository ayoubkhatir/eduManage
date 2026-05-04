import type {
  Collection,
  Notification,
  Resource,
  ResourceApiModel,
  ResourceSortOption,
} from './modelType'

export type SuccessResponse<T> = {
  success: true
  message: string
  data: T
}

export type ErrorResponse = {
  success: false
  message: string
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse

export type PaginatedSuccessResponse<T> = SuccessResponse<Array<T>> & {
  pagination: {
    totalPages: number
    totalElements: number
  }
}

export type PaginatedApiResponse<T> =
  | PaginatedSuccessResponse<T>
  | ErrorResponse

export type PaginationData<T> = {
  data: Array<T>
  rowCount: number
}

export type PaginationParams = {
  pageIndex: number
  pageSize: number
}

export type Filter<T> = Partial<T & PaginationParams>
export type TypeTabFilter = 'All' | 'Urgent' | 'Administration'

export type ResourceFilter = Filter<Resource> & {
  sortBy?: ResourceSortOption
}

export type NotificationFilter = Filter<Notification>

export type AddOrEditCollectionPayload = {
  name: string
  role: 'add' | 'edit'
  id?: string
}

export interface CollectionFetcher {
  getCollection: (collectionId: string) => Promise<Collection>
  getAllCollections: (all: boolean) => Promise<Array<Collection>>
  getResources: (
    collectionId: string | undefined,
    filterAndPagination: ResourceFilter,
  ) => Promise<PaginationData<Resource>>
  addOrEditCollection: (
    name: string,
    role: 'add' | 'edit',
    id?: string,
  ) => Promise<void>
  deleteCollection: (collectionId: string) => Promise<void>
}

export type AddTeacherNotificationPayload = {
  role: 'teacher' | 'admin'
  subject: string
  content: string
  attachments?: FileList | Array<File>
  onUploadProgress?: (progress: number) => void
  sendTo?: Array<string>
  type: 'Teacher' | 'Urgent' | 'Administrative' | 'User' | 'Grade' | 'Book'
}

export interface NotificationFetcher {
  getTeacherNotifications: (
    filterAndPagination: NotificationFilter,
  ) => Promise<PaginationData<Notification>>
  getTeacherNotification: (notificationId: string) => Promise<Notification>
  addTeacherNotification: (
    payload: AddTeacherNotificationPayload,
  ) => Promise<Notification>
  deleteOwnNotification: (notificationId: string) => Promise<void>
}

export type { ResourceApiModel }
