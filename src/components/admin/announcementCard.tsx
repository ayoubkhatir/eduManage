export type AnnouncementCardType = {
  id: string
  audience: 'All School' | 'Parents & Students' | 'Teachers only'
  authorName: string
  title: string
  content: string
  publishedAt: string // this field should come from the backend as a string so we can display it
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
  isPinned?: boolean
  isRead?: boolean
}
// All School
// You
// End of Term Exams Schedule

/* The final exam schedule for the Fall 2023 term has been released.
Please review the dates carefully. All grades must be submitted by Dec
20th. Make sure to communicate this to your students early.*/

// Oct 24, 2023
// Published

export default function AnnouncementCard(props: AnnouncementCardType) {
  return (
    <div
      className="group relative flex flex-col md:flex-row gap-6 p-6 rounded-xl bg-white dark:bg-[#1e293b] border-l-4 border-l-primary shadow-sm hover:shadow-md"
      style={{ transition: 'box-shadow 0.2s ease-in-out' }}
    >
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {props.isPinned && (
            <span
              className={`${props.isPinned ? 'text-primary bg-primary/20' : 'invisible'} inline-flex items-center gap-1 rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary`}
            >
              <span className=" material-symbols-outlined text-[14px]">
                {'push_pin'}
                {/* props.isPinned &&  */}
              </span>
              {props.isPinned}
            </span>
          )}
          <span
            className={` inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${props.audience === 'All School' ? 'text-slate-200 bg-slate-700' : props.audience === 'Parents & Students' ? 'text-purple-200 bg-purple-700' : 'text-blue-200 bg-blue-700'}`}
          >
            {props.audience}
          </span>
        </div>
        <h4 className="text-xl font-bold text-slate-900 dark:text-white">
          {props.title}
        </h4>
        <p className="text-slate-600 dark:text-[#9da6b9] line-clamp-2">
          {props.content}
        </p>
        <div className="flex items-center gap-4 mt-1 text-sm text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">
              calendar_today
            </span>
            {props.publishedAt}
            {/* the date type can't be assigned to a jsx so we make it a string then we render it  */}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">
              {props.authorName && 'person'}
            </span>
            Posted by {props.authorName}
          </span>
          <span className="flex items-center gap-1 rounded-2xl font-medium md:ml-0">
            <span
              className={`${
                props.status === 'PUBLISHED'
                  ? 'text-emerald-500'
                  : props.status === 'DRAFT'
                    ? 'text-amber-500'
                    : ' text-slate-700 '
              } material-symbols-outlined text-[16px] fill-1`}
            >
              {props.status === 'PUBLISHED'
                ? 'check_circle'
                : props.status === 'DRAFT'
                  ? 'edit'
                  : 'inventory_2'}
            </span>
            <span
              className={`${
                props.status === 'PUBLISHED'
                  ? 'text-emerald-500'
                  : props.status === 'DRAFT'
                    ? 'text-amber-500'
                    : ' text-slate-700 '
              }`}
            >
              <p>{props.status}</p>
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
