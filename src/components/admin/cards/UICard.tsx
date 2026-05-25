import { getAnnouncementsListQueryOptions } from '#/hooks/admin/hooks'

import { getStudentsStatsServerFn } from '#/server/modules/students/students.server-functions'
import { getTeachersStatsServerFn } from '#/server/modules/teachers/teachers.server-functions'
import type { GetAnnouncementsFiltersSchema } from '#/types/announcementTypes'
import type { ID } from '#/types/authTypes'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

const getTeacherStatsQueryOptions = () => ({
  queryKey: ['teachers', 'stats'],
  queryFn: async () => {
    const response = await getTeachersStatsServerFn()
    if (response.success) return response.data
    else
      return {
        totalTeachers: 0,
        totalActiveTeachers: 0,
        totalNewThisMonth: 0,
      }
  },
})

const iconColorMap: Record<CardColor, string> = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
  purple:
    'bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400',
  green: 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400',
  orange:
    'bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400',
}

type CardColor = 'blue' | 'purple' | 'green' | 'orange'

export type UICardType = {
  id: string
  iconName: string
  iconColor: CardColor
  stateIcon: string
  percentage: number
  cardTitle: string
  info: string | number
}

export default function UICardComponent({
  iconName,
  iconColor,
  stateIcon,
  percentage,
  cardTitle,
  info,
}: UICardType) {
  const isPositive = percentage >= 0
  const displayInfo = typeof info === 'number' ? info.toLocaleString() : info

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600">
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br from-transparent to-slate-50/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:to-slate-700/30" />
      <div className="relative">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 ${iconColorMap[iconColor]}`}
          >
            <span className="material-symbols-outlined text-[22px]">
              {iconName}
            </span>
          </div>

          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              isPositive
                ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {stateIcon}
            </span>
            <span>
              {isPositive && percentage > 0 ? '+' : ''}
              {percentage}%
            </span>
          </span>
        </div>

        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {cardTitle}
        </p>

        <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {displayInfo}
        </h3>
      </div>
    </div>
  )
}

export function UICardSkeletonItem() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-start justify-between gap-4">
        {/* Icon */}
        <Skeleton className="h-11 w-11 rounded-xl" />

        {/* Percentage badge */}
        {/* <Skeleton className="h-6 w-16 rounded-full" /> */}
      </div>

      {/* Title */}
      <Skeleton className="h-4 w-32" />

      {/* Value */}
      <Skeleton className="mt-3 h-8 w-24" />
    </div>
  )
}

export function UICardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-1 gap-4 md:grid-cols-${count}`}>
      {Array.from({ length: count }).map((_, i) => (
        <UICardSkeletonItem key={i} />
      ))}
    </div>
  )
}

export function TeachersStatCards() {
  const { data: teachersStat, status: fetchStatus } = useQuery({
    ...getTeacherStatsQueryOptions(),
  })

  const cards = useMemo<UICardType[]>(
    () => [
      {
        id: '0',
        iconName: 'school',
        iconColor: 'blue',
        stateIcon: 'trending_up',
        percentage: 5,
        cardTitle: 'Total Teachers',
        info: teachersStat?.totalTeachers ?? 0,
      },
      {
        id: '1',
        iconName: 'bolt',
        iconColor: 'green',
        stateIcon: 'trending_up',
        percentage: 2,
        cardTitle: 'Active Now',
        info: teachersStat?.totalActiveTeachers ?? 0,
      },
      {
        id: '2',
        iconName: 'person_add',
        iconColor: 'purple',
        stateIcon: 'trending_up',
        percentage: 10,
        cardTitle: 'New This Month',
        info: teachersStat?.totalNewThisMonth ?? 0,
      },
    ],
    [teachersStat],
  )

  if (fetchStatus === 'pending') return <UICardSkeleton count={3} />
  if (fetchStatus === 'error') return null

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <UICardComponent {...card} key={card.id} />
      ))}
    </div>
  )
}

const getStudentsStatsQueryOptions = () => ({
  queryKey: ['students', 'stats'],
  queryFn: async () => {
    const response = await getStudentsStatsServerFn()
    if (response.success) return response.data
    return {
      totalStudents: 0,
      totalMonthEnrollments: 0,
    }
  },
})

export function StudentsStatCards() {
  const { data: studentsStat, status: fetchStatus } = useQuery({
    ...getStudentsStatsQueryOptions(),
  })

  const cards = useMemo<UICardType[]>(
    () => [
      {
        id: 'total-students',
        iconName: 'school',
        iconColor: 'blue',
        stateIcon: 'trending_up',
        percentage: 0,
        cardTitle: 'Total Students',
        info: studentsStat?.totalStudents ?? 0,
      },
      {
        id: 'month-enrollments',
        iconName: 'person_add',
        iconColor: 'green',
        stateIcon: 'trending_up',
        percentage: 0,
        cardTitle: 'Enrollments This Month',
        info: studentsStat?.totalMonthEnrollments ?? 0,
      },
    ],
    [studentsStat],
  )

  if (fetchStatus === 'pending') return <UICardSkeleton count={2} />
  if (fetchStatus === 'error') return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cards.map((card) => (
        <UICardComponent {...card} key={card.id} />
      ))}
    </div>
  )
}

export function AnnouncementsStatCards({
  schoolId,
  filters,
}: {
  schoolId: ID
  filters: GetAnnouncementsFiltersSchema
}) {
  const { data: announcements, status: fetchStatus } = useSuspenseQuery(
    getAnnouncementsListQueryOptions(schoolId, filters),
  )

  console.log({ announcements, fetchStatus })
  if (fetchStatus === 'error') return null
  const cards = useMemo<UICardType[]>(
    () => [
      {
        id: 'active-posts',
        iconName: 'campaign',
        iconColor: 'green',
        stateIcon: 'trending_up',
        percentage: 12,
        cardTitle: 'Active Posts',
        info: announcements.length ?? 0,
      },

      {
        id: 'draft-posts',
        iconName: 'edit_document',
        iconColor: 'orange',
        stateIcon: 'trending_down',
        percentage: -3,
        cardTitle: 'Drafts',
        info: 0,
      },

      {
        id: 'total-views',
        iconName: 'visibility',
        iconColor: 'blue',
        stateIcon: 'trending_up',
        percentage: 24,
        cardTitle: 'Total Views',
        info: '1.2k',
      },
    ],
    [announcements, fetchStatus],
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <UICardComponent {...card} key={card.id} />
      ))}
    </div>
  )
}
