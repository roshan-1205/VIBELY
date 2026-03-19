import axios, { AxiosError, type AxiosResponse } from 'axios'

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

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
    // Get token from localStorage or your auth store
    const token = localStorage.getItem('auth_token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    // Handle common error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    
    if (error.response?.status === 403) {
      // Forbidden - show error message
      console.error('Access forbidden:', error.response.data)
    }
    
    if (error.response?.status && error.response.status >= 500) {
      // Server error - show generic error message
      console.error('Server error:', error.response?.data)
    }
    
    // Network error
    if (!error.response) {
      console.error('Network error:', error.message)
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