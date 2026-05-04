// import { useMemo } from 'react'
// import type { OwnerEvent } from './model'
// // import { useGetTeachers } from '@/services/api/owner/teacher/hooks'
// import { useGetStudents } from '@/services/api/owner/student/hooks'
// import useGetEvents from '@/services/api/getEvents'

// type ApiEvent = Omit<OwnerEvent, 'start' | 'end'> & {
//   start: string | Date
//   end: string | Date
// }

// export function useOwnerCalendarData() {
//   // const { data: { data: teachersData } = { data: [] } } = useGetTeachers()
//   const { data: { data: studentsData } = { data: [] } } = useGetStudents({})

//   const {
//     data: eventsData,
//     isLoading: isEventsLoading,
//     isError: isEventsError,
//   } = useGetEvents(undefined, undefined, true)

//   const events = useMemo<Array<OwnerEvent>>(
//     () =>
//       (eventsData ?? []).map((ev: ApiEvent) => ({
//         ...ev,
//         start: new Date(ev.start),
//         end: new Date(ev.end),
//       })),
//     [eventsData],
//   )

//   const teacherNames: Array<string> = useMemo(
//     () =>
//       teachersData
//         .map((t: { id: string; name: string }) => t.name)
//         .filter(Boolean),
//     [teachersData],
//   )

//   const classOptions: Array<string> = useMemo(() => {
//     const grades: Array<string> = studentsData.map(
//       (s: { grade: string }) => s.grade,
//     )
//     return Array.from(new Set(grades)).sort()
//   }, [studentsData])

//   const displayEvents = useMemo(() => {
//     const WEEK_MS = 7 * 24 * 60 * 60 * 1000
//     const windowStart = new Date()
//     windowStart.setFullYear(windowStart.getFullYear() - 1)
//     const windowEnd = new Date()
//     windowEnd.setFullYear(windowEnd.getFullYear() + 1)

//     const result: Array<OwnerEvent> = []
//     for (const ev of events) {
//       if (!ev.repeatWeekly) {
//         result.push(ev)
//         continue
//       }

//       const durationMs = ev.end.getTime() - ev.start.getTime()
//       let cur = new Date(ev.start)

//       if (cur < windowStart) {
//         const weeks = Math.ceil(
//           (windowStart.getTime() - cur.getTime()) / WEEK_MS,
//         )
//         cur = new Date(cur.getTime() + weeks * WEEK_MS)
//       }

//       while (cur <= windowEnd) {
//         result.push({
//           ...ev,
//           start: new Date(cur),
//           end: new Date(cur.getTime() + durationMs),
//         })
//         cur = new Date(cur.getTime() + WEEK_MS)
//       }
//     }

//     return result
//   }, [events])

//   const upcomingEvents = useMemo(() => {
//     const now = new Date()
//     const todayStart = new Date(
//       now.getFullYear(),
//       now.getMonth(),
//       now.getDate(),
//     )
//     const tomorrowEnd = new Date(
//       todayStart.getTime() + 2 * 24 * 60 * 60 * 1000 - 1,
//     )

//     return [...displayEvents]
//       .filter((e) => e.start <= tomorrowEnd && e.end >= todayStart)
//       .sort((a, b) => a.start.getTime() - b.start.getTime())
//   }, [displayEvents])

//   return {
//     classOptions,
//     displayEvents,
//     events,
//     isEventsError,
//     isEventsLoading,
//     teacherNames,
//     upcomingEvents,
//   }
// }
