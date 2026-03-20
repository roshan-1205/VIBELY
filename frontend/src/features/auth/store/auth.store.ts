/**
 * Auth Store - Zustand Authentication State
 * Secure token management with persistence
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User, AuthTokens, AuthError, AuthState, AuthActions } from '../types/auth.types'
import { logger } from '@/core'

interface AuthStore extends AuthState, AuthActions {}

/**
 * Secure token storage with encryption (simplified for demo)
 */
const secureStorage = {
  getItem: (name: string): string | null => {
    try {
      const item = localStorage.getItem(name)
      if (!item) return null
      
      // In production, decrypt the token here
      return item
    } catch (error) {
      logger.error('Failed to get auth token', error)
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      // In production, encrypt the token here
      localStorage.setItem(name, value)
    } catch (error) {
      logger.error('Failed to store auth token', error)
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name)
    } catch (error) {
      logger.error('Failed to remove auth token', error)
    }
  },
}

/**
 * Main auth store with persistence
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setAuth: (user: User, tokens: AuthTokens) => {
        set({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
        
        logger.info('User authenticated', { userId: user.id, email: user.email })
      },

      clearAuth: () => {
        const currentUser = get().user
        
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
        
        logger.info('User logged out', { userId: currentUser?.id })
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading })
      },

      setError: (error: AuthError | null) => {
        set({ error, isLoading: false })
        
        if (error) {
          logger.error('Auth error', { code: error.code, message: error.message })
        }
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user
        if (!currentUser) return

        const updatedUser = { ...currentUser, ...updates }
        set({ user: updatedUser })
        
        logger.debug('User updated', { userId: currentUser.id, updates })
      },

      refreshTokens: (tokens: AuthTokens) => {
        set({ tokens })
        logger.debug('Tokens refreshed')
      },
    }),
    {
      name: 'vibely-auth',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.tokens) {
          // Check if token is expired
          const now = Date.now()
          if (state.tokens.expiresAt < now) {
            logger.warn('Stored token expired, clearing auth')
            state.clearAuth()
          } else {
            logger.info('Auth state rehydrated', { userId: state.user?.id })
          }
        }
      },
    }
  )
)

/**
 * Selectors for optimized re-renders
 */
export const useAuthUser = () => useAuthStore((state) => state.user)
export const useAuthTokens = () => useAuthStore((state) => state.tokens)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
export const useAuthLoading = () => useAuthStore((state) => state.isLoading)
export const useAuthError = () => useAuthStore((state) => state.error)

/**
 * Auth actions selectors
 */
export const useAuthActions = () => useAuthStore((state) => ({
  setAuth: state.setAuth,
  clearAuth: state.clearAuth,
  setLoading: state.setLoading,
  setError: state.setError,
  updateUser: state.updateUser,
  refreshTokens: state.refreshTokens,
}))

/**
 * Computed selectors
 */
export const useUserRole = () => useAuthStore((state) => state.user?.role)
export const useIsAdmin = () => useAuthStore((state) => state.user?.role === 'admin')
export const useUserPreferences = () => useAuthStore((state) => state.user?.preferences)

/**
 * Token utilities
 */
export const getAuthToken = (): string | null => {
  const tokens = useAuthStore.getState().tokens
  return tokens?.accessToken || null
}

export const isTokenExpired = (): boolean => {
  const tokens = useAuthStore.getState().tokens
  if (!tokens) return true
  
  return Date.now() >= tokens.expiresAt
}

export const getTokenExpiryTime = (): number | null => {
  const tokens = useAuthStore.getState().tokens
  return tokens?.expiresAt || null
}

/**
 * Auth state utilities
 */
export const getCurrentUser = (): User | null => {
  return useAuthStore.getState().user
}

export const checkAuthState = (): boolean => {
  const state = useAuthStore.getState()
  return state.isAuthenticated && !!state.user && !!state.tokens && !isTokenExpired()
}

/**
 * Development helpers
 */
export const debugAuthState = () => {
  if (process.env.NODE_ENV === 'development') {
    const state = useAuthStore.getState()
    console.group('🔐 Auth State Debug')
    console.log('User:', state.user)
    console.log('Is Authenticated:', state.isAuthenticated)
    console.log('Is Loading:', state.isLoading)
    console.log('Error:', state.error)
    console.log('Token Expired:', isTokenExpired())
    console.groupEnd()
  }
}