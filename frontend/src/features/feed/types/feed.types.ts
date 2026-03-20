/**
 * Feed Types - Vibely Social Media Feed
 * Production-ready type definitions for Instagram/Threads level feed
 */

export interface User {
  id: number
  username: string
  full_name?: string
  avatar_url?: string
  is_verified?: boolean
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

export interface Post {
  id: number
  content: string
  author: User
  image_url?: string
  video_url?: string
  vibe_score: number
  likes_count: number
  comments_count: number
  shares_count?: number
  created_at: string
  updated_at?: string
  is_liked?: boolean
  is_bookmarked?: boolean
}

export interface FeedResponse {
  posts: Post[]
  next_offset?: number
  has_more: boolean
  total?: number
}

export interface FeedParams {
  offset?: number
  limit?: number
  type?: 'timeline' | 'explore' | 'trending'
}

export interface CreatePostRequest {
  content: string
  image_url?: string
  video_url?: string
}

export interface LikeResponse {
  liked: boolean
  likes_count: number
}

export interface CommentResponse {
  success: boolean
  comment: {
    id: string
    content: string
    author: User
    created_at: string
  }
}

// Optimistic update types
export interface OptimisticLike {
  postId: number
  isLiked: boolean
  previousLikesCount: number
  newLikesCount: number
}

export interface OptimisticComment {
  postId: number
  tempId: string
  content: string
  author: User
}

// Feed state types
export interface FeedState {
  selectedPostId: number | null
  isRefreshing: boolean
  lastRefreshTime: number
}

// Error types
export interface FeedError {
  code?: string
  message: string
  details?: any
}

// Analytics types
export interface PostInteraction {
  postId: number
  type: 'like' | 'comment' | 'share' | 'view' | 'click'
  timestamp: number
  metadata?: Record<string, any>
}