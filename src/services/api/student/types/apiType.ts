export type TypeTabFilter =
  | 'All'
  | 'Unread'
  | 'Urgent'
  | 'Teachers'
  | 'Administration'

export type NotificationsProps = {
  initialTab?: TypeTabFilter
}

export type NotificationListProps = {
  tab?: TypeTabFilter
  searchText?: string
  role?: 'student' | 'teacher'
  data?: Array<ResourceCard>
  isLoading?: boolean
  error?: any
  detailTo?: string
}

export type ResourceCard = {
  id: string
  type: string
  title: string
  subject: string
  content: string
  time: string
  read?: boolean
}
