/**
 * FeedCard Component - Optimized for Performance
 */

import React, { memo, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

// Mock types for now
interface User {
  id: string
  username: string
  avatar?: string
}

interface Post {
  id: string
  content: string
  user: User
  createdAt: string
  isLiked: boolean
  likesCount: number
  commentsCount: number
  sentimentScore?: number
  vibeIntensity?: number
  media?: Array<{ url: string; alt?: string }>
}

interface FeedCardProps {
  post: Post
  index?: number
  onView?: (postId: string) => void
  onLike?: (postId: string, isLiked: boolean) => void
  onComment?: (postId: string) => void
  onShare?: (postId: string) => void
}

const hwAcceleration = {
  willChange: 'transform' as const,
  backfaceVisibility: 'hidden' as const,
  perspective: 1000,
}

const cardHover = {
  whileHover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
  },
}

export const FeedCard = memo(function FeedCard({ 
  post, 
  index = 0, 
  onView,
  onLike,
  onComment,
  onShare
}: FeedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleLikeClick = useCallback(() => {
    onLike?.(post.id, post.isLiked)
  }, [onLike, post.id, post.isLiked])

  const handleCommentClick = useCallback(() => {
    onComment?.(post.id)
  }, [onComment, post.id])

  const handleShareClick = useCallback(() => {
    onShare?.(post.id)
  }, [onShare, post.id])

  return (
    <motion.article
      ref={cardRef}
      {...cardHover}
      style={hwAcceleration}
      className="glass-card rounded-3xl p-6 space-y-4 border border-white/20 backdrop-blur-xl"
      data-post-id={post.id}
    >
      <header className="flex items-center space-x-3">
        <img
          src={post.user.avatar || '/default-avatar.png'}
          alt={post.user.username}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-900">
            {post.user.username}
          </h3>
          <time className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </time>
        </div>
      </header>

      <div className="space-y-3">
        <p className="text-gray-800 leading-relaxed">
          {post.content}
        </p>
      </div>

      <footer className="flex items-center space-x-4 pt-2 border-t border-gray-100">
        <button
          onClick={handleLikeClick}
          className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
            post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
          }`}
        >
          <svg className="w-4 h-4" fill={post.isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{post.likesCount}</span>
        </button>

        <button
          onClick={handleCommentClick}
          className="flex items-center space-x-1 px-3 py-1 rounded-lg text-gray-500 hover:text-blue-500 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{post.commentsCount}</span>
        </button>

        <button
          onClick={handleShareClick}
          className="flex items-center space-x-1 px-3 py-1 rounded-lg text-gray-500 hover:text-green-500 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <span>Share</span>
        </button>
      </footer>
    </motion.article>
  )
})