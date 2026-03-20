/**
 * useCreatePost Hook - Vibely Post Creation
 * Optimistic mutations with TanStack Query
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost, mockCreatePostResponse } from '../services/create.api'
import { feedQueryKeys } from '@/features/feed'
import type { CreatePostRequest, CreatePostResponse } from '../types/create.types'
import { logger } from '@/core'

interface UseCreatePostOptions {
  onSuccess?: (post: CreatePostResponse['post']) => void
  onError?: (error: Error) => void
  useMockData?: boolean
}

/**
 * Hook for creating posts with optimistic updates
 */
export function useCreatePost(options: UseCreatePostOptions = {}) {
  const {
    onSuccess,
    onError,
    useMockData = process.env.NODE_ENV === 'development',
  } = options

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (postData: CreatePostRequest): Promise<CreatePostResponse> => {
      logger.debug('Creating post', { 
        contentLength: postData.content.length,
        mediaCount: postData.media?.length || 0,
        sentimentScore: postData.sentimentScore,
      })

      // Use mock data in development
      if (useMockData) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Simulate occasional errors for testing
        if (Math.random() < 0.1) {
          throw new Error('Network error - please try again')
        }
        
        return {
          ...mockCreatePostResponse,
          post: {
            ...mockCreatePostResponse.post,
            content: postData.content,
            media: postData.media,
            sentimentScore: postData.sentimentScore,
            vibeIntensity: postData.vibeIntensity,
          },
        }
      }

      return createPost(postData)
    },

    // Optimistic update - add post to feed immediately
    onMutate: async (postData: CreatePostRequest) => {
      logger.debug('Optimistic post creation', { postData })

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: feedQueryKeys.all })

      // Snapshot previous value
      const previousData = queryClient.getQueriesData({ queryKey: feedQueryKeys.all })

      // Create optimistic post
      const optimisticPost = {
        id: `temp_${Date.now()}`,
        content: postData.content,
        media: postData.media,
        user: {
          id: 'current_user',
          username: 'you',
          displayName: 'You',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        },
        stats: {
          likes: 0,
          comments: 0,
          shares: 0,
          views: 0,
        },
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sentimentScore: postData.sentimentScore || 0,
        vibeIntensity: postData.vibeIntensity || 0.5,
      }

      // Optimistically update all feed queries
      queryClient.setQueriesData({ queryKey: feedQueryKeys.all }, (oldData: any) => {
        if (!oldData?.pages) return oldData

        // Add new post to the first page
        const newPages = [...oldData.pages]
        if (newPages[0]) {
          newPages[0] = {
            ...newPages[0],
            posts: [optimisticPost, ...newPages[0].posts],
          }
        }

        return {
          ...oldData,
          pages: newPages,
        }
      })

      return { previousData, optimisticPost }
    },

    // Handle success
    onSuccess: (response, variables, context) => {
      logger.info('Post created successfully', { 
        postId: response.post.id,
        contentLength: response.post.content.length,
      })

      // Update the optimistic post with real data
      queryClient.setQueriesData({ queryKey: feedQueryKeys.all }, (oldData: any) => {
        if (!oldData?.pages) return oldData

        const newPages = oldData.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((post: any) => {
            // Replace temporary post with real post
            if (post.id === context?.optimisticPost?.id) {
              return response.post
            }
            return post
          }),
        }))

        return {
          ...oldData,
          pages: newPages,
        }
      })

      // Call success callback
      onSuccess?.(response.post)
    },

    // Handle error - rollback optimistic update
    onError: (error, variables, context) => {
      logger.error('Post creation failed, rolling back', { 
        error: error.message,
        variables,
      })

      // Restore previous data
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }

      // Call error callback
      onError?.(error as Error)
    },

    // Always refetch after mutation settles
    onSettled: () => {
      // Invalidate feed queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: feedQueryKeys.all })
    },
  })

  // Helper function to create post
  const createPostWithData = (postData: CreatePostRequest) => {
    mutation.mutate(postData)
  }

  return {
    // Mutation state
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,

    // Actions
    createPost: createPostWithData,
    reset: mutation.reset,

    // Raw mutation for advanced usage
    mutation,
  }
}

/**
 * Hook for managing post creation analytics
 */
export function usePostCreationAnalytics() {
  const startTime = Date.now()

  const trackPostCreation = (data: {
    characterCount: number
    mediaCount: number
    sentimentScore: number
    timeToComplete: number
    success: boolean
  }) => {
    // Track analytics
    logger.debug('Post creation analytics', {
      ...data,
      sessionDuration: Date.now() - startTime,
    })

    // In production, send to analytics service
    // analytics.track('post_created', data)
  }

  const trackPostAbandoned = (data: {
    characterCount: number
    timeSpent: number
    reason: 'closed_modal' | 'navigated_away' | 'error'
  }) => {
    logger.debug('Post creation abandoned', {
      ...data,
      sessionDuration: Date.now() - startTime,
    })

    // In production, send to analytics service
    // analytics.track('post_abandoned', data)
  }

  return {
    trackPostCreation,
    trackPostAbandoned,
  }
}