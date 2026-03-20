/**
 * ProfilePage Component - Complete Profile Experience
 * Premium social media profile with all components integrated
 */

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile'
import { ProfileHeader } from './ProfileHeader'
import { ProfileStats } from './ProfileStats'
import { ProfileTabs, TabContent } from './ProfileTabs'
import { ProfilePosts } from './ProfilePosts'
import { ProfileSkeleton } from './ProfileSkeleton'
import { ProfileError } from './ProfileError'
import { hwAcceleration } from '@/core'
import type { ProfileTabType, ProfileViewMode } from '../types/profile.types'

interface ProfilePageProps {
  userId?: string
  className?: string
}

export function ProfilePage({ userId: propUserId, className = '' }: ProfilePageProps) {
  const { userId: paramUserId } = useParams<{ userId: string }>()
  const userId = propUserId || paramUserId || 'current_user'
  
  // Profile state
  const [activeTab, setActiveTab] = useState<ProfileTabType>('posts')
  const [viewMode, setViewMode] = useState<ProfileViewMode>('grid')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Profile data
  const { 
    profile, 
    isLoading, 
    isError, 
    error, 
    refetch,
    isOwnProfile 
  } = useProfile(userId)

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeTab])

  // Handle stats click
  const handleStatsClick = (type: 'posts' | 'followers' | 'following') => {
    if (type === 'posts') {
      setActiveTab('posts')
    }
    // In a real app, you'd navigate to followers/following pages
    console.log(`Navigate to ${type}`)
  }

  // Handle edit profile
  const handleEditProfile = () => {
    setIsEditModalOpen(true)
  }

  // Handle message user
  const handleMessage = () => {
    // In a real app, open message composer
    console.log('Open message composer')
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8 ${className}`}>
        <div className="max-w-4xl mx-auto">
          <ProfileSkeleton />
        </div>
      </div>
    )
  }

  // Error state
  if (isError || !profile) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8 ${className}`}>
        <div className="max-w-4xl mx-auto">
          <ProfileError 
            error={error}
            onRetry={refetch}
            type={error?.message?.includes('404') ? 'notFound' : 'profile'}
          />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8 ${className}`}
      style={hwAcceleration}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <ProfileHeader
          userId={userId}
          onEditProfile={handleEditProfile}
          onMessage={handleMessage}
        />

        {/* Profile Stats */}
        <ProfileStats
          stats={profile.stats}
          onStatsClick={handleStatsClick}
        />

        {/* Profile Navigation */}
        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={[
            { id: 'posts', label: 'Posts', count: profile.stats.postsCount },
            { id: 'media', label: 'Media', count: undefined },
            { id: 'liked', label: 'Liked', count: undefined },
            { id: 'replies', label: 'Replies', count: undefined },
          ]}
        />

        {/* Profile Content */}
        <TabContent activeTab={activeTab}>
          <ProfilePosts
            userId={userId}
            activeTab={activeTab}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </TabContent>

        {/* Floating Action Button (for own profile) */}
        {isOwnProfile && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleEditProfile}
            className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40"
            style={hwAcceleration}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </motion.button>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(data) => {
            // Handle profile update
            console.log('Update profile:', data)
            setIsEditModalOpen(false)
          }}
        />
      )}
    </motion.div>
  )
}

/**
 * Edit Profile Modal (placeholder)
 */
function EditProfileModal({
  profile,
  onClose,
  onSave,
}: {
  profile: any
  onClose: () => void
  onSave: (data: any) => void
}) {
  const [formData, setFormData] = useState({
    name: profile.user.name,
    bio: profile.user.bio || '',
    location: profile.user.location || '',
    website: profile.user.website || '',
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/**
 * Compact profile for mobile or sidebar
 */
export function CompactProfile({ userId }: { userId: string }) {
  const { profile, isLoading } = useProfile(userId)

  if (isLoading) {
    return (
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
          </div>
        </div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-4"
    >
      <div className="flex items-center gap-3">
        <img
          src={profile.user.avatar}
          alt={profile.user.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {profile.user.name}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            @{profile.user.username}
          </p>
        </div>
      </div>
      
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <div className="font-semibold text-gray-900">{profile.stats.postsCount}</div>
          <div className="text-gray-500">Posts</div>
        </div>
        <div>
          <div className="font-semibold text-gray-900">{profile.stats.followersCount}</div>
          <div className="text-gray-500">Followers</div>
        </div>
        <div>
          <div className="font-semibold text-gray-900">{profile.stats.followingCount}</div>
          <div className="text-gray-500">Following</div>
        </div>
      </div>
    </motion.div>
  )
}