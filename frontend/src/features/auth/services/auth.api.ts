/**
 * Auth API Services - Secure Authentication
 * API calls with proper error handling and security
 */

import { apiClient } from '@/core/api/client'
import type { 
  LoginRequest, 
  SignupRequest, 
  AuthResponse, 
  ForgotPasswordRequest,
  ResetPasswordRequest,
  OAuthResponse,
  SessionInfo,
  User,
  AuthTokens
} from '../types/auth.types'
import { logger } from '@/core'

/**
 * Login user with email and password
 */
export async function loginUser(credentials: LoginRequest): Promise<AuthResponse> {
  try {
    logger.debug('Attempting login', { email: credentials.email })
    
    const response = await apiClient.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
      rememberMe: credentials.rememberMe || false,
    })
    
    logger.info('Login successful', { userId: response.data.user.id })
    return response.data
  } catch (error: any) {
    logger.error('Login failed', { 
      email: credentials.email, 
      error: error.response?.data || error.message 
    })
    throw error
  }
}

/**
 * Register new user account
 */
export async function signupUser(data: SignupRequest): Promise<AuthResponse> {
  try {
    logger.debug('Attempting signup', { email: data.email, name: data.name })
    
    const response = await apiClient.post('/auth/signup', {
      name: data.name,
      email: data.email,
      password: data.password,
      acceptTerms: data.acceptTerms,
    })
    
    logger.info('Signup successful', { userId: response.data.user.id })
    return response.data
  } catch (error: any) {
    logger.error('Signup failed', { 
      email: data.email, 
      error: error.response?.data || error.message 
    })
    throw error
  }
}

/**
 * Logout user and invalidate tokens
 */
export async function logoutUser(): Promise<void> {
  try {
    await apiClient.post('/auth/logout')
    logger.info('Logout successful')
  } catch (error: any) {
    // Don't throw on logout errors, just log them
    logger.warn('Logout request failed', { error: error.message })
  }
}

/**
 * Refresh authentication tokens
 */
export async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  try {
    const response = await apiClient.post('/auth/refresh', {
      refreshToken,
    })
    
    logger.debug('Tokens refreshed successfully')
    return response.data.tokens
  } catch (error: any) {
    logger.error('Token refresh failed', { error: error.response?.data || error.message })
    throw error
  }
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<User> {
  try {
    const response = await apiClient.get('/auth/me')
    return response.data.user
  } catch (error: any) {
    logger.error('Failed to get current user', { error: error.response?.data || error.message })
    throw error
  }
}

/**
 * Forgot password - send reset email
 */
export async function forgotPassword(data: ForgotPasswordRequest): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiClient.post('/auth/forgot-password', data)
    logger.info('Password reset email sent', { email: data.email })
    return response.data
  } catch (error: any) {
    logger.error('Forgot password failed', { 
      email: data.email, 
      error: error.response?.data || error.message 
    })
    throw error
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(data: ResetPasswordRequest): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiClient.post('/auth/reset-password', data)
    logger.info('Password reset successful')
    return response.data
  } catch (error: any) {
    logger.error('Password reset failed', { error: error.response?.data || error.message })
    throw error
  }
}

/**
 * OAuth authentication
 */
export async function oauthLogin(provider: string, code: string): Promise<OAuthResponse> {
  try {
    const response = await apiClient.post(`/auth/oauth/${provider}`, { code })
    logger.info('OAuth login successful', { provider, userId: response.data.user.id })
    return response.data
  } catch (error: any) {
    logger.error('OAuth login failed', { 
      provider, 
      error: error.response?.data || error.message 
    })
    throw error
  }
}

/**
 * Get user sessions
 */
export async function getUserSessions(): Promise<SessionInfo[]> {
  try {
    const response = await apiClient.get('/auth/sessions')
    return response.data.sessions
  } catch (error: any) {
    logger.error('Failed to get user sessions', { error: error.response?.data || error.message })
    throw error
  }
}

/**
 * Revoke session
 */
export async function revokeSession(sessionId: string): Promise<void> {
  try {
    await apiClient.delete(`/auth/sessions/${sessionId}`)
    logger.info('Session revoked', { sessionId })
  } catch (error: any) {
    logger.error('Failed to revoke session', { 
      sessionId, 
      error: error.response?.data || error.message 
    })
    throw error
  }
}

/**
 * Mock data for development
 */
export const mockAuthResponse: AuthResponse = {
  success: true,
  user: {
    id: 'user_123',
    name: 'John Doe',
    email: 'john@example.com',
    username: 'johndoe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'user',
    isVerified: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z',
    preferences: {
      theme: 'system',
      notifications: true,
      privacy: 'public',
    },
  },
  tokens: {
    accessToken: 'mock_access_token_' + Date.now(),
    refreshToken: 'mock_refresh_token_' + Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  },
}

/**
 * Development mode API calls with mock data
 */
export async function loginUserDev(credentials: LoginRequest): Promise<AuthResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Simulate validation errors
  if (!credentials.email.includes('@')) {
    throw new Error('Invalid email format')
  }
  
  if (credentials.password.length < 6) {
    throw new Error('Password must be at least 6 characters')
  }
  
  // Simulate login failure
  if (credentials.email === 'fail@example.com') {
    throw new Error('Invalid email or password')
  }
  
  return {
    ...mockAuthResponse,
    user: {
      ...mockAuthResponse.user,
      email: credentials.email,
    },
  }
}

export async function signupUserDev(data: SignupRequest): Promise<AuthResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1200))
  
  // Simulate validation errors
  if (!data.email.includes('@')) {
    throw new Error('Invalid email format')
  }
  
  if (data.password !== data.confirmPassword) {
    throw new Error('Passwords do not match')
  }
  
  if (!data.acceptTerms) {
    throw new Error('You must accept the terms and conditions')
  }
  
  // Simulate email already exists
  if (data.email === 'exists@example.com') {
    throw new Error('Email already exists')
  }
  
  return {
    ...mockAuthResponse,
    user: {
      ...mockAuthResponse.user,
      name: data.name,
      email: data.email,
      username: data.name.toLowerCase().replace(/\s+/g, ''),
    },
  }
}

export async function logoutUserDev(): Promise<void> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  // Always succeeds in dev mode
}

/**
 * API error handler
 */
export function handleAuthError(error: any): never {
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message)
  }
  
  if (error.response?.status === 401) {
    throw new Error('Invalid email or password')
  }
  
  if (error.response?.status === 422) {
    throw new Error('Please check your input and try again')
  }
  
  if (error.response?.status >= 500) {
    throw new Error('Server error. Please try again later.')
  }
  
  throw new Error(error.message || 'An unexpected error occurred')
}