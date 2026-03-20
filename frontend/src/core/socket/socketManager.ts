/**
 * WebSocket Manager - Production Ready
 * Handles real-time connections with authentication and reconnection
 */

import React from 'react'
import { ENV } from '../config/env'
import { logger } from '../utils/logger'
import { useAuthStore } from '../store/auth.store'
import { useNotificationStore } from '../store/notification.store'
import { useQueryClient } from '@tanstack/react-query'
import { notificationQueryKeys } from '@/features/notifications/hooks/useNotifications'
import { feedQueryKeys } from '@/features/feed/hooks/useFeed'

export interface SocketEvent {
  type: string
  data: any
  timestamp: number
}

export interface SocketEventHandler {
  (data: any): void
}

class SocketManager {
  private socket: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private eventHandlers = new Map<string, Set<SocketEventHandler>>()
  private isConnecting = false
  private shouldReconnect = true
  private queryClient: any = null

  /**
   * Set query client for cache updates
   */
  setQueryClient(client: any) {
    this.queryClient = client
  }

  /**
   * Connect to WebSocket server with JWT authentication
   */
  async connect(): Promise<void> {
    if (this.socket?.readyState === WebSocket.OPEN || this.isConnecting) {
      return
    }

    this.isConnecting = true
    
    try {
      const { user, accessToken } = useAuthStore.getState()
      
      if (!user || !accessToken) {
        logger.warn('Cannot connect to WebSocket: No authenticated user')
        return
      }

      const wsUrl = `${ENV.VITE_WS_URL}/connect?token=${accessToken}`
      
      logger.info('Connecting to WebSocket', { userId: user.id })
      
      this.socket = new WebSocket(wsUrl)
      
      this.socket.onopen = this.handleOpen.bind(this)
      this.socket.onmessage = this.handleMessage.bind(this)
      this.socket.onclose = this.handleClose.bind(this)
      this.socket.onerror = this.handleError.bind(this)
      
    } catch (error) {
      logger.error('WebSocket connection failed', error)
      this.isConnecting = false
      this.scheduleReconnect()
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.shouldReconnect = false
    
    if (this.socket) {
      this.socket.close(1000, 'Client disconnect')
      this.socket = null
    }
    
    this.isConnecting = false
    this.reconnectAttempts = 0
    
    logger.info('WebSocket disconnected')
  }

  /**
   * Send message to server
   */
  send(type: string, data: any): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      const message = {
        type,
        data,
        timestamp: Date.now()
      }
      
      this.socket.send(JSON.stringify(message))
      logger.debug('WebSocket message sent', { type, data })
    } else {
      logger.warn('Cannot send message: WebSocket not connected', { type, data })
    }
  }

  /**
   * Subscribe to events
   */
  on(eventType: string, handler: SocketEventHandler): () => void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set())
    }
    
    this.eventHandlers.get(eventType)!.add(handler)
    
    // Return unsubscribe function
    return () => {
      this.eventHandlers.get(eventType)?.delete(handler)
    }
  }

  /**
   * Unsubscribe from events
   */
  off(eventType: string, handler?: SocketEventHandler): void {
    if (handler) {
      this.eventHandlers.get(eventType)?.delete(handler)
    } else {
      this.eventHandlers.delete(eventType)
    }
  }

  /**
   * Join a room (e.g., post comments, live feed)
   */
  joinRoom(room: string): void {
    this.send('join_room', { room })
  }

  /**
   * Leave a room
   */
  leaveRoom(room: string): void {
    this.send('leave_room', { room })
  }

  /**
   * Get connection status
   */
  get isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN
  }

  /**
   * Handle WebSocket open event
   */
  private handleOpen(): void {
    this.isConnecting = false
    this.reconnectAttempts = 0
    
    logger.info('WebSocket connected successfully')
    
    // Emit connection event
    this.emit('connection', { connected: true })
  }

  /**
   * Handle WebSocket message event
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: SocketEvent = JSON.parse(event.data)
      
      logger.debug('WebSocket message received', message)
      
      // Handle specific message types
      this.handleSpecificMessage(message)
      
      // Emit to specific event handlers
      this.emit(message.type, message.data)
      
    } catch (error) {
      logger.error('Failed to parse WebSocket message', error)
    }
  }

  /**
   * Handle specific WebSocket message types
   */
  private handleSpecificMessage(message: SocketEvent): void {
    switch (message.type) {
      case 'notification':
        this.handleNotificationMessage(message.data)
        break
      
      case 'post_like':
        this.handlePostLikeMessage(message.data)
        break
      
      case 'new_comment':
        this.handleNewCommentMessage(message.data)
        break
      
      case 'vibe_update':
        this.handleVibeUpdateMessage(message.data)
        break
      
      default:
        // Let other handlers process unknown message types
        break
    }
  }

  /**
   * Handle notification messages
   */
  private handleNotificationMessage(data: any): void {
    const notificationStore = useNotificationStore.getState()
    notificationStore.handleRealtimeNotification(data)
    
    // Update React Query cache
    if (this.queryClient) {
      this.queryClient.invalidateQueries({ 
        queryKey: notificationQueryKeys.unreadCount() 
      })
    }
  }

  /**
   * Handle post like messages
   */
  private handlePostLikeMessage(data: any): void {
    if (this.queryClient) {
      // Update feed cache with new like count
      this.queryClient.setQueriesData(
        { queryKey: feedQueryKeys.lists() },
        (old: any) => {
          if (!old) return old

          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((post: any) => {
                if (post.id.toString() === data.post_id) {
                  return {
                    ...post,
                    likes_count: data.liked 
                      ? post.likes_count + 1 
                      : Math.max(0, post.likes_count - 1),
                  }
                }
                return post
              }),
            })),
          }
        }
      )
    }
  }

  /**
   * Handle new comment messages
   */
  private handleNewCommentMessage(data: any): void {
    if (this.queryClient) {
      // Update post comment count
      this.queryClient.setQueriesData(
        { queryKey: feedQueryKeys.lists() },
        (old: any) => {
          if (!old) return old

          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((post: any) => {
                if (post.id.toString() === data.post_id) {
                  return {
                    ...post,
                    comments_count: post.comments_count + 1,
                  }
                }
                return post
              }),
            })),
          }
        }
      )
    }
  }

  /**
   * Handle vibe update messages
   */
  private handleVibeUpdateMessage(data: any): void {
    if (this.queryClient) {
      // Update post vibe score
      this.queryClient.setQueriesData(
        { queryKey: feedQueryKeys.lists() },
        (old: any) => {
          if (!old) return old

          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((post: any) => {
                if (post.id.toString() === data.post_id) {
                  return {
                    ...post,
                    vibe_score: data.sentiment.score || post.vibe_score,
                  }
                }
                return post
              }),
            })),
          }
        }
      )
    }
  }

  /**
   * Handle WebSocket close event
   */
  private handleClose(event: CloseEvent): void {
    this.isConnecting = false
    this.socket = null
    
    logger.info('WebSocket connection closed', { 
      code: event.code, 
      reason: event.reason 
    })
    
    // Emit disconnection event
    this.emit('connection', { connected: false })
    
    // Attempt reconnection if needed
    if (this.shouldReconnect && event.code !== 1000) {
      this.scheduleReconnect()
    }
  }

  /**
   * Handle WebSocket error event
   */
  private handleError(event: Event): void {
    logger.error('WebSocket error', event)
    
    // Emit error event
    this.emit('error', { error: event })
  }

  /**
   * Emit event to handlers
   */
  private emit(eventType: string, data: any): void {
    const handlers = this.eventHandlers.get(eventType)
    
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data)
        } catch (error) {
          logger.error('Error in WebSocket event handler', { eventType, error })
        }
      })
    }
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.error('Max reconnection attempts reached')
      return
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts)
    this.reconnectAttempts++
    
    logger.info(`Scheduling WebSocket reconnection in ${delay}ms`, {
      attempt: this.reconnectAttempts,
      maxAttempts: this.maxReconnectAttempts
    })
    
    setTimeout(() => {
      if (this.shouldReconnect) {
        this.connect()
      }
    }, delay)
  }
}

// Create singleton instance
export const socketManager = new SocketManager()

// React hook for WebSocket events
export function useSocket(eventType: string, handler: SocketEventHandler) {
  React.useEffect(() => {
    const unsubscribe = socketManager.on(eventType, handler)
    return unsubscribe
  }, [eventType, handler])
}

// React hook for WebSocket connection status
export function useSocketConnection() {
  const [isConnected, setIsConnected] = React.useState(socketManager.isConnected)
  
  React.useEffect(() => {
    const handleConnection = (data: { connected: boolean }) => {
      setIsConnected(data.connected)
    }
    
    const unsubscribe = socketManager.on('connection', handleConnection)
    return unsubscribe
  }, [])
  
  return {
    isConnected,
    connect: () => socketManager.connect(),
    disconnect: () => socketManager.disconnect(),
  }
}

// Auto-connect when user is authenticated
useAuthStore.subscribe((state) => {
  if (state.isAuthenticated && state.user) {
    socketManager.connect()
  } else {
    socketManager.disconnect()
  }
})