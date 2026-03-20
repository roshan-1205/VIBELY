/**
 * useProfilePosts Hook - Virtualized Profile Posts
 * Infinite scroll with React Virtuoso for performance
 */

import { useState, useMemo } from 'react'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { fetchProfilePosts, fetchProfilePostsDev } from '../services/profile.api'
import { profileQueryKeys } from './useProfile'
import type { ProfilePost, ProfileTabType } from '../types/profile.types'
import { logger } from '@/core'

interface UseProfilePostsOptions {
  enabled?: boolean
  useMockData?: boolean
  limit?: number
}

/**
 * Hook for fetching profile posts with infinite scroll
 */
export function useProfilePosts(
  userId: string,
  tab: ProfileTabType = 'posts',
  options: UseProfilePostsOptions = {}
) {
  const {
    enabled = true,
    useMockData = process.env.NODE_ENV === 'development',
    limit = 20,
  } = options

  const queryClient = useQueryClient()

  const query = useInfiniteQuery({
    queryKey: [...profileQueryKeys.posts(userId), tab],
    queryFn: ({ pageParam }) => {
      const fetchFn = useMockData ? fetchProfilePostsDev : fetchProfilePosts
      return fetchFn(userId, pageParam, limit, tab)
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: enabled && !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    initialPageParam: undefined,
  })

  // Flatten posts from all pages
  const posts = query.data?.pages.flatMap(page => page.posts) || []
  const totalCount = query.data?.pages[0]?.totalCount || 0
  const hasMore = query.hasNextPage

  // Helper functions
  const loadMore = () => {
    if (hasMore && !query.isFetchingNextPage) {
      query.fetchNextPage()
    }
  }

  const refreshPosts = () => {
    query.refetch()
  }

  // Optimistic post updates (for when user creates/likes posts)
  const addOptimisticPost = (post: ProfilePost) => {
    queryClient.setQueryData(
      [...profileQueryKeys.posts(userId), tab],
      (oldData: any) => {
        if (!oldData?.pages) return oldData

        const newPages = [...oldData.pages]
        if (newPages[0]) {
          newPages[0] = {
            ...newPages[0],
            posts: [post, ...newPages[0].posts],
            totalCount: newPages[0].totalCount + 1,
          }
        }

        return {
          ...oldData,
          pages: newPages,
        }
      }
    )
  }

  const updateOptimisticPost = (postId: string, updates: Partial<ProfilePost>) => {
    queryClient.setQueryData(
      [...profileQueryKeys.posts(userId), tab],
      (oldData: any) => {
        if (!oldData?.pages) return oldData

        const newPages = oldData.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((post: ProfilePost) =>
            post.id === postId ? { ...post, ...updates } : post
          ),
        }))

        return {
          ...oldData,
          pages: newPages,
        }
      }
    )
  }

  const removeOptimisticPost = (postId: string) => {
    queryClient.setQueryData(
      [...profileQueryKeys.posts(userId), tab],
      (oldData: any) => {
        if (!oldData?.pages) return oldData

        const newPages = oldData.pages.map((page: any) => ({
          ...page,
          posts: page.posts.filter((post: ProfilePost) => post.id !== postId),
          totalCount: Math.max(0, page.totalCount - 1),
        }))

        return {
          ...oldData,
          pages: newPages,
        }
      }
    )
  }

  // Performance metrics
  const performanceMetrics = {
    totalPosts: posts.length,
    loadedPages: query.data?.pages.length || 0,
    isVirtualized: posts.length > 50, // Virtualization kicks in after 50 posts
    memoryUsage: posts.length * 0.5, // Rough estimate in KB
  }

  logger.debug('Profile posts performance', {
    userId,
    tab,
    ...performanceMetrics,
  })

  return {
    // Data
    posts,
    totalCount,
    hasMore,
    
    // Query state
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetchingNextPage: query.isFetchingNextPage,
    isRefetching: query.isRefetching,
    
    // Actions
    loadMore,
    refreshPosts,
    
    // Optimistic updates
    addOptimisticPost,
    updateOptimisticPost,
    removeOptimisticPost,
    
    // Performance
    performanceMetrics,
    
    // Raw query for advanced usage
    query,
  }
}

/**
 * Hook for managing post interactions within profile
 */
export function useProfilePostInteractions(userId: string) {
  const queryClient = useQueryClient()

  const likePost = (postId: string) => {
    // Optimistically update like status
    const updateLike = (oldData: any) => {
      if (!oldData?.pages) return oldData

      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((post: ProfilePost) =>
            post.id === postId
              ? {
                  ...post,
                  isLiked: !post.isLiked,
                  stats: {
                    ...post.stats,
                    likes: post.stats.likes + (post.isLiked ? -1 : 1),
                  },
                }
              : post
          ),
        })),
      }
    }

    // Update all profile post queries
    queryClient.setQueriesData(
      { queryKey: profileQueryKeys.posts(userId) },
      updateLike
    )

    logger.debug('Post liked optimistically', { userId, postId })
  }

  const bookmarkPost = (postId: string) => {
    // Optimistically update bookmark status
    const updateBookmark = (oldData: any) => {
      if (!oldData?.pages) return oldData

      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((post: ProfilePost) =>
            post.id === postId
              ? { ...post, isBookmarked: !post.isBookmarked }
              : post
          ),
        })),
      }
    }

    queryClient.setQueriesData(
      { queryKey: profileQueryKeys.posts(userId) },
      updateBookmark
    )

    logger.debug('Post bookmarked optimistically', { userId, postId })
  }

  const sharePost = (postId: string) => {
    // Optimistically update share count
    const updateShare = (oldData: any) => {
      if (!oldData?.pages) return oldData

      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((post: ProfilePost) =>
            post.id === postId
              ? {
                  ...post,
                  stats: {
                    ...post.stats,
                    shares: post.stats.shares + 1,
                  },
                }
              : post
          ),
        })),
      }
    }

    queryClient.setQueriesData(
      { queryKey: profileQueryKeys.posts(userId) },
      updateShare
    )

    logger.debug('Post shared optimistically', { userId, postId })
  }

  return {
    likePost,
    bookmarkPost,
    sharePost,
  }
}

/**
 * Hook for profile posts filtering and search
 */
export function useProfilePostsFilter(posts: ProfilePost[]) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'engagement'>('recent')
  const [filterBy, setFilterBy] = useState<'all' | 'media' | 'text'>('all')

  const filteredPosts = useMemo(() => {
    let filtered = [...posts]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(post =>
        post.content.toLowerCase().includes(query)
      )
    }

    // Type filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(post => {
        if (filterBy === 'media') return post.media && post.media.length > 0
        if (filterBy === 'text') return !post.media || post.media.length === 0
        return true
      })
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.stats.likes - a.stats.likes
        case 'engagement':
          const aEngagement = a.stats.likes + a.stats.comments + a.stats.shares
          const bEngagement = b.stats.likes + b.stats.comments + b.stats.shares
          return bEngagement - aEngagement
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return filtered
  }, [posts, searchQuery, sortBy, filterBy])

  return {
    filteredPosts,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    resultsCount: filteredPosts.length,
    totalCount: posts.length,
  }
}