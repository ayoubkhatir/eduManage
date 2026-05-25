import { createFileRoute } from '@tanstack/react-router'
import { AnnouncementForm } from '@/components/admin/Announcement/AnnouncementForm'
import { FetchCurrentUserServerFn } from '#/routes/-fetchAuthStateInBeforeLoad'
import type { AdminUser } from '#/types/usersTypes'

export const Route = createFileRoute('/_auth/teacher/createAnnouncement')({
  loader: async ({ context }) => {
    const currentUser = (await FetchCurrentUserServerFn({
      data: context.authState.user!,
    })) as AdminUser
    return { currentUser }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { currentUser } = Route.useLoaderData()
  return (
    <div className="flex-1 h-full overflow-y-auto">
      <AnnouncementForm user={currentUser} />
    </div>
  )
}
