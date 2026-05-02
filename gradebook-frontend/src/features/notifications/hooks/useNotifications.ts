import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getNotifications,
  getUnreadCount,
  markAllRead,
  markRead,
} from '../api/notifications.api'

export const useNotifications = (role: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['notifications', role],
    queryFn: () => getNotifications(role),
    enabled,
    refetchInterval: enabled ? 30_000 : false,
  })
}

export const useUnreadCount = (role: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['notifications', role, 'unread-count'],
    queryFn: () => getUnreadCount(role),
    enabled,
    refetchInterval: enabled ? 30_000 : false,
  })
}

export const useMarkAllRead = (role: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => markAllRead(role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', role] })
    },
  })
}

export const useMarkRead = (role: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (notificationId: string) => markRead(role, notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', role] })
    },
  })
}
