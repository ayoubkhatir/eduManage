import { useMemo } from 'react'
import type { OwnerEvent } from './model'
import useGetEvents from '@/hooks/events/hooks'
import { useGetStudents } from '@/hooks/students/hooks'
import { useQuery } from '@tanstack/react-query'
import { getAllTeachersServerFn } from '#/server/modules/teachers/teachers.server-functions'

type ApiEvent = Omit<OwnerEvent, 'start' | 'end'> & {
	start: string | Date
	end: string | Date
}

export function useAdminCalendarData(schoolId?: string) {
	const { data: studentsResp } = useGetStudents({})
	const studentsData = studentsResp?.data ?? []

	const { data: teachersResp } = useQuery({
		queryKey: ['teachers', 'calendar-options', schoolId],
		queryFn: async () => {
			if (!schoolId) return []
			const response = await getAllTeachersServerFn({ data: { schoolId } })
			return response.success ? response.data : []
		},
		enabled: !!schoolId,
	})

	const {
		data: eventsData,
		isLoading: isEventsLoading,
		isError: isEventsError,
	} = useGetEvents(undefined, undefined, true)

	const events = useMemo<Array<OwnerEvent>>(
		() =>
			(eventsData ?? []).map((ev: ApiEvent) => ({
				...ev,
				start: new Date(ev.start),
				end: new Date(ev.end),
			})),
		[eventsData],
	)

	const teacherNames: Array<string> = useMemo(() => {
		const names = (teachersResp ?? [])
			.map((teacher: any) => teacher.username)
			.filter(Boolean)
		return Array.from(new Set(names)).sort()
	}, [teachersResp])

	const classOptions: Array<string> = useMemo(() => {
		const classNames: Array<string> = studentsData
			.map((student: any) => student.info?.class?.name)
			.filter(Boolean)
		return Array.from(new Set(classNames)).sort()
	}, [studentsData])

	const classLookup = useMemo(() => {
		const lookup = new Map<string, string>()
		for (const student of studentsData as Array<any>) {
			const className = student.info?.class?.name
			const classId = student.info?.class?.id
			if (className && classId && !lookup.has(className)) {
				lookup.set(className, classId)
			}
		}
		return lookup
	}, [studentsData])

	const teacherLookup = useMemo(() => {
		const lookup = new Map<string, string>()
		for (const teacher of (teachersResp ?? []) as Array<any>) {
			if (teacher.username && teacher.teacherId && !lookup.has(teacher.username)) {
				lookup.set(teacher.username, teacher.teacherId)
			}
		}
		return lookup
	}, [teachersResp])

	const displayEvents = useMemo(() => {
		const WEEK_MS = 7 * 24 * 60 * 60 * 1000
		const windowStart = new Date()
		windowStart.setFullYear(windowStart.getFullYear() - 1)
		const windowEnd = new Date()
		windowEnd.setFullYear(windowEnd.getFullYear() + 1)

		const result: Array<OwnerEvent> = []
		for (const ev of events) {
			if (!ev.repeatWeekly) {
				result.push(ev)
				continue
			}

			const durationMs = ev.end.getTime() - ev.start.getTime()
			let cur = new Date(ev.start)

			if (cur < windowStart) {
				const weeks = Math.ceil((windowStart.getTime() - cur.getTime()) / WEEK_MS)
				cur = new Date(cur.getTime() + weeks * WEEK_MS)
			}

			while (cur <= windowEnd) {
				result.push({
					...ev,
					start: new Date(cur),
					end: new Date(cur.getTime() + durationMs),
				})
				cur = new Date(cur.getTime() + WEEK_MS)
			}
		}

		return result
	}, [events])

	const upcomingEvents = useMemo(() => {
		const now = new Date()
		const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
		const tomorrowEnd = new Date(todayStart.getTime() + 2 * 24 * 60 * 60 * 1000 - 1)

		return [...displayEvents]
			.filter((e) => e.start <= tomorrowEnd && e.end >= todayStart)
			.sort((a, b) => a.start.getTime() - b.start.getTime())
	}, [displayEvents])

	return {
		classOptions,
		classLookup,
		displayEvents,
		events,
		isEventsError,
		isEventsLoading,
		teacherNames,
		teacherLookup,
		upcomingEvents,
	}
}
