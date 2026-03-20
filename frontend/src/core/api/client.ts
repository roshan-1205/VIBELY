/**
 * API Client Configuration - Production Ready
 * Handles authentication, retries, and error normalization
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { logger } from '../utils/logger'
import { ENV } from '../config/env'

// API Response Types
export interface APIResponse<T = any> {
  success: boolean
  data: T
  message?: string
}

export interface APIError {
  success: false
  message: string
  details?: any
}

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token management
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: string) => void
  reject: (error: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token!)
    }
  })
  
  failedQueue = []
}

// Request interceptor - attach auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken')
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

// Response interceptor - handle auth and normalize errors
apiClient.interceptors.response.use(
  (response) => {
    logger.debug('API Response:', {
      status: response.status,
      url: response.config.url,
    })
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    logger.error('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
    })

    // Handle 401 - Token refresh logic
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return apiClient(originalRequest)
        }).catch((err) => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post(`${ENV.API_URL}/auth/refresh`, {
          refresh_token: refreshToken
        })

        const { access_token } = response.data.data
        localStorage.setItem('accessToken', access_token)
        
        processQueue(null, access_token)
        
        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return apiClient(originalRequest)
        
      } catch (refreshError) {
        processQueue(refreshError, null)
        
        // Clear tokens and redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        
        // Trigger logout in auth store
        try {
          const { useAuthStore } = await import('../store/auth.store')
          useAuthStore.getState().logout()
        } catch (e) {
          logger.error('Failed to trigger logout:', e)
        }
        
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Normalize error response
    const normalizedError: APIError = {
      success: false,
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      details: error.response?.data
    }

    return Promise.reject(normalizedError)
  }
)

// API helper functions
export const api = {
  get: <T>(url: string, params?: any): Promise<APIResponse<T>> =>
    apiClient.get(url, { params }).then(res => res.data),
    
  post: <T>(url: string, data?: any): Promise<APIResponse<T>> =>
    apiClient.post(url, data).then(res => res.data),
    
  put: <T>(url: string, data?: any): Promise<APIResponse<T>> =>
    apiClient.put(url, data).then(res => res.data),
    
  delete: <T>(url: string): Promise<APIResponse<T>> =>
    apiClient.delete(url).then(res => res.data),
}

// API endpoints
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  feed: {
    get: '/feed',
    create: '/posts',
  },
  posts: {
    create: '/posts',
    like: (id: string) => `/posts/${id}/like`,
    unlike: (id: string) => `/posts/${id}/unlike`,
    get: (id: string) => `/posts/${id}`,
  },
  users: {
    me: '/users/me',
    profile: (id: string) => `/users/${id}`,
  }
}

// Legacy exports for compatibility
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