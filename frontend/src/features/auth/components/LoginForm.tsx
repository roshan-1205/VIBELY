/**
 * LoginForm Component - Premium Login Experience
 * Glassmorphism UI with smooth animations and validation
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth, useAuthValidation } from '../hooks/useAuth'
import { AuthLayout, AuthError, AuthSpinner } from './AuthLayout'
import { buttonTap, hwAcceleration } from '@/core'
import type { LoginRequest } from '../types/auth.types'

export function LoginForm() {
  const { login, isLoginPending, error, clearError } = useAuth()
  const { validateLoginForm } = useAuthValidation()

  // Form state
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
    rememberMe: false,
  })

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    clearError()
    setFieldErrors({})

    // Validate form
    const validation = validateLoginForm(formData)
    if (!validation.isValid) {
      setFieldErrors(validation.errors)
      return
    }

    // Submit login
    login(formData)
  }

  // Handle input changes
  const handleChange = (field: keyof LoginRequest, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Global Error */}
        <AuthError 
          error={error?.message || null} 
          onDismiss={clearError}
        />

        {/* Email Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email address
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`
                w-full px-4 py-3 bg-white/50 backdrop-blur-sm border rounded-xl
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all duration-200 placeholder-gray-400
                ${fieldErrors.email 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
              placeholder="Enter your email"
              disabled={isLoginPending}
              style={hwAcceleration}
            />
            
            {/* Email Icon */}
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
          </div>
          
          {fieldErrors.email && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 text-sm text-red-600"
            >
              {fieldErrors.email}
            </motion.p>
          )}
        </motion.div>

        {/* Password Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className={`
                w-full px-4 py-3 pr-12 bg-white/50 backdrop-blur-sm border rounded-xl
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all duration-200 placeholder-gray-400
                ${fieldErrors.password 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
              placeholder="Enter your password"
              disabled={isLoginPending}
              style={hwAcceleration}
            />
            
            {/* Password Toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoginPending}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          
          {fieldErrors.password && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 text-sm text-red-600"
            >
              {fieldErrors.password}
            </motion.p>
          )}
        </motion.div>

        {/* Remember Me & Forgot Password */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between"
        >
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => handleChange('rememberMe', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-white/50 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              disabled={isLoginPending}
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>

          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Forgot password?
          </Link>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          {...buttonTap}
          style={hwAcceleration}
          type="submit"
          disabled={isLoginPending}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`
            w-full py-3 px-4 rounded-xl font-medium text-white
            bg-gradient-to-r from-blue-600 to-purple-600
            hover:from-blue-700 hover:to-purple-700
            focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200 shadow-lg hover:shadow-xl
            ${isLoginPending ? 'cursor-not-allowed' : ''}
          `}
          whileHover={!isLoginPending ? { scale: 1.02 } : {}}
        >
          {isLoginPending ? (
            <div className="flex items-center justify-center gap-2">
              <AuthSpinner size="sm" />
              <span>Signing in...</span>
            </div>
          ) : (
            'Sign in'
          )}
        </motion.button>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white/80 text-gray-500">Or continue with</span>
          </div>
        </motion.div>

        {/* OAuth Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-3"
        >
          <OAuthButton
            provider="google"
            disabled={isLoginPending}
          />
          <OAuthButton
            provider="github"
            disabled={isLoginPending}
          />
        </motion.div>

        {/* Sign Up Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </form>
    </AuthLayout>
  )
}

/**
 * OAuth button component
 */
function OAuthButton({ 
  provider, 
  disabled 
}: { 
  provider: 'google' | 'github'
  disabled: boolean 
}) {
  const providerConfig = {
    google: {
      name: 'Google',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
    },
    github: {
      name: 'GitHub',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
    },
  }

  const config = providerConfig[provider]

  const handleOAuthLogin = () => {
    // In a real app, this would redirect to OAuth provider
    console.log(`OAuth login with ${provider}`)
  }

  return (
    <motion.button
      {...buttonTap}
      style={hwAcceleration}
      type="button"
      onClick={handleOAuthLogin}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-2 py-2.5 px-4 
        bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl
        hover:bg-white/70 hover:border-gray-300
        focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200 text-sm font-medium text-gray-700
      `}
      whileHover={!disabled ? { scale: 1.02 } : {}}
    >
      {config.icon}
      <span>{config.name}</span>
    </motion.button>
  )
}