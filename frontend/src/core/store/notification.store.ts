/**
 * Notification Store - Zustand
 * Global state management for notifications
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { NotificationItem } from '@/features/notifications/types/notification.types'
import { logger } from '../utils/logger'

interface NotificationState {
  // State
  notifications: NotificationItem[]
  unreadCount: number
  isLoading: boolean
  
  // Actions
  addNotification: (notification: NotificationItem) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  removeNotification: (notificationId: string) => void
  setNotifications: (notifications: NotificationItem[]) => void
  setUnreadCount: (count: number) => void
  setLoading: (loading: boolean) => void
  
  // Real-time handlers
  handleRealtimeNotification: (notification: NotificationItem) => void
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set, get) => ({
      // Initial state
      notifications: [],
      unreadCount: 0,
      isLoading: false,

      // Actions
      addNotification: (notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + (notification.is_read ? 0 : 1),
        }))
        
        logger.info('Notification added', { id: notification.id, type: notification.type })
      },

      markAsRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, is_read: true, read_at: new Date().toISOString() }
              : notification
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }))
        
        logger.info('Notification marked as read', { id: notificationId })
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            is_read: true,
            read_at: new Date().toISOString(),
          })),
          unreadCount: 0,
        }))
        
        logger.info('All notifications marked as read')
      },

      removeNotification: (notificationId) => {
        set((state) => {
          const notification = state.notifications.find(n => n.id === notificationId)
          const wasUnread = notification && !notification.is_read
          
          return {
            notifications: state.notifications.filter((n) => n.id !== notificationId),
            unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
          }
        })
        
        logger.info('Notification removed', { id: notificationId })
      },

      setNotifications: (notifications) => {
        const unreadCount = notifications.filter(n => !n.is_read).length
        
        set({
          notifications,
          unreadCount,
        })
        
        logger.info('Notifications set', { count: notifications.length, unread: unreadCount })
      },

      setUnreadCount: (count) => {
        set({ unreadCount: count })
        logger.debug('Unread count updated', { count })
      },

      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      // Real-time handlers
      handleRealtimeNotification: (notification) => {
        const { addNotification } = get()
        
        // Add to store
        addNotification(notification)
        
        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.svg',
            tag: notification.id, // Prevent duplicates
          })
        }
        
        logger.info('Real-time notification received', { 
          id: notification.id, 
          type: notification.type 
        })
      },
    }),
    {
      name: 'notification-store',
    }
  )
)

// Request notification permission on store creation
if (typeof window !== 'undefined' && 'Notification' in window) {
  if (Notification.permission === 'default') {
    Notification.requestPermission().then((permission) => {
      logger.info('Notification permission', { permission })
    })
  }
}