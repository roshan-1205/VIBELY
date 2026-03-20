/**
 * Authentication API Service
 * Handles all auth-related API calls with proper typing
 */

import { api, endpoints, APIResponse } from '@/core/api/client'
import { User } from '../types/auth.types'

// Auth request/response types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  full_name?: string
}

export interface AuthResponse {
  user: User
  access_token: string
  refresh_token: string
  token_type: string
}

export interface RefreshRequest {
  refresh_token: string
}

export interface RefreshResponse {
  access_token: string
  token_type: string
}

// Auth API service
export class AuthAPI {
  /**
   * Login user with email and password
   */
  static async login(credentials: LoginRequest): Promise<APIResponse<AuthResponse>> {
    return api.post<AuthResponse>(endpoints.auth.login, credentials)
  }

  /**
   * Register new user
   */
  static async register(userData: RegisterRequest): Promise<APIResponse<AuthResponse>> {
    return api.post<AuthResponse>(endpoints.auth.register, userData)
  }

  /**
   * Refresh access token
   */
  static async refresh(refreshData: RefreshRequest): Promise<APIResponse<RefreshResponse>> {
    return api.post<RefreshResponse>(endpoints.auth.refresh, refreshData)
  }

  /**
   * Logout user (optional backend call)
   */
  static async logout(): Promise<APIResponse<void>> {
    return api.post<void>(endpoints.auth.logout)
  }

  /**
   * Get current user profile
   */
  static async me(): Promise<APIResponse<User>> {
    return api.get<User>(endpoints.auth.me)
  }
}

// Export individual functions for convenience
export const authAPI = {
  login: AuthAPI.login,
  register: AuthAPI.register,
  refresh: AuthAPI.refresh,
  logout: AuthAPI.logout,
  me: AuthAPI.me,
}