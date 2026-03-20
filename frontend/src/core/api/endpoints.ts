/**
 * API Endpoints Configuration
 * Centralized endpoint management for consistent API calls
 */

export const API = {
  // Authentication
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
  
  // User Management
  PROFILE: '/profile',
  USER_PROFILE: (id: string) => `/users/${id}`,
  UPDATE_PROFILE: '/users/me',
  SEARCH_USERS: '/users/search',
  
  // Posts & Feed
  FEED: '/feed',
  POSTS: '/posts',
  POST_DETAIL: (id: string) => `/posts/${id}`,
  POST_LIKE: (id: string) => `/posts/${id}/like`,
  POST_COMMENTS: (id: string) => `/posts/${id}/comments`,
  
  // Vibe System
  VIBE_ANALYZE: '/vibe/analyze',
  VIBE_TRENDS: '/vibe/trends',
  VIBE_HISTORY: '/vibe/history',
  
  // Real-time
  NOTIFICATIONS: '/notifications',
  WEBSOCKET: '/ws',
} as const

export type ApiEndpoint = typeof API[keyof typeof API]