/**
 * Auth Store - Zustand State Management
 * Production-ready authentication with React Query integration
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/features/auth/types/auth.types'

// Re-export User type for convenience
export type { User } from '@/features/auth/types/auth.types'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (user: User, accessToken: string, refreshToken: string) => void
  logout: () => void
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

// Combined auth store interface
interface AuthStore extends AuthState, AuthActions {}

// Create auth store with persistence
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: (user: User, accessToken: string, refreshToken: string) => {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          error: null
        })
        
        console.log('User logged in successfully', { userId: user.id })
      },

      logout: () => {
        // Clear tokens from localStorage
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null
        })
        
        console.log('User logged out')
      },

      setUser: (user: User) => {
        set({ user })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error: string | null) => {
        set({ error })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Selector hooks for better performance
export const useUser = () => useAuthStore(state => state.user)
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated)
export const useAuthLoading = () => useAuthStore(state => state.isLoading)
export const useAuthError = () => useAuthStore(state => state.error)

// Legacy compatibility hook - this is what the error is looking for
export const useAuth = () => useAuthStore(state => ({
  user: state.user,
  token: state.accessToken,
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
  login: state.login,
  logout: state.logout,
  setUser: state.setUser,
  setLoading: state.setLoading,
  setError: state.setError,
}))

// Auth actions hook
export const useAuthActions = () => useAuthStore(state => ({
  login: state.login,
  logout: state.logout,
  setUser: state.setUser,
  setLoading: state.setLoading,
  setError: state.setError,
}))
