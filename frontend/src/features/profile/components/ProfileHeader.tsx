/**
 * ProfileHeader Component - Premium Profile Header
 * Glassmorphism design with gradient aura and smooth animations
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useProfile } from '../hooks/useProfile'
import { buttonTap, hwAcceleration } from '@/core'
import type { User } from '../types/profile.types'

interface ProfileHeaderProps {
  userId: string
  onEditProfile?: () => void
  onMessage?: () => void
}

export function ProfileHeader({ userId, onEditProfile, onMessage }: ProfileHeaderProps) {
  const { 
    profile, 
    isLoading, 
    toggleFollowStatus, 
    isFollowing,
    isOwnProfile,
    canFollow 
  } = useProfile(userId)

  if (isLoading) {
    return <ProfileHeaderSkeleton />
  }

  if (!profile) {
    return <ProfileHeaderError />
  }

  const { user, stats } = profile

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative"
      style={hwAcceleration}
    >
      {/* Background Gradient Aura */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-30 blur-3xl pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              var(--vibe-glow, rgba(59, 130, 246, 0.3)) 0%,
              transparent 70%
            )
          `,
        }}
      />

      {/* Main Header Card */}
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
        {/* Subtle gradient overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, var(--vibe-glow, rgba(59, 130, 246, 0.1)) 0%, transparent 50%)',
          }}
        />

        <div className="relative p-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center md:items-start">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative"
                style={hwAcceleration}
              >
                {/* Avatar Glow */}
                <div 
                  className="absolute inset-0 rounded-full opacity-50 blur-lg"
                  style={{
                    background: 'var(--vibe-glow, rgba(59, 130, 246, 0.3))',
                  }}
                />
                
                {/* Avatar Image */}
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/50 shadow-xl">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Verified Badge */}
                {user.isVerified && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 500 }}
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              {/* Name and Username */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-4"
              >
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                  {user.name}
                </h1>
                <p className="text-lg text-gray-500">
                  @{user.username}
                </p>
              </motion.div>

              {/* Bio */}
              {user.bio && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mb-4"
                >
                  <p className="text-gray-700 leading-relaxed max-w-2xl">
                    {user.bio}
                  </p>
                </motion.div>
              )}

              {/* Location and Website */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6 text-sm text-gray-500"
              >
                {user.location && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{user.location}</span>
                  </div>
                )}
                
                {user.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span>{user.website.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}

                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Joined {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-wrap items-center justify-center md:justify-start gap-3"
              >
                {isOwnProfile ? (
                  <motion.button
                    {...buttonTap}
                    style={hwAcceleration}
                    onClick={onEditProfile}
                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-xl transition-all duration-200 border border-gray-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    Edit Profile
                  </motion.button>
                ) : (
                  <>
                    {canFollow && (
                      <motion.button
                        {...buttonTap}
                        style={hwAcceleration}
                        onClick={toggleFollowStatus}
                        disabled={isFollowing}
                        className={`
                          px-6 py-2.5 font-medium rounded-xl transition-all duration-200
                          ${user.isFollowing
                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                          }
                          ${isFollowing ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        whileHover={!isFollowing ? { scale: 1.02 } : {}}
                      >
                        {isFollowing ? (
                          <div className="flex items-center gap-2">
                            <motion.div
                              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            />
                            <span>Following...</span>
                          </div>
                        ) : (
                          user.isFollowing ? 'Following' : 'Follow'
                        )}
                      </motion.button>
                    )}

                    {onMessage && (
                      <motion.button
                        {...buttonTap}
                        style={hwAcceleration}
                        onClick={onMessage}
                        className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-xl transition-all duration-200 border border-gray-200"
                        whileHover={{ scale: 1.02 }}
                      >
                        Message
                      </motion.button>
                    )}
                  </>
                )}

                {/* More Options */}
                <motion.button
                  {...buttonTap}
                  style={hwAcceleration}
                  className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Loading skeleton for profile header
 */
function ProfileHeaderSkeleton() {
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
 * Error state for profile header
 */
function ProfileHeaderError() {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 text-center">
      <div className="text-gray-500 mb-4">
        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Profile not found</h3>
        <p className="text-gray-600">This profile may have been deleted or made private.</p>
      </div>
    </div>
  )
}