import { useQuery } from '@tanstack/react-query'
import {
  getAllAnnouncementsServerFn,
  getAnnouncementByIdServerFn,
} from '#/server/modules/announcment/announcement.server-functions'
import type { AnnouncementModel } from '@/schemas/announcement.schemas'

interface AnnouncementFilters {
  search?: string
}

export const getAnnouncementsListQueryOptions = (
  filters?: AnnouncementFilters,
) => ({
  queryKey: ['announcements', filters],
  queryFn: async () => {
    try {
      const response = await getAllAnnouncementsServerFn({
        data: filters || {},
      })
      console.log('Announcements response:', response)

      if (response.success && response.data) {
        return response.data
      }
      return []
    } catch (error) {
      console.error('Error fetching announcements:', error)
      throw error
    }
  },
})

export function useGetAnnouncements(filters?: AnnouncementFilters) {
  return useQuery({
    ...getAnnouncementsListQueryOptions(filters),
    retry: false,
  })
}

export const getAnnouncementQueryOptions = (announcementId: string) => ({
  queryKey: ['announcement', announcementId],
  queryFn: async () => {
    try {
      const response = await getAnnouncementByIdServerFn({
        data: announcementId,
      })
      console.log('Announcement response:', response)

      if (response.success && response.data) {
        return response.data
      }
      return null
    } catch (error) {
      console.error('Error fetching announcement:', error)
      throw error
    }
  },
})

export function useGetAnnouncement(id: string) {
  return useQuery({
    ...getAnnouncementQueryOptions(id),
    retry: false,
  })
}
