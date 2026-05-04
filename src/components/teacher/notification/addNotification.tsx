import { useCallback, useMemo } from 'react'
import OwnNotificationTable from './ownNotification-table'
import { columns } from './columns'
import { NotificationForm } from './form/NotificationForm'

import type { NotificationFilter } from '@/services/api/teacher/types/apiType'
import type { Notification } from '@/services/api/teacher/types/modelType'
import Loading from '@/components/loading'
import useGetTeacherNotifications from '@/services/api/teacher/notification/hooks'

export default function AddNotification({
  role,
  filters,
  onFilterChange,
}: {
  role: 'teacher' | 'admin'
  filters: NotificationFilter
  onFilterChange: (nextFilters: Partial<NotificationFilter>) => void
}) {
  const paginationState = useMemo(
    () => ({
      pageIndex: filters.pageIndex ?? 1,
      pageSize: filters.pageSize ?? 5,
    }),
    [filters.pageIndex, filters.pageSize],
  )

  const {
    data: notificationsData,
    isLoading: isNotificationsLoading,
    isError: isNotificationsError,
  } = useGetTeacherNotifications(filters)
  const data: Array<Notification> = notificationsData?.data ?? []
  const rowCount = notificationsData?.rowCount ?? 0

  const handlePaginationChange = useCallback(
    (
      pagination:
        | { pageIndex: number; pageSize: number }
        | ((state: { pageIndex: number; pageSize: number }) => {
            pageIndex: number
            pageSize: number
          }),
    ) => {
      const nextPagination =
        typeof pagination === 'function'
          ? pagination(paginationState)
          : pagination

      onFilterChange({
        pageIndex: nextPagination.pageIndex,
        pageSize: nextPagination.pageSize,
      })
    },
    [onFilterChange, paginationState],
  )

  return (
    <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 relative">
      <div className="max-w-350 mx-auto flex flex-col gap-8 h-full">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                {role === 'admin' ? 'Announcements' : 'Notifications'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base max-w-2xl">
                Manage and send important{' '}
                {role === 'admin' ? 'announcements' : 'notifications'} to your{' '}
                {role === 'teacher' ? 'students ' : 'teachers and students'}.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col xl:flex-row gap-6 h-full items-start">
          <div className="w-full xl:w-7/12 flex flex-col gap-4 order-2 xl:order-1">
            {isNotificationsLoading ? (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151b2b] overflow-hidden">
                <Loading
                  className="py-16"
                  text="Loading notifications..."
                  description="Please wait while we fetch your notifications."
                />
              </div>
            ) : isNotificationsError ? (
              <div className="rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 flex flex-col items-center justify-center gap-3 py-16 text-center px-6">
                <span className="material-symbols-outlined text-red-400 text-5xl">
                  notifications_off
                </span>
                <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
                  Failed to load notifications
                </p>
                <p className="text-sm text-slate-400">
                  Could not fetch notification data. Please try again later.
                </p>
              </div>
            ) : data.length === 0 ? (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151b2b] flex flex-col items-center justify-center gap-3 py-16 text-center px-6">
                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-6xl">
                  mark_unread_chat_alt
                </span>
                <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
                  No notifications yet
                </p>
                <p className="text-sm text-slate-400">
                  Use the form to send your first notification.
                </p>
              </div>
            ) : (
              <OwnNotificationTable
                data={data}
                columns={columns}
                pagination={paginationState}
                paginationOptions={{
                  onPaginationChange: handlePaginationChange,
                  rowCount,
                }}
                filters={filters}
                onFilterChange={onFilterChange}
              />
            )}
          </div>
          <div className="w-full xl:w-5/12 flex flex-col gap-4 order-1 xl:order-2">
            <div className="sticky top-4">
              <div className="bg-white dark:bg-[#151b2b] rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col overflow-hidden h-fit">
                <NotificationForm role={role} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
