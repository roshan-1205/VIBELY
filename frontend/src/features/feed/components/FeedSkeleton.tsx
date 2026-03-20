/**
 * FeedSkeleton Component - Vibely Social Media Feed
 * Shimmer loading state that matches FeedCard layout
 */

import React from 'react'
import { motion } from 'framer-motion'
import { hwAcceleration } from '@/core'

interface FeedSkeletonProps {
  count?: number
}

export function FeedSkeleton({ count = 3 }: FeedSkeletonProps) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={index} delay={index * 0.1} />
      ))}
    </div>
  )
}

function SkeletonCard({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      style={hwAcceleration}
      className="glass-card rounded-3xl p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center space-x-3">
        {/* Avatar skeleton */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
        
        <div className="flex-1 space-y-2">
          {/* Username skeleton */}
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-32 animate-pulse" />
          {/* Timestamp skeleton */}
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-20 animate-pulse" />
        </div>
        
        {/* Menu button skeleton */}
        <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse" />
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-3">
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full animate-pulse" />
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-4/5 animate-pulse" />
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/5 animate-pulse" />
      </div>
      
      {/* Media skeleton */}
      <div className="w-full h-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse" />
      
      {/* Actions skeleton */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center space-x-6">
          {/* Like button skeleton */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse" />
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-8 animate-pulse" />
          </div>
          
          {/* Comment button skeleton */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse" />
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-8 animate-pulse" />
          </div>
          
          {/* Share button skeleton */}
          <div className="w-6 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse" />
        </div>
        
        {/* Bookmark skeleton */}
        <div className="w-6 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse" />
      </div>
    </motion.div>
  )
}

/**
 * Inline skeleton for loading states within existing cards
 */
export function InlineSkeleton({ 
  width = 'w-full', 
  height = 'h-4',
  className = '' 
}: { 
  width?: string
  height?: string
  className?: string 
}) {
  return (
    <div 
      className={`bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse ${width} ${height} ${className}`}
    />
  )
}

/**
 * Avatar skeleton component
 */
export function AvatarSkeleton({ size = 'w-12 h-12' }: { size?: string }) {
  return (
    <div 
      className={`bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse ${size}`}
    />
  )
}

/**
 * Media skeleton component
 */
export function MediaSkeleton({ 
  aspectRatio = 'aspect-video',
  className = '' 
}: { 
  aspectRatio?: string
  className?: string 
}) {
  return (
    <div 
      className={`bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse ${aspectRatio} ${className}`}
    />
  )
}