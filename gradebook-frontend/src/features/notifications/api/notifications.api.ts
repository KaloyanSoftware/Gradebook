import axiosClient from '@/api/axiosClient'
import type { NotificationResponse, UnreadCountResponse } from '../types/notification.types'

export const getNotifications = async (): Promise<NotificationResponse[]> => {
  const response = await axiosClient.get<NotificationResponse[]>('/parent/notifications')
  return response.data
}

export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  const response = await axiosClient.get<UnreadCountResponse>('/parent/notifications/unread-count')
  return response.data
}

export const markAllRead = async (): Promise<void> => {
  await axiosClient.patch('/parent/notifications/read-all')
}

export const markRead = async (notificationId: string): Promise<void> => {
  await axiosClient.patch(`/parent/notifications/${notificationId}/read`)
}
