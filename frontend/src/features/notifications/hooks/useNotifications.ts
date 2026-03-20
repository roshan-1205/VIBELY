/**
 * Notification Hooks
 * React Query hooks for notification management
 */

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationAPI } from '../services/notification.api'
import { NotificationItem, NotificationParams } from '../types/notification.types'
import { logger } from '@/core/utils/logger'
import { useToast } from '@/core/components/Toast'

// Query keys
export const notificationQueryKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationQueryKeys.all, 'list'] as const,
  list: (params: NotificationParams) => [...notificationQueryKeys.lists(), params] as const,
  unreadCount: () => [...notificationQueryKeys.all, 'unread-count'] as const,
}

/**
 * Hook for getting notifications with infinite scroll
 */
export function useNotifications(params: NotificationParams = {}) {
  return useInfiniteQuery({
    queryKey: notificationQueryKeys.list(params),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await notificationAPI.getNotifications({
        ...params,
        offset: pageParam,
      })
      return response.data
    },
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage.length === (params.limit || 20)
      return hasMore ? allPages.length * (params.limit || 20) : undefined
    },
    initialPageParam: 0,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook for getting unread notification count
 */
export function useUnreadCount() {
  return useQuery({
    queryKey: notificationQueryKeys.unreadCount(),
    queryFn: async () => {
      const response = await notificationAPI.getUnreadCount()
      return response.data.unread_count
    },
    staleTime: 10 * 1000, // 10 seconds
    gcTime: 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })
}

/**
 * Hook for marking notification as read
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: notificationAPI.markAsRead,
    onMutate: async (notificationId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: notificationQueryKeys.lists() })

      // Snapshot previous value
      const previousNotifications = queryClient.getQueryData(notificationQueryKeys.lists())

      // Optimistically update notification
      queryClient.setQueriesData(
        { queryKey: notificationQueryKeys.lists() },
        (old: any) => {
          if (!old) return old

          return {
            ...old,
            pages: old.pages.map((page: NotificationItem[]) =>
              page.map((notification) =>
                notification.id === notificationId
                  ? { ...notification, is_read: true, read_at: new Date().toISOString() }
                  : notification
              )
            ),
          }
        }
      )

      // Update unread count
      queryClient.setQueryData(
        notificationQueryKeys.unreadCount(),
        (old: number = 0) => Math.max(0, old - 1)
      )

      return { previousNotifications }
    },
    onError: (err, notificationId, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(notificationQueryKeys.lists(), context.previousNotifications)
      }
      
      showToast({
        type: 'error',
        message: 'Failed to mark notification as read',
      })
      
      logger.error('Mark notification as read failed', err)
    },
    onSuccess: () => {
      logger.info('Notification marked as read')
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.unreadCount() })
    },
  })
}

/**
 * Hook for marking all notifications as read
 */
export function useMarkAllAsRead() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: notificationAPI.markAllAsRead,
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: notificationQueryKeys.lists() })

      // Snapshot previous value
      const previousNotifications = queryClient.getQueryData(notificationQueryKeys.lists())

      // Optimistically update all notifications
      queryClient.setQueriesData(
        { queryKey: notificationQueryKeys.lists() },
        (old: any) => {
          if (!old) return old

          return {
            ...old,
            pages: old.pages.map((page: NotificationItem[]) =>
              page.map((notification) => ({
                ...notification,
                is_read: true,
                read_at: new Date().toISOString(),
              }))
            ),
          }
        }
      )

      // Update unread count to 0
      queryClient.setQueryData(notificationQueryKeys.unreadCount(), 0)

      return { previousNotifications }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(notificationQueryKeys.lists(), context.previousNotifications)
      }
      
      showToast({
        type: 'error',
        message: 'Failed to mark all notifications as read',
      })
      
      logger.error('Mark all notifications as read failed', err)
    },
    onSuccess: (data) => {
      showToast({
        type: 'success',
        message: `Marked ${data.data.marked_count} notifications as read`,
      })
      
      logger.info('All notifications marked as read', { count: data.data.marked_count })
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all })
    },
  })
}

/**
 * Hook for deleting notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: notificationAPI.deleteNotification,
    onMutate: async (notificationId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: notificationQueryKeys.lists() })

      // Snapshot previous value
      const previousNotifications = queryClient.getQueryData(notificationQueryKeys.lists())

      // Optimistically remove notification
      queryClient.setQueriesData(
        { queryKey: notificationQueryKeys.lists() },
        (old: any) => {
          if (!old) return old

          return {
            ...old,
            pages: old.pages.map((page: NotificationItem[]) =>
              page.filter((notification) => notification.id !== notificationId)
            ),
          }
        }
      )

      return { previousNotifications }
    },
    onError: (err, notificationId, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(notificationQueryKeys.lists(), context.previousNotifications)
      }
      
      showToast({
        type: 'error',
        message: 'Failed to delete notification',
      })
      
      logger.error('Delete notification failed', err)
    },
    onSuccess: () => {
      showToast({
        type: 'success',
        message: 'Notification deleted',
      })
      
      logger.info('Notification deleted')
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all })
    },
  })
}