import axios, { AxiosError, type AxiosResponse } from 'axios'
import { logger } from '../utils/logger'
import { ENV } from '../config/env'

// Base API configuration
const API_BASE_URL = ENV.API_URL

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - attach auth token
apiClient.interceptors.request.use(
  (config) => {
    // Import auth store dynamically to avoid circular dependencies
    const getAuthToken = () => {
      try {
        const authStore = require('../../features/auth/store/auth.store')
        return authStore.getAuthToken()
      } catch {
        return null
      }
    }
    
    const token = getAuthToken()
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    logger.debug('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      hasAuth: !!token,
    })
    
    return config
  },
  (error) => {
    logger.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    logger.debug('API Response:', {
      status: response.status,
      url: response.config.url,
    })
    return response
  },
  async (error: AxiosError) => {
    const status = error.response?.status
    const url = error.config?.url
    
    logger.error('API Error:', {
      status,
      url,
      message: error.message,
      data: error.response?.data,
    })
    
    // Handle 401 Unauthorized
    if (status === 401) {
      logger.warn('Unauthorized access, clearing auth state')
      
      // Import auth store dynamically to avoid circular dependencies
      try {
        const authStore = require('../../features/auth/store/auth.store')
        authStore.useAuthStore.getState().clearAuth()
        
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
      } catch (error) {
        logger.error('Failed to clear auth state:', error)
      }
    }
    
    // Handle 403 Forbidden
    if (status === 403) {
      logger.error('Access forbidden:', error.response?.data)
    }
    
    // Handle server errors
    if (status && status >= 500) {
      logger.error('Server error:', error.response?.data)
    }
    
    // Handle network errors
    if (!error.response) {
      logger.error('Network error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

// API response types
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  code?: string
  details?: unknown
}

// Helper functions for common API patterns
export const api = {
  // GET request
  get: <T>(url: string, params?: Record<string, unknown>) =>
    apiClient.get<ApiResponse<T>>(url, { params }),
  
  // POST request
  post: <T>(url: string, data?: unknown) =>
    apiClient.post<ApiResponse<T>>(url, data),
  
  // PUT request
  put: <T>(url: string, data?: unknown) =>
    apiClient.put<ApiResponse<T>>(url, data),
  
  // PATCH request
  patch: <T>(url: string, data?: unknown) =>
    apiClient.patch<ApiResponse<T>>(url, data),
  
  // DELETE request
  delete: <T>(url: string) =>
    apiClient.delete<ApiResponse<T>>(url),
}

// Specific API endpoints
export const endpoints = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  
  // User endpoints
  users: {
    profile: (id: string) => `/users/${id}`,
    update: '/users/me',
    search: '/users/search',
  },
  
  // Post endpoints
  posts: {
    list: '/posts',
    create: '/posts',
    detail: (id: string) => `/posts/${id}`,
    update: (id: string) => `/posts/${id}`,
    delete: (id: string) => `/posts/${id}`,
    like: (id: string) => `/posts/${id}/like`,
    comments: (id: string) => `/posts/${id}/comments`,
  },
  
  // Feed endpoints
  feed: {
    timeline: '/feed',
    trending: '/feed/trending',
    explore: '/feed/explore',
  },
  
  // Vibe endpoints
  vibe: {
    analyze: '/vibe/analyze',
    trends: '/vibe/trends',
    history: '/vibe/history',
  },
} as const