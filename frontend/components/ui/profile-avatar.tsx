'use client'

import { useProfileImage } from '@/hooks/useProfileImage'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'

interface ProfileAvatarProps {
  userId?: string
  firstName?: string
  lastName?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showInitials?: boolean
  onClick?: () => void
  showTooltip?: boolean
  linkToProfile?: boolean // New prop to enable profile linking
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-20 h-20 text-2xl'
}

export const ProfileAvatar = ({ 
  userId, 
  firstName, 
  lastName, 
  size = 'md', 
  className,
  showInitials = true,
  onClick,
  showTooltip = true,
  linkToProfile = false
}: ProfileAvatarProps) => {
  const { profileImage } = useProfileImage(userId)
  const [showTooltipState, setShowTooltipState] = useState(false)

  const getInitials = () => {
    if (!showInitials || !firstName || !lastName) return ''
    try {
      return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`
    } catch (error) {
      console.error('Error generating initials:', error)
      return '??'
    }
  }

  const handleClick = () => {
    try {
      if (onClick) {
        onClick()
      }
    } catch (error) {
      console.error('Error handling avatar click:', error)
    }
  }

  const avatarContent = (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={() => setShowTooltipState(true)}
      onMouseLeave={() => setShowTooltipState(false)}
      onClick={linkToProfile ? undefined : handleClick}
      className={cn(
        'bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg overflow-hidden transition-all duration-200 relative group',
        (onClick || linkToProfile) ? 'cursor-pointer hover:shadow-xl hover:ring-2 hover:ring-purple-300 dark:hover:ring-purple-600' : '',
        sizeClasses[size],
        className
      )}
    >
      {profileImage ? (
        <img 
          src={profileImage} 
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{getInitials()}</span>
      )}
      
      {/* Hover overlay */}
      {(onClick || linkToProfile) && (
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="text-white text-xs font-medium">
            {linkToProfile ? 'Visit Profile' : 'Profile'}
          </div>
        </div>
      )}
    </motion.div>
  )

  return (
    <div className="relative">
      {linkToProfile && userId ? (
        <Link href={`/profile/${userId}`}>
          {avatarContent}
        </Link>
      ) : (
        avatarContent
      )}

      {/* Tooltip */}
      {showTooltip && (onClick || linkToProfile) && (
        <AnimatePresence>
          {showTooltipState && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-50"
            >
              <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                {linkToProfile ? 'Visit Profile' : 'Go to Profile'}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}