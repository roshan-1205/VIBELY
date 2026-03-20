/**
 * Feed Types - Vibely Social Media Feed
 * Production-ready type definitions for Instagram/Threads level feed
 */

export interface User {
  id: string
  username: string
  displayName: string
  avatar?: string
  isVerified?: boolean
}

export interface PostMedia {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnailUrl?: string
  width: number
  height: number
  alt?: string
}

export interface PostStats {
  likes: number
  comments: number
  shares: number
  views?: number
}

export interface Post {
  id: string
  user: User
  content: string
  media?: PostMedia[]
  stats: PostStats
  isLiked: boolean
  isBookmarked: boolean
  createdAt: string
  updatedAt: string
  
  // Vibe sync integration
  sentimentScore?: number
  vibeIntensity?: number
}

export interface FeedResponse {
  posts: Post[]
  nextCursor: string | null
  hasMore: boolean
  totalCount?: number
}

export interface FeedParams {
  cursor?: string
  limit?: number
  userId?: string
  type?: 'timeline' | 'explore' | 'trending'
}

export interface LikeResponse {
  success: boolean
  isLiked: boolean
  likesCount: number
}

export interface CommentResponse {
  success: boolean
  comment: {
    id: string
    content: string
    user: User
    createdAt: string
  }
}

// Optimistic update types
export interface OptimisticLike {
  postId: string
  isLiked: boolean
  previousLikesCount: number
  newLikesCount: number
}

export interface OptimisticComment {
  postId: string
  tempId: string
  content: string
  user: User
}

// Feed state types
export interface FeedState {
  selectedPostId: string | null
  isRefreshing: boolean
  lastRefreshTime: number
}

// Error types
export interface FeedError {
  code: string
  message: string
  details?: any
}

// Analytics types
export interface PostInteraction {
  postId: string
  type: 'like' | 'comment' | 'share' | 'view' | 'click'
  timestamp: number
  metadata?: Record<string, any>
}