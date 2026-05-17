import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import type { EventForm } from '#/components/admin/calendar/model'


async function getEvents(className?: string, teacherId?: string, isOwner = false) {
  const now = new Date()
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  let params: Record<string, unknown> = {}

  if (!isOwner) {
    params = {
      ...params,
      startDate: now.toISOString().split('T')[0],
      endDate: in30Days.toISOString().split('T')[0],
    }
  }

  if (className && !isOwner) {
    params = { ...params, className }
  } else if (teacherId && !isOwner) {
    params = { ...params, teacherId }
  }

  return axios
    .get<Array<EventForm>>('http://localhost:4000/events', { params })
    .then((res) => res.data)
}

export const useGetEventsOptions = (
  className?: string,
  teacherId?: string,
  isOwner = false,
) => ({
  queryKey: [
    'events',
    isOwner ? 'admin-all' : (className ?? teacherId ?? 'all'),
  ],
  queryFn: () => getEvents(className, teacherId, isOwner),
  enabled: true,
})

export default function useGetEvents(
  className?: string,
  teacherId?: string,
  isOwner = false,
) {
  return useQuery(useGetEventsOptions(className, teacherId, isOwner))
}

