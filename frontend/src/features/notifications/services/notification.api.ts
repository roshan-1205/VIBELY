/**
 * Notification API Service
 * Handles all notification-related API calls
 */

import { api, endpoints } from '@/core/api/client'
import { 
  NotificationItem, 
  NotificationResponse, 
  UnreadCountResponse,
  NotificationParams 
} from '../types/notification.types'

export const notificationAPI = {
  /**
   * Get user notifications with pagination
   */
  getNotifications: async (params: NotificationParams = {}): Promise<NotificationResponse> => {
    const queryParams = new URLSearchParams()
    
    if (params.offset !== undefined) queryParams.append('offset', params.offset.toString())
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString())
    if (params.unread_only) queryParams.append('unread_only', 'true')
    if (params.type) queryParams.append('type', params.type)
    
    const url = `/notifications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return api.get<NotificationItem[]>(url)
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    return api.get<{ unread_count: number }>('/notifications/unread-count')
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (notificationId: string): Promise<{ success: boolean; data: { marked_read: boolean } }> => {
    return api.post<{ marked_read: boolean }>(`/notifications/${notificationId}/read`)
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<{ success: boolean; data: { marked_count: number } }> => {
    return api.post<{ marked_count: number }>('/notifications/mark-all-read')
  },

  /**
   * Delete notification
   */
  deleteNotification: async (notificationId: string): Promise<{ success: boolean; data: { deleted: boolean } }> => {
    return api.delete<{ deleted: boolean }>(`/notifications/${notificationId}`)
  },
}

// Update endpoints
export const notificationEndpoints = {
  notifications: '/notifications',
  unreadCount: '/notifications/unread-count',
  markAsRead: (id: string) => `/notifications/${id}/read`,
  markAllAsRead: '/notifications/mark-all-read',
  delete: (id: string) => `/notifications/${id}`,
}