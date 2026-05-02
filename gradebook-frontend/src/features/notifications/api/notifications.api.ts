import axiosClient from '@/api/axiosClient'
import type { NotificationResponse, UnreadCountResponse } from '../types/notification.types'

const BASE: Record<string, string> = {
  PARENT:  '/parent/notifications',
  STUDENT: '/student/me/notifications',
}

export const getNotifications = async (role: string): Promise<NotificationResponse[]> => {
  const response = await axiosClient.get<NotificationResponse[]>(BASE[role])
  return response.data
}

export const getUnreadCount = async (role: string): Promise<UnreadCountResponse> => {
  const response = await axiosClient.get<UnreadCountResponse>(`${BASE[role]}/unread-count`)
  return response.data
}

export const markAllRead = async (role: string): Promise<void> => {
  await axiosClient.patch(`${BASE[role]}/read-all`)
}

export const markRead = async (role: string, notificationId: string): Promise<void> => {
  await axiosClient.patch(`${BASE[role]}/${notificationId}/read`)
}
