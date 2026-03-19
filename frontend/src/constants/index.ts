// Application constants

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const

// Authentication
export const AUTH_CONFIG = {
  TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  USER_KEY: 'user_data',
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  INFINITE_SCROLL_THRESHOLD: 0.8,
} as const

// Vibe Analysis
export const VIBE_CONFIG = {
  SCORE_RANGES: {
    POSITIVE: { min: 0.6, max: 1.0 },
    NEUTRAL: { min: 0.4, max: 0.6 },
    NEGATIVE: { min: 0.0, max: 0.4 },
  },
  CONFIDENCE_THRESHOLD: 0.7,
  ANALYSIS_TIMEOUT: 5000,
} as const

// Content Limits
export const CONTENT_LIMITS = {
  POST_MAX_LENGTH: 2000,
  COMMENT_MAX_LENGTH: 500,
  BIO_MAX_LENGTH: 160,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  PASSWORD_MIN_LENGTH: 8,
} as const

// File Upload
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
} as const

// UI Constants
export const UI_CONFIG = {
  SIDEBAR_WIDTH: 256,
  HEADER_HEIGHT: 64,
  MOBILE_BREAKPOINT: 768,
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 4000,
} as const

// Theme Configuration
export const THEME_CONFIG = {
  DEFAULT_THEME: 'light',
  STORAGE_KEY: 'theme_preference',
  VIBE_THEME_KEY: 'vibe_theme',
} as const

// Routes
export const ROUTES = {
  HOME: '/',
  FEED: '/feed',
  PROFILE: '/profile',
  CREATE: '/create',
  EXPLORE: '/explore',
  SETTINGS: '/settings',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Dynamic routes
  USER_PROFILE: (username: string) => `/profile/${username}`,
  POST_DETAIL: (id: string) => `/post/${id}`,
} as const

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  RATE_LIMIT: 'Too many requests. Please wait before trying again.',
  
  // Auth specific
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_TAKEN: 'This email is already registered.',
  USERNAME_TAKEN: 'This username is already taken.',
  WEAK_PASSWORD: 'Password must be at least 8 characters long.',
  
  // Content specific
  POST_TOO_LONG: `Post cannot exceed ${CONTENT_LIMITS.POST_MAX_LENGTH} characters.`,
  COMMENT_TOO_LONG: `Comment cannot exceed ${CONTENT_LIMITS.COMMENT_MAX_LENGTH} characters.`,
  FILE_TOO_LARGE: `File size cannot exceed ${UPLOAD_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB.`,
  INVALID_FILE_TYPE: 'Invalid file type.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  POST_CREATED: 'Post created successfully!',
  POST_UPDATED: 'Post updated successfully!',
  POST_DELETED: 'Post deleted successfully!',
  COMMENT_ADDED: 'Comment added successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!',
  
  // Auth specific
  LOGIN_SUCCESS: 'Welcome back!',
  REGISTER_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
} as const

// Vibe Labels and Colors
export const VIBE_LABELS = {
  POSITIVE: 'positive',
  NEUTRAL: 'neutral',
  NEGATIVE: 'negative',
} as const

export const VIBE_COLORS = {
  [VIBE_LABELS.POSITIVE]: '#10b981',
  [VIBE_LABELS.NEUTRAL]: '#f59e0b',
  [VIBE_LABELS.NEGATIVE]: '#ef4444',
} as const

export const VIBE_EMOJIS = {
  [VIBE_LABELS.POSITIVE]: '😊',
  [VIBE_LABELS.NEUTRAL]: '😐',
  [VIBE_LABELS.NEGATIVE]: '😔',
} as const

// Social Features
export const SOCIAL_CONFIG = {
  MAX_FOLLOWING: 5000,
  MAX_FOLLOWERS_DISPLAY: 999999,
  TRENDING_THRESHOLD: 100,
  VIRAL_THRESHOLD: 1000,
} as const

// WebSocket Events
export const WS_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  POST_LIKE: 'post_like',
  NEW_COMMENT: 'new_comment',
  VIBE_UPDATE: 'vibe_update',
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: AUTH_CONFIG.TOKEN_KEY,
  REFRESH_TOKEN: AUTH_CONFIG.REFRESH_TOKEN_KEY,
  USER_DATA: AUTH_CONFIG.USER_KEY,
  THEME: THEME_CONFIG.STORAGE_KEY,
  VIBE_THEME: THEME_CONFIG.VIBE_THEME_KEY,
  DRAFT_POST: 'draft_post',
  FEED_CACHE: 'feed_cache',
  SETTINGS: 'user_settings',
} as const

// Feature Flags
export const FEATURES = {
  VIBE_ANALYSIS: true,
  REAL_TIME_UPDATES: true,
  INFINITE_SCROLL: true,
  DARK_MODE: true,
  NOTIFICATIONS: true,
  VIDEO_UPLOAD: false,
  STORIES: false,
  LIVE_STREAMING: false,
} as const