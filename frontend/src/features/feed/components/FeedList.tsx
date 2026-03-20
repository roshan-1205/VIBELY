/**
 * FeedList Component - Vibely Social Media Feed
 * Production-ready virtualized feed with infinite scroll
 */

import React, { useCallback, useRef, useEffect } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { motion } from 'framer-motion'
import { useFeed } from '../hooks/useFeed'
import { useFeedActions } from '../hooks/useFeedActions'
import { FeedCard } from './FeedCard'
import { FeedSkeleton } from './FeedSkeleton'
import { FeedError, EmptyFeed } from './FeedError'
import { useScrollFadeInUp, hwAcceleration, logger } from '@/core'
import type { Post } from '../types/feed.types'

interface FeedListProps {
  type?: 'timeline' | 'explore' | 'trending'
  userId?: string
  className?: string
}

export function FeedList({ type = 'timeline', userId, className = '' }: FeedListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { handleView } = useFeedActions()
  
  // Scroll animation for container
  useScrollFadeInUp(containerRef, { duration: 0.6 })

  // Feed data with infinite query
  const {
    posts,
    totalPosts,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useFeed({
    type,
    userId,
    limit: 20,
    useMockData: true, // Use mock data for demo
  })

  // Performance logging
  useEffect(() => {
    logger.debug('FeedList render', {
      type,
      totalPosts,
      hasNextPage,
      isFetchingNextPage,
      isLoading,
      isError,
    })
  }, [type, totalPosts, hasNextPage, isFetchingNextPage, isLoading, isError])

  // Optimized item renderer for virtualization
  const itemContent = useCallback((index: number, post: Post) => {
    return (
      <div className="pb-6">
        <FeedCard
          post={post}
          index={index}
          onView={handleView}
        />
      </div>
    )
  }, [handleView])

  // End reached handler for infinite scroll
  const endReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      logger.debug('End reached, fetching next page')
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // Footer component for loading states
  const Footer = useCallback(() => {
    if (isFetchingNextPage) {
      return (
        <div className="py-8">
          <FeedSkeleton count={2} />
        </div>
      )
    }
    
    if (!hasNextPage && posts.length > 0) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-8 text-center text-gray-500"
        >
          <p>You've reached the end of your feed</p>
        </motion.div>
      )
    }
    
    return null
  }, [isFetchingNextPage, hasNextPage, posts.length])

  // Loading state
  if (isLoading) {
    return (
      <div ref={containerRef} className={className}>
        <FeedSkeleton count={5} />
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div ref={containerRef} className={className}>
        <FeedError
          error={error}
          onRetry={refetch}
          title="Failed to load feed"
          message="We couldn't load your feed. Please check your connection and try again."
        />
      </div>
    )
  }

  // Empty state
  if (posts.length === 0) {
    const emptyMessages = {
      timeline: {
        title: 'Welcome to Vibely!',
        message: 'Follow some accounts to see posts in your timeline.',
        actionLabel: 'Discover People',
      },
      explore: {
        title: 'Nothing to explore yet',
        message: 'Check back later for trending content.',
        actionLabel: 'Refresh',
      },
      trending: {
        title: 'No trending posts',
        message: 'Be the first to create trending content!',
        actionLabel: 'Create Post',
      },
    }

    const emptyConfig = emptyMessages[type]

    return (
      <div ref={containerRef} className={className}>
        <EmptyFeed
          title={emptyConfig.title}
          message={emptyConfig.message}
          actionLabel={emptyConfig.actionLabel}
          onAction={() => {
            if (type === 'explore') {
              refetch()
            } else {
              console.log(`Handle ${type} empty action`)
            }
          }}
        />
      </div>
    )
  }

  // Main feed render
  return (
    <motion.div
      ref={containerRef}
      style={hwAcceleration}
      className={`feed-list ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Virtuoso
        data={posts}
        endReached={endReached}
        itemContent={itemContent}
        components={{
          Footer,
        }}
        style={{ height: '100%' }}
        // Performance optimizations
        overscan={5}
        increaseViewportBy={1000}
        // Stable keys for better performance
        computeItemKey={(index, post) => post.id}
        // Custom styling
        className="virtuoso-container"
      />
    </motion.div>
  )
}

/**
 * Feed list with custom header
 */
export function FeedListWithHeader({
  title,
  subtitle,
  action,
  ...feedProps
}: FeedListProps & {
  title?: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      {(title || subtitle || action) && (
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            {title && (
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            )}
            {subtitle && (
              <p className="text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </motion.header>
      )}

      {/* Feed */}
      <FeedList {...feedProps} />
    </div>
  )
}

/**
 * Compact feed list for sidebars or smaller spaces
 */
export function CompactFeedList(props: FeedListProps) {
  return (
    <FeedList
      {...props}
      className="compact-feed"
    />
  )
}