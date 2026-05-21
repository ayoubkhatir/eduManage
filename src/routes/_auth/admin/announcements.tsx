import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import type { AnnouncementCardType } from '@/components/admin/announcementCard'
import AnnouncementCard from '@/components/admin/announcementCard'

export const Route = createFileRoute('/_auth/admin/announcements')({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: 'Admin | Announcements - EduManage' }],
  }),
})

const announcementPlaceHolder: Array<AnnouncementCardType> = [
  {
    id: '1',
    audience: 'All School',
    authorName: 'You',
    title: 'End of Term Exams Schedule',
    content:
      'The final exam schedule for the Fall 2023 term has been released. Please review the dates carefully. All grades must be submitted by Dec 20th. Make sure to communicate this to your students early.',
    publishedAt: 'Oct 24, 2023',
    status: 'PUBLISHED',
    isPinned: true,
  },
  {
    id: '2',
    audience: 'Teachers only',
    authorName: 'Mr. Smith',
    title: 'Staff Meeting Reminder - November',
    content:
      'Just a reminder that our monthly staff meeting will be held next Tuesday in the main hall. Agenda includes curriculum updates and holiday planning.',
    publishedAt: 'Nov 1, 2023',
    status: 'DRAFT',
    isPinned: false,
  },
  {
    id: '3',
    audience: 'Parents & Students',
    authorName: 'Administration',
    title: 'Science Fair Registration Open',
    content:
      'Students can now register for the annual Science Fair. Forms are available at the front desk or can be downloaded from the student portal.',
    publishedAt: 'Oct 20, 2023',
    status: 'PUBLISHED',
    isPinned: false,
  },
  {
    id: '4',
    audience: 'All School',
    authorName: 'Admin Team',
    title: 'Holiday Closure Notice',
    content:
      'The school will be closed on Sept 25th for a public holiday. Classes will resume as normal on Sept 26th.',
    publishedAt: 'Sept 15, 2023',
    status: 'ARCHIVED',
    isPinned: false,
  },
  {
    id: '5',
    audience: 'Parents & Students',
    authorName: 'Counselor',
    title: 'Parent-Teacher Conference Schedule',
    content:
      'Parent-Teacher conferences will take place from Oct 30th to Nov 2nd. Please book your slots through the school portal.',
    publishedAt: 'Oct 10, 2023',
    status: 'PUBLISHED',
    isPinned: false,
  },
  {
    id: '6',
    audience: 'Teachers only',
    authorName: 'Principal',
    title: 'New Curriculum Guidelines',
    content:
      'The new curriculum guidelines for the upcoming academic year have been released. Please review and prepare your lesson plans accordingly.',
    publishedAt: 'Oct 5, 2023',
    status: 'PUBLISHED',
    isPinned: true,
  },
]

function RouteComponent() {
  const pinned = announcementPlaceHolder.filter((a) => a.isPinned)
  const unpinned = announcementPlaceHolder.filter((a) => !a.isPinned)

  return (
    <Skeleton name="admin-announcements-page" loading={false}>
      <div className="flex-1 overflow-y-auto p-6 pt-2">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          {/* Page heading */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Announcements
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage and broadcast school-wide updates.
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <span className="material-symbols-outlined">campaign</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Published
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    5
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                  <span className="material-symbols-outlined">
                    edit_document
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Drafts
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    2
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <span className="material-symbols-outlined">visibility</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Total Views
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    1.2k
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search & filters */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex h-10 w-full items-center gap-2 rounded-xl border border-transparent bg-slate-50 px-3 transition-all focus-within:border-primary sm:w-80 dark:bg-slate-800/50">
              <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">
                search
              </span>
              <input
                className="w-full border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
                placeholder="Search by title or content..."
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              <select className="h-10 cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-600 outline-none transition-colors hover:border-primary/30 hover:bg-primary/5 focus:border-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-primary/40 dark:hover:bg-primary/10">
                <option>All Status</option>
                <option>Published</option>
                <option>Draft</option>
                <option>Archived</option>
              </select>
              <select className="h-10 cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-600 outline-none transition-colors hover:border-primary/30 hover:bg-primary/5 focus:border-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-primary/40 dark:hover:bg-primary/10">
                <option>All School</option>
                <option>Teachers Only</option>
                <option>Students &amp; Parents</option>
              </select>
              <button
                type="button"
                className="cursor-pointer flex h-10 cursor-pointer items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-600 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary focus:border-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-primary/40 dark:hover:bg-primary/10 dark:hover:text-primary"
                title="Sort by Date"
              >
                <span className="material-symbols-outlined text-xl">sort</span>
              </button>
            </div>
          </div>

          {/* Announcement list */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Recent Updates
            </h3>

            {pinned.map((announcement) => (
              <AnnouncementCard {...announcement} key={announcement.id} />
            ))}
            {unpinned.map((announcement) => (
              <AnnouncementCard {...announcement} key={announcement.id} />
            ))}
          </div>
        </div>
      </div>
    </Skeleton>
  )
}
