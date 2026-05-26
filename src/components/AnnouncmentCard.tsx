import { stripHtmlTags } from '#/lib/utils'
import { UserGenderEnum } from '#/server/db/schema'

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
export function AnnouncementCard({ announcement }: { announcement: any }) {
  const audienceColors = getAudienceColors(announcement.audience)
  return (
    <div
      role="button"
      tabIndex={0}
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
          {stripHtmlTags(announcement.description)}
        </p>

        <div className="flex items-center gap-4 mt-1 text-sm text-slate-400 dark:text-slate-500 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">
              calendar_today
            </span>
            {announcement.createdAt.toISOString().split('T')[0]}
          </span>

          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">
              person
            </span>
            {announcement.author.gender === UserGenderEnum.MALE ? 'Mr' : 'Ms'}
            {announcement.author.name}({announcement.author.role})
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
}
