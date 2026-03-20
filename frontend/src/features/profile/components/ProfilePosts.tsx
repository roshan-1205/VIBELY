/**
 * ProfilePosts Component - Virtualized Posts Display
 * High-performance grid/list view with React Virtuoso
 */

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Virtuoso } from 'react-virtuoso'
import { useProfilePosts, useProfilePostInteractions } from '../hooks/useProfilePosts'
import { hwAcceleration } from '@/core'
import type { ProfilePost, ProfileTabType, ProfileViewMode } from '../types/profile.types'

interface ProfilePostsProps {
  userId: string
  activeTab: ProfileTabType
  viewMode?: ProfileViewMode
  onViewModeChange?: (mode: ProfileViewMode) => void
}

export function ProfilePosts({ 
  userId, 
  activeTab, 
  viewMode = 'grid',
  onViewModeChange 
}: ProfilePostsProps) {
  const { 
    posts, 
    isLoading, 
    isError, 
    error, 
    loadMore, 
    hasMore,
    isFetchingNextPage 
  } = useProfilePosts(userId, activeTab)

  const { likePost, bookmarkPost, sharePost } = useProfilePostInteractions(userId)

  if (isLoading) {
    return <ProfilePostsSkeleton viewMode={viewMode} />
  }

  if (isError) {
    return <ProfilePostsError error={error} onRetry={() => window.location.reload()} />
  }

  if (!posts.length) {
    return <ProfilePostsEmpty activeTab={activeTab} />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
      style={hwAcceleration}
    >
      {/* View Mode Toggle */}
      {onViewModeChange && (
        <ViewModeToggle 
          viewMode={viewMode} 
          onViewModeChange={onViewModeChange}
          postsCount={posts.length}
        />
      )}

      {/* Posts Display */}
      {viewMode === 'grid' ? (
        <VirtualizedPostGrid
          posts={posts}
          onLoadMore={loadMore}
          hasMore={hasMore}
          isFetchingNextPage={isFetchingNextPage}
          onLike={likePost}
          onBookmark={bookmarkPost}
          onShare={sharePost}
        />
      ) : (
        <VirtualizedPostList
          posts={posts}
          onLoadMore={loadMore}
          hasMore={hasMore}
          isFetchingNextPage={isFetchingNextPage}
          onLike={likePost}
          onBookmark={bookmarkPost}
          onShare={sharePost}
        />
      )}
    </motion.div>
  )
}

/**
 * Virtualized grid view for posts
 */
function VirtualizedPostGrid({
  posts,
  onLoadMore,
  hasMore,
  isFetchingNextPage,
  onLike,
  onBookmark,
  onShare,
}: {
  posts: ProfilePost[]
  onLoadMore: () => void
  hasMore: boolean
  isFetchingNextPage: boolean
  onLike: (postId: string) => void
  onBookmark: (postId: string) => void
  onShare: (postId: string) => void
}) {
  // Group posts into rows of 3 for grid layout
  const postRows = useMemo(() => {
    const rows = []
    for (let i = 0; i < posts.length; i += 3) {
      rows.push(posts.slice(i, i + 3))
    }
    return rows
  }, [posts])

  return (
    <div className="h-[600px]">
      <Virtuoso
        data={postRows}
        endReached={() => {
          if (hasMore && !isFetchingNextPage) {
            onLoadMore()
          }
        }}
        itemContent={(index, row) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="grid grid-cols-3 gap-4 mb-4"
            style={hwAcceleration}
          >
            {row.map((post, postIndex) => (
              <PostGridItem
                key={post.id}
                post={post}
                index={index * 3 + postIndex}
                onLike={onLike}
                onBookmark={onBookmark}
                onShare={onShare}
              />
            ))}
          </motion.div>
        )}
        components={{
          Footer: () => isFetchingNextPage ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : null,
        }}
      />
    </div>
  )
}

/**
 * Virtualized list view for posts
 */
function VirtualizedPostList({
  posts,
  onLoadMore,
  hasMore,
  isFetchingNextPage,
  onLike,
  onBookmark,
  onShare,
}: {
  posts: ProfilePost[]
  onLoadMore: () => void
  hasMore: boolean
  isFetchingNextPage: boolean
  onLike: (postId: string) => void
  onBookmark: (postId: string) => void
  onShare: (postId: string) => void
}) {
  return (
    <div className="h-[600px]">
      <Virtuoso
        data={posts}
        endReached={() => {
          if (hasMore && !isFetchingNextPage) {
            onLoadMore()
          }
        }}
        itemContent={(index, post) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
            className="mb-6"
            style={hwAcceleration}
          >
            <PostListItem
              post={post}
              index={index}
              onLike={onLike}
              onBookmark={onBookmark}
              onShare={onShare}
            />
          </motion.div>
        )}
        components={{
          Footer: () => isFetchingNextPage ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : null,
        }}
      />
    </div>
  )
}

/**
 * Grid item component
 */
