/**
 * ProfileStats Component - Clean Stats Display
 * Posts, followers, following with hover interactions
 */

import React from 'react'
import { motion } from 'framer-motion'
import { hwAcceleration } from '@/core'
import type { ProfileStats as ProfileStatsType } from '../types/profile.types'

interface ProfileStatsProps {
  stats: ProfileStatsType
  onStatsClick?: (type: 'posts' | 'followers' | 'following') => void
  className?: string
}

export function ProfileStats({ stats, onStatsClick, className = '' }: ProfileStatsProps) {
  const statsData = [
    {
      key: 'posts' as const,
      label: 'Posts',
      value: stats.postsCount,
      color: 'text-blue-600',
    },
    {
      key: 'followers' as const,
      label: 'Followers',
      value: stats.followersCount,
      color: 'text-purple-600',
    },
    {
      key: 'following' as const,
      label: 'Following',
      value: stats.followingCount,
      color: 'text-green-600',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-6 ${className}`}
      style={hwAcceleration}
    >
      <div className="grid grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            whileHover={{ 
              scale: onStatsClick ? 1.05 : 1.02,
              y: -2,
            }}
            onClick={() => onStatsClick?.(stat.key)}
            className={`
              text-center transition-all duration-200
              ${onStatsClick ? 'cursor-pointer' : ''}
            `}
            style={hwAcceleration}
          >
            {/* Value */}
            <motion.div
              className={`text-2xl md:text-3xl font-bold ${stat.color} mb-1`}
              whileHover={onStatsClick ? { scale: 1.1 } : {}}
            >
              {formatNumber(stat.value)}
            </motion.div>

            {/* Label */}
            <div className="text-sm font-medium text-gray-600">
              {stat.label}
            </div>

            {/* Hover Indicator */}
            {onStatsClick && (
              <motion.div
                className="h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 mt-2"
                whileHover={{ opacity: 1 }}
                style={{ color: stat.color.replace('text-', '') }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Additional Stats (Optional) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 pt-6 border-t border-gray-100/50"
      >
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-700">
              {formatNumber(stats.likesCount)}
            </div>
            <div className="text-xs text-gray-500">Total Likes</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-700">
              {formatNumber(stats.viewsCount)}
            </div>
            <div className="text-xs text-gray-500">Profile Views</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/**
 * Compact stats for smaller spaces
 */
export function CompactProfileStats({ stats, onStatsClick }: ProfileStatsProps) {
  const statsData = [
    { key: 'posts' as const, label: 'Posts', value: stats.postsCount },
    { key: 'followers' as const, label: 'Followers', value: stats.followersCount },
    { key: 'following' as const, label: 'Following', value: stats.followingCount },
  ]

  return (
    <div className="flex items-center justify-center gap-8">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 * index }}
          whileHover={{ scale: onStatsClick ? 1.05 : 1.02 }}
          onClick={() => onStatsClick?.(stat.key)}
          className={`
            text-center transition-all duration-200
            ${onStatsClick ? 'cursor-pointer' : ''}
          `}
          style={hwAcceleration}
        >
          <div className="text-xl font-bold text-gray-900 mb-1">
            {formatNumber(stat.value)}
          </div>
          <div className="text-sm text-gray-600">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

/**
 * Animated counter for stats
 */
export function AnimatedStatCounter({ 
  value, 
  duration = 1000,
  className = '' 
}: { 
  value: number
  duration?: number
  className?: string 
}) {
  const [displayValue, setDisplayValue] = React.useState(0)

  React.useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      
      setDisplayValue(Math.floor(value * easeOutQuart))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [value, duration])

  return (
    <span className={className}>
      {formatNumber(displayValue)}
    </span>
  )
}

/**
 * Stats with growth indicators
 */
export function ProfileStatsWithGrowth({ 
  stats, 
  previousStats,
  onStatsClick 
}: ProfileStatsProps & { 
  previousStats?: ProfileStatsType 
}) {
  const getGrowth = (current: number, previous: number) => {
    if (!previous) return 0
    return ((current - previous) / previous) * 100
  }

  const statsData = [
    {
      key: 'posts' as const,
      label: 'Posts',
      value: stats.postsCount,
      growth: previousStats ? getGrowth(stats.postsCount, previousStats.postsCount) : 0,
    },
    {
      key: 'followers' as const,
      label: 'Followers',
      value: stats.followersCount,
      growth: previousStats ? getGrowth(stats.followersCount, previousStats.followersCount) : 0,
    },
    {
      key: 'following' as const,
      label: 'Following',
      value: stats.followingCount,
      growth: previousStats ? getGrowth(stats.followingCount, previousStats.followingCount) : 0,
    },
  ]

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-6">
      <div className="grid grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            whileHover={{ scale: onStatsClick ? 1.05 : 1.02 }}
            onClick={() => onStatsClick?.(stat.key)}
            className={`
              text-center transition-all duration-200
              ${onStatsClick ? 'cursor-pointer' : ''}
            `}
            style={hwAcceleration}
          >
            <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              <AnimatedStatCounter value={stat.value} />
            </div>
            
            <div className="text-sm font-medium text-gray-600 mb-1">
              {stat.label}
            </div>

            {/* Growth Indicator */}
            {previousStats && stat.growth !== 0 && (
              <div className={`
                text-xs font-medium flex items-center justify-center gap-1
                ${stat.growth > 0 ? 'text-green-600' : 'text-red-600'}
              `}>
                <svg 
                  className={`w-3 h-3 ${stat.growth > 0 ? '' : 'rotate-180'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span>{Math.abs(stat.growth).toFixed(1)}%</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/**
 * Format numbers for display (1K, 1M, etc.)
 */
function formatNumber(num: number): string {
  if (num < 1000) return num.toString()
  if (num < 1000000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  if (num < 1000000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B'
}