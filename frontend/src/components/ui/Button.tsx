/**
 * Button Component - Vibely Design System
 * Premium button with multiple variants and motion animations
 */

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { scaleTap } from '@/lib/motion'
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

// Button variants
const buttonVariants = {
  // Base styles
  base: 'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  
  // Size variants
  sizes: {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  },
  
  // Style variants
  variants: {
    primary: 'text-white shadow-lg hover:shadow-xl focus:ring-blue-500/20',
    secondary: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500/20',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500/20',
    glass: 'backdrop-blur-xl border text-gray-700 hover:bg-white/20 focus:ring-blue-500/20',
    outline: 'border-2 bg-transparent hover:bg-gray-50 focus:ring-blue-500/20',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl focus:ring-red-500/20',
    success: 'bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-xl focus:ring-green-500/20',
  },
} as const

export interface ButtonProps 
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'>,
    Omit<MotionProps, 'children'> {
  variant?: keyof typeof buttonVariants.variants
  size?: keyof typeof buttonVariants.sizes
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  children: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    className,
    children,
    ...props
  }, ref) => {
    // Generate dynamic styles for primary variant
    const getPrimaryStyles = () => {
      if (variant === 'primary') {
        return {
          background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-active) 100%)',
        }
      }
      return {}
    }

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

    // Generate outline styles
    const getOutlineStyles = () => {
      if (variant === 'outline') {
        return {
          borderColor: 'var(--accent)',
          color: 'var(--accent)',
        }
      }
      return {}
    }

    return (
      <motion.button
        ref={ref}
        className={cn(
          buttonVariants.base,
          buttonVariants.sizes[size],
          buttonVariants.variants[variant],
          fullWidth && 'w-full',
          className
        )}
        style={{
          ...getPrimaryStyles(),
          ...getGlassStyles(),
          ...getOutlineStyles(),
        }}
        disabled={disabled || loading}
        {...scaleTap}
        {...props}
      >
        {/* Left Icon */}
        {leftIcon && !loading && (
          <span className="flex-shrink-0">
            {leftIcon}
          </span>
        )}
        
        {/* Loading Spinner */}
        {loading && (
          <motion.div
            className="flex-shrink-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </motion.div>
        )}
        
        {/* Button Text */}
        <span className={loading ? 'opacity-70' : ''}>
          {children}
        </span>
        
        {/* Right Icon */}
        {rightIcon && !loading && (
          <span className="flex-shrink-0">
            {rightIcon}
          </span>
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'