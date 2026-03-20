/**
 * Profile Types - Vibely Profile System
 * Premium social media profile with vibe sync
 */

export interface User {
  id: string
  name: string
  username: string
  displayName?: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  joinedAt: string
  isVerified: boolean
  isFollowing: boolean
  isFollowedBy: boolean
  isBlocked: boolean
  isMuted: boolean
}

export interface ProfileStats {
  postsCount: number
  followersCount: number
  followingCount: number
  likesCount: number
  viewsCount: number
}

export interface ProfileData {
  user: User
  stats: ProfileStats
  averageVibeScore: number
  recentActivity: {
    lastPostAt?: string
    lastActiveAt: string
    postsThisWeek: number
  }
}

export interface ProfilePost {
  id: string
  content: string
  media?: {
    id: string
    type: 'image' | 'video'
    url: string
    thumbnailUrl?: string
    alt?: string
  }[]
  stats: {
    likes: number
    comments: number
    shares: number
    views: number
  }
  isLiked: boolean
  isBookmarked: boolean
  createdAt: string
  sentimentScore?: number
  vibeIntensity?: number
}

export interface ProfilePostsResponse {
  posts: ProfilePost[]
  nextCursor?: string
  hasMore: boolean
  totalCount: number
}

export interface ProfileTab {
  id: string
  label: string
  count?: number
  icon?: string
}

export interface ProfileError {
  code: string
  message: string
  details?: any
}

// Profile view modes
export type ProfileViewMode = 'grid' | 'list'
export type ProfileTabType = 'posts' | 'media' | 'liked' | 'replies'

// Profile interaction types
export interface FollowAction {
  userId: string
  action: 'follow' | 'unfollow'
}

export interface ProfileAnalytics {
  profileViews: number
  profileViewsThisWeek: number
  topPost?: ProfilePost
  engagementRate: number
  vibeDistribution: {
    positive: number
    neutral: number
    negative: number
  }
}

// Profile settings
export interface ProfileSettings {
  isPrivate: boolean
  showActivity: boolean
  showFollowers: boolean
  showFollowing: boolean
  allowMessages: boolean
  allowMentions: boolean
}

// Profile edit data
export interface ProfileEditData {
  name: string
  bio: string
  location: string
  website: string
  avatar?: File
}

// Virtualization types
export interface VirtualizedPostItem {
  id: string
  post: ProfilePost
  index: number
  isVisible: boolean
}

// Profile state
export interface ProfileState {
  activeTab: ProfileTabType
  viewMode: ProfileViewMode
  isEditing: boolean
  selectedPost?: ProfilePost
}