/**
 * Feed API Service
 * Handles all feed-related API calls with proper typing and caching
 */

import { api, endpoints, APIResponse } from '@/core/api/client'
import { Post, FeedParams, FeedResponse, CreatePostRequest } from '../types/feed.types'

// Feed API service
export class FeedAPI {
  /**
   * Get feed with pagination
   */
  static async getFeed(params: FeedParams = {}): Promise<APIResponse<FeedResponse>> {
    const queryParams = {
      offset: params.offset || 0,
      limit: params.limit || 20,
      type: params.type || 'timeline'
    }
    
    return api.get<FeedResponse>(endpoints.feed.get, queryParams)
  }

  /**
   * Create a new post
   */
  static async createPost(postData: CreatePostRequest): Promise<APIResponse<Post>> {
    return api.post<Post>(endpoints.posts.create, postData)
  }

  /**
   * Like a post
   */
  static async likePost(postId: string): Promise<APIResponse<{ liked: boolean; likes_count: number }>> {
    return api.post<{ liked: boolean; likes_count: number }>(endpoints.posts.like(postId))
  }

  /**
   * Unlike a post
   */
  static async unlikePost(postId: string): Promise<APIResponse<{ liked: boolean; likes_count: number }>> {
    return api.delete<{ liked: boolean; likes_count: number }>(endpoints.posts.like(postId))
  }

  /**
   * Get a specific post
   */
  static async getPost(postId: string): Promise<APIResponse<Post>> {
    return api.get<Post>(endpoints.posts.get(postId))
  }

  /**
   * Toggle post like (optimistic update helper)
   */
  static async togglePostLike(postId: string, isCurrentlyLiked: boolean): Promise<APIResponse<{ liked: boolean; likes_count: number }>> {
    if (isCurrentlyLiked) {
      return FeedAPI.unlikePost(postId)
    } else {
      return FeedAPI.likePost(postId)
    }
  }

  /**
   * Add comment to post
   */
  static async addComment(postId: string, content: string): Promise<APIResponse<{ id: string; content: string; created_at: string }>> {
    return api.post<{ id: string; content: string; created_at: string }>(`/posts/${postId}/comments`, { content })
  }

  /**
   * Share a post
   */
  static async sharePost(postId: string): Promise<APIResponse<{ shared: boolean; shares_count: number }>> {
    return api.post<{ shared: boolean; shares_count: number }>(`/posts/${postId}/share`)
  }

  /**
   * Track post view (analytics)
   */
  static async trackPostView(postId: string): Promise<APIResponse<{ viewed: boolean }>> {
    return api.post<{ viewed: boolean }>(`/posts/${postId}/view`)
  }
}

// Mock data for development and testing
export const mockFeedData = {
  posts: [
    {
      id: 'mock-1',
      content: 'Welcome to Vibely! This is a sample post to get you started.',
      author: {
        id: 'mock-user-1',
        username: 'vibely_team',
        name: 'Vibely Team',
        avatar: null,
        is_verified: true,
      },
      image_url: null,
      likes_count: 42,
      comments_count: 8,
      created_at: new Date().toISOString(),
      is_liked: false,
    },
    {
      id: 'mock-2', 
      content: 'Just shipped a new feature! The feed is looking amazing 🚀',
      author: {
        id: 'mock-user-2',
        username: 'developer',
        name: 'Dev Team',
        avatar: null,
        is_verified: false,
      },
      image_url: null,
      likes_count: 15,
      comments_count: 3,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      is_liked: true,
    },
  ],
  has_more: false,
  next_offset: null,
}

// Export individual functions for convenience
export const feedAPI = {
  getFeed: FeedAPI.getFeed,
  createPost: FeedAPI.createPost,
  likePost: FeedAPI.likePost,
  unlikePost: FeedAPI.unlikePost,
  getPost: FeedAPI.getPost,
  togglePostLike: FeedAPI.togglePostLike,
  addComment: FeedAPI.addComment,
  sharePost: FeedAPI.sharePost,
  trackPostView: FeedAPI.trackPostView,
}

// Export individual functions for direct import
export const {
  getFeed,
  createPost,
  likePost,
  unlikePost,
  getPost,
  togglePostLike,
  addComment,
  sharePost,
  trackPostView,
} = feedAPI

// Alias exports for compatibility
export const fetchFeed = getFeed