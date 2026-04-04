"use client"

import { useState, useEffect, useCallback } from 'react'
import { apiService } from '@/services/api'
import { useSocket } from '@/contexts/SocketContext'
import { useAuth } from '@/contexts/AuthContext'

interface UserStats {
  posts: number
  followers: number
  following: number
}

interface UseUserStatsReturn {
  stats: UserStats | null
  loading: boolean
  error: string | null
  refreshStats: () => Promise<void>
}

export function useUserStats(userId?: string): UseUserStatsReturn {
  const { user } = useAuth()
  const { socket } = useSocket()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use current user's ID if no userId provided
  const targetUserId = userId || user?._id

  const fetchStats = useCallback(async () => {
    if (!targetUserId) return

    try {
      setLoading(true)
      setError(null)

      // Get user profile with stats
      const response = await apiService.getProfile()
      
      if (response.success && response.data?.user?.stats) {
        setStats({
          posts: response.data.user.stats.posts || 0,
          followers: response.data.user.stats.followers || 0,
          following: response.data.user.stats.following || 0
        })
      } else {
        // Fallback: get social stats separately
        const socialResponse = await apiService.getSocialStats(targetUserId)
        if (socialResponse.success && socialResponse.data) {
          setStats({
            posts: 0, // Will be updated by post events
            followers: socialResponse.data.followerCount || 0,
            following: socialResponse.data.followingCount || 0
          })
        }
      }
    } catch (err) {
      console.error('Error fetching user stats:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch stats')
    } finally {
      setLoading(false)
    }
  }, [targetUserId])

  const refreshStats = useCallback(async () => {
    await fetchStats()
  }, [fetchStats])

  // Initial fetch
  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  // Set up real-time listeners
  useEffect(() => {
    if (!socket) return

    const handleFollowUpdate = (data: any) => {
      // Update stats when someone follows/unfollows this user
      if (data.targetUserId === targetUserId && data.followerCount !== undefined) {
        setStats(prev => prev ? {
          ...prev,
          followers: data.followerCount
        } : null)
      }
      
      // Update stats when this user follows/unfollows someone
      if (data.followerId === targetUserId && data.followingCount !== undefined) {
        setStats(prev => prev ? {
          ...prev,
          following: data.followingCount
        } : null)
      }
    }

    const handlePostStatsUpdate = (data: any) => {
      // Update post count when user creates/deletes a post
      if (data.authorId === targetUserId) {
        setStats(prev => prev ? {
          ...prev,
          posts: data.postCount
        } : null)
      }
    }

    const handleStatsUpdate = (data: any) => {
      // Direct stats update event
      if (data.userId === targetUserId) {
        setStats(prev => ({
          posts: data.posts ?? prev?.posts ?? 0,
          followers: data.followers ?? prev?.followers ?? 0,
          following: data.following ?? prev?.following ?? 0
        }))
      }
    }

    // Listen for real-time events using the socket context methods
    const cleanupFollow = socket.on ? (() => {
      socket.on('follow:updated', handleFollowUpdate)
      return () => socket.off('follow:updated', handleFollowUpdate)
    })() : () => {}

    const cleanupPostStats = socket.on ? (() => {
      socket.on('post:stats_updated', handlePostStatsUpdate)
      return () => socket.off('post:stats_updated', handlePostStatsUpdate)
    })() : () => {}

    const cleanupStats = socket.on ? (() => {
      socket.on('user:stats_updated', handleStatsUpdate)
      return () => socket.off('user:stats_updated', handleStatsUpdate)
    })() : () => {}

    // Cleanup listeners
    return () => {
      cleanupFollow()
      cleanupPostStats()
      cleanupStats()
    }
  }, [socket, targetUserId])

  return {
    stats,
    loading,
    error,
    refreshStats
  }
}