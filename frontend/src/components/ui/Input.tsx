/**
 * Input Component - Simplified Version
 */

import { forwardRef, type InputHTMLAttributes, useState, useCallback, memo } from 'react'
import { cn } from '@/core/utils'

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

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: keyof typeof inputVariants.variants
  size?: keyof typeof inputVariants.sizes
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  glow?: boolean
}

export const Input = memo(forwardRef<HTMLInputElement, InputProps>(
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
    onFocus,
    onBlur,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false)

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    }, [onFocus])

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }, [onBlur])

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              inputVariants.base,
              inputVariants.variants[variant],
              inputVariants.sizes[size],
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              glow && isFocused && 'shadow-lg shadow-blue-500/25',
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        
        {hint && !error && (
          <p className="text-sm text-gray-500">{hint}</p>
        )}
      </div>
    )
  }
))

Input.displayName = 'Input'