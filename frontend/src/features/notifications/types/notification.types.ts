/**
 * Notification Types
 * TypeScript definitions for notification system
 */

export interface NotificationItem {
  id: string
  type: 'like' | 'comment' | 'follow' | 'system'
  title: string
  message: string
  metadata?: {
    post_id?: number
    liker_id?: string
    liker_username?: string
    commenter_id?: string
    commenter_username?: string
    follower_id?: string
    follower_username?: string
    post_content?: string
    comment_content?: string
  }
  is_read: boolean
  created_at: string
  read_at?: string
}

export interface NotificationResponse {
  success: boolean
  data: NotificationItem[]
  message?: string
}

export interface UnreadCountResponse {
  success: boolean
  data: {
    unread_count: number
  }
  message?: string
}

export interface NotificationEvent {
  type: 'notification'
  notification: NotificationItem
  timestamp: string
}

export interface NotificationFilters {
  unread_only?: boolean
  type?: string
}

export interface NotificationParams extends NotificationFilters {
  offset?: number
  limit?: number
}