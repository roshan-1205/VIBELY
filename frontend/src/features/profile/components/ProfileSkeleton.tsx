/**
 * ProfileSkeleton Component - Loading States
 * Shimmer effects for profile loading
 */

import React from 'react'
import { motion } from 'framer-motion'

/**
 * Complete profile page skeleton
 */
export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <ProfileHeaderSkeleton />
      
      {/* Stats Skeleton */}
      <ProfileStatsSkeleton />
      
      {/* Tabs Skeleton */}
      <ProfileTabsSkeleton />
      
      {/* Posts Skeleton */}
      <ProfilePostsSkeleton />
    </div>
  )
}

/**
 * Profile header skeleton
 */
export function ProfileHeaderSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        {/* Avatar Skeleton */}
        <div className="flex flex-col items-center md:items-start">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-200 animate-pulse" />
        </div>

        {/* Info Skeleton */}
        <div className="flex-1 text-center md:text-left">
          <div className="mb-4">
            <div className="h-8 bg-gray-200 rounded-lg animate-pulse mb-2 max-w-xs mx-auto md:mx-0" />
            <div className="h-5 bg-gray-200 rounded-lg animate-pulse max-w-32 mx-auto md:mx-0" />
          </div>
          
          <div className="mb-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 max-w-2xl mx-auto md:mx-0" />
            <div className="h-4 bg-gray-200 rounded animate-pulse max-w-xl mx-auto md:mx-0" />
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-28" />
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <div className="h-10 bg-gray-200 rounded-xl animate-pulse w-32" />
            <div className="h-10 bg-gray-200 rounded-xl animate-pulse w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Profile stats skeleton
 */
export function ProfileStatsSkeleton() {
  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-6">
      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-2 mx-auto w-16" />
            <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto w-12" />
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100/50">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-1 mx-auto w-12" />
            <div className="h-3 bg-gray-200 rounded animate-pulse mx-auto w-16" />
          </div>
          <div>
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-1 mx-auto w-12" />
            <div className="h-3 bg-gray-200 rounded animate-pulse mx-auto w-20" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Profile tabs skeleton
 */
export function ProfileTabsSkeleton() {
  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg">
      <div className="flex">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4"
          >
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Profile posts skeleton
 */
export function ProfilePostsSkeleton({ 
  viewMode = 'grid',
  count = 9 
}: { 
  viewMode?: 'grid' | 'list'
  count?: number 
}) {
  const skeletonItems = Array.from({ length: count })

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-3 gap-4">
        {skeletonItems.map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="aspect-square bg-gray-200 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {skeletonItems.map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-6"
        >
          {/* Content skeleton */}
          <div className="mb-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>

          {/* Media skeleton */}
          {index % 3 === 0 && (
            <div className="mb-4 grid grid-cols-2 gap-2">
              <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
              <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
            </div>
          )}

          {/* Actions skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {Array.from({ length: 3 }).map((_, actionIndex) => (
                <div
                  key={actionIndex}
                  className="flex items-center gap-2"
                >
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-8" />
                </div>
              ))}
            </div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

/**
 * Shimmer effect component
 */
export function ShimmerEffect({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gray-200 ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}

/**
 * Skeleton with shimmer animation
 */
export function SkeletonBox({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '' 
}: { 
  width?: string
  height?: string
  className?: string 
}) {
  return (
    <ShimmerEffect 
      className={`${width} ${height} rounded animate-pulse ${className}`} 
    />
  )
}

/**
 * Avatar skeleton with shimmer
 */
export function AvatarSkeleton({ 
  size = 'w-10 h-10',
  className = '' 
}: { 
  size?: string
  className?: string 
}) {
  return (
    <ShimmerEffect 
      className={`${size} rounded-full animate-pulse ${className}`} 
    />
  )
}

/**
 * Card skeleton with shimmer
 */
export function CardSkeleton({ 
  children,
  className = '' 
}: { 
  children?: React.ReactNode
  className?: string 
}) {
  return (
    <div className={`bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-6 ${className}`}>
      {children || (
        <div className="space-y-4">
          <SkeletonBox height="h-6" width="w-3/4" />
          <SkeletonBox height="h-4" width="w-full" />
          <SkeletonBox height="h-4" width="w-2/3" />
        </div>
      )}
    </div>
  )
}