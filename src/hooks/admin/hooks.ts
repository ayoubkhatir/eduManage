// import {
//   getAllAnnouncementsServerFn,
//   getAnnouncementByIdServerFn,
// } from '#/server/modules/announcment/announcement.server-functions'
// import type { AnnouncementModel } from '@/schemas/announcement.schemas'
import { getAnnouncementByIdServerFn, getAnnouncementByTitleSlugServerFn, getAnnouncementsServerFn } from '#/server/modules/announcement/announcement.server-functions'

// interface AnnouncementFilters {
//   search?: string
// }

export const getAnnouncementsListQueryOptions = (
  schoolId: string
  // filters?: AnnouncementFilters,
) => ({
  queryKey: ['announcements', schoolId],//filters],
  queryFn: async () => {
    try {
      const response = await getAnnouncementsServerFn({
        data: schoolId,
      })
      //filters || {}
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

export const getAnnouncementQueryOptions = (announcementId: string) => ({
  queryKey: ['announcement', "announcementId", announcementId],
  queryFn: async () => {
    try {
      const response = await getAnnouncementByIdServerFn({
        data: announcementId,
      })

      if (!response.success) {
        throw new Error('Announcement not found')
      }

      return response.data
    } catch (error) {
      console.error('Error fetching announcement:', error)
      throw error
    }
  },
})

export const getAnnouncementByTitleQueryOptions = (announcementTitleSlug: string) => ({
  queryKey: ['announcement', "announcementTitleSlug", announcementTitleSlug],
  queryFn: async () => {
    try {
      const response = await getAnnouncementByTitleSlugServerFn({
        data: announcementTitleSlug,
      })

      if (!response.success) {
        throw new Error('Announcement not found')
      }

      return response.data
    } catch (error) {
      console.error('Error fetching announcement:', error)
      throw error
    }
  },
})
