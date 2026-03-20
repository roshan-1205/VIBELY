/**
 * AuthLayout Component - Premium Auth UI Layout
 * Glassmorphism design with smooth animations
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { hwAcceleration } from '@/core'
import type { AuthLayoutProps } from '../types/auth.types'

export function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  showBackButton = false,
  onBack 
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          ease: [0.25, 0.46, 0.45, 0.94] 
        }}
        className="relative w-full max-w-md"
        style={hwAcceleration}
      >
        {/* Glassmorphism Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Gradient Glow */}
          <div 
            className="absolute inset-0 rounded-3xl opacity-20 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
            }}
          />

          {/* Header */}
          <div className="relative px-8 pt-8 pb-6">
            {/* Back Button */}
            {showBackButton && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                onClick={onBack}
                className="mb-4 p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100/50"
                style={hwAcceleration}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
            )}

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-6"
            >
              <Link to="/" className="inline-block">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Vibely
                </h1>
              </Link>
            </motion.div>

            {/* Title & Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {title}
              </h2>
              {subtitle && (
                <p className="text-gray-600 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </motion.div>
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative px-8 pb-8"
          >
            {children}
          </motion.div>
        </div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <Link 
              to="/privacy" 
              className="hover:text-gray-700 transition-colors"
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <Link 
              to="/terms" 
              className="hover:text-gray-700 transition-colors"
            >
              Terms of Service
            </Link>
            <span>•</span>
            <Link 
              to="/help" 
              className="hover:text-gray-700 transition-colors"
            >
              Help
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

/**
 * Compact auth layout for mobile
 */
export function CompactAuthLayout({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 px-4 py-6">
        <div className="text-center">
          <Link to="/">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vibely
            </h1>
          </Link>
          <h2 className="text-lg font-medium text-gray-900 mt-2">
            {title}
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Auth error display component
 */
export function AuthError({ 
  error, 
  onDismiss 
}: { 
  error: string | null
  onDismiss?: () => void 
}) {
  if (!error) return null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl"
    >
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        
        <div className="flex-1">
          <p className="text-sm text-red-700 font-medium">
            {error}
          </p>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  )
}

/**
 * Auth success message component
 */
export function AuthSuccess({ 
  message, 
  onDismiss 
}: { 
  message: string | null
  onDismiss?: () => void 
}) {
  if (!message) return null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl"
    >
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        
        <div className="flex-1">
          <p className="text-sm text-green-700 font-medium">
            {message}
          </p>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-green-400 hover:text-green-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  )
}

/**
 * Loading spinner for auth forms
 */
export function AuthSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizeClasses[size]} border-2 border-current border-t-transparent rounded-full`}
      style={hwAcceleration}
    />
  )
}