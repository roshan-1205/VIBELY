/**
 * SignupForm Component - Premium Registration Experience
 * Glassmorphism UI with validation and smooth animations
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth, useAuthValidation } from '../hooks/useAuth'
import { AuthLayout, AuthError, AuthSpinner } from './AuthLayout'
import { buttonTap, hwAcceleration } from '@/core'
import type { SignupRequest } from '../types/auth.types'

export function SignupForm() {
  const { signup, isSignupPending, error, clearError } = useAuth()
  const { validateSignupForm } = useAuthValidation()

  // Form state
  const [formData, setFormData] = useState<SignupRequest>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  })

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    clearError()
    setFieldErrors({})

    // Validate form
    const validation = validateSignupForm(formData)
    if (!validation.isValid) {
      setFieldErrors(validation.errors)
      return
    }

    // Submit signup
    signup(formData)
  }

  // Handle input changes
  const handleChange = (field: keyof SignupRequest, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Vibely and start sharing your vibe with the world"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Global Error */}
        <AuthError 
          error={error?.message || null} 
          onDismiss={clearError}
        />

        {/* Name Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full name
          </label>
          <div className="relative">
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`
                w-full px-4 py-3 bg-white/50 backdrop-blur-sm border rounded-xl
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all duration-200 placeholder-gray-400
                ${fieldErrors.name 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
              placeholder="Enter your full name"
              disabled={isSignupPending}
              style={hwAcceleration}
            />
            
            {/* Name Icon */}
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          
          {fieldErrors.name && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 text-sm text-red-600"
            >
              {fieldErrors.name}
            </motion.p>
          )}
        </motion.div>

        {/* Email Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
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
              disabled={isSignupPending}
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
          transition={{ delay: 0.3 }}
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
              placeholder="Create a strong password"
              disabled={isSignupPending}
              style={hwAcceleration}
            />
            
            {/* Password Toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isSignupPending}
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

          {/* Password Strength Indicator */}
          {formData.password && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${strengthColors[passwordStrength - 1] || 'bg-gray-200'}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {strengthLabels[passwordStrength - 1] || 'Too short'}
                </span>
              </div>
            </motion.div>
          )}
          
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

        {/* Confirm Password Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              className={`
                w-full px-4 py-3 pr-12 bg-white/50 backdrop-blur-sm border rounded-xl
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all duration-200 placeholder-gray-400
                ${fieldErrors.confirmPassword 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
              placeholder="Confirm your password"
              disabled={isSignupPending}
              style={hwAcceleration}
            />
            
            {/* Password Toggle */}
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isSignupPending}
            >
              {showConfirmPassword ? (
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

            {/* Match Indicator */}
            {formData.confirmPassword && (
              <div className="absolute inset-y-0 right-12 flex items-center pointer-events-none">
                {formData.password === formData.confirmPassword ? (
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            )}
          </div>
          
          {fieldErrors.confirmPassword && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 text-sm text-red-600"
            >
              {fieldErrors.confirmPassword}
            </motion.p>
          )}
        </motion.div>

        {/* Terms & Conditions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) => handleChange('acceptTerms', e.target.checked)}
              className={`
                mt-1 w-4 h-4 text-blue-600 bg-white/50 border-gray-300 rounded 
                focus:ring-blue-500 focus:ring-2
                ${fieldErrors.acceptTerms ? 'border-red-300' : ''}
              `}
              disabled={isSignupPending}
            />
            <span className="text-sm text-gray-600 leading-relaxed">
              I agree to the{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                Privacy Policy
              </Link>
            </span>
          </label>
          
          {fieldErrors.acceptTerms && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 text-sm text-red-600"
            >
              {fieldErrors.acceptTerms}
            </motion.p>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.button
          {...buttonTap}
          style={hwAcceleration}
          type="submit"
          disabled={isSignupPending}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`
            w-full py-3 px-4 rounded-xl font-medium text-white
            bg-gradient-to-r from-blue-600 to-purple-600
            hover:from-blue-700 hover:to-purple-700
            focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200 shadow-lg hover:shadow-xl
            ${isSignupPending ? 'cursor-not-allowed' : ''}
          `}
          whileHover={!isSignupPending ? { scale: 1.02 } : {}}
        >
          {isSignupPending ? (
            <div className="flex items-center justify-center gap-2">
              <AuthSpinner size="sm" />
              <span>Creating account...</span>
            </div>
          ) : (
            'Create account'
          )}
        </motion.button>

        {/* Sign In Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </form>
    </AuthLayout>
  )
}