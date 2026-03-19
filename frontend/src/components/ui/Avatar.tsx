/**
 * Avatar Component - Vibely Design System
 * Premium avatar with fallback initials and status indicators
 */

import { forwardRef, type HTMLAttributes, useState } from 'react'
import { motion } from 'framer-motion'
import { scaleIn, hoverScale } from '@/lib/motion'
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

// Avatar variants
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

// Status indicator variants
const statusVariants = {
  base: 'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
  
  sizes: {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
    '3xl': 'w-6 h-6',
  },
  
  status: {
    online: 'bg-green-400',
    offline: 'bg-gray-400',
    away: 'bg-yellow-400',
    busy: 'bg-red-400',
  },
} as const

export interface AvatarProps 
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
    Omit<MotionProps, 'children'> {
  src?: string
  alt?: string
  fallback?: string
  size?: keyof typeof avatarVariants.sizes
  variant?: keyof typeof avatarVariants.variants
  status?: keyof typeof statusVariants.status
  hover?: boolean
  ring?: boolean
  children?: React.ReactNode
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({
    src,
    alt,
    fallback,
    size = 'md',
    variant = 'default',
    status,
    hover = false,
    ring = false,
    className,
    children,
    ...props
  }, ref) => {
    const [imageError, setImageError] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)

    // Generate initials from fallback text
    const getInitials = (text?: string) => {
      if (!text) return '?'
      return text
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    // Handle image load error
    const handleImageError = () => {
      setImageError(true)
    }

    // Handle image load success
    const handleImageLoad = () => {
      setImageLoaded(true)
    }

    const motionProps = hover ? hoverScale : {}

    return (
      <motion.div
        ref={ref}
        className={cn(
          avatarVariants.base,
          avatarVariants.sizes[size],
          avatarVariants.variants[variant],
          ring && 'ring-2 ring-white/20',
          className
        )}
        variants={scaleIn}
        {...motionProps}
        {...props}
      >
        {/* Image */}
        {src && !imageError && (
          <motion.img
            src={src}
            alt={alt || 'Avatar'}
            className="w-full h-full object-cover"
            onError={handleImageError}
            onLoad={handleImageLoad}
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
        
        {/* Fallback initials or children */}
        {(imageError || !src) && (
          <motion.span
            className="font-semibold"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {children || getInitials(fallback)}
          </motion.span>
        )}
        
        {/* Status indicator */}
        {status && (
          <motion.span
            className={cn(
              statusVariants.base,
              statusVariants.sizes[size],
              statusVariants.status[status]
            )}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
      </motion.div>
    )
  }
)

Avatar.displayName = 'Avatar'

// Avatar Group Component
export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  max?: number
  spacing?: 'tight' | 'normal' | 'loose'
  size?: keyof typeof avatarVariants.sizes
  children: React.ReactNode
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({
    max = 5,
    spacing = 'normal',
    size = 'md',
    className,
    children,
    ...props
  }, ref) => {
    const spacingMap = {
      tight: '-space-x-1',
      normal: '-space-x-2',
      loose: '-space-x-3',
    }

    const childrenArray = Array.isArray(children) ? children : [children]
    const visibleChildren = childrenArray.slice(0, max)
    const remainingCount = Math.max(0, childrenArray.length - max)

    return (
      <div
        ref={ref}
        className={cn('flex items-center', spacingMap[spacing], className)}
        {...props}
      >
        {visibleChildren.map((child, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {child}
          </motion.div>
        ))}
        
        {/* Remaining count indicator */}
        {remainingCount > 0 && (
          <motion.div
            className={cn(
              avatarVariants.base,
              avatarVariants.sizes[size],
              'bg-gray-500 text-white font-semibold'
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: visibleChildren.length * 0.1 }}
          >
            +{remainingCount}
          </motion.div>
        )}
      </div>
    )
  }
)

AvatarGroup.displayName = 'AvatarGroup'