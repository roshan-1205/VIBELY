/**
 * AuthDemo Component - Showcase Authentication System
 * Demonstrates the secure auth features
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth, useIsAuthenticated, useAuthUser, debugAuthState } from '@/features/auth'
import { hwAcceleration } from '@/core'

/**
 * Demo component showcasing the auth system
 */
export function AuthDemo() {
  const { logout } = useAuth()
  const isAuthenticated = useIsAuthenticated()
  const user = useAuthUser()
  const [showDebug, setShowDebug] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Secure Authentication System
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Production-ready authentication with Zustand, TanStack Query, and premium UX. 
            Features secure token management, route protection, and glassmorphism design.
          </motion.p>
        </div>

        {/* Auth Status */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl p-8"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Authentication Status
          </h2>

          {isAuthenticated ? (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-200">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900">
                    ✅ Authenticated as {user?.name}
                  </h3>
                  <p className="text-green-700 text-sm">
                    Email: {user?.email} • Role: {user?.role} • Verified: {user?.isVerified ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  Sign Out
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDebug(!showDebug)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
                >
                  {showDebug ? 'Hide' : 'Show'} Debug Info
                </motion.button>
              </div>

              {/* Debug Info */}
              {showDebug && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-gray-100 rounded-xl"
                >
                  <h4 className="font-medium text-gray-900 mb-2">Debug Information</h4>
                  <button
                    onClick={debugAuthState}
                    className="text-sm text-blue-600 hover:text-blue-700 underline"
                  >
                    Log Auth State to Console
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Not Authenticated */}
              <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-2xl border border-yellow-200">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-900">
                    ⚠️ Not Authenticated
                  </h3>
                  <p className="text-yellow-700 text-sm">
                    Please sign in to access protected features
                  </p>
                </div>
              </div>

              {/* Auth Actions */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  Sign In
                </Link>
                
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {authFeatures.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </motion.div>

        {/* Technical Implementation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl p-8"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Technical Implementation
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Security Features
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  JWT token management
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Automatic token refresh
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Secure token storage
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Route protection
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Role-based access control
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tech Stack
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Zustand (state management)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  TanStack Query (mutations)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Axios (HTTP client)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  Framer Motion (animations)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  React Router (routing)
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Demo Credentials */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-50 rounded-2xl p-6 border border-blue-200"
          >
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Demo Credentials
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Test Login:</h4>
                <p className="text-blue-700">Email: test@example.com</p>
                <p className="text-blue-700">Password: password123</p>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Error Testing:</h4>
                <p className="text-blue-700">Email: fail@example.com (triggers error)</p>
                <p className="text-blue-700">Email: exists@example.com (signup error)</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

/**
 * Feature card component
 */
function FeatureCard({ 
  feature, 
  index 
}: { 
  feature: typeof authFeatures[0]
  index: number 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ y: -5 }}
      style={hwAcceleration}
    >
      <div className="space-y-4">
        {/* Icon */}
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl">
          {feature.icon}
        </div>

        {/* Content */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">
            {feature.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {feature.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {feature.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Auth features data
 */
const authFeatures = [
  {
    icon: '🔐',
    title: 'Secure Authentication',
    description: 'JWT-based authentication with automatic token refresh and secure storage using encrypted localStorage.',
    tags: ['Security', 'JWT', 'Encryption'],
  },
  {
    icon: '🛡️',
    title: 'Route Protection',
    description: 'Comprehensive route guards with role-based access control. Automatic redirects for unauthorized access.',
    tags: ['Protection', 'RBAC', 'Guards'],
  },
  {
    icon: '✨',
    title: 'Premium UI/UX',
    description: 'Glassmorphism design with smooth animations, form validation, and micro-interactions throughout.',
    tags: ['Design', 'Animation', 'UX'],
  },
  {
    icon: '⚡',
    title: 'Optimistic Updates',
    description: 'Instant UI feedback with TanStack Query mutations. Automatic error handling and rollback.',
    tags: ['Performance', 'UX', 'Mutations'],
  },
  {
    icon: '🔄',
    title: 'State Management',
    description: 'Zustand-powered auth state with persistence, selectors for optimal re-renders, and dev tools.',
    tags: ['Zustand', 'State', 'Performance'],
  },
  {
    icon: '🌐',
    title: 'API Integration',
    description: 'Axios interceptors for automatic token attachment, error handling, and request/response logging.',
    tags: ['API', 'Interceptors', 'Logging'],
  },
]