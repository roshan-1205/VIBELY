/**
 * Input Component - Vibely Design System
 * Premium input with focus glow and smooth animations
 */

import { forwardRef, type InputHTMLAttributes, useState } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/motion'
import { cn } from '@/core/utils'

// Define motion props locally to avoid Framer Motion export issues
type MotionProps = {
  initial?: object
  animate?: object
  exit?: object
  whileHover?: object
  whileTap?: object
  transition?: object
  variants?: object
}

// Input variants
const inputVariants = {
  base: 'flex w-full rounded-xl border bg-transparent px-4 py-3 text-base transition-all duration-200 placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  
  variants: {
    default: 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
    glass: 'backdrop-blur-xl border-white/20 focus:border-white/40 focus:ring-2 focus:ring-blue-500/20',
    outline: 'border-2 border-gray-300 focus:border-blue-500',
    filled: 'border-transparent bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
  },
  
  sizes: {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  },
} as const

export interface InputProps 
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    Omit<MotionProps, 'children'> {
  variant?: keyof typeof inputVariants.variants
  size?: keyof typeof inputVariants.sizes
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  glow?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    variant = 'default',
    size = 'md',
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    glow = false,
    className,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false)

    // Generate glass styles
    const getGlassStyles = () => {
      if (variant === 'glass') {
        return {
          background: 'var(--glass-bg)',
          borderColor: 'var(--glass-border)',
          color: 'var(--text-primary)',
        }
      }
      return {}
    }

    // Generate glow styles
    const getGlowStyles = () => {
      if (glow && isFocused) {
        return {
          boxShadow: '0 0 20px var(--vibe-glow)',
        }
      }
      return {}
    }

    return (
      <motion.div
        className="w-full"
        variants={fadeInUp}
      >
        {/* Label */}
        {label && (
          <motion.label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--text-primary)' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {label}
          </motion.label>
        )}
        
        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          {/* Input Field */}
          <motion.input
            ref={ref}
            className={cn(
              inputVariants.base,
              inputVariants.variants[variant],
              inputVariants.sizes[size],
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            style={{
              ...getGlassStyles(),
              ...getGlowStyles(),
            }}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            {...props}
          />
          
          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
          
          {/* Focus Ring Animation */}
          {isFocused && (
            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                boxShadow: '0 0 0 2px var(--focus-ring)',
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </div>
        
        {/* Error Message */}
        {error && (
          <motion.p
            className="mt-2 text-sm text-red-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {error}
          </motion.p>
        )}
        
        {/* Hint Text */}
        {hint && !error && (
          <motion.p
            className="mt-2 text-sm"
            style={{ color: 'var(--text-secondary)' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {hint}
          </motion.p>
        )}
      </motion.div>
    )
  }
)

Input.displayName = 'Input'

// Textarea Component
export interface TextareaProps 
  extends Omit<InputHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    Omit<MotionProps, 'children'> {
  variant?: keyof typeof inputVariants.variants
  size?: keyof typeof inputVariants.sizes
  label?: string
  error?: string
  hint?: string
  rows?: number
  glow?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    variant = 'default',
    size = 'md',
    label,
    error,
    hint,
    rows = 4,
    glow = false,
    className,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false)

    // Generate glass styles
    const getGlassStyles = () => {
      if (variant === 'glass') {
        return {
          background: 'var(--glass-bg)',
          borderColor: 'var(--glass-border)',
          color: 'var(--text-primary)',
        }
      }
      return {}
    }

    // Generate glow styles
    const getGlowStyles = () => {
      if (glow && isFocused) {
        return {
          boxShadow: '0 0 20px var(--vibe-glow)',
        }
      }
      return {}
    }

    return (
      <motion.div
        className="w-full"
        variants={fadeInUp}
      >
        {/* Label */}
        {label && (
          <motion.label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--text-primary)' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {label}
          </motion.label>
        )}
        
        {/* Textarea Container */}
        <div className="relative">
          {/* Textarea Field */}
          <motion.textarea
            ref={ref}
            rows={rows}
            className={cn(
              inputVariants.base,
              inputVariants.variants[variant],
              inputVariants.sizes[size],
              'resize-none',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            style={{
              ...getGlassStyles(),
              ...getGlowStyles(),
            }}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            {...props}
          />
          
          {/* Focus Ring Animation */}
          {isFocused && (
            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                boxShadow: '0 0 0 2px var(--focus-ring)',
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </div>
        
        {/* Error Message */}
        {error && (
          <motion.p
            className="mt-2 text-sm text-red-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {error}
          </motion.p>
        )}
        
        {/* Hint Text */}
        {hint && !error && (
          <motion.p
            className="mt-2 text-sm"
            style={{ color: 'var(--text-secondary)' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {hint}
          </motion.p>
        )}
      </motion.div>
    )
  }
)

Textarea.displayName = 'Textarea'