import { useQuery, queryOptions } from '@tanstack/react-query'
import { getEventsServerFn } from '#/server/modules/events/events.server-functions'

export const useGetEventsOptions = (
    classId?: string,
    teacherUserId?: string,
    isOwner = false,
) => {
    const now = new Date()
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    return queryOptions({
        queryKey: [
            'events',
            isOwner ? 'admin-all' : classId ?? teacherUserId ?? 'all',
            isOwner ? null : now.toISOString().split('T')[0],
            isOwner ? null : in30Days.toISOString().split('T')[0],
        ],
        queryFn: async () => {
            const response = await getEventsServerFn({
                data: {
                    classId,
                    teacherUserId,
                    isOwner,
                    startDate: isOwner ? undefined : now.toISOString(),
                    endDate: isOwner ? undefined : in30Days.toISOString(),
                },
            })

            if (response.success) return response.data
            throw new Error('Failed to fetch events')
        },
    })
}

export default function useGetEvents(
    classId?: string,
    teacherUserId?: string,
    isOwner = false,
) {
    return useQuery(useGetEventsOptions(classId, teacherUserId, isOwner))
}
