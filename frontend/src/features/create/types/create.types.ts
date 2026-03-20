/**
 * Create Post Types - Vibely Post Creation System
 * Premium post creation with real-time vibe sync
 */

export interface MediaFile {
  id: string
  file: File
  type: 'image' | 'video'
  url: string
  thumbnailUrl?: string
  size: number
  dimensions?: {
    width: number
    height: number
  }
}

export interface PostDraft {
  content: string
  media: MediaFile[]
  sentimentScore: number
  vibeIntensity: number
  characterCount: number
  isValid: boolean
}

export interface CreatePostRequest {
  content: string
  media?: {
    id: string
    type: 'image' | 'video'
    url: string
  }[]
  sentimentScore?: number
  vibeIntensity?: number
}

export interface CreatePostResponse {
  success: boolean
  post: {
    id: string
    content: string
    media?: any[]
    user: {
      id: string
      username: string
      displayName: string
      avatar?: string
    }
    stats: {
      likes: number
      comments: number
      shares: number
    }
    isLiked: boolean
    isBookmarked: boolean
    createdAt: string
    sentimentScore?: number
    vibeIntensity?: number
  }
}

export interface CreatePostError {
  code: string
  message: string
  field?: string
  details?: any
}

// Modal state types
export interface CreateModalState {
  isOpen: boolean
  isSubmitting: boolean
  draft: PostDraft
  error: CreatePostError | null
}

// Validation types
export interface PostValidation {
  isValid: boolean
  errors: {
    content?: string
    media?: string
    general?: string
  }
  warnings: {
    characterLimit?: string
    mediaSize?: string
  }
}

// Media upload types
export interface MediaUploadProgress {
  fileId: string
  progress: number
  status: 'uploading' | 'processing' | 'complete' | 'error'
  error?: string
}

// Composer state
export interface ComposerState {
  content: string
  characterCount: number
  maxCharacters: number
  sentimentScore: number
  vibeIntensity: number
  isTyping: boolean
  lastTypingTime: number
}

// Analytics types
export interface PostCreationAnalytics {
  sessionId: string
  startTime: number
  endTime?: number
  characterCount: number
  mediaCount: number
  sentimentScore: number
  timeToComplete?: number
  abandoned?: boolean
}