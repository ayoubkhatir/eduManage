import axios from 'axios'

import { filterNotifications } from './filter'
import type {
  AddTeacherNotificationPayload,
  NotificationFetcher,
  NotificationFilter,
  PaginationData,
} from '../types/apiType'
import type { Notification } from '../types/modelType'

const API_URL = 'http://localhost:4000/teacherNotifications'

/* handle notification response */
const unwrapNotificationResponse = (
  data: Notification | { data: Notification },
): Notification => {
  if (typeof data === 'object' && 'data' in data) {
    return data.data
  }

  return data
}

const isMultipartParsingError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) {
    return false
  }

  const responseMessage =
    typeof error.response?.data === 'string' ? error.response.data : ''

  return /json at position|unexpected token|multipart|boundary/i.test(
    responseMessage,
  )
}

const buildAudience = (
  role: 'Teacher' | 'Admin',
  sendTo: Array<string> = [],
): NonNullable<Notification['sendTo']> => {
  const normalized = sendTo.filter(
    (value): value is 'Students' | 'Teachers' =>
      value === 'Students' || value === 'Teachers',
  )

  if (normalized.length > 0) {
    return normalized
  }

  return role === 'Teacher' ? ['Students'] : ['Teachers', 'Students']
}

class JsonNotificationFetcher implements NotificationFetcher {
  async getTeacherNotifications(
    filterAndPagination: NotificationFilter,
  ): Promise<PaginationData<Notification>> {
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    const response = await axios.get<Array<Notification>>(API_URL)
    return filterNotifications(response.data, filterAndPagination)
  }

  async getTeacherNotification(notificationId: string): Promise<Notification> {
    // await new Promise((resolve)=> setTimeout(resolve , 2000))
    if (!notificationId) {
      throw new Error('Notification id is required')
    }
    const response = await axios.get<Notification>(
      `${API_URL}/${notificationId}`,
    )
    return response.data
  }

  async addTeacherNotification({
    role,
    subject,
    content,
    attachments,
    type,
    sendTo,
    onUploadProgress,
  }: AddTeacherNotificationPayload): Promise<Notification> {
    const audience = buildAudience(role, sendTo)

    const payload = {
      type,
      title: subject,
      content,
      subject: audience.join(' • '),
      sendTo: audience,
      time: new Date().toLocaleString(),
    }
    {
      /* give progress updates */
    }
    const reportProgress = (loaded: number, total?: number) => {
      if (!onUploadProgress) {
        return
      }

      if (!total) {
        onUploadProgress(0)
        return
      }

      const progress = Math.round((loaded * 100) / total)
      onUploadProgress(progress)
    }

    const formData = new FormData()
    formData.append('type', payload.type)
    formData.append('title', payload.title)
    formData.append('content', payload.content)
    formData.append('subject', payload.subject)
    formData.append('time', payload.time)
    formData.append('sendTo', JSON.stringify(payload.sendTo))

    payload.sendTo.forEach((value) => {
      formData.append('sendTo[]', value)
    })

    Array.from(attachments ?? []).forEach((file) => {
      formData.append('attachments', file)
    })

    try {
      const response = await axios.post<Notification | { data: Notification }>(
        API_URL,
        formData,
        {
          onUploadProgress: (event) => {
            reportProgress(event.loaded, event.total)
          },
        },
      )

      onUploadProgress?.(100)
      return unwrapNotificationResponse(response.data)
    } catch (error) {
      const hasFiles = (attachments?.length ?? 0) > 0
      if (hasFiles || !isMultipartParsingError(error)) {
        throw error
      }

      const response = await axios.post<Notification | { data: Notification }>(
        API_URL,
        payload,
      )
      onUploadProgress?.(100)
      return unwrapNotificationResponse(response.data)
    }
  }
  // TODO : handle deleting file
  async deleteOwnNotification(notificationId: string): Promise<void> {
    if (!notificationId) {
      throw new Error('Notification id is required')
    }

    try {
      await axios.delete(`${API_URL}/${notificationId}`)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return
      }

      throw error
    }
  }
}

export const notificationFetcher: NotificationFetcher = new JsonNotificationFetcher()
