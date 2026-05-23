import { useNavigate } from '@tanstack/react-router'
import Loading from './loading'
import type { AnnouncementModel } from '@/schemas/announcement.schemas'
import { stripHtmlTags } from '@/lib/utils'
import { useGetAnnouncements } from '@/hooks/admin/hooks'

export type AnnouncementListProps = {
  data?: Array<AnnouncementModel>
  isLoading?: boolean
  error?: any
  selectedAudience: string
  searchText?: string
  detailTo?: string
}

const getAudienceColors = (audience: string) => {
  switch (audience) {
    case 'All School':
      return {
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        darkBg: 'dark:bg-slate-500/20',
        darkText: 'dark:text-slate-300',
        ring: 'ring-slate-500/20',
        border: 'border-slate-500',
      }
    case 'Students':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        darkBg: 'dark:bg-blue-500/10',
        ring: 'ring-blue-500/20',
        border: 'border-blue-500',
      }
    case 'Teachers':
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        darkBg: 'dark:bg-purple-500/10',
        ring: 'ring-purple-500/20',
        border: 'border-purple-500',
      }
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        darkBg: 'dark:bg-gray-500/10',
        ring: 'ring-gray-500/20',
        border: 'border-gray-500',
      }
  }
}

const filterAnnouncements = (
  data: Array<AnnouncementModel>,
  searchText = '',
  selectedAudience = 'All School',
) => {
  const lowerSearch = searchText.trim().toLowerCase()

  return data.filter((announcement) => {
    // Filter by audience :
    if (
      selectedAudience !== 'All School' &&
      announcement.audience !== selectedAudience
    ) {
      return false
    }

    // Filter by search text :
    if (!lowerSearch) return true

    const cleanContent = stripHtmlTags(announcement.content)
    const haystack =
      `${announcement.title} ${cleanContent} ${announcement.audience}`.toLowerCase()
    return haystack.includes(lowerSearch)
  })
}

export default function AnnouncementList({
  data: propData,
  isLoading: propIsLoading,
  error: propError,
  searchText = '',
  selectedAudience = 'All School',
  detailTo = '/admin/announcements',
}: AnnouncementListProps) {
  const navigate = useNavigate()
  const announcementsQuery = useGetAnnouncements(
    searchText ? { search: searchText } : {},
  )
  const isLoading = propIsLoading || announcementsQuery.isLoading
  const error = propError || announcementsQuery.error
  const data = propData || announcementsQuery.data

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loading
          className="h-[80%] w-[80%] p-10"
          text="loading..."
          description="Please wait while we fetch the announcements for you."
        />
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-[#4c669a] dark:text-[#9da6b9] text-center py-10 pl-8 text-base font-normal">
        Something went wrong.
      </p>
    )
  }

  if (!data || data.length === 0) {
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

  const filteredData = filterAnnouncements(data, searchText, selectedAudience)

  if (filteredData.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[#4b5563] dark:text-[#9da6b9]">
          No announcements match your filters.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {filteredData.map((announcement: AnnouncementModel) => {
        const audienceColors = getAudienceColors(announcement.audience)

        return (
          <div
            key={announcement.id}
            role="button"
            tabIndex={0}
            onClick={() =>
              navigate({
                to: '/admin/announcements/$announcementId',
                params: { announcementId: announcement.id },
              })
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                navigate({
                  to: '/admin/announcements/$announcementId',
                  params: { announcementId: announcement.id },
                })
              }
            }}
            className={`group relative flex flex-col md:flex-row gap-6 p-6 rounded-xl bg-white dark:bg-[#1e293b] border-l-4 ${audienceColors.border} shadow-sm hover:shadow-md cursor-pointer`}
            style={{ transition: 'box-shadow 0.2s ease-in-out' }}
          >
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${audienceColors.bg} ${audienceColors.text} ${audienceColors.darkBg} ${audienceColors.darkText} ${audienceColors.ring} ${audienceColors.border}`}
                >
                  {announcement.audience}
                </span>
              </div>

              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                {announcement.title}
              </h4>

              <p className="text-slate-600 dark:text-[#9da6b9] line-clamp-2">
                {stripHtmlTags(announcement.content)}
              </p>

              <div className="flex items-center gap-4 mt-1 text-sm text-slate-400 dark:text-slate-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">
                    calendar_today
                  </span>
                  {announcement.publishedAt}
                </span>

                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">
                    person
                  </span>
                  Posted by {announcement.authorName}
                </span>
              </div>
            </div>

            <div className="hidden md:flex shrink-0 items-center self-center">
              <span className="material-symbols-outlined text-gray-400 group-hover:text-black dark:text-[#4b5563] dark:group-hover:text-white">
                chevron_right
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
