/**
 * useAuth Hook - Authentication Logic
 * React Query mutations with Zustand state management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authAPI, LoginRequest, RegisterRequest } from '../services/auth.api'
import { useAuthStore } from '@/core/store/auth.store'
import { logger } from '@/core/utils/logger'

interface UseAuthOptions {
  redirectTo?: string
}

/**
 * Main authentication hook
 */
export function useAuth(options: UseAuthOptions = {}) {
  const {
    redirectTo = '/',  // Changed from '/feed' to '/' (home page)
  } = options

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  // Auth state from Zustand store
  const { user, isAuthenticated, isLoading, login: setAuth, logout: clearAuth, setLoading, setError } = useAuthStore()

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onMutate: () => {
      setLoading(true)
      setError(null)
    },
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.access_token, response.data.refresh_token)
      
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] })
      
      // Navigate to redirect URL
      navigate(redirectTo, { replace: true })
      
      logger.info('Login successful', { userId: response.data.user.id })
    },
    onError: (error: any) => {
      setError(error.message || 'Login failed')
      logger.error('Login failed', error)
    },
    onSettled: () => {
      setLoading(false)
    },
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onMutate: () => {
      setLoading(true)
      setError(null)
    },
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.access_token, response.data.refresh_token)
      
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] })
      
      // Navigate to redirect URL
      navigate(redirectTo, { replace: true })
      
      logger.info('Register successful', { userId: response.data.user.id })
    },
    onError: (error: any) => {
      setError(error.message || 'Registration failed')
      logger.error('Register failed', error)
    },
    onSettled: () => {
      setLoading(false)
    },
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
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
    queryFn: authAPI.me,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  })

  // Helper functions
  const login = (credentials: LoginRequest) => {
    loginMutation.mutate(credentials)
  }

  const register = (data: RegisterRequest) => {
    registerMutation.mutate(data)
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
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    user: user || userQuery.data?.data,
    
    // Actions
    login,
    register,
    logout,
    clearError,
    
    // Mutation states
    isLoginPending: loginMutation.isPending,
    isRegisterPending: registerMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
    
    // Raw mutations for advanced usage
    loginMutation,
    registerMutation,
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
    if (password.length < 8) return 'Password must be at least 8 characters'
    return null
  }

  const validateName = (name: string): string | null => {
    if (!name) return 'Name is required'
    if (name.length < 2) return 'Name must be at least 2 characters'
    return null
  }

  const validateUsername = (username: string): string | null => {
    if (!username) return 'Username is required'
    if (username.length < 3) return 'Username must be at least 3 characters'
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

  const validateRegisterForm = (data: RegisterRequest) => {
    const errors: Record<string, string> = {}
    
    const usernameError = validateUsername(data.username)
    if (usernameError) errors.username = usernameError
    
    const emailError = validateEmail(data.email)
    if (emailError) errors.email = emailError
    
    const passwordError = validatePassword(data.password)
    if (passwordError) errors.password = passwordError
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }

  return {
    validateEmail,
    validatePassword,
    validateName,
    validateUsername,
    validateLoginForm,
    validateRegisterForm,
  }
}