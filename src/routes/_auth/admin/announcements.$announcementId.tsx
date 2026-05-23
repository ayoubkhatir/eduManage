import { Link, createFileRoute } from '@tanstack/react-router'
import Loading from '@/components/loading'
import { stripHtmlTags } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { getAnnouncementQueryOptions } from '#/hooks/admin/hooks'

export const Route = createFileRoute(
  '/_auth/admin/announcements/$announcementId',
)({
  component: AnnouncementDetailPage,
  head: () => ({
    meta: [{ title: 'Owner | Announcement - EduManage' }],
  }),
})

function AnnouncementDetailPage() {
  const { announcementId } = Route.useParams()
  const { data, status } = useQuery(getAnnouncementQueryOptions(announcementId))
  // useGetAnnouncement(announcementId)

  if (status === 'pending') {
    return (
      <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
        <Loading
          className="h-[80%] w-[80%] p-10"
          text="Loading..."
          description="Please wait while we fetch this announcement."
        />
      </div>
    )
  } else if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-8 py-16 text-center">
        <p className="text-[#4c669a] dark:text-[#9da6b9]">
          Could not load this announcement.
        </p>
        <Link
          to="/admin/announcements"
          className="text-primary font-medium hover:underline"
        >
          Back to announcements
        </Link>
      </div>
    )
  } else if (status === 'success') {
    return (
      <div className="flex-1 px-4 py-8 sm:px-8">
        <Link
          to="/admin/announcements"
          className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary dark:text-slate-400"
        >
          <span className="material-symbols-outlined text-[18px]">
            arrow_back
          </span>
          Back to announcements
        </Link>

        <article className="max-w-3xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-[#1e293b]">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">
            {data.audience}
          </span>

          <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
            {data.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">
                calendar_today
              </span>
              {data.createdAt.toISOString().split('T')[0]}
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">
                person
              </span>
              Posted by {data.author.name}
            </span>
          </div>

          <div className="mt-8 whitespace-pre-wrap text-slate-700 dark:text-slate-300">
            {stripHtmlTags(data.description)}
          </div>
        </article>
      </div>
    )
  }
}
