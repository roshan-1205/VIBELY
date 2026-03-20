/**
 * useAuth Hook - Authentication Logic
 * React Query mutations with Zustand state management
 */

import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { 
  loginUser, 
  signupUser, 
  logoutUser, 
  getCurrentUser,
  refreshTokens,
  loginUserDev,
  signupUserDev,
  logoutUserDev,
  handleAuthError
} from '../services/auth.api'
import { 
  useAuthStore, 
  useAuthActions, 
  useIsAuthenticated,
  useAuthLoading,
  useAuthError,
  isTokenExpired
} from '../store/auth.store'
import type { LoginRequest, SignupRequest } from '../types/auth.types'
import { logger } from '@/core'

interface UseAuthOptions {
  redirectTo?: string
  useMockData?: boolean
}

/**
 * Main authentication hook
 */
export function useAuth(options: UseAuthOptions = {}) {
  const {
    redirectTo = '/feed',
    useMockData = process.env.NODE_ENV === 'development',
  } = options

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  // Auth state
  const isAuthenticated = useIsAuthenticated()
  const isLoading = useAuthLoading()
  const error = useAuthError()
  
  // Auth actions
  const { setAuth, clearAuth, setLoading, setError } = useAuthActions()

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => {
      const loginFn = useMockData ? loginUserDev : loginUser
      return loginFn(credentials)
    },
    onMutate: () => {
      setLoading(true)
      setError(null)
    },
    onSuccess: (response) => {
      setAuth(response.user, response.tokens)
      
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] })
      
      // Navigate to redirect URL
      navigate(redirectTo, { replace: true })
      
      logger.info('Login successful', { userId: response.user.id })
    },
    onError: (error: any) => {
      const authError = {
        code: 'LOGIN_FAILED',
        message: error.message || 'Login failed',
      }
      setError(authError)
      logger.error('Login failed', authError)
    },
    onSettled: () => {
      setLoading(false)
    },
  })

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: (data: SignupRequest) => {
      const signupFn = useMockData ? signupUserDev : signupUser
      return signupFn(data)
    },
    onMutate: () => {
      setLoading(true)
      setError(null)
    },
    onSuccess: (response) => {
      setAuth(response.user, response.tokens)
      
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] })
      
      // Navigate to redirect URL
      navigate(redirectTo, { replace: true })
      
      logger.info('Signup successful', { userId: response.user.id })
    },
    onError: (error: any) => {
      const authError = {
        code: 'SIGNUP_FAILED',
        message: error.message || 'Signup failed',
      }
      setError(authError)
      logger.error('Signup failed', authError)
    },
    onSettled: () => {
      setLoading(false)
    },
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => {
      const logoutFn = useMockData ? logoutUserDev : logoutUser
      return logoutFn()
    },
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: () => {
      clearAuth()
      
      // Clear all cached data
      queryClient.clear()
      
      // Navigate to login
      navigate('/login', { replace: true })
      
      logger.info('Logout successful')
    },
    onError: (error: any) => {
      // Still clear auth even if logout request fails
      clearAuth()
      navigate('/login', { replace: true })
      
      logger.warn('Logout request failed but cleared local state', { error: error.message })
    },
    onSettled: () => {
      setLoading(false)
    },
  })

  // Current user query
  const userQuery = useQuery({
    queryKey: ['user', 'current'],
    queryFn: getCurrentUser,
    enabled: isAuthenticated && !isTokenExpired(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  })

  // Helper functions
  const login = (credentials: LoginRequest) => {
    loginMutation.mutate(credentials)
  }

  const signup = (data: SignupRequest) => {
    signupMutation.mutate(data)
  }

  const logout = () => {
    logoutMutation.mutate()
  }

  const clearError = () => {
    setError(null)
  }

  return {
    // State
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending || signupMutation.isPending || logoutMutation.isPending,
    error,
    user: userQuery.data,
    
    // Actions
    login,
    signup,
    logout,
    clearError,
    
    // Mutation states
    isLoginPending: loginMutation.isPending,
    isSignupPending: signupMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
    
    // Raw mutations for advanced usage
    loginMutation,
    signupMutation,
    logoutMutation,
    userQuery,
  }
}

