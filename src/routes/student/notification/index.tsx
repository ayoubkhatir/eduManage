import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Skeleton } from 'boneyard-js/react'
import type {
  NotificationsProps,
  TypeTabFilter,
} from '@/services/api/student/types/apiType'

import NotificationList from '@/components/notificationList'

export const Route = createFileRoute('/student/notification/')({
  component: Notifications,
  head: () => ({
    meta: [{ title: 'Student | Notifications - EduManage' }],
  }),
})
const tabFilters: Array<TypeTabFilter> = [
  'All',
  'Unread',
  'Urgent',
  'Teachers',
  'Administration',
]

function Notifications({ initialTab = 'All' }: NotificationsProps) {
  const [tab, setTab] = useState<TypeTabFilter>(initialTab)
  const [searchText, setSearchText] = useState('')
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false)
  const queryClient = useQueryClient()

  const markAllAsRead = async () => {
    setIsMarkingAllRead(true)
    try {
      // Fetch current notifications
      const res = await fetch('http://localhost:4000/notifications')
      if (!res.ok) throw new Error('Failed to fetch notifications')
      const notifications = await res.json()

      // Update each unread notification
      const updatePromises = notifications
        .filter((n: any) => !n.read)
        .map((n: any) =>
          fetch(`http://localhost:4000/notifications/${n.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ read: true }),
          }),
        )

      await Promise.all(updatePromises)

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    } finally {
      setIsMarkingAllRead(false)
    }
  }

  return (
    <Skeleton name="student-notifications-page" loading={false}>
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-background-light dark:bg-background-dark relative">
        <div className="max-w-250 mx-auto w-full p-6 md:p-10 flex flex-col gap-8">
          {/* Page Heading & Actions */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2">
              <h2 className=" text-[#0d121b] dark:text-white  text-4xl font-black leading-tight tracking-tight">
                Notifications
              </h2>
              <p className="text-[#4c669a] dark:text-[#9da6b9] text-base font-normal max-w-lg">
                Stay updated with your latest school alerts, exam schedules, and
                messages from your teachers.
              </p>
            </div>

            <button
              onClick={markAllAsRead}
              disabled={isMarkingAllRead}
              className="flex shrink-0 items-center gap-2 justify-center rounded-lg h-10 px-5   bg-primary dark:bg-[#282e39] hover:bg-blue-700 dark:hover:bg-[#323b49] text-white text-sm font-bold active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">
                done_all
              </span>
              <span>Mark all as read</span>
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <label className="group relative flex w-full md:max-w-md items-center">
              <span className="absolute left-4 text-[#9da6b9] group-focus-within:text-primary">
                <span className="material-symbols-outlined text-[24px]">
                  search
                </span>
              </span>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search notification history..."
                className="bg-gray-200 dark:bg-[#282e39] border border-gray-300 h-12 w-full rounded-xl dark:border-gray-700 focus:border-primary focus:bg-gray-300 dark:focus:bg-surface-dark focus:ring-0 pl-12 pr-4 text-[#0d121b] dark:text-white placeholder-[#6b7280] text-base"
              />
            </label>

            {/* Filter Chips */}

            <div className="flex flex-wrap items-center gap-2">
              {tabFilters.map((t) => {
                const isActive = tab === t
                const variantClasses = isActive
                  ? 'bg-primary text-white hover:scale-105'
                  : 'border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#282e39] hover:bg-gray-50 dark:hover:bg-[#374151] text-[#9da6b9] hover:text-gray-600 dark:hover:text-white'
                return (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={` flex h-9 items-center justify-center px-4 rounded-full text-sm font-medium ${variantClasses}`}
                    style={
                      isActive
                        ? { transition: 'transform 0.2s ease-in-out' }
                        : undefined
                    }
                  >
                    {t === 'All' ? 'All Resources' : t}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Notifications List */}
          <NotificationList
            tab={tab}
            searchText={searchText}
            role="Student"
            isLoading={isMarkingAllRead}
          />

          {/* Footer */}
          <div className="flex justify-center py-8">
            <p className="text-[#4b5563] text-sm">End of notifications</p>
          </div>
        </div>
      </main>
    </Skeleton>
  )
}
