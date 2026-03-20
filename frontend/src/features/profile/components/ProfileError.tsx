/**
 * ProfileError Component - Error States
 * Clean error handling with retry functionality
 */

import React from 'react'
import { motion } from 'framer-motion'
import { buttonTap, hwAcceleration } from '@/core'

interface ProfileErrorProps {
  error?: Error | null
  onRetry?: () => void
  type?: 'profile' | 'posts' | 'network' | 'notFound' | 'forbidden'
  className?: string
}

export function ProfileError({ 
  error, 
  onRetry, 
  type = 'profile',
  className = '' 
}: ProfileErrorProps) {
  const errorConfig = getErrorConfig(type, error)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 text-center ${className}`}
      style={hwAcceleration}
    >
      {/* Error Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="mb-6"
      >
        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${errorConfig.iconBg}`}>
          {errorConfig.icon}
        </div>
      </motion.div>

      {/* Error Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {errorConfig.title}
        </h3>
        <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
          {errorConfig.message}
        </p>
        
        {error?.message && type === 'network' && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Technical details
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 rounded-lg text-xs text-gray-700 overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3"
      >
        {onRetry && (
          <motion.button
            {...buttonTap}
            style={hwAcceleration}
            onClick={onRetry}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Try Again</span>
            </div>
          </motion.button>
        )}

        <motion.button
          {...buttonTap}
          style={hwAcceleration}
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200"
          whileHover={{ scale: 1.02 }}
        >
          Go Back
        </motion.button>
      </motion.div>

      {/* Additional Help */}
      {errorConfig.helpText && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 pt-6 border-t border-gray-100"
        >
          <p className="text-sm text-gray-500">
            {errorConfig.helpText}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

/**
 * Compact error for smaller spaces
 */
export function CompactProfileError({ 
  error, 
  onRetry, 
  type = 'profile' 
}: ProfileErrorProps) {
  const errorConfig = getErrorConfig(type, error)

  return (
    <div className="text-center py-8">
      <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 ${errorConfig.iconBg}`}>
        {React.cloneElement(errorConfig.icon, { className: 'w-6 h-6' })}
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {errorConfig.title}
      </h3>
      
      <p className="text-gray-600 text-sm mb-4">
        {errorConfig.message}
      </p>

      {onRetry && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </motion.button>
      )}
    </div>
  )
}

/**
 * Inline error for form fields or small components
 */
export function InlineProfileError({ 
  error, 
  onRetry 
}: { 
  error: string | Error
  onRetry?: () => void 
}) {
  const message = typeof error === 'string' ? error : error.message

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
    >
      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
      
      <span className="flex-1">{message}</span>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-red-600 hover:text-red-800 font-medium underline"
        >
          Retry
        </button>
      )}
    </motion.div>
  )
}

/**
 * Network status error
 */
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-xl shadow-lg max-w-sm"
    >
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        
        <div className="flex-1">
          <h4 className="font-medium mb-1">Connection Lost</h4>
          <p className="text-sm opacity-90">Check your internet connection</p>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  )
}

/**
 * Get error configuration based on type
 */
function getErrorConfig(type: string, error?: Error | null) {
  const configs = {
    profile: {
      title: 'Profile Not Found',
      message: 'This profile may have been deleted or made private.',
      icon: (
        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      iconBg: 'bg-gray-100',
      helpText: 'Try searching for the user or check the URL.',
    },
    posts: {
      title: 'Failed to Load Posts',
      message: 'We couldn\'t load the posts right now. Please try again.',
      icon: (
        <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      iconBg: 'bg-orange-100',
      helpText: 'This might be a temporary issue. Try refreshing the page.',
    },
    network: {
      title: 'Connection Problem',
      message: 'Unable to connect to the server. Check your internet connection and try again.',
      icon: (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
        </svg>
      ),
      iconBg: 'bg-red-100',
      helpText: 'Make sure you\'re connected to the internet.',
    },
    notFound: {
      title: 'Page Not Found',
      message: 'The profile you\'re looking for doesn\'t exist or has been removed.',
      icon: (
        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.239 0-4.236-.18-5.536-.437C7.061 14.754 8 14.139 8 13.407V9.1c0-.718-.936-1.31-2.09-1.31S4 8.382 4 9.1v4.307c0 .732.939 1.347 2.464 1.156C7.764 14.82 9.761 15 12 15s4.236-.18 5.536-.437C18.939 14.754 20 14.139 20 13.407V9.1c0-.718-.936-1.31-2.09-1.31S16 8.382 16 9.1v4.307c0 .732.939 1.347 2.464 1.156z" />
        </svg>
      ),
      iconBg: 'bg-gray-100',
      helpText: 'Double-check the username or try searching for the user.',
    },
    forbidden: {
      title: 'Access Denied',
      message: 'You don\'t have permission to view this profile.',
      icon: (
        <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      iconBg: 'bg-yellow-100',
      helpText: 'This profile may be private or restricted.',
    },
  }

  return configs[type as keyof typeof configs] || configs.profile
}