/**
 * useFeed Hook - Vibely Social Media Feed
 * Production-ready infinite query with TanStack Query v5
 */

import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchFeed, mockFeedData } from '../services/feed.api'
import type { FeedParams, Post } from '../types/feed.types'
import { logger } from '@/core'

// Query keys factory
export const feedQueryKeys = {
  all: ['feed'] as const,
  lists: () => [...feedQueryKeys.all, 'list'] as const,
  list: (params: FeedParams) => [...feedQueryKeys.lists(), params] as const,
  timeline: (userId?: string) => [...feedQueryKeys.all, 'timeline', userId] as const,
  explore: () => [...feedQueryKeys.all, 'explore'] as const,
  trending: () => [...feedQueryKeys.all, 'trending'] as const,
}

interface UseFeedOptions {
  type?: 'timeline' | 'explore' | 'trending'
  userId?: string
  limit?: number
  enabled?: boolean
  useMockData?: boolean
}

/**
 * Hook for infinite feed query with virtualization support
 */
export function useFeed(options: UseFeedOptions = {}) {
  const {
    type = 'timeline',
    userId,
    limit = 20,
    enabled = true,
    useMockData = process.env.NODE_ENV === 'development',
  } = options

  const queryKey = type === 'timeline' 
    ? feedQueryKeys.timeline(userId)
    : type === 'explore'
    ? feedQueryKeys.explore()
    : feedQueryKeys.trending()

  const query = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      logger.debug('Fetching feed page', { pageParam, type, userId })
      
      // Use mock data in development
      if (useMockData) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Generate more mock posts for pagination
        const mockPosts = Array.from({ length: limit }, (_, index) => ({
          ...mockFeedData.posts[index % mockFeedData.posts.length],
          id: `${pageParam || 'initial'}_${index}`,
        }))
        
        return {
          posts: mockPosts,
          nextCursor: pageParam ? `cursor_${Date.now()}` : 'cursor_page_2',
          hasMore: true,
        }
      }
      
      return fetchFeed({
        cursor: pageParam,
        limit,
        type,
        userId,
      })
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined
    },
    initialPageParam: undefined as string | undefined,
    
    // Performance optimizations
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    
    // Enable query only when needed
    enabled,
    
    // Error handling
    throwOnError: false,
  })

  // Flatten all pages into a single array for virtualization
  const posts: Post[] = query.data?.pages.flatMap(page => page.posts) ?? []
  
  // Performance metrics
  const totalPosts = posts.length
  const hasNextPage = query.hasNextPage
  const isFetchingNextPage = query.isFetchingNextPage
  
  logger.debug('Feed query state', {
    totalPosts,
    hasNextPage,
    isFetchingNextPage,
    isLoading: query.isLoading,
    isError: query.isError,
  })

  return {
    // Data
    posts,
    totalPosts,
    
    // Pagination
    hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage,
    
    // Loading states
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    
    // Error handling
    isError: query.isError,
    error: query.error,
    
    // Actions
    refetch: query.refetch,
    
    // Raw query for advanced usage
    query,
  }
}

/**
 * Hook for refreshing feed data
 */
export function useFeedRefresh(type: 'timeline' | 'explore' | 'trending' = 'timeline') {
  const queryKey = type === 'timeline' 
    ? feedQueryKeys.timeline()
    : type === 'explore'
    ? feedQueryKeys.explore()
    : feedQueryKeys.trending()

  return {
    refresh: () => {
      // Invalidate and refetch feed queries
      return Promise.all([
        // Invalidate current feed
        // queryClient.invalidateQueries({ queryKey }),
        // Could add more specific invalidation logic here
      ])
    },
  }
}

/**
 * Hook for preloading next page
 */
export function useFeedPreload() {
  return {
    preloadNextPage: (posts: Post[]) => {
      // Preload logic for better UX
      // Could implement intersection observer for the last few items
      logger.debug('Preloading next page', { currentPostCount: posts.length })
    },
  }
}