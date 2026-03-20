/**
 * Button Component - Simplified Version
 */

import { forwardRef, type ButtonHTMLAttributes, memo } from 'react'
import { cn } from '@/core/utils'

const buttonVariants = {
  base: 'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95',
  
  sizes: {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  },
  
  variants: {
    primary: 'bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl focus:ring-blue-500/20',
    secondary: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500/20',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500/20',
    glass: 'backdrop-blur-xl border border-white/20 text-gray-700 hover:bg-white/20 focus:ring-blue-500/20',
    outline: 'border-2 border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-blue-500/20',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl focus:ring-red-500/20',
    success: 'bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-xl focus:ring-green-500/20',
  },
} as const

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: keyof typeof buttonVariants.variants
  size?: keyof typeof buttonVariants.sizes
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    children,
    className,
    disabled,
    ...props
  }, ref) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          buttonVariants.base,
          buttonVariants.variants[variant],
          buttonVariants.sizes[size],
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        
        {!loading && leftIcon && leftIcon}
        
        {children}
        
        {!loading && rightIcon && rightIcon}
      </button>
    )
  }
))

Button.displayName = 'Button'