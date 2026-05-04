import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import NotificationDetail from '@/components/student/studentNotificationDetail'

export const Route = createFileRoute('/student/notification/$notificationId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { notificationId } = Route.useParams()
  return (
    <Skeleton name="student-notification-detail-page" loading={false}>
      <NotificationDetail notificationId={notificationId} />
    </Skeleton>
  )
}
