/**
 * Feed Hooks - React Query Integration
 * Production-ready hooks with optimistic updates and caching
 */

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { feedAPI } from '../services/feed.api'
import { Post, FeedParams, CreatePostRequest, OptimisticLike } from '../types/feed.types'
import { logger } from '@/core/utils/logger'
import { useToast } from '@/core/components/Toast'

// Query keys
export const feedQueryKeys = {
  all: ['feed'] as const,
  lists: () => [...feedQueryKeys.all, 'list'] as const,
  list: (params: FeedParams) => [...feedQueryKeys.lists(), params] as const,
  posts: () => [...feedQueryKeys.all, 'posts'] as const,
  post: (id: number) => [...feedQueryKeys.posts(), id] as const,
}

/**
 * Hook for infinite feed with pagination
 */
export function useFeed(params: FeedParams = {}) {
  return useInfiniteQuery({
    queryKey: feedQueryKeys.list(params),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await feedAPI.getFeed({
        ...params,
        offset: pageParam,
      })
      return response.data
    },
    getNextPageParam: (lastPage) => {
      return lastPage.has_more ? lastPage.next_offset : undefined
    },
    initialPageParam: 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Hook for creating posts with optimistic updates
 */
export function useCreatePost() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: feedAPI.createPost,
    onMutate: async (newPost: CreatePostRequest) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: feedQueryKeys.lists() })

      // Snapshot previous value
      const previousFeed = queryClient.getQueryData(feedQueryKeys.lists())

      // Optimistically update feed
      queryClient.setQueriesData(
        { queryKey: feedQueryKeys.lists() },
        (old: any) => {
          if (!old) return old

          const optimisticPost: Post = {
            id: Date.now(), // Temporary ID
            content: newPost.content,
            author: queryClient.getQueryData(['user', 'me']) as any,
            image_url: newPost.image_url,
            vibe_score: 0,
            likes_count: 0,
            comments_count: 0,
            created_at: new Date().toISOString(),
            is_liked: false,
          }

          return {
            ...old,
            pages: [
              {
                ...old.pages[0],
                posts: [optimisticPost, ...old.pages[0].posts],
              },
              ...old.pages.slice(1),
            ],
          }
        }
      )

      return { previousFeed }
    },
    onError: (err, newPost, context) => {
      // Rollback on error
      if (context?.previousFeed) {
        queryClient.setQueryData(feedQueryKeys.lists(), context.previousFeed)
      }
      
      showToast({
        type: 'error',
        message: 'Failed to create post. Please try again.',
      })
      
      logger.error('Create post failed', err)
    },
    onSuccess: (data) => {
      showToast({
        type: 'success',
        message: 'Post created successfully!',
      })
      
      logger.info('Post created', { postId: data.data.id })
    },
    onSettled: () => {
      // Refetch feed to get accurate data
      queryClient.invalidateQueries({ queryKey: feedQueryKeys.lists() })
    },
  })
}

/**
 * Hook for liking posts with optimistic updates
 */
export function useLikePost() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: number; isLiked: boolean }) => {
      if (isLiked) {
        return feedAPI.unlikePost(postId.toString())
      } else {
        return feedAPI.likePost(postId.toString())
      }
    },
    onMutate: async ({ postId, isLiked }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: feedQueryKeys.lists() })

      // Snapshot previous value
      const previousFeed = queryClient.getQueryData(feedQueryKeys.lists())

      // Optimistically update like status
      queryClient.setQueriesData(
        { queryKey: feedQueryKeys.lists() },
        (old: any) => {
          if (!old) return old

          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((post: Post) => {
                if (post.id === postId) {
                  return {
                    ...post,
                    is_liked: !isLiked,
                    likes_count: isLiked ? post.likes_count - 1 : post.likes_count + 1,
                  }
                }
                return post
              }),
            })),
          }
        }
      )

      const optimisticLike: OptimisticLike = {
        postId,
        isLiked: !isLiked,
        previousLikesCount: 0, // Will be set from actual post data
        newLikesCount: 0,
      }

      return { previousFeed, optimisticLike }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousFeed) {
        queryClient.setQueryData(feedQueryKeys.lists(), context.previousFeed)
      }
      
      showToast({
        type: 'error',
        message: 'Failed to update like. Please try again.',
      })
      
      logger.error('Like post failed', err)
    },
    onSuccess: (data, variables) => {
      logger.info('Post like updated', { 
        postId: variables.postId, 
        liked: data.data.liked 
      })
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: feedQueryKeys.lists() })
    },
  })
}

/**
 * Hook for getting a single post
 */
export function usePost(postId: number) {
  return useInfiniteQuery({
    queryKey: feedQueryKeys.post(postId),
    queryFn: () => feedAPI.getPost(postId.toString()),
    enabled: !!postId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook for refreshing feed data
 */
export function useFeedRefresh() {
  const queryClient = useQueryClient()

  const refreshFeed = async () => {
    await queryClient.invalidateQueries({ queryKey: feedQueryKeys.lists() })
    await queryClient.refetchQueries({ queryKey: feedQueryKeys.lists() })
  }

  const refreshPost = async (postId: number) => {
    await queryClient.invalidateQueries({ queryKey: feedQueryKeys.post(postId) })
    await queryClient.refetchQueries({ queryKey: feedQueryKeys.post(postId) })
  }

  const refreshAll = async () => {
    await queryClient.invalidateQueries({ queryKey: feedQueryKeys.all })
    await queryClient.refetchQueries({ queryKey: feedQueryKeys.all })
  }

  return {
    refreshFeed,
    refreshPost,
    refreshAll,
  }
}

/**
 * Hook for preloading feed data
 */
export function useFeedPreload() {
  const queryClient = useQueryClient()

  const preloadFeed = async (params: FeedParams = {}) => {
    await queryClient.prefetchInfiniteQuery({
      queryKey: feedQueryKeys.list(params),
      queryFn: async ({ pageParam = 0 }) => {
        const response = await feedAPI.getFeed({
          ...params,
          offset: pageParam,
        })
        return response.data
      },
      initialPageParam: 0,
    })
  }

  const preloadPost = async (postId: number) => {
    await queryClient.prefetchQuery({
      queryKey: feedQueryKeys.post(postId),
      queryFn: () => feedAPI.getPost(postId.toString()),
    })
  }

  return {
    preloadFeed,
    preloadPost,
  }
}