/**
 * FeedError Component - Vibely Social Media Feed
 * Clean error state with retry functionality
 */

import React from 'react'
import { motion } from 'framer-motion'
import { buttonTap, hwAcceleration, fadeInUp } from '@/core'

interface FeedErrorProps {
  error?: Error | null
  onRetry?: () => void
  title?: string
  message?: string
  showRetry?: boolean
}

export function FeedError({
  error,
  onRetry,
  title = 'Something went wrong',
  message,
  showRetry = true,
}: FeedErrorProps) {
  const errorMessage = message || error?.message || 'Unable to load feed. Please try again.'

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      style={hwAcceleration}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      {/* Error Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-16 h-16 mb-6 rounded-full bg-red-100 flex items-center justify-center"
      >
        <svg
          className="w-8 h-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </motion.div>

      {/* Error Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4 max-w-md"
      >
        <h3 className="text-xl font-semibold text-gray-900">
          {title}
        </h3>
        
        <p className="text-gray-600 leading-relaxed">
          {errorMessage}
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && error?.stack && (
          <details className="mt-4 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
              Error Details
            </summary>
            <pre className="mt-2 text-xs text-gray-500 bg-gray-100 p-3 rounded-lg overflow-auto max-h-32">
              {error.stack}
            </pre>
          </details>
        )}
      </motion.div>

      {/* Action Buttons */}
      {showRetry && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 mt-8"
        >
          {onRetry && (
            <motion.button
              {...buttonTap}
              style={hwAcceleration}
              onClick={onRetry}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Try Again
            </motion.button>
          )}
          
          <motion.button
            {...buttonTap}
            style={hwAcceleration}
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Refresh Page
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}

/**
 * Inline error component for smaller error states
 */
export function InlineError({
  message = 'Something went wrong',
  onRetry,
  size = 'md',
}: {
  message?: string
  onRetry?: () => void
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizeClasses = {
    sm: 'py-4 px-4 text-sm',
    md: 'py-6 px-6 text-base',
    lg: 'py-8 px-8 text-lg',
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={hwAcceleration}
      className={`glass-card rounded-2xl text-center ${sizeClasses[size]}`}
    >
      <div className="flex items-center justify-center space-x-2 text-red-600 mb-3">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-medium">Error</span>
      </div>
      
      <p className="text-gray-600 mb-4">{message}</p>
      
      {onRetry && (
        <motion.button
          {...buttonTap}
          style={hwAcceleration}
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Retry
        </motion.button>
      )}
    </motion.div>
  )
}

/**
 * Network error component
 */
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <FeedError
      title="Connection Problem"
      message="Please check your internet connection and try again."
      onRetry={onRetry}
    />
  )
}

/**
 * Empty state component
 */
export function EmptyFeed({ 
  title = 'No posts yet',
  message = 'Follow some accounts to see posts in your feed.',
  actionLabel,
  onAction,
}: {
  title?: string
  message?: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      style={hwAcceleration}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      {/* Empty Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-16 h-16 mb-6 rounded-full bg-gray-100 flex items-center justify-center"
      >
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4 max-w-md"
      >
        <h3 className="text-xl font-semibold text-gray-900">
          {title}
        </h3>
        
        <p className="text-gray-600 leading-relaxed">
          {message}
        </p>
      </motion.div>

      {actionLabel && onAction && (
        <motion.button
          {...buttonTap}
          style={hwAcceleration}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={onAction}
          className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  )
}