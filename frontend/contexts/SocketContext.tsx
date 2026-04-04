"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './AuthContext'
import { type NotificationItem, type Post, type User } from '@/services/api'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  onlineUsers: string[]
  // Event handlers
  onNewNotification: (callback: (notification: NotificationItem) => void) => void
  onNewPost: (callback: (post: Post) => void) => void
  onPostUpdate: (callback: (data: { postId: string; update: any }) => void) => void
  onUserOnlineStatus: (callback: (data: { userId: string; isOnline: boolean }) => void) => void
  onStatsUpdate: (callback: (data: { userId: string; posts?: number; followers?: number; following?: number }) => void) => void
  onFollowUpdate: (callback: (data: { followerId: string; targetUserId: string; isFollowing: boolean; followerCount?: number; followingCount?: number }) => void) => void
  onPostStatsUpdate: (callback: (data: { authorId: string; postCount: number }) => void) => void
  // Emit methods
  emitTypingStart: (targetUserId: string) => void
  emitTypingStop: (targetUserId: string) => void
  emitReaction: (postId: string, reaction: string) => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('vibely_token')
      if (!token) return

      // Initialize socket connection
      const newSocket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001', {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling']
      })

      // Connection events
      newSocket.on('connect', () => {
        console.log('🔌 Connected to real-time service')
        setIsConnected(true)
      })

      newSocket.on('disconnect', () => {
        console.log('🔌 Disconnected from real-time service')
        setIsConnected(false)
      })

      newSocket.on('connect_error', (error) => {
        console.error('🔌 Connection error:', error)
        setIsConnected(false)
      })

      // Initial connection confirmation
      newSocket.on('connected', (data) => {
        console.log('✅ Real-time service ready:', data)
      })

      // Online users updates
      newSocket.on('users:online', (users: string[]) => {
        setOnlineUsers(users)
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
        setSocket(null)
        setIsConnected(false)
      }
    } else {
      // Cleanup when user logs out
      if (socket) {
        socket.close()
        setSocket(null)
        setIsConnected(false)
      }
    }
  }, [user])

  // Event handler methods
  const onNewNotification = (callback: (notification: NotificationItem) => void) => {
    if (socket) {
      socket.on('notification:new', callback)
      return () => socket.off('notification:new', callback)
    }
    return () => {} // Return empty cleanup function if no socket
  }

  const onNewPost = (callback: (post: Post) => void) => {
    if (socket) {
      socket.on('post:new', callback)
      return () => socket.off('post:new', callback)
    }
    return () => {} // Return empty cleanup function if no socket
  }

  const onPostUpdate = (callback: (data: { postId: string; update: any }) => void) => {
    if (socket) {
      socket.on('post:updated', callback)
      return () => socket.off('post:updated', callback)
    }
    return () => {} // Return empty cleanup function if no socket
  }

  const onUserOnlineStatus = (callback: (data: { userId: string; isOnline: boolean }) => void) => {
    if (socket) {
      socket.on('user:online_status', callback)
      return () => socket.off('user:online_status', callback)
    }
    return () => {} // Return empty cleanup function if no socket
  }

  const onStatsUpdate = (callback: (data: { userId: string; posts?: number; followers?: number; following?: number }) => void) => {
    if (socket) {
      socket.on('user:stats_updated', callback)
      return () => socket.off('user:stats_updated', callback)
    }
    return () => {} // Return empty cleanup function if no socket
  }

  const onFollowUpdate = (callback: (data: { followerId: string; targetUserId: string; isFollowing: boolean; followerCount?: number; followingCount?: number }) => void) => {
    if (socket) {
      socket.on('follow:updated', callback)
      return () => socket.off('follow:updated', callback)
    }
    return () => {} // Return empty cleanup function if no socket
  }

  const onPostStatsUpdate = (callback: (data: { authorId: string; postCount: number }) => void) => {
    if (socket) {
      socket.on('post:stats_updated', callback)
      return () => socket.off('post:stats_updated', callback)
    }
    return () => {} // Return empty cleanup function if no socket
  }

  // Emit methods
  const emitTypingStart = (targetUserId: string) => {
    if (socket && isConnected) {
      socket.emit('typing:start', { targetUserId })
    }
  }

  const emitTypingStop = (targetUserId: string) => {
    if (socket && isConnected) {
      socket.emit('typing:stop', { targetUserId })
    }
  }

  const emitReaction = (postId: string, reaction: string) => {
    if (socket && isConnected) {
      socket.emit('reaction:add', { postId, reaction })
    }
  }

  const value: SocketContextType = {
    socket,
    isConnected,
    onlineUsers,
    onNewNotification,
    onNewPost,
    onPostUpdate,
    onUserOnlineStatus,
    onStatsUpdate,
    onFollowUpdate,
    onPostStatsUpdate,
    emitTypingStart,
    emitTypingStop,
    emitReaction
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}