"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { apiService, type User } from '@/services/api'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, firstName: string, lastName: string, phone?: string, location?: string, coordinates?: { latitude: number; longitude: number }) => Promise<boolean>
  logout: () => Promise<void>
  updateProfile: (profileData: { firstName?: string; lastName?: string; email?: string; phone?: string; location?: string; coordinates?: { latitude: number; longitude: number } }) => Promise<boolean>
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
        console.log('AuthContext: User initialized from token:', response.data.user.email)
        // Update localStorage with fresh user data
        localStorage.setItem('vibely_user', JSON.stringify(response.data.user))
      } else {
        // Token is invalid, clear storage
        console.log('AuthContext: Invalid token, clearing storage')
        localStorage.removeItem('vibely_token')
        localStorage.removeItem('vibely_user')
        setUser(null)
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      // Clear invalid tokens
      localStorage.removeItem('vibely_token')
      localStorage.removeItem('vibely_user')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('AuthContext: Starting login process for:', email);
      const response = await apiService.login({ email, password })
      console.log('AuthContext: Login response:', response);
      
      if (response.success && response.data?.user && response.data?.token) {
        // Set user state immediately
        setUser(response.data.user)
        console.log('AuthContext: Login successful, user set:', response.data.user.email);
        
        // Ensure localStorage is updated (apiService should have done this, but double-check)
        localStorage.setItem('vibely_token', response.data.token)
        localStorage.setItem('vibely_user', JSON.stringify(response.data.user))
        
        return true
      } else {
        const errorMsg = response.message || 'Login failed'
        console.log('AuthContext: Login failed:', errorMsg);
        setError(errorMsg)
        setUser(null)
        return false
      }
    } catch (error: any) {
      console.error('AuthContext: Login error:', error)
      setError(error.message || 'Login failed. Please try again.')
      setUser(null)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    phone?: string, 
    location?: string, 
    coordinates?: { latitude: number; longitude: number }
  ): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('AuthContext: Starting signup process for:', email);
      const response = await apiService.register({
        firstName,
        lastName,
        email,
        password,
        phone,
        location,
        coordinates
      })
      console.log('AuthContext: Signup response:', response);
      
      if (response.success && response.data?.user && response.data?.token) {
        // Set user state immediately
        setUser(response.data.user)
        console.log('AuthContext: Signup successful, user set:', response.data.user.email);
        
        // Ensure localStorage is updated (apiService should have done this, but double-check)
        localStorage.setItem('vibely_token', response.data.token)
        localStorage.setItem('vibely_user', JSON.stringify(response.data.user))
        
        return true
      } else {
        const errorMsg = response.message || 'Registration failed'
        console.log('AuthContext: Signup failed:', errorMsg);
        setError(errorMsg)
        setUser(null)
        return false
      }
    } catch (error: any) {
      console.error('AuthContext: Signup error:', error)
      setError(error.message || 'Registration failed. Please try again.')
      setUser(null)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)
      console.log('AuthContext: Starting logout process')
      
      // Call API logout (this will clear localStorage)
      await apiService.logout()
      
      // Clear user state
      setUser(null)
      setError(null)
      console.log('AuthContext: Logout successful, user cleared')
    } catch (error) {
      console.error('Logout error:', error)
      // Continue with logout even if API call fails
      // Clear local state and storage
      setUser(null)
      setError(null)
      localStorage.removeItem('vibely_token')
      localStorage.removeItem('vibely_user')
    } finally {
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