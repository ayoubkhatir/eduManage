// Temporarily disabled for future repair.
export default function TeacherNotificationDetail() {
  return null
}

/*
import { MdOutlineGrade, MdPriorityHigh } from 'react-icons/md'
import { GiWhiteBook } from 'react-icons/gi'
import { FaRegCircleUser } from 'react-icons/fa6'
import { FaUserTie } from 'react-icons/fa'
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Skeleton as BoneyardSkeleton } from 'boneyard-js/react'
import Loading from '../../loading'
import { useTeacherNotification } from '@/services/api/teacher/notification/hooks'

const getIcon = (iconType: string) => {
  switch (iconType) {
    case 'Urgent':
      return <MdPriorityHigh className="text-[24px]" />
    case 'Book':
      return <GiWhiteBook className="text-[24px]" />
    case 'User':
      return <FaRegCircleUser className="text-[24px]" />
    case 'Grade':
      return <MdOutlineGrade className="text-[24px]" />
    case 'Teacher':
      return <FaUserTie className="text-[24px]" />
  }
}
const getColors = (type: string) => {
  switch (type) {
    case 'Urgent':
      return {
        bg: 'bg-red-50',
        text: 'text-red-500',
        darkBg: 'dark:bg-red-500/10',
        ring: 'ring-red-500/20',
        border: 'border-red-500',
      }
    case 'Book':
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-500',
        darkBg: 'dark:bg-purple-500/10',
        ring: 'ring-purple-500/20',
        border: 'border-purple-500',
      }
    case 'Teacher':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-500',
        darkBg: 'dark:bg-blue-500/10',
        ring: 'ring-blue-500/20',
        border: 'border-blue-500',
      }
    case 'Grade':
      return {
        bg: 'bg-green-50',
        text: 'text-green-500',
        darkBg: 'dark:bg-green-500/10',
        ring: 'ring-green-500/20',
        border: 'border-green-500',
      }
    case 'User':
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-500',
        darkBg: 'dark:bg-orange-500/10',
        ring: 'ring-orange-500/20',
        border: 'border-orange-500',
      }
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-500',
        darkBg: 'dark:bg-gray-500/10',
        ring: 'ring-gray-500/20',
        border: 'border-gray-500',
      }
  }
}

export default function TeacherNotificationDetail({
  notificationId,
}: {
  notificationId: string
}) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useTeacherNotification(
    notificationId || '',
  )

  // Mark notification as read when viewing it
  useEffect(() => {
    if (notificationId && data) {
      fetch(`http://localhost:4000/teacherNotifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      }).catch((err) => console.error('Failed to mark as read:', err))
    }
  }, [notificationId, data])

  // Refresh notification list when leaving detail page
  useEffect(() => {
    return () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-notifications'] })
    }
  }, [queryClient])

  if (isLoading) {
    return (
      <BoneyardSkeleton
        name="teacher-notification-detail"
        loading
        animate="shimmer"
        fallback={
          <div className="h-full w-full flex items-center justify-center">
            <Loading
              className="h-[80%] w-[80%] p-10"
              text="searching..."
              description="Please wait while we fetch the notifications for you."
            />
          </div>
        }
      >
        <main className="pt-5 pb-16 px-4 md:pl-5 md:pr-5 min-h-screen overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 h-5 w-44 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 shadow-xl">
              <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="size-14 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="h-7 w-3/5 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-4 w-2/5 rounded bg-slate-300 dark:bg-slate-800" />
                </div>
                <div className="h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>

              <div className="space-y-4">
                <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-4/5 rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
          </div>
        </main>
      </BoneyardSkeleton>
    )
  }

  if (error) {
    return (
      <main className="pt-24 pb-12 px-4 md:pl-72 md:pr-8 min-h-screen bg-slate-950">
        <div className="max-w-4xl mx-auto text-center py-24 text-red-400">
          Failed to load notification.
        </div>
      </main>
    )
  }

  if (!data) {
    return (
      <main className="pt-24 pb-12 px-4 md:pl-72 md:pr-8 min-h-screen bg-slate-950">
        <div className="max-w-4xl mx-auto text-center py-24 text-slate-300">
          Notification not found.
        </div>
      </main>
    )
  }

  const { title, subject, time, type, content } = data
  const colors = getColors(data.type)
  const Icon = getIcon(data.type)

  return (
    <main className="pt-5 pb-16 px-4 md:pl-5 md:pr-5 min-h-screen overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-6">
          <button
            onClick={() => navigate({ to: '/teacher/notifications' })}
            className="cursor-pointer flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors group"
            type="button"
          >
            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            <span className="font-semibold text-sm">Back to notifications</span>
          </button>
        </nav>

        <div className="bg-slate-900/50 border border-slate-800 backdrop-blur-md rounded-xl p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-10">
            <div
              className={`flex size-14 items-center justify-center rounded-full ${colors.bg} ${colors.text} ${colors.darkBg}`}
            >
              {Icon}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {title}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                <span className="text-indigo-400 font-semibold text-sm">
                  {subject}
                </span>
                {time ? (
                  <>
                    <span className="text-slate-500 text-xs">•</span>
                    <span className="text-slate-400 text-xs">{time}</span>
                  </>
                ) : null}
              </div>
            </div>

            <span
              className={`px-3 py-1 ${colors.bg} ${colors.darkBg} ${colors.text} text-xs font-bold rounded-full uppercase tracking-wider border ${colors.ring}`}
            >
              {type}
            </span>
          </div>

          <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-4">
            {content ? <p>{content}</p> : <p>No content.</p>}
          </div>
        </div>
      </div>
    </main>
  )
}
*/
