import { FaUserSecret, FaUserTie } from 'react-icons/fa'
import { Link } from '@tanstack/react-router'
import type { ID } from '#/types/authTypes'
import { useQuery } from '@tanstack/react-query'
import { getAnnouncementByIdQueryOptions } from '#/hooks/admin/hooks'

const getIcon = (iconType: string) => {
  switch (iconType) {
    case 'Admin':
      return <FaUserSecret className="text-[24px]" />
    case 'Teacher':
      return <FaUserTie className="text-[24px]" />
  }
}
const getColors = (type: string) => {
  switch (type) {
    case 'Admin':
      return {
        bg: 'bg-red-50',
        text: 'text-red-500',
        darkBg: 'dark:bg-red-500/10',
        ring: 'ring-red-500/20',
        border: 'border-red-500',
      }
    case 'Teacher':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-500',
        darkBg: 'dark:bg-blue-500/10',
        ring: 'ring-blue-500/20',
        border: 'border-blue-500',
      }
  }
}

export default function NotificationDetail({
  notificationId,
}: {
  notificationId: ID
}) {
  const { data: notification } = useQuery(
    getAnnouncementByIdQueryOptions(notificationId),
  )
  const type = notification?.author.role
  const colors = getColors(type!)
  const Icon = getIcon(type!)

  return (
    <main className="pt-5 pb-16 px-4 md:pl-5 md:pr-5 min-h-screen overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-6">
          <Link to="/admin/announcements">
            <button
              className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors group"
              type="button"
            >
              <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">
                arrow_back
              </span>
              <span className="font-semibold text-sm">
                Back to notifications
              </span>
            </button>
          </Link>
        </nav>

        <div className="bg-slate-900/50 border border-slate-800 backdrop-blur-md rounded-xl p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-10">
            <div
              className={`flex size-14 items-center justify-center rounded-full ${colors?.bg} ${colors?.text} ${colors?.darkBg}`}
            >
              {Icon}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {notification?.title}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                <span className="text-indigo-400 font-semibold text-sm">
                  {notification?.description}
                </span>
                {notification?.createdAt ? (
                  <>
                    <span className="text-slate-500 text-xs">•</span>
                    <span className="text-slate-400 text-xs">
                      {notification.createdAt.toISOString().split('T')[0]}
                    </span>
                  </>
                ) : null}
              </div>
            </div>

            <span
              className={`px-3 py-1 ${colors?.bg} ${colors?.darkBg} ${colors?.text} text-xs font-bold rounded-full uppercase tracking-wider border ${colors?.ring}`}
            >
              {type}
            </span>
          </div>

          <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-4">
            {notification?.description ? (
              <p>{notification?.description}</p>
            ) : (
              <p>No content.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
