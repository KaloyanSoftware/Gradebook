export interface NotificationResponse {
  id: string
  type: string
  message: string
  isRead: boolean
  sourceId: string
  sourceType: string
  createdAt: string
}

export interface UnreadCountResponse {
  count: number
}
