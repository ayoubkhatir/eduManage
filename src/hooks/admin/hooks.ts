import type { AnnouncementAudienceEnum } from '#/server/db/schema'
import { getAnnouncementByIdServerFn, getAnnouncementByTitleSlugServerFn, getAnnouncementsServerFn } from '#/server/modules/announcement/announcement.server-functions'
import { getDashboardStatsServerFn } from '#/server/modules/students/students.server-functions'

export type AnnouncementsListFilters = {
  audience: AnnouncementAudienceEnum,
  search: string
}

export const getAnnouncementsListQueryOptions = (
  schoolId: string,
  filters: AnnouncementsListFilters
) => ({
  queryKey: ['announcements', schoolId, filters],
  queryFn: async () => {
    try {
      const response = await getAnnouncementsServerFn({
        data: { schoolId, filters },
      })

      if (!response.success) {
        throw new Error("Error when fetching announcements")

      }
      return response.data
    } catch (error) {
      console.error('Error fetching announcements:', error)
      throw error
    }
  },
})

export const getAnnouncementQueryOptions = (announcementId: string) => ({
  queryKey: ['announcements', "announcementId", announcementId],
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

export const getAnnouncementByTitleSlugQueryOptions = (announcementTitleSlug: string) => ({
  queryKey: ['announcements', "announcementTitleSlug", announcementTitleSlug],
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

export const getAnnouncementByIdQueryOptions = (announcementId: string) => ({
  queryKey: ['announcements', "announcementId", announcementId],
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

export const getDashboardStatsQueryOptions = (schoolId: string) => {
  return {
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      try {
        const response = await getDashboardStatsServerFn({ data: schoolId })
        if (!response.success) {
          throw new Error('Dashboard stats not found')
        }
        return response.data
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        throw error
      }
    },
  }
}