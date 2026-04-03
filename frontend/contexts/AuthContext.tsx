"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { apiService, type User } from '@/services/api'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>
  logout: () => Promise<void>
  updateProfile: (profileData: { firstName?: string; lastName?: string; email?: string }) => Promise<boolean>
  isLoading: boolean
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      setIsLoading(true)
      
      // Check if we have a token
      const token = localStorage.getItem('vibely_token')
      if (!token) {
        setIsLoading(false)
        return
      }

      // Verify token with backend
      const response = await apiService.verifyToken()
      if (response.success && response.data?.user) {
        setUser(response.data.user)
        // Update localStorage with fresh user data
        localStorage.setItem('vibely_user', JSON.stringify(response.data.user))
      } else {
        // Token is invalid, clear storage
        localStorage.removeItem('vibely_token')
        localStorage.removeItem('vibely_user')
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      // Clear invalid tokens
      localStorage.removeItem('vibely_token')
      localStorage.removeItem('vibely_user')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('AuthContext: Starting login process');
      const response = await apiService.login({ email, password })
      console.log('AuthContext: Login response:', response);
      
      if (response.success && response.data?.user) {
        setUser(response.data.user)
        console.log('AuthContext: Login successful, user set');
        return true
      } else {
        const errorMsg = response.message || 'Login failed'
        console.log('AuthContext: Login failed:', errorMsg);
        setError(errorMsg)
        return false
      }
    } catch (error: any) {
      console.error('AuthContext: Login error:', error)
      setError(error.message || 'Login failed. Please try again.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await apiService.register({
        firstName,
        lastName,
        email,
        password
      })
      
      if (response.success && response.data?.user) {
        setUser(response.data.user)
        return true
      } else {
        setError(response.message || 'Registration failed')
        return false
      }
    } catch (error: any) {
      console.error('Signup error:', error)
      setError(error.message || 'Registration failed. Please try again.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)
      await apiService.logout()
    } catch (error) {
      console.error('Logout error:', error)
      // Continue with logout even if API call fails
    } finally {
      setUser(null)
      setIsLoading(false)
    }
  }

  const updateProfile = async (profileData: { firstName?: string; lastName?: string; email?: string }): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await apiService.updateProfile(profileData)
      
      if (response.success && response.data?.user) {
        setUser(response.data.user)
        return true
      } else {
        setError(response.message || 'Profile update failed')
        return false
      }
    } catch (error: any) {
      console.error('Profile update error:', error)
      setError(error.message || 'Profile update failed. Please try again.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      updateProfile,
      isLoading, 
      error, 
      clearError 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}