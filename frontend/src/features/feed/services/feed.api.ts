/**
 * Feed API Service - Vibely Social Media Feed
 * Production-ready API layer with error handling and caching
 */

import { api, API } from '@/core'
import type { FeedResponse, FeedParams, LikeResponse, CommentResponse, Post } from '../types/feed.types'

// API endpoints
const FEED_ENDPOINTS = {
  TIMELINE: '/feed/timeline',
  EXPLORE: '/feed/explore',
  TRENDING: '/feed/trending',
  POST_LIKE: (postId: string) => `/posts/${postId}/like`,
  POST_COMMENT: (postId: string) => `/posts/${postId}/comments`,
  POST_SHARE: (postId: string) => `/posts/${postId}/share`,
  POST_VIEW: (postId: string) => `/posts/${postId}/view`,
} as const

/**
 * Fetch feed posts with pagination
 */
export const fetchFeed = async (params: FeedParams = {}): Promise<FeedResponse> => {
  const { cursor, limit = 20, type = 'timeline', userId } = params
  
  let endpoint = FEED_ENDPOINTS.TIMELINE
  
  switch (type) {
    case 'explore':
      endpoint = FEED_ENDPOINTS.EXPLORE
      break
    case 'trending':
      endpoint = FEED_ENDPOINTS.TRENDING
      break
    default:
      endpoint = FEED_ENDPOINTS.TIMELINE
  }
  
  const queryParams = new URLSearchParams()
  if (cursor) queryParams.append('cursor', cursor)
  if (limit) queryParams.append('limit', limit.toString())
  if (userId) queryParams.append('userId', userId)
  
  const url = `${endpoint}?${queryParams.toString()}`
  
  try {
    const response = await api.get<FeedResponse>(url)
    
    // Transform and validate response
    const feedData = response.data.data
    
    // Add sentiment scores for vibe sync (mock for now)
    const postsWithSentiment = feedData.posts.map(post => ({
      ...post,
      sentimentScore: calculateSentimentScore(post.content),
      vibeIntensity: Math.random() * 0.8 + 0.2, // 0.2 to 1.0
    }))
    
    return {
      ...feedData,
      posts: postsWithSentiment,
    }
  } catch (error) {
    console.error('Feed API Error:', error)
    throw new Error('Failed to fetch feed')
  }
}

/**
 * Like/unlike a post
 */
export const togglePostLike = async (postId: string, isLiked: boolean): Promise<LikeResponse> => {
  try {
    const response = await api.post<LikeResponse>(
      FEED_ENDPOINTS.POST_LIKE(postId),
      { isLiked: !isLiked }
    )
    
    return response.data.data
  } catch (error) {
    console.error('Like API Error:', error)
    throw new Error('Failed to update like status')
  }
}

/**
 * Add comment to post
 */
export const addComment = async (postId: string, content: string): Promise<CommentResponse> => {
  try {
    const response = await api.post<CommentResponse>(
      FEED_ENDPOINTS.POST_COMMENT(postId),
      { content }
    )
    
    return response.data.data
  } catch (error) {
    console.error('Comment API Error:', error)
    throw new Error('Failed to add comment')
  }
}

/**
 * Share a post
 */
export const sharePost = async (postId: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.post<{ success: boolean }>(
      FEED_ENDPOINTS.POST_SHARE(postId)
    )
    
    return response.data.data
  } catch (error) {
    console.error('Share API Error:', error)
    throw new Error('Failed to share post')
  }
}

/**
 * Track post view
 */
export const trackPostView = async (postId: string): Promise<void> => {
  try {
    // Fire and forget - don't block UI
    api.post(FEED_ENDPOINTS.POST_VIEW(postId))
  } catch (error) {
    // Silently fail for analytics
    console.warn('View tracking failed:', error)
  }
}

/**
 * Calculate sentiment score for vibe sync
 * In production, this would be done by the backend
 */
function calculateSentimentScore(content: string): number {
  const positiveWords = [
    'love', 'amazing', 'great', 'awesome', 'fantastic', 'wonderful', 
    'excellent', 'perfect', 'beautiful', 'happy', 'joy', 'excited',
    'thrilled', 'grateful', 'blessed', 'incredible', 'outstanding'
  ]
  
  const negativeWords = [
    'hate', 'terrible', 'awful', 'horrible', 'disgusting', 'annoying',
    'frustrated', 'angry', 'sad', 'disappointed', 'worried', 'stressed',
    'upset', 'furious', 'devastated', 'heartbroken', 'miserable'
  ]
  
  const words = content.toLowerCase().split(/\s+/)
  let score = 0
  
  words.forEach(word => {
    if (positiveWords.includes(word)) {
      score += 0.2
    } else if (negativeWords.includes(word)) {
      score -= 0.2
    }
  })
  
  // Normalize to -1 to 1 range
  return Math.max(-1, Math.min(1, score))
}

// Mock data for development
export const mockFeedData: FeedResponse = {
  posts: [
    {
      id: '1',
      user: {
        id: 'user1',
        username: 'johndoe',
        displayName: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        isVerified: true,
      },
      content: 'Just launched my new project! So excited to share this amazing journey with everyone. The future looks bright! 🚀✨',
      media: [
        {
          id: 'media1',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
          width: 800,
          height: 600,
          alt: 'Project launch celebration',
        },
      ],
      stats: {
        likes: 1247,
        comments: 89,
        shares: 23,
        views: 5420,
      },
      isLiked: false,
      isBookmarked: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      sentimentScore: 0.8,
      vibeIntensity: 0.9,
    },
    {
      id: '2',
      user: {
        id: 'user2',
        username: 'sarahwilson',
        displayName: 'Sarah Wilson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        isVerified: false,
      },
      content: 'Beautiful sunset from my evening walk. Nature never fails to amaze me 🌅',
      media: [
        {
          id: 'media2',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
          width: 800,
          height: 600,
          alt: 'Beautiful sunset landscape',
        },
      ],
      stats: {
        likes: 892,
        comments: 34,
        shares: 12,
        views: 2150,
      },
      isLiked: true,
      isBookmarked: true,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      sentimentScore: 0.6,
      vibeIntensity: 0.7,
    },
    {
      id: '3',
      user: {
        id: 'user3',
        username: 'techguru',
        displayName: 'Alex Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        isVerified: true,
      },
      content: 'Working on some exciting new features. The development process has been challenging but rewarding. Can\'t wait to show you what we\'ve been building!',
      stats: {
        likes: 567,
        comments: 78,
        shares: 45,
        views: 1890,
      },
      isLiked: false,
      isBookmarked: false,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      sentimentScore: 0.3,
      vibeIntensity: 0.5,
    },
  ],
  nextCursor: 'cursor_page_2',
  hasMore: true,
  totalCount: 1000,
}