/**
 * Skeleton Component - Vibely Design System
 * Premium loading skeleton with shimmer animation
 */

import { forwardRef, type HTMLAttributes } from 'react'
import { motion } from 'framer-motion'
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

// Skeleton variants
const skeletonVariants = {
  base: 'animate-pulse rounded-lg',
  
  variants: {
    default: 'bg-gray-200',
    glass: 'backdrop-blur-xl border border-white/20',
    shimmer: 'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer',
  },
  
  shapes: {
    rectangle: 'rounded-lg',
    circle: 'rounded-full',
    text: 'rounded-md',
  },
} as const

export interface SkeletonProps 
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
    Omit<MotionProps, 'children'> {
  variant?: keyof typeof skeletonVariants.variants
  shape?: keyof typeof skeletonVariants.shapes
  width?: string | number
  height?: string | number
  lines?: number
  avatar?: boolean
  children?: React.ReactNode
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({
    variant = 'default',
    shape = 'rectangle',
    width,
    height,
    lines,
    avatar = false,
    className,
    children,
    style,
    ...props
  }, ref) => {
    // Generate glass styles
    const getGlassStyles = () => {
      if (variant === 'glass') {
        return {
          background: 'var(--glass-bg)',
          borderColor: 'var(--glass-border)',
        }
      }
      return {}
    }

    // If lines prop is provided, render multiple text lines
    if (lines && lines > 1) {
      return (
        <motion.div
          ref={ref}
          className={cn('space-y-3', className)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          {...props}
        >
          {Array.from({ length: lines }).map((_, index) => (
            <motion.div
              key={index}
              className={cn(
                skeletonVariants.base,
                skeletonVariants.variants[variant],
                'h-4'
              )}
              style={{
                width: index === lines - 1 ? '75%' : '100%',
                ...getGlassStyles(),
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            />
          ))}
        </motion.div>
      )
    }

    // Avatar skeleton
    if (avatar) {
      return (
        <motion.div
          ref={ref}
          className={cn('flex items-center space-x-4', className)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          {...props}
        >
          {/* Avatar circle */}
          <motion.div
            className={cn(
              skeletonVariants.base,
              skeletonVariants.variants[variant],
              'w-12 h-12 rounded-full'
            )}
            style={getGlassStyles()}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          />
          
          {/* Text lines */}
          <div className="flex-1 space-y-2">
            <motion.div
              className={cn(
                skeletonVariants.base,
                skeletonVariants.variants[variant],
                'h-4 w-3/4'
              )}
              style={getGlassStyles()}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            />
            <motion.div
              className={cn(
                skeletonVariants.base,
                skeletonVariants.variants[variant],
                'h-3 w-1/2'
              )}
              style={getGlassStyles()}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            />
          </div>
        </motion.div>
      )
    }

    // Single skeleton element
    return (
      <motion.div
        ref={ref}
        className={cn(
          skeletonVariants.base,
          skeletonVariants.variants[variant],
          skeletonVariants.shapes[shape],
          className
        )}
        style={{
          width,
          height,
          ...getGlassStyles(),
          ...style,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Skeleton.displayName = 'Skeleton'

// Skeleton presets for common use cases
export const SkeletonCard = forwardRef<HTMLDivElement, Omit<SkeletonProps, 'children'>>(
  ({ className, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn('p-6 space-y-4', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {/* Header */}
      <div className="space-y-2">
        <Skeleton height="24px" width="60%" />
        <Skeleton height="16px" width="40%" />
      </div>
      
      {/* Content */}
      <div className="space-y-2">
        <Skeleton height="16px" width="100%" />
        <Skeleton height="16px" width="90%" />
        <Skeleton height="16px" width="75%" />
      </div>
      
      {/* Footer */}
      <div className="flex justify-between items-center pt-4">
        <Skeleton height="32px" width="80px" shape="rectangle" />
        <Skeleton height="32px" width="32px" shape="circle" />
      </div>
    </motion.div>
  )
)

SkeletonCard.displayName = 'SkeletonCard'

export const SkeletonPost = forwardRef<HTMLDivElement, Omit<SkeletonProps, 'children'>>(
  ({ className, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn('p-6 space-y-4', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {/* User info */}
      <div className="flex items-center space-x-3">
        <Skeleton height="40px" width="40px" shape="circle" />
        <div className="space-y-1">
          <Skeleton height="16px" width="120px" />
          <Skeleton height="12px" width="80px" />
        </div>
      </div>
      
      {/* Post content */}
      <div className="space-y-2">
        <Skeleton height="16px" width="100%" />
        <Skeleton height="16px" width="85%" />
        <Skeleton height="16px" width="60%" />
      </div>
      
      {/* Post image */}
      <Skeleton height="200px" width="100%" />
      
      {/* Actions */}
      <div className="flex items-center space-x-4 pt-2">
        <Skeleton height="32px" width="60px" />
        <Skeleton height="32px" width="60px" />
        <Skeleton height="32px" width="60px" />
      </div>
    </motion.div>
  )
)

SkeletonPost.displayName = 'SkeletonPost'