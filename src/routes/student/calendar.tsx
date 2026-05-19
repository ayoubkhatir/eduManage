import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'

import { useGetEventsOptions } from '#/hooks/events/hooks'

import { GlobalCalendar } from '#/components/teacher-calendar'

export const Route = createFileRoute('/student/calendar')({
  component: StudentCalendar,
  pendingComponent: () => (
    <Skeleton name="student-calendar-page" loading>
      <StudentCalendarContent />
    </Skeleton>
  ),
  pendingMs: 0,
  pendingMinMs: 220,
  head: () => ({
    meta: [{ title: 'Student | Calendar - EduManage' }],
  }),
  loader: async ({ context }) => {
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    await context.queryClient.prefetchQuery(useGetEventsOptions('Class-B'))
  },
})

function StudentCalendar() {
  return (
    <Skeleton name="student-calendar-page" loading={false}>
      <StudentCalendarContent />
    </Skeleton>
  )
}

function StudentCalendarContent() {
  return (
    <GlobalCalendar isTeacher={false} rawEvents={[]}>
      <div className="h-full w-full" />
    </GlobalCalendar>
  )
}