function PostGridItem({
  post,
  index,
  onLike,
  onBookmark,
  onShare,
}: {
  post: ProfilePost
  index: number
  onLike: (postId: string) => void
  onBookmark: (postId: string) => void
  onShare: (postId: string) => void
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative aspect-square bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden cursor-pointer group"
      style={hwAcceleration}
    >
      {/* Post Media or Content Preview */}
      {post.media && post.media.length > 0 ? (
        <img
          src={post.media[0].thumbnailUrl || post.media[0].url}
          alt="Post media"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full p-4 flex items-center justify-center">
          <p className="text-gray-700 text-sm line-clamp-6 text-center">
            {post.content}
          </p>
        </div>
      )}

      {/* Hover Overlay */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{post.stats.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-sm font-medium">{post.stats.comments}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Multiple Media Indicator */}
      {post.media && post.media.length > 1 && (
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-white text-xs font-medium">
          +{post.media.length - 1}
        </div>
      )}

      {/* Vibe Indicator */}
      {post.sentimentScore !== undefined && (
        <div 
          className="absolute bottom-3 left-3 w-3 h-3 rounded-full border-2 border-white shadow-lg"
          style={{
            backgroundColor: `hsl(${(post.sentimentScore + 1) * 60}, 70%, 50%)`,
          }}
        />
      )}
    </motion.div>
  )
}

/**
 * List item component
 */
function PostListItem({
  post,
  index,
  onLike,
  onBookmark,
  onShare,
}: {
  post: ProfilePost
  index: number
  onLike: (postId: string) => void
  onBookmark: (postId: string) => void
  onShare: (postId: string) => void
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-6"
      style={hwAcceleration}
    >
      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-800 leading-relaxed">{post.content}</p>
      </div>

      {/* Post Media */}
      {post.media && post.media.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
          {post.media.slice(0, 4).map((media, mediaIndex) => (
            <div
              key={media.id}
              className={`
                relative aspect-square overflow-hidden
                ${post.media!.length === 1 ? 'col-span-2' : ''}
                ${post.media!.length === 3 && mediaIndex === 0 ? 'col-span-2' : ''}
              `}
            >
              <img
                src={media.thumbnailUrl || media.url}
                alt={media.alt || 'Post media'}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {post.media!.length > 4 && mediaIndex === 3 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold">
                  +{post.media!.length - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onLike(post.id)}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors
              ${post.isLiked 
                ? 'text-red-500 bg-red-50' 
                : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
              }
            `}
          >
            <svg className="w-4 h-4" fill={post.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-sm font-medium">{post.stats.likes}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm font-medium">{post.stats.comments}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onShare(post.id)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-600 hover:text-green-500 hover:bg-green-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span className="text-sm font-medium">{post.stats.shares}</span>
          </motion.button>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onBookmark(post.id)}
            className={`
              p-2 rounded-lg transition-colors
              ${post.isBookmarked 
                ? 'text-yellow-500 bg-yellow-50' 
                : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
              }
            `}
          >
            <svg className="w-4 h-4" fill={post.isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </motion.button>

          <span className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * View mode toggle component
 */
function ViewModeToggle({
  viewMode,
  onViewModeChange,
  postsCount,
}: {
  viewMode: ProfileViewMode
  onViewModeChange: (mode: ProfileViewMode) => void
  postsCount: number
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-600">
        {postsCount} posts
      </div>

      <div className="flex bg-gray-100 rounded-lg p-1">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onViewModeChange('grid')}
          className={`
            px-3 py-1.5 rounded-md text-sm font-medium transition-all
            ${viewMode === 'grid'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onViewModeChange('list')}
          className={`
            px-3 py-1.5 rounded-md text-sm font-medium transition-all
            ${viewMode === 'list'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </motion.button>
      </div>
    </div>
  )
}

/**
 * Loading skeleton
 */
function ProfilePostsSkeleton({ viewMode }: { viewMode: ProfileViewMode }) {
  const skeletonItems = Array.from({ length: viewMode === 'grid' ? 9 : 3 })

  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-3 gap-4' : 'space-y-6'}>
      {skeletonItems.map((_, index) => (
        <div
          key={index}
          className={`
            bg-gray-200 animate-pulse rounded-2xl
            ${viewMode === 'grid' ? 'aspect-square' : 'h-48'}
          `}
        />
      ))}
    </div>
  )
}

/**
 * Error state
 */
function ProfilePostsError({ error, onRetry }: { error: any; onRetry: () => void }) {
  return (
    <div className="text-center py-12">
      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load posts</h3>
      <p className="text-gray-600 mb-4">{error?.message || 'Something went wrong'}</p>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try Again
      </motion.button>
    </div>
  )
}

/**
 * Empty state
 */
function ProfilePostsEmpty({ activeTab }: { activeTab: ProfileTabType }) {
  const messages = {
    posts: 'No posts yet',
    media: 'No media posts',
    liked: 'No liked posts',
    replies: 'No replies yet',
  }

  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📝</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {messages[activeTab]}
      </h3>
      <p className="text-gray-600">
        {activeTab === 'posts' 
          ? 'Start sharing your thoughts with the world!'
          : `No ${activeTab} to show yet.`
        }
      </p>
    </div>
  )
}

/**
 * Loading spinner
 */
function LoadingSpinner() {
  return (
    <motion.div
      className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  )
}