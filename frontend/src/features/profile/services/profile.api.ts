/**
 * Profile API Services - Vibely Profile System
 * Data fetching and mutations for profile features
 */

import { apiClient } from '@/core/api/client'
import type { 
  ProfileData, 
  ProfilePostsResponse, 
  FollowAction,
  ProfileEditData,
  ProfileAnalytics 
} from '../types/profile.types'

/**
 * Fetch user profile data
 */
export async function fetchProfile(userId: string): Promise<ProfileData> {
  try {
    const response = await apiClient.get(`/users/${userId}/profile`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch profile:', error)
    throw error
  }
}

/**
 * Fetch user posts with pagination
 */
export async function fetchProfilePosts(
  userId: string,
  cursor?: string,
  limit: number = 20,
  tab: string = 'posts'
): Promise<ProfilePostsResponse> {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      tab,
      ...(cursor && { cursor }),
    })

    const response = await apiClient.get(`/users/${userId}/posts?${params}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch profile posts:', error)
    throw error
  }
}

/**
 * Follow/unfollow user
 */
export async function toggleFollow(action: FollowAction): Promise<{ success: boolean }> {
  try {
    const response = await apiClient.post(`/users/${action.userId}/${action.action}`)
    return response.data
  } catch (error) {
    console.error('Failed to toggle follow:', error)
    throw error
  }
}

/**
 * Update profile
 */
export async function updateProfile(
  userId: string, 
  data: ProfileEditData
): Promise<ProfileData> {
  try {
    const formData = new FormData()
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'avatar' && value instanceof File) {
          formData.append('avatar', value)
        } else {
          formData.append(key, value.toString())
        }
      }
    })

    const response = await apiClient.put(`/users/${userId}/profile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response.data
  } catch (error) {
    console.error('Failed to update profile:', error)
    throw error
  }
}

/**
 * Get profile analytics
 */
export async function fetchProfileAnalytics(userId: string): Promise<ProfileAnalytics> {
  try {
    const response = await apiClient.get(`/users/${userId}/analytics`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch profile analytics:', error)
    throw error
  }
}

/**
 * Calculate average vibe score from recent posts
 */
export function calculateAverageVibeScore(posts: ProfilePostsResponse['posts']): number {
  if (!posts.length) return 0

  const recentPosts = posts.slice(0, 10) // Last 10 posts
  const scores = recentPosts
    .map(post => post.sentimentScore || 0)
    .filter(score => score !== 0)

  if (!scores.length) return 0

  return scores.reduce((sum, score) => sum + score, 0) / scores.length
}

/**
 * Mock data for development
 */
export const mockProfileData: ProfileData = {
  user: {
    id: 'user_123',
    name: 'Alex Chen',
    username: 'alexchen',
    displayName: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    bio: 'Frontend engineer building the future of social media. Love React, TypeScript, and smooth animations. ✨',
    location: 'San Francisco, CA',
    website: 'https://alexchen.dev',
    joinedAt: '2023-01-15T00:00:00Z',
    isVerified: true,
    isFollowing: false,
    isFollowedBy: false,
    isBlocked: false,
    isMuted: false,
  },
  stats: {
    postsCount: 1247,
    followersCount: 12500,
    followingCount: 892,
    likesCount: 45600,
    viewsCount: 234000,
  },
  averageVibeScore: 0.7,
  recentActivity: {
    lastPostAt: '2024-03-19T14:30:00Z',
    lastActiveAt: '2024-03-20T09:15:00Z',
    postsThisWeek: 5,
  },
}

export const mockProfilePosts: ProfilePostsResponse = {
  posts: Array.from({ length: 50 }, (_, i) => ({
    id: `post_${i + 1}`,
    content: `This is post #${i + 1}. Building amazing user experiences with React and TypeScript! ${
      i % 3 === 0 ? '🚀' : i % 3 === 1 ? '✨' : '💫'
    }`,
    media: i % 4 === 0 ? [{
      id: `media_${i}`,
      type: 'image' as const,
      url: `https://images.unsplash.com/photo-${1500000000000 + i}?w=400&h=400&fit=crop`,
      thumbnailUrl: `https://images.unsplash.com/photo-${1500000000000 + i}?w=200&h=200&fit=crop`,
    }] : undefined,
    stats: {
      likes: Math.floor(Math.random() * 500) + 10,
      comments: Math.floor(Math.random() * 50) + 1,
      shares: Math.floor(Math.random() * 20),
      views: Math.floor(Math.random() * 1000) + 50,
    },
    isLiked: Math.random() > 0.7,
    isBookmarked: Math.random() > 0.9,
    createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    sentimentScore: Math.random() * 2 - 1, // -1 to 1
    vibeIntensity: Math.random(),
  })),
  nextCursor: 'cursor_50',
  hasMore: true,
  totalCount: 1247,
}

/**
 * Development mode API calls with mock data
 */
export async function fetchProfileDev(userId: string): Promise<ProfileData> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Simulate occasional errors
  if (Math.random() < 0.05) {
    throw new Error('Network error - please try again')
  }
  
  return {
    ...mockProfileData,
    user: {
      ...mockProfileData.user,
      id: userId,
    },
  }
}

export async function fetchProfilePostsDev(
  userId: string,
  cursor?: string,
  limit: number = 20,
  tab: string = 'posts'
): Promise<ProfilePostsResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600))
  
  const startIndex = cursor ? parseInt(cursor.split('_')[1]) : 0
  const endIndex = startIndex + limit
  
  const posts = mockProfilePosts.posts.slice(startIndex, endIndex)
  
  return {
    posts,
    nextCursor: endIndex < mockProfilePosts.posts.length ? `cursor_${endIndex}` : undefined,
    hasMore: endIndex < mockProfilePosts.posts.length,
    totalCount: mockProfilePosts.totalCount,
  }
}