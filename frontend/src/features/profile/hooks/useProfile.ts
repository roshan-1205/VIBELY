/**
 * useProfile Hook - Vibely Profile System
 * Data fetching and state management for user profiles
 */

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  fetchProfile, 
  fetchProfileDev, 
  toggleFollow, 
  updateProfile,
  calculateAverageVibeScore 
} from '../services/profile.api'
import { useVibeSync } from '@/core/hooks'
import type { ProfileData, FollowAction, ProfileEditData } from '../types/profile.types'
import { logger } from '@/core'

/**
 * Query keys for profile data
 */
export const profileQueryKeys = {
  all: ['profile'] as const,
  profile: (userId: string) => [...profileQueryKeys.all, userId] as const,
  posts: (userId: string) => [...profileQueryKeys.all, userId, 'posts'] as const,
  analytics: (userId: string) => [...profileQueryKeys.all, userId, 'analytics'] as const,
}

interface UseProfileOptions {
  enabled?: boolean
  useMockData?: boolean
}

/**
 * Hook for fetching and managing profile data
 */
export function useProfile(userId: string, options: UseProfileOptions = {}) {
  const {
    enabled = true,
    useMockData = process.env.NODE_ENV === 'development',
  } = options

  const queryClient = useQueryClient()

  // Fetch profile data
  const query = useQuery({
    queryKey: profileQueryKeys.profile(userId),
    queryFn: () => useMockData ? fetchProfileDev(userId) : fetchProfile(userId),
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  })

  // Vibe sync integration - update UI based on average vibe score
  useVibeSync(query.data?.averageVibeScore || 0, {
    enableTransitions: true,
    transitionDuration: 800,
    enableGlow: true,
    intensity: Math.abs(query.data?.averageVibeScore || 0),
  })

  // Follow/unfollow mutation
  const followMutation = useMutation({
    mutationFn: toggleFollow,
    onMutate: async (action: FollowAction) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: profileQueryKeys.profile(userId) })

      // Snapshot previous value
      const previousProfile = queryClient.getQueryData<ProfileData>(
        profileQueryKeys.profile(userId)
      )

      // Optimistically update
      if (previousProfile) {
        queryClient.setQueryData<ProfileData>(
          profileQueryKeys.profile(userId),
          {
            ...previousProfile,
            user: {
              ...previousProfile.user,
              isFollowing: action.action === 'follow',
            },
            stats: {
              ...previousProfile.stats,
              followersCount: previousProfile.stats.followersCount + 
                (action.action === 'follow' ? 1 : -1),
            },
          }
        )
      }

      return { previousProfile }
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousProfile) {
        queryClient.setQueryData(
          profileQueryKeys.profile(userId),
          context.previousProfile
        )
      }
      logger.error('Follow action failed', { error, variables })
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.profile(userId) })
    },
  })

  // Profile update mutation
  const updateMutation = useMutation({
    mutationFn: (data: ProfileEditData) => updateProfile(userId, data),
    onSuccess: (updatedProfile) => {
      // Update cache with new data
      queryClient.setQueryData(
        profileQueryKeys.profile(userId),
        updatedProfile
      )
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.all })
      
      logger.info('Profile updated successfully', { userId })
    },
    onError: (error) => {
      logger.error('Profile update failed', { error, userId })
    },
  })

  // Helper functions
  const follow = () => {
    if (!query.data?.user.isFollowing) {
      followMutation.mutate({ userId, action: 'follow' })
    }
  }

  const unfollow = () => {
    if (query.data?.user.isFollowing) {
      followMutation.mutate({ userId, action: 'unfollow' })
    }
  }

  const toggleFollowStatus = () => {
    const action = query.data?.user.isFollowing ? 'unfollow' : 'follow'
    followMutation.mutate({ userId, action })
  }

  const updateProfileData = (data: ProfileEditData) => {
    updateMutation.mutate(data)
  }

  // Computed values
  const isOwnProfile = userId === 'current_user' // Replace with actual current user check
  const canEdit = isOwnProfile
  const canFollow = !isOwnProfile && !query.data?.user.isBlocked

  return {
    // Query state
    profile: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isRefetching: query.isRefetching,
    
    // Mutation state
    isFollowing: followMutation.isPending,
    isUpdating: updateMutation.isPending,
    
    // Actions
    follow,
    unfollow,
    toggleFollowStatus,
    updateProfile: updateProfileData,
    refetch: query.refetch,
    
    // Computed values
    isOwnProfile,
    canEdit,
    canFollow,
    
    // Raw queries for advanced usage
    query,
    followMutation,
    updateMutation,
  }
}

/**
 * Hook for profile analytics and insights
 */
export function useProfileAnalytics(userId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: profileQueryKeys.analytics(userId),
    queryFn: () => {
      // Mock analytics for development
      return Promise.resolve({
        profileViews: Math.floor(Math.random() * 10000) + 1000,
        profileViewsThisWeek: Math.floor(Math.random() * 500) + 50,
        engagementRate: Math.random() * 0.1 + 0.02, // 2-12%
        vibeDistribution: {
          positive: Math.random() * 0.4 + 0.4, // 40-80%
          neutral: Math.random() * 0.3 + 0.1,  // 10-40%
          negative: Math.random() * 0.2,        // 0-20%
        },
      })
    },
    enabled: enabled && !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  })
}

/**
 * Hook for managing profile state
 */
export function useProfileState() {
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'liked' | 'replies'>('posts')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isEditing, setIsEditing] = useState(false)

  return {
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode,
    isEditing,
    setIsEditing,
  }
}

/**
 * Hook for profile interactions and analytics tracking
 */
export function useProfileInteractions(userId: string) {
  const trackProfileView = () => {
    // Track profile view analytics
    logger.debug('Profile viewed', { userId, timestamp: Date.now() })
    
    // In production, send to analytics service
    // analytics.track('profile_viewed', { userId })
  }

  const trackFollowAction = (action: 'follow' | 'unfollow') => {
    logger.debug('Follow action', { userId, action, timestamp: Date.now() })
    
    // In production, send to analytics service
    // analytics.track('follow_action', { userId, action })
  }

  const trackProfileEdit = () => {
    logger.debug('Profile edited', { userId, timestamp: Date.now() })
    
    // In production, send to analytics service
    // analytics.track('profile_edited', { userId })
  }

  return {
    trackProfileView,
    trackFollowAction,
    trackProfileEdit,
  }
}