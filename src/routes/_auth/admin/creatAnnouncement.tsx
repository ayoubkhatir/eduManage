import { createFileRoute } from '@tanstack/react-router'
import { AnnouncementForm } from '@/components/admin/Announcement/AnnouncementForm'

export const Route = createFileRoute('/_auth/admin/creatAnnouncement')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex-1 h-full overflow-y-auto">
      <AnnouncementForm />
    </div>
  )
}
