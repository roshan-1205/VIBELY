/**
 * AuthGuard Component - Route Protection
 * Secure route protection with role-based access
 */

import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useIsAuthenticated, useUser, useAuthLoading } from '@/core/store/auth.store'
import type { ProtectedRouteProps } from '../types/auth.types'

// Simple loading spinner component
const AuthSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }
  
  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-blue-600 border-t-transparent`} />
  )
}

/**
 * Main auth guard component
 */
export function AuthGuard({ 
  children, 
  requireAuth = true, 
  requireRole,
  fallback 
}: ProtectedRouteProps) {
  const location = useLocation()
  const isAuthenticated = useIsAuthenticated()
  const user = useUser()
  const isLoading = useAuthLoading()

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <AuthSpinner size="lg" />
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </motion.div>
      </div>
    )
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    // Redirect to login with return URL
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    )
  }

  // Check role requirement
  if (requireRole && user && !requireRole.includes(user.username)) { // Using username as role for now
    // Show access denied or redirect to unauthorized page
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Contact your administrator if you believe this is an error.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    )
  }

  // Render protected content
  return <>{children}</>
}

/**
 * Redirect authenticated users away from auth pages
 */
export function GuestGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useIsAuthenticated()
  const isLoading = useAuthLoading()

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <AuthSpinner size="lg" />
      </div>
    )
  }

  // Redirect authenticated users to feed
  if (isAuthenticated) {
    return <Navigate to="/feed" replace />
  }

  // Render guest content (login/signup forms)
  return <>{children}</>
}

/**
 * Role-based component rendering
 */
export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback 
}: { 
  children: React.ReactNode
  allowedRoles: string[]
  fallback?: React.ReactNode 
}) {
  const user = useUser()

  if (!user || !allowedRoles.includes(user.username)) { // Using username as role for now
    return fallback || null
  }

  return <>{children}</>
}

/**
 * Admin-only component wrapper
 */
export function AdminGuard({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  return (
    <RoleGuard allowedRoles={['admin']} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

/**
 * Moderator+ component wrapper
 */
export function ModeratorGuard({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  return (
    <RoleGuard allowedRoles={['admin', 'moderator']} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

/**
 * Hook for checking permissions
 */
export function usePermissions() {
  const user = useUser()
  const isAuthenticated = useIsAuthenticated()

  const hasRole = (role: string) => {
    return user?.username === role // Using username as role for now
  }

  const hasAnyRole = (roles: string[]) => {
    return user ? roles.includes(user.username) : false
  }

  const isAdmin = () => hasRole('admin')
  const isModerator = () => hasAnyRole(['admin', 'moderator'])
  const isUser = () => hasRole('user')

  const canAccess = (requiredRoles?: string[]) => {
    if (!isAuthenticated) return false
    if (!requiredRoles || requiredRoles.length === 0) return true
    return hasAnyRole(requiredRoles)
  }

  return {
    user,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    isAdmin,
    isModerator,
    isUser,
    canAccess,
  }
}

/**
 * Higher-order component for route protection
 */
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    requireAuth?: boolean
    requireRole?: string[]
    fallback?: React.ReactNode
  } = {}
) {
  const WrappedComponent = (props: P) => {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    )
  }

  WrappedComponent.displayName = `withAuthGuard(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

/**
 * Higher-order component for guest-only pages
 */
export function withGuestGuard<P extends object>(
  Component: React.ComponentType<P>
) {
  const WrappedComponent = (props: P) => {
    return (
      <GuestGuard>
        <Component {...props} />
      </GuestGuard>
    )
  }

  WrappedComponent.displayName = `withGuestGuard(${Component.displayName || Component.name})`
  
  return WrappedComponent
}