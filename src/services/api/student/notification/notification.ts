import { useQuery } from '@tanstack/react-query'

const fetchNotification = async () => {
  const res = await fetch('http://localhost:4000/notifications')
  if (!res.ok) {
    throw new Error('Failed to fetch notifications')
  }
  return res.json()
}

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotification,
  })
}

export const fetchNotificationById = async (notificationId: string) => {
  const res = await fetch(
    `http://localhost:4000/notifications/${notificationId}`,
  )
  if (!res.ok) {
    throw new Error('Failed to fetch notification')
  }
  return res.json()
}

export const useNotificationById = (notificationId: string) => {
  return useQuery({
    queryKey: ['notification', notificationId],
    queryFn: () => fetchNotificationById(notificationId),
    enabled: !!notificationId,
    staleTime: 5 * 60 * 1000,
  })
}
