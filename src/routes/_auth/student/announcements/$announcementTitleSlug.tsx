import { Link, createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getAnnouncementByTitleSlugQueryOptions } from '#/hooks/admin/hooks'
import Loading from '#/components/loading'
import AnnouncementDetail from '#/components/admin/Announcement/AnnouncementDetail'

export const Route = createFileRoute(
  '/_auth/student/announcements/$announcementTitleSlug',
)({
  component: AnnouncementDetailPage,
  pendingComponent: () => (
    <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
      <Loading
        className="h-[80%] w-[80%] p-10"
        text="Loading..."
        description="Please wait while we fetch this announcement."
      />
    </div>
  ),
  head: () => ({
    meta: [{ title: 'Owner | Announcement - EduManage' }],
  }),

  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData({
      ...getAnnouncementByTitleSlugQueryOptions(params.announcementTitleSlug),
    })
  },
})

function AnnouncementDetailPage() {
  const { announcementTitleSlug } = Route.useParams()

  const { data: announcement, status } = useSuspenseQuery({
    ...getAnnouncementByTitleSlugQueryOptions(announcementTitleSlug),
  })

  console.log({ announcement })

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-8 py-16 text-center">
        <p className="text-[#4c669a] dark:text-[#9da6b9]">
          Could not load this announcement.
        </p>
        <Link
          to="/student/announcements"
          className="text-primary font-medium hover:underline"
        >
          Back to announcements
        </Link>
      </div>
    )
  }
  return (
    <div className="flex-1 px-4 py-8 sm:px-8">
      <Link
        to="/student/announcements"
        className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary dark:text-slate-400"
      >
        <span className="material-symbols-outlined text-[18px]">
          arrow_back
        </span>
        Back to announcements
      </Link>
      <AnnouncementDetail announcement={announcement} />
    </div>
  )
}
