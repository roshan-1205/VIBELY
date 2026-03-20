/**
 * Skeleton Component - Vibely Design System
 * Loading placeholder with smooth shimmer animation
 */

import { cn } from '@/core/utils'

interface SkeletonProps {
  className?: string
  variant?: 'default' | 'glass' | 'shimmer'
  width?: string | number
  height?: string | number
  lines?: number
  shape?: 'rectangle' | 'circle'
  avatar?: boolean
}

const skeletonVariants = {
  variants: {
    default: 'bg-gray-200',
    glass: 'bg-white/20 backdrop-blur-sm',
    shimmer: 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse',
  }
}

export function Skeleton({
  className,
  variant = 'default',
  width,
  height,
  lines = 1,
  shape = 'rectangle',
  avatar = false,
}: SkeletonProps) {
  const baseClasses = shape === 'circle' || avatar ? 'rounded-full' : 'rounded-md'
  
  // Avatar preset
  if (avatar) {
    return (
      <div className="flex items-center space-x-3">
        <div
          className={cn(
            'rounded-full',
            skeletonVariants.variants[variant],
            className
          )}
          style={{ width: '40px', height: '40px' }}
        />
        <div className="space-y-2">
          <Skeleton width="120px" height="16px" />
          <Skeleton width="80px" height="14px" />
        </div>
      </div>
    )
  }
  
  const style = {
    width: width,
    height: height || '1rem',
  }

  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              skeletonVariants.variants[variant],
              i === lines - 1 && 'w-3/4', // Last line shorter
              className
            )}
            style={style}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(baseClasses, skeletonVariants.variants[variant], className)}
      style={style}
    />
  )
}

/**
 * Page Skeleton - Full page loading state
 */
export function PageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header skeleton */}
      <div className="flex items-center space-x-4">
        <Skeleton variant="default" width={48} height={48} className="rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton width="200px" height="20px" />
          <Skeleton width="150px" height="16px" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-4">
        <Skeleton width="100%" height="200px" />
        <Skeleton lines={3} />
        <div className="flex space-x-2">
          <Skeleton width="80px" height="32px" />
          <Skeleton width="80px" height="32px" />
        </div>
      </div>
    </div>
  )
}

/**
 * Feed Card Skeleton - Optimized for feed loading
 */
export function FeedCardSkeleton() {
  return (
    <div className="glass-card rounded-3xl p-6 space-y-4">
      {/* User info */}
      <div className="flex items-center space-x-3">
        <Skeleton variant="default" width={40} height={40} className="rounded-full" />
        <div className="space-y-1">
          <Skeleton width="120px" height="16px" />
          <Skeleton width="80px" height="14px" />
        </div>
      </div>
      
      {/* Content */}
      <Skeleton lines={2} />
      
      {/* Image placeholder */}
      <Skeleton width="100%" height="200px" className="rounded-xl" />
      
      {/* Actions */}
      <div className="flex items-center space-x-4">
        <Skeleton width="60px" height="32px" />
        <Skeleton width="60px" height="32px" />
        <Skeleton width="60px" height="32px" />
      </div>
    </div>
  )
}