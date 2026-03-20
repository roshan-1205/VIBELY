/**
 * useFeedActions Hook - Vibely Social Media Feed
 * Optimistic updates with TanStack Query mutations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { togglePostLike, addComment, sharePost, trackPostView } from '../services/feed.api'
import { feedQueryKeys } from './useFeed'
import type { Post, OptimisticLike, OptimisticComment } from '../types/feed.types'
import { logger } from '@/core'

/**
 * Hook for feed actions with optimistic updates
 */
export function useFeedActions() {
  const queryClient = useQueryClient()

  /**
   * Optimistic like/unlike mutation
   */
  const likeMutation = useMutation({
    mutationFn: ({ postId, isLiked }: { postId: string; isLiked: boolean }) =>
      togglePostLike(postId, isLiked),
    
    // Optimistic update
    onMutate: async ({ postId, isLiked }) => {
      logger.debug('Optimistic like update', { postId, isLiked })
      
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: feedQueryKeys.all })
      
      // Snapshot previous value
      const previousData = queryClient.getQueriesData({ queryKey: feedQueryKeys.all })
      
      // Optimistically update all feed queries
      queryClient.setQueriesData({ queryKey: feedQueryKeys.all }, (oldData: any) => {
        if (!oldData?.pages) return oldData
        
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: Post) => {
              if (post.id === postId) {
                const newLikesCount = isLiked 
                  ? post.stats.likes - 1 
                  : post.stats.likes + 1
                
                return {
                  ...post,
                  isLiked: !isLiked,
                  stats: {
                    ...post.stats,
                    likes: Math.max(0, newLikesCount),
                  },
                }
              }
              return post
            }),
          })),
        }
      })
      
      return { previousData }
    },
    
    // Rollback on error
    onError: (error, variables, context) => {
      logger.error('Like mutation failed, rolling back', { error, variables })
      
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    
    // Always refetch after mutation
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: feedQueryKeys.all })
    },
  })

  /**
   * Comment mutation with optimistic update
   */
  const commentMutation = useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      addComment(postId, content),
    
    onMutate: async ({ postId, content }) => {
      logger.debug('Optimistic comment update', { postId, content })
      
      await queryClient.cancelQueries({ queryKey: feedQueryKeys.all })
      const previousData = queryClient.getQueriesData({ queryKey: feedQueryKeys.all })
      
      // Optimistically update comment count
      queryClient.setQueriesData({ queryKey: feedQueryKeys.all }, (oldData: any) => {
        if (!oldData?.pages) return oldData
        
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: Post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  stats: {
                    ...post.stats,
                    comments: post.stats.comments + 1,
                  },
                }
              }
              return post
            }),
          })),
        }
      })
      
      return { previousData }
    },
    
    onError: (error, variables, context) => {
      logger.error('Comment mutation failed, rolling back', { error, variables })
      
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: feedQueryKeys.all })
    },
  })

  /**
   * Share mutation
   */
  const shareMutation = useMutation({
    mutationFn: (postId: string) => sharePost(postId),
    
    onMutate: async (postId) => {
      logger.debug('Optimistic share update', { postId })
      
      await queryClient.cancelQueries({ queryKey: feedQueryKeys.all })
      const previousData = queryClient.getQueriesData({ queryKey: feedQueryKeys.all })
      
      // Optimistically update share count
      queryClient.setQueriesData({ queryKey: feedQueryKeys.all }, (oldData: any) => {
        if (!oldData?.pages) return oldData
        
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: Post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  stats: {
                    ...post.stats,
                    shares: post.stats.shares + 1,
                  },
                }
              }
              return post
            }),
          })),
        }
      })
      
      return { previousData }
    },
    
    onError: (error, variables, context) => {
      logger.error('Share mutation failed, rolling back', { error, variables })
      
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: feedQueryKeys.all })
    },
  })

  /**
   * View tracking (fire and forget)
   */
  const trackView = (postId: string) => {
    trackPostView(postId).catch(error => {
      logger.warn('View tracking failed', { postId, error })
    })
  }

  // Action handlers with optimistic updates
  const handleLike = (postId: string, isLiked: boolean) => {
    likeMutation.mutate({ postId, isLiked })
  }

  const handleComment = (postId: string, content: string) => {
    if (!content.trim()) return
    commentMutation.mutate({ postId, content })
  }

  const handleShare = (postId: string) => {
    shareMutation.mutate(postId)
  }

  const handleView = (postId: string) => {
    trackView(postId)
  }

  return {
    // Actions
    handleLike,
    handleComment,
    handleShare,
    handleView,
    
    // Loading states
    isLiking: likeMutation.isPending,
    isCommenting: commentMutation.isPending,
    isSharing: shareMutation.isPending,
    
    // Error states
    likeError: likeMutation.error,
    commentError: commentMutation.error,
    shareError: shareMutation.error,
    
    // Raw mutations for advanced usage
    likeMutation,
    commentMutation,
    shareMutation,
  }
}