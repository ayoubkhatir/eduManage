import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { notificationFetcher } from './fetcher'
import type {
  AddTeacherNotificationPayload,
  NotificationFilter,
} from '../types/apiType'

export const getTeacherNotificationsQueryOptions = (
  filterAndPagination: NotificationFilter,
) =>
  queryOptions({
    queryKey: ['teacher-notifications', filterAndPagination],
    queryFn: () =>
      notificationFetcher.getTeacherNotifications(filterAndPagination),
  })

export const getTeacherNotificationQueryOptions = (notificationId: string) =>
  queryOptions({
    queryKey: ['teacher-notification', notificationId],
    queryFn: () => notificationFetcher.getTeacherNotification(notificationId),
  })

export default function useGetTeacherNotifications(
  filterAndPagination: NotificationFilter,
  enabled: boolean
) {
  return useQuery({
    ...getTeacherNotificationsQueryOptions(filterAndPagination),
    placeholderData: keepPreviousData,
    enabled
  })
}

export function useTeacherNotification(notificationId: string) {
  return useQuery({
    ...getTeacherNotificationQueryOptions(notificationId),
    enabled: !!notificationId,
  })
}

export function useAddTeacherNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddTeacherNotificationPayload) =>
      notificationFetcher.addTeacherNotification(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['teacher-notifications'],
      })
    },
  })
}

export function useDeleteOwnNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationFetcher.deleteOwnNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['teacher-notifications'],
      })
    },
  })
}
