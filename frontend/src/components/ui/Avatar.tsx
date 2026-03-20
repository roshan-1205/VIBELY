/**
 * Avatar Component - Simplified Version
 */

import { forwardRef, type HTMLAttributes, useState, useCallback, memo } from 'react'
import { cn } from '@/core/utils'

const avatarVariants = {
  base: 'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br font-medium text-white select-none',
  
  sizes: {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
    '3xl': 'w-24 h-24 text-3xl',
  },
  
  variants: {
    default: 'from-gray-400 to-gray-600',
    primary: 'from-blue-400 to-blue-600',
    success: 'from-green-400 to-green-600',
    warning: 'from-yellow-400 to-yellow-600',
    danger: 'from-red-400 to-red-600',
    vibe: 'from-purple-400 to-pink-600',
  },
} as const

const statusVariants = {
  online: 'bg-green-500',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
  offline: 'bg-gray-400',
} as const

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  size?: keyof typeof avatarVariants.sizes
  variant?: keyof typeof avatarVariants.variants
  fallback?: string
  interactive?: boolean
  status?: keyof typeof statusVariants
  hover?: boolean
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const Avatar = memo(forwardRef<HTMLDivElement, AvatarProps>(
  ({
    src,
    alt = '',
    size = 'md',
    variant = 'default',
    fallback,
    interactive = false,
    status,
    hover = false,
    className,
    ...props
  }, ref) => {
    const [imageError, setImageError] = useState(false)

    const handleImageError = useCallback(() => {
      setImageError(true)
    }, [])

    const initials = fallback ? getInitials(fallback) : alt ? getInitials(alt) : '?'

    return (
      <div
        ref={ref}
        className={cn(
          avatarVariants.base,
          avatarVariants.sizes[size],
          !src || imageError ? avatarVariants.variants[variant] : '',
          (interactive || hover) && 'cursor-pointer hover:scale-105 transition-transform',
          className
        )}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <span className="font-semibold">
            {initials}
          </span>
        )}
        
        {/* Status indicator */}
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
              statusVariants[status],
              size === 'xs' && 'w-2 h-2',
              size === 'sm' && 'w-2.5 h-2.5',
              size === 'md' && 'w-3 h-3',
              size === 'lg' && 'w-3.5 h-3.5',
              size === 'xl' && 'w-4 h-4',
              (size === '2xl' || size === '3xl') && 'w-5 h-5'
            )}
          />
        )}
      </div>
    )
  }
))

Avatar.displayName = 'Avatar'

// Avatar Group Component
export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  max?: number
  spacing?: 'tight' | 'normal' | 'loose'
  children: React.ReactElement<AvatarProps>[]
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ max = 5, spacing = 'normal', children, className, ...props }, ref) => {
    const avatars = Array.isArray(children) ? children : [children]
    const visibleAvatars = avatars.slice(0, max)
    const remainingCount = avatars.length - max

    const spacingClasses = {
      tight: '-space-x-1',
      normal: '-space-x-2',
      loose: '-space-x-1',
    }

    return (
      <div
        ref={ref}
        className={cn('flex items-center', spacingClasses[spacing], className)}
        {...props}
      >
        {visibleAvatars.map((avatar, index) => (
          <div key={index} className="relative">
            {avatar}
          </div>
        ))}
        
        {remainingCount > 0 && (
          <Avatar
            fallback={`+${remainingCount}`}
            variant="default"
            className="border-2 border-white"
          />
        )}
      </div>
    )
  }
)

AvatarGroup.displayName = 'AvatarGroup'