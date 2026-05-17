export type AnnouncementCardType = {
  id: string
  audience: 'All School' | 'Parents & Students' | 'Teachers only'
  authorName: string
  title: string
  content: string
  publishedAt: string
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
  isPinned?: boolean
  isRead?: boolean
}

const audienceStyles: Record<
  string,
  { bg: string; text: string }
> = {
  'All School': {
    bg: 'bg-slate-700 dark:bg-slate-600',
    text: 'text-slate-100',
  },
  'Parents & Students': {
    bg: 'bg-purple-700 dark:bg-purple-600',
    text: 'text-purple-100',
  },
  'Teachers only': {
    bg: 'bg-blue-700 dark:bg-blue-600',
    text: 'text-blue-100',
  },
}

const statusStyles: Record<
  string,
  { icon: string; text: string; color: string }
> = {
  PUBLISHED: {
    icon: 'check_circle',
    text: 'PUBLISHED',
    color: 'text-emerald-600 dark:text-emerald-400',
  },
  DRAFT: {
    icon: 'edit',
    text: 'DRAFT',
    color: 'text-amber-600 dark:text-amber-400',
  },
  ARCHIVED: {
    icon: 'inventory_2',
    text: 'ARCHIVED',
    color: 'text-slate-500 dark:text-slate-500',
  },
}

export default function AnnouncementCard(props: AnnouncementCardType) {
  const audienceStyle = audienceStyles[props.audience] ?? audienceStyles['All School']
  const statusStyle = statusStyles[props.status] ?? statusStyles.PUBLISHED

  return (
    <article className="group relative flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-white/[0.06] dark:bg-white/[0.02]">
      {/* Top row: badges */}
      <div className="flex flex-wrap items-center gap-2">
        {props.isPinned && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
            <span className="material-symbols-outlined text-[14px]">
              push_pin
            </span>
            Pinned
          </span>
        )}
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${audienceStyle.bg} ${audienceStyle.text}`}
        >
          {props.audience}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
          {props.title}
        </h4>
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {props.content}
        </p>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400 dark:text-slate-500">
        <span className="inline-flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">
            calendar_today
          </span>
          {props.publishedAt}
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">person</span>
          {props.authorName}
        </span>
        <span className={`inline-flex items-center gap-1 ${statusStyle.color}`}>
          <span className="material-symbols-outlined text-[16px]">
            {statusStyle.icon}
          </span>
          {statusStyle.text}
        </span>
      </div>
    </article>
  )
}
