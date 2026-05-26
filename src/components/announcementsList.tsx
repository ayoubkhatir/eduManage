import { Link } from '@tanstack/react-router'
// import type { AnnouncementModel } from '@/schemas/announcement.schemas'
import { getAnnouncementsListQueryOptions } from '#/hooks/admin/hooks'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { GetAnnouncementsFiltersSchema } from '#/types/announcementTypes'
import { AnnouncementCard } from './AnnouncmentCard'

export type AnnouncementListProps = {
  schoolId: string
  filters: GetAnnouncementsFiltersSchema
  role: string
}

export default function AnnouncementsList({
  schoolId,
  filters,
  role,
}: AnnouncementListProps) {
  const { status, data } = useSuspenseQuery(
    getAnnouncementsListQueryOptions(schoolId, filters),
  )
  console.log({ data })

  if (status === 'error') {
    return (
      <p className="text-[#4c669a] dark:text-[#9da6b9] text-center py-10 pl-8 text-base font-normal">
        Something went wrong.
      </p>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-center px-4">
        <div className="size-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-3">
          <span className="material-symbols-outlined text-[32px]">
            notifications_off
          </span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          You have no announcements
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {data.map((announcement) => {
        return role === 'admin' ? (
          <Link
            to={`/admin/announcements/$announcementTitleSlug`}
            params={{ announcementTitleSlug: announcement.slug }}
            key={announcement.slug}
          >
            <AnnouncementCard announcement={announcement} />
          </Link>
        ) : role === 'teacher' ? (
          <Link
            to={`/teacher/announcements/$announcementTitleSlug`}
            params={{ announcementTitleSlug: announcement.slug }}
            key={announcement.slug}
          >
            <AnnouncementCard announcement={announcement} />
          </Link>
        ) : role === 'student' ? (
          <Link
            to={`/student/announcements/$announcementTitleSlug`}
            params={{ announcementTitleSlug: announcement.slug }}
            key={announcement.slug}
          >
            <AnnouncementCard announcement={announcement} />
          </Link>
        ) : null
      })}
    </div>
  )
}
