/**
 * Create Post API Service - Vibely Post Creation
 * Production-ready API layer for post creation
 */

import { api } from '@/core'
import type { CreatePostRequest, CreatePostResponse, MediaFile } from '../types/create.types'

// API endpoints
const CREATE_ENDPOINTS = {
  CREATE_POST: '/posts',
  UPLOAD_MEDIA: '/media/upload',
  VALIDATE_POST: '/posts/validate',
} as const

/**
 * Create a new post
 */
export const createPost = async (postData: CreatePostRequest): Promise<CreatePostResponse> => {
  try {
    const response = await api.post<CreatePostResponse>(
      CREATE_ENDPOINTS.CREATE_POST,
      postData
    )
    
    return response.data.data
  } catch (error) {
    console.error('Create post API error:', error)
    throw new Error('Failed to create post')
  }
}

/**
 * Upload media files
 */
export const uploadMedia = async (files: File[]): Promise<MediaFile[]> => {
  try {
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append(`media_${index}`, file)
    })
    
    const response = await api.post<{ media: MediaFile[] }>(
      CREATE_ENDPOINTS.UPLOAD_MEDIA,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    
    return response.data.data.media
  } catch (error) {
    console.error('Media upload API error:', error)
    throw new Error('Failed to upload media')
  }
}

/**
 * Validate post content
 */
export const validatePost = async (content: string): Promise<{ isValid: boolean; errors: string[] }> => {
  try {
    const response = await api.post<{ isValid: boolean; errors: string[] }>(
      CREATE_ENDPOINTS.VALIDATE_POST,
      { content }
    )
    
    return response.data.data
  } catch (error) {
    console.error('Post validation API error:', error)
    return { isValid: false, errors: ['Validation failed'] }
  }
}

/**
 * Calculate sentiment score for vibe sync
 * In production, this would be done by the backend
 */
export function calculateSentimentScore(content: string): number {
  if (!content.trim()) return 0
  
  const positiveWords = [
    'love', 'amazing', 'great', 'awesome', 'fantastic', 'wonderful', 
    'excellent', 'perfect', 'beautiful', 'happy', 'joy', 'excited',
    'thrilled', 'grateful', 'blessed', 'incredible', 'outstanding',
    'brilliant', 'superb', 'marvelous', 'delightful', 'fabulous'
  ]
  
  const negativeWords = [
    'hate', 'terrible', 'awful', 'horrible', 'disgusting', 'annoying',
    'frustrated', 'angry', 'sad', 'disappointed', 'worried', 'stressed',
    'upset', 'furious', 'devastated', 'heartbroken', 'miserable',
    'pathetic', 'useless', 'boring', 'stupid', 'ridiculous'
  ]
  
  const neutralWords = [
    'okay', 'fine', 'normal', 'regular', 'standard', 'typical',
    'average', 'moderate', 'decent', 'acceptable'
  ]
  
  const words = content.toLowerCase().split(/\s+/)
  let score = 0
  let wordCount = 0
  
  words.forEach(word => {
    // Remove punctuation
    const cleanWord = word.replace(/[^\w]/g, '')
    
    if (positiveWords.includes(cleanWord)) {
      score += 0.3
      wordCount++
    } else if (negativeWords.includes(cleanWord)) {
      score -= 0.3
      wordCount++
    } else if (neutralWords.includes(cleanWord)) {
      score += 0.05
      wordCount++
    }
  })
  
  // Normalize based on content length and word count
  if (wordCount > 0) {
    score = score / Math.max(1, wordCount * 0.5)
  }
  
  // Add slight positive bias for longer, thoughtful content
  if (content.length > 100) {
    score += 0.1
  }
  
  // Normalize to -1 to 1 range
  return Math.max(-1, Math.min(1, score))
}

/**
 * Calculate vibe intensity based on content characteristics
 */
export function calculateVibeIntensity(content: string, sentimentScore: number): number {
  if (!content.trim()) return 0
  
  // Base intensity on content length and sentiment strength
  const lengthFactor = Math.min(content.length / 200, 1) // 0 to 1 based on length
  const sentimentFactor = Math.abs(sentimentScore) // 0 to 1 based on sentiment strength
  
  // Check for emotional indicators
  const emotionalIndicators = [
    '!', '?', '😀', '😍', '😢', '😡', '🔥', '💯', '✨', '🚀',
    'wow', 'omg', 'amazing', 'incredible', 'unbelievable'
  ]
  
  let emotionalBoost = 0
  emotionalIndicators.forEach(indicator => {
    if (content.toLowerCase().includes(indicator)) {
      emotionalBoost += 0.1
    }
  })
  
  // Calculate final intensity
  const intensity = (lengthFactor * 0.3) + (sentimentFactor * 0.5) + Math.min(emotionalBoost, 0.2)
  
  return Math.max(0.1, Math.min(1, intensity))
}

// Mock data for development
export const mockCreatePostResponse: CreatePostResponse = {
  success: true,
  post: {
    id: `post_${Date.now()}`,
    content: '',
    user: {
      id: 'current_user',
      username: 'you',
      displayName: 'You',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    stats: {
      likes: 0,
      comments: 0,
      shares: 0,
    },
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date().toISOString(),
  },
}