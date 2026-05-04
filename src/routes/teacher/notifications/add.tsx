import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import z from 'zod'

import AddNotification from '@/components/teacher/notification/addNotification'
import { sendToListQueryOptions } from '@/components/teacher/notification/getSendToList'
import { useFilterResource } from '@/hooks/teacher/use-filter-resource'
import { getTeacherNotificationsQueryOptions } from '@/services/api/teacher/notification/hooks'

export const NotificationSearchSchema = z.object({
  pageIndex: z.number().catch(1).default(1),
  pageSize: z.number().catch(5).default(5),
  title: z.string().optional().catch(undefined),
  type: z
    .enum(['Urgent', 'Teacher', 'Administrative', 'User', 'Grade', 'Book'])
    .optional()
    .catch(undefined),
  subject: z.string().optional().catch(undefined),
})

export const Route = createFileRoute('/teacher/notifications/add')({
  component: RouteComponent,
  pendingComponent: AddTeacherNotificationPending,
  validateSearch: NotificationSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    return Promise.all([
      context.queryClient.ensureQueryData(sendToListQueryOptions),
      context.queryClient.ensureQueryData(
        getTeacherNotificationsQueryOptions(deps),
      ),
    ])
  },
  head: () => ({
    meta: [{ title: 'Teacher | Add Notification - EduManage' }],
  }),
})

function RouteComponent() {
  return (
    <Skeleton name="teacher-add-notification-page" loading={false}>
      <TeacherNotificationContent />
    </Skeleton>
  )
}

function AddTeacherNotificationPending() {
  return (
    <Skeleton name="teacher-add-notification-page" loading>
      <TeacherNotificationContent />
    </Skeleton>
  )
}

function TeacherNotificationContent() {
  const { filters, setFilters } = useFilterResource(Route.id)

  return (
    <AddNotification
      role="teacher"
      filters={filters}
      onFilterChange={setFilters}
    />
  )
}
