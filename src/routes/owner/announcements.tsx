import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import type { AnnouncementCardType } from '@/components/owner/announcementCard'
import AnnouncementCard from '@/components/owner/announcementCard'

export const Route = createFileRoute('/owner/announcements')({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: 'Owner | Announcements - EduManage' }],
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
  return (
    <Skeleton name="owner-announcements-page" loading={false}>
      <div className="flex-1 py-8 px-4 sm:px-6 flex flex-col w-full overflow-y-auto gap-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                Announcements Dashboard
              </h1>
              <p className="text-slate-500 dark:text-[#9da6b9] text-base font-normal">
                Manage and broadcast school-wide updates.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1e293b] shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <span className="material-symbols-outlined">campaign</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  Active Posts
                </p>
              </div>
              <p className="text-3xl font-bold leading-tight mt-2">5</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1e293b] shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                  <span className="material-symbols-outlined">
                    edit_document
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  Drafts
                </p>
              </div>
              <p className="text-3xl font-bold leading-tight mt-2">2</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1e293b] shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                  <span className="material-symbols-outlined">visibility</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  Total Views
                </p>
              </div>
              <p className="text-3xl font-bold leading-tight mt-2">1.2k</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-[#1e293b] p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-full md:w-96">
            <label className="flex items-center w-full h-10 rounded-lg bg-slate-50 dark:bg-[#111827] px-3 border border-transparent focus-within:border-primary">
              <span className="material-symbols-outlined text-slate-400 dark:text-[#9da6b9]">
                search
              </span>
              <input
                className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#9da6b9] focus:ring-0 ml-2 text-sm"
                placeholder="Search by title or content..."
              />
            </label>
          </div>
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            <select
              className="flex items-center h-10 rounded-lg border-none bg-gray-50 px-4 py-0 pr-8 text-sm font-medium text-slate-500 
    focus:ring-0 border-slate-100 dark:border-gray-700/50  dark:text-white  dark:bg-[#1E2532] hover:bg-primary/5 dark:hover:bg-primary/10 hover:border-primary/30 dark:hover:border-primary/40 hover:text-primary dark:hover:text-blue-400 group cursor-pointer"
              style={{
                transition:
                  'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.2s ease-in-out',
              }}
            >
              <span className="material-symbols-outlined text-base">
                expand_more
              </span>
              <option>All Status</option>
              <option>active</option>
              <option>inactive</option>
              <option>pending</option>
            </select>
            <select
              className="flex items-center h-10 rounded-lg border-none bg-gray-50 px-4 py-0 pr-8 text-sm font-medium text-slate-500 
    focus:ring-0 border-slate-100 dark:border-gray-700/50  dark:text-white  dark:bg-[#1E2532] hover:bg-primary/5 dark:hover:bg-primary/10 hover:border-primary/30 dark:hover:border-primary/40 hover:text-primary dark:hover:text-blue-400 group cursor-pointer"
              style={{
                transition:
                  'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.2s ease-in-out',
              }}
            >
              <span className="material-symbols-outlined text-base">
                expand_more
              </span>
              <option>All School</option>
              <option>Teachers Only</option>
              <option>Students & Parents</option>
            </select>
            <button
              className="flex items-center h-10 rounded-lg border-none bg-gray-50 px-4 py-0 pr-8 text-sm font-medium text-slate-500 
    focus:ring-0 border-slate-100 dark:border-gray-700/50  dark:text-white  dark:bg-[#1E2532] hover:bg-primary/5 dark:hover:bg-primary/10 hover:border-primary/30 dark:hover:border-primary/40 hover:text-primary dark:hover:text-blue-400 group cursor-pointer"
              style={{
                transition:
                  'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.2s ease-in-out',
              }}
              title="Sort by Date"
            >
              <span className="material-symbols-outlined text-xl">sort</span>
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold px-1">Recent Updates</h3>
          {announcementPlaceHolder
            .filter((announcement) => announcement.isPinned === true)
            .map((announcement) => (
              <AnnouncementCard {...announcement} key={announcement.id} />
            ))}
          {announcementPlaceHolder.map(
            (announcement) =>
              !announcement.isPinned && (
                <AnnouncementCard {...announcement} key={announcement.id} />
              ),
          )}
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-48 h-48 bg-slate-800 rounded-full mb-6 flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-slate-600">
              post_add
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-2">No announcements yet</h3>
          <p className="text-slate-400 mb-6 max-w-md">
            Create your first announcement to share updates with teachers,
            students, and parents.
          </p>
          <button className="bg-primary text-white px-6 py-3 rounded-lg font-bold cursor-pointer">
            Create Announcement
          </button>
        </div>
      </div>
    </Skeleton>
  )
}
