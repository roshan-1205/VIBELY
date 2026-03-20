/**
 * FeedCard Component - Vibely Social Media Feed
 * Premium UI card with vibe sync integration and smooth interactions
 */

import React, { memo, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useVibeSync } from '@/core/hooks/useVibeSync'
import { useFeedActions } from '../hooks/useFeedActions'
import { formatRelativeTime, formatNumber, hwAcceleration, cardHover, buttonTap } from '@/core'
import type { Post } from '../types/feed.types'

interface FeedCardProps {
  post: Post
  index?: number
  onView?: (postId: string) => void
}

export const FeedCard = memo(function FeedCard({ post, index = 0, onView }: FeedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { handleLike, handleComment, handleShare, isLiking } = useFeedActions()
  
  // Vibe sync integration - NO React state, only CSS variables
  useVibeSync(post.sentimentScore || 0, {
    enableTransitions: true,
    transitionDuration: 600,
    enableGlow: true,
    intensity: post.vibeIntensity || 0.5,
  })

  // Track view when card enters viewport
  useEffect(() => {
    if (!cardRef.current || !onView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onView(post.id)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [post.id, onView])

  // Optimized event handlers
  const handleLikeClick = useCallback(() => {
    handleLike(post.id, post.isLiked)
  }, [handleLike, post.id, post.isLiked])

  const handleCommentClick = useCallback(() => {
    // In a real app, this would open a comment modal
    console.log('Open comments for post:', post.id)
  }, [post.id])

  const handleShareClick = useCallback(() => {
    handleShare(post.id)
  }, [handleShare, post.id])

  const handleUserClick = useCallback(() => {
    // Navigate to user profile
    console.log('Navigate to user:', post.user.username)
  }, [post.user.username])

  return (
    <motion.article
      ref={cardRef}
      {...cardHover}
      style={hwAcceleration}
      className="glass-card rounded-3xl p-6 space-y-4 border border-white/20 backdrop-blur-xl"
      data-post-id={post.id}
    >
      {/* Header */}
      <header className="flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-3 cursor-pointer"
          {...buttonTap}
          onClick={handleUserClick}
        >
          {/* Avatar */}
          <div className="relative">
            <img
              src={post.user.avatar || '/default-avatar.png'}
              alt={post.user.displayName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20"
              loading="lazy"
            />
            {post.user.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
          
          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 truncate">
                {post.user.displayName}
              </h3>
              <span className="text-gray-500 text-sm">
                @{post.user.username}
              </span>
            </div>
            <time className="text-gray-500 text-sm">
              {formatRelativeTime(post.createdAt)}
            </time>
          </div>
        </motion.div>

        {/* Menu Button */}
        <motion.button
          {...buttonTap}
          style={hwAcceleration}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Post options"
        >
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </motion.button>
      </header>

      {/* Content */}
      <div className="space-y-4">
        {/* Text Content */}
        {post.content && (
          <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        )}

        {/* Media */}
        {post.media && post.media.length > 0 && (
          <div className="space-y-3">
            {post.media.map((media) => (
              <div key={media.id} className="relative rounded-2xl overflow-hidden">
                {media.type === 'image' ? (
                  <img
                    src={media.url}
                    alt={media.alt || 'Post image'}
                    className="w-full h-auto max-h-96 object-cover"
                    loading="lazy"
                    style={{ aspectRatio: `${media.width}/${media.height}` }}
                  />
                ) : (
                  <video
                    src={media.url}
                    poster={media.thumbnailUrl}
                    className="w-full h-auto max-h-96 object-cover"
                    controls
                    preload="metadata"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <footer className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          {/* Like Button */}
          <motion.button
            {...buttonTap}
            style={hwAcceleration}
            onClick={handleLikeClick}
            disabled={isLiking}
            className={`flex items-center space-x-2 group ${
              post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            } transition-colors`}
            aria-label={post.isLiked ? 'Unlike post' : 'Like post'}
          >
            <motion.div
              animate={post.isLiked ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                className="w-6 h-6"
                fill={post.isLiked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </motion.div>
            <span className="text-sm font-medium">
              {formatNumber(post.stats.likes)}
            </span>
          </motion.button>

          {/* Comment Button */}
          <motion.button
            {...buttonTap}
            style={hwAcceleration}
            onClick={handleCommentClick}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors group"
            aria-label="Comment on post"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-sm font-medium">
              {formatNumber(post.stats.comments)}
            </span>
          </motion.button>

          {/* Share Button */}
          <motion.button
            {...buttonTap}
            style={hwAcceleration}
            onClick={handleShareClick}
            className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors group"
            aria-label="Share post"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
            <span className="text-sm font-medium">
              {formatNumber(post.stats.shares)}
            </span>
          </motion.button>
        </div>

        {/* Bookmark Button */}
        <motion.button
          {...buttonTap}
          style={hwAcceleration}
          className={`p-2 rounded-full transition-colors ${
            post.isBookmarked 
              ? 'text-blue-500 bg-blue-50' 
              : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50'
          }`}
          aria-label={post.isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
        >
          <svg
            className="w-5 h-5"
            fill={post.isBookmarked ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </motion.button>
      </footer>
    </motion.article>
  )
})

FeedCard.displayName = 'FeedCard'