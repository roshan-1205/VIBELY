// Core application types

// User types
export interface User {
  id: string
  username: string
  email: string
  name: string
  bio?: string
  avatar?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface UserProfile extends Omit<User, 'email'> {
  followersCount: number
  followingCount: number
  postsCount: number
  isFollowing?: boolean
}

// Post types
export interface Post {
  id: string
  content: string
  imageUrl?: string
  author: UserProfile
  likesCount: number
  commentsCount: number
  isLiked: boolean
  vibeScore?: number
  vibeLabel?: VibeLabel
  createdAt: string
  updatedAt: string
}

export interface CreatePostData {
  content: string
  imageUrl?: string
}

export interface UpdatePostData {
  content?: string
  imageUrl?: string
}

// Comment types
export interface Comment {
  id: string
  content: string
  author: UserProfile
  post: string
  createdAt: string
  updatedAt: string
}

export interface CreateCommentData {
  content: string
  postId: string
}

// Vibe analysis types
export type VibeLabel = 'positive' | 'neutral' | 'negative'

export interface VibeAnalysis {
  score: number // 0-1 range
  label: VibeLabel
  confidence: number
  keywords: string[]
  processingTime: number
}

export interface VibeRequest {
  text: string
}

export interface VibeTrend {
  label: VibeLabel
  count: number
  percentage: number
  change: number // percentage change from previous period
}

// Feed types
export interface FeedPost extends Post {
  priority?: number
  reason?: string // why this post is in the feed
}

export interface FeedResponse {
  posts: FeedPost[]
  nextCursor?: string
  hasMore: boolean
}

export interface FeedFilters {
  vibeLabel?: VibeLabel
  following?: boolean
  trending?: boolean
}

// Auth types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface RefreshTokenRequest {
  refreshToken: string
}

// API types
export interface PaginationParams {
  cursor?: string
  limit?: number
}

export interface SearchParams extends PaginationParams {
  query: string
}

export interface ApiError {
  message: string
  code?: string
  field?: string
}

export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

// UI types
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'glass' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type InputVariant = 'default' | 'glass'
export type LoadingSize = 'sm' | 'md' | 'lg'

// Theme types
export type Theme = 'light' | 'dark' | 'system'
export type VibeTheme = 'positive' | 'neutral' | 'negative'

// Store types
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  clearError: () => void
}

export interface UIState {
  theme: Theme
  vibeTheme: VibeTheme
  sidebarCollapsed: boolean
  notifications: Notification[]
}

export interface UIActions {
  setTheme: (theme: Theme) => void
  setVibeTheme: (theme: VibeTheme) => void
  toggleSidebar: () => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
}

// Notification types
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// WebSocket types
export interface WebSocketMessage {
  type: string
  data: unknown
  timestamp: string
}

export interface PostLikeMessage extends WebSocketMessage {
  type: 'post_like'
  data: {
    postId: string
    userId: string
    liked: boolean
  }
}

export interface NewCommentMessage extends WebSocketMessage {
  type: 'new_comment'
  data: {
    comment: Comment
  }
}

export interface VibeUpdateMessage extends WebSocketMessage {
  type: 'vibe_update'
  data: {
    postId: string
    analysis: VibeAnalysis
  }
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}