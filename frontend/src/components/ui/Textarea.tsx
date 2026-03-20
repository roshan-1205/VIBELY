/**
 * Textarea Component - Vibely Design System
 * Premium textarea with glassmorphism effects and smooth animations
 */

import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/core/utils'

const textareaVariants = {
  base: 'w-full rounded-xl border transition-all duration-300 resize-none focus:outline-none focus:ring-2 focus:ring-offset-2',
  
  variants: {
    default: 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500/20',
    glass: 'border-white/20 bg-white/10 backdrop-blur-xl focus:border-blue-400/50 focus:ring-blue-400/20',
    filled: 'border-transparent bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20',
    outline: 'border-2 border-gray-300 bg-transparent focus:border-blue-500 focus:ring-blue-500/20',
  },
  
  sizes: {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  },
} as const

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: keyof typeof textareaVariants.variants
  size?: keyof typeof textareaVariants.sizes
  label?: string
  hint?: string
  error?: string
  glow?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    variant = 'default',
    size = 'md',
    label,
    hint,
    error,
    glow = false,
    className,
    ...props
  }, ref) => {
    const getGlowStyles = () => {
      if (glow) {
        return {
          boxShadow: '0 0 20px var(--vibe-glow, rgba(59, 130, 246, 0.3))',
        }
      }
      return {}
    }

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          className={cn(
            textareaVariants.base,
            textareaVariants.variants[variant],
            textareaVariants.sizes[size],
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          style={getGlowStyles()}
          {...props}
        />
        
        {(hint || error) && (
          <p className={cn(
            'text-sm',
            error ? 'text-red-600' : 'text-gray-500'
          )}>
            {error || hint}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'