/**
 * Hook for form validation
 */
export function useAuthValidation() {
  const validateEmail = (email: string): string | null => {
    if (!email) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format'
    return null
  }

  const validatePassword = (password: string): string | null => {
    if (!password) return 'Password is required'
    if (password.length < 6) return 'Password must be at least 6 characters'
    return null
  }

  const validateName = (name: string): string | null => {
    if (!name) return 'Name is required'
    if (name.length < 2) return 'Name must be at least 2 characters'
    return null
  }

  const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
    if (!confirmPassword) return 'Please confirm your password'
    if (password !== confirmPassword) return 'Passwords do not match'
    return null
  }

  const validateLoginForm = (data: LoginRequest) => {
    const errors: Record<string, string> = {}
    
    const emailError = validateEmail(data.email)
    if (emailError) errors.email = emailError
    
    const passwordError = validatePassword(data.password)
    if (passwordError) errors.password = passwordError
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }

  const validateSignupForm = (data: SignupRequest) => {
    const errors: Record<string, string> = {}
    
    const nameError = validateName(data.name)
    if (nameError) errors.name = nameError
    
    const emailError = validateEmail(data.email)
    if (emailError) errors.email = emailError
    
    const passwordError = validatePassword(data.password)
    if (passwordError) errors.password = passwordError
    
    const confirmPasswordError = validateConfirmPassword(data.password, data.confirmPassword)
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError
    
    if (!data.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions'
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }

  return {
    validateEmail,
    validatePassword,
    validateName,
    validateConfirmPassword,
    validateLoginForm,
    validateSignupForm,
  }
}

/**
 * Hook for token management
 */
export function useTokenManager() {
  const { refreshTokens: updateTokens } = useAuthActions()
  const authStore = useAuthStore()

  const refreshMutation = useMutation({
    mutationFn: (refreshToken: string) => refreshTokens(refreshToken),
    onSuccess: (newTokens) => {
      updateTokens(newTokens)
      logger.debug('Tokens refreshed successfully')
    },
    onError: (error) => {
      logger.error('Token refresh failed', error)
      // Clear auth state on refresh failure
      authStore.clearAuth()
    },
  })

  const refreshAuthTokens = () => {
    const tokens = authStore.tokens
    if (tokens?.refreshToken) {
      refreshMutation.mutate(tokens.refreshToken)
    }
  }

  // Auto-refresh tokens when they're about to expire
  React.useEffect(() => {
    const tokens = authStore.tokens
    if (!tokens || !authStore.isAuthenticated) return

    const timeUntilExpiry = tokens.expiresAt - Date.now()
    const refreshThreshold = 5 * 60 * 1000 // 5 minutes before expiry

    if (timeUntilExpiry <= refreshThreshold && timeUntilExpiry > 0) {
      refreshAuthTokens()
    }

    // Set up auto-refresh timer
    const refreshTimer = setTimeout(() => {
      if (authStore.isAuthenticated && !isTokenExpired()) {
        refreshAuthTokens()
      }
    }, Math.max(timeUntilExpiry - refreshThreshold, 0))

    return () => clearTimeout(refreshTimer)
  }, [authStore.tokens, authStore.isAuthenticated])

  return {
    refreshAuthTokens,
    isRefreshing: refreshMutation.isPending,
    refreshError: refreshMutation.error,
  }
}

/**
 * Hook for auth state persistence
 */
export function useAuthPersistence() {
  const authStore = useAuthStore()

  // Check auth state on app load
  React.useEffect(() => {
    const checkAuthState = () => {
      if (authStore.isAuthenticated && isTokenExpired()) {
        logger.warn('Stored token expired, clearing auth state')
        authStore.clearAuth()
      }
    }

    checkAuthState()
  }, [])

  return {
    isAuthReady: true, // Auth state is always ready with Zustand persistence
  }
}