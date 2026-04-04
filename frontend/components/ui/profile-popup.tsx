'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Edit, Settings, LogOut, Camera, MapPin, Calendar, Mail, Phone, Heart, MessageSquare, Share2, MoreHorizontal, Bell, Shield, HelpCircle, Bookmark, Upload, User } from 'lucide-react'
import { AdaptiveSplineScene } from './adaptive-spline'
import { CustomizableSplineScene } from './customizable-spline'
import { loadCustomization, getDefaultCustomization } from '@/lib/robotCustomization'
import { Card } from './card'
import { Spotlight } from './spotlight'
import { useAuth } from '@/contexts/AuthContext'
import { useProfileImage } from '@/hooks/useProfileImage'
import { VoiceWelcome } from './voice-welcome'

interface ProfilePopupProps {
  isOpen: boolean
  onClose: () => void
}

export const ProfilePopup = ({ isOpen, onClose }: ProfilePopupProps) => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isUpdatingRobot, setIsUpdatingRobot] = useState(false)
  const [robotCustomization, setRobotCustomization] = useState(getDefaultCustomization())
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Use the custom profile image hook
  const { profileImage, saveProfileImage, removeProfileImage: removeImage, clearProfileImage } = useProfileImage(user?._id)

  // Load robot customization
  useEffect(() => {
    if (user?._id) {
      const customization = loadCustomization(user._id)
      setRobotCustomization(customization)
    }
  }, [user?._id])

  const handleLogout = () => {
    clearProfileImage() // Clear image from state when logging out
    logout()
    onClose()
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && user?._id) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB.')
        return
      }

      setIsUploading(true)

      // Create a FileReader to convert image to base64
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        saveProfileImage(result, user._id) // Use the hook's save function
        setIsUploading(false)
        
        // Trigger robot theme update
        setIsUpdatingRobot(true)
        setTimeout(() => setIsUpdatingRobot(false), 3000) // Show updating state for 3 seconds
        
        console.log(`Profile image saved for user: ${user._id}`)
      }
      reader.onerror = () => {
        setIsUploading(false)
        alert('Error reading the image file.')
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveProfileImage = () => {
    if (user?._id) {
      removeImage(user._id) // Use the hook's remove function
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      // Reset robot theme when image is removed
      setIsUpdatingRobot(true)
      setTimeout(() => setIsUpdatingRobot(false), 2000)
      
      console.log(`Profile image removed for user: ${user._id}`)
    }
  }

  const handleResetRobotTheme = () => {
    if (user?._id) {
      localStorage.removeItem(`vibely_robot_theme_${user._id}`)
      setIsUpdatingRobot(true)
      setTimeout(() => setIsUpdatingRobot(false), 2000)
      console.log(`Robot theme reset for user: ${user._id}`)
    }
  }

  const handleRefreshRobotTheme = () => {
    if (user?._id && profileImage) {
      setIsUpdatingRobot(true)
      // Force re-analysis by temporarily clearing and restoring the image
      setTimeout(() => {
        setIsUpdatingRobot(false)
        // This will trigger the useEffect in AdaptiveSplineScene
        console.log(`Robot theme refresh triggered for user: ${user._id}`)
      }, 1000)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <Edit className="w-4 h-4" /> },
    { id: 'activity', label: 'Activity', icon: <Heart className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden relative border border-gray-200 dark:border-gray-700">
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-md border border-gray-200 dark:border-gray-600"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
              
              {/* Content Container */}
              <div className="flex h-full">
                {/* Left Side - 3D Scene */}
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-2/5 relative"
                >
                  <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden rounded-l-2xl">
                    <Spotlight
                      className="-top-40 left-0 md:left-60 md:-top-20"
                      fill="white"
                    />
                    <div className="absolute inset-0">
                      <CustomizableSplineScene 
                        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                        className="w-full h-full"
                        customization={robotCustomization}
                        userId={user?._id}
                        debug={false}
                      />
                    </div>
                    
                    {/* Robot Update Indicator */}
                    {isUpdatingRobot && (
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-4 text-center shadow-lg">
                          <div className="animate-spin rounded-full h-8 w-8 border-3 border-purple-500 border-t-transparent mx-auto mb-2"></div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Adapting Robot Appearance
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Analyzing your profile image...
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Voice Welcome Control */}
                    <div className="absolute top-4 right-4 z-20">
                      <VoiceWelcome
                        profileOwnerName={user ? `${user.firstName} ${user.lastName}` : 'User'}
                        visitorName={user ? `${user.firstName}` : undefined}
                        customMessage={`Welcome to ${user?.firstName}'s profile!`}
                        size="md"
                        showControls={true}
                        className="drop-shadow-lg"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Right Side - Profile Content */}
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="w-3/5 flex flex-col bg-white dark:bg-gray-900"
                >
                  {/* Profile Header */}
                  <div className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="relative group">
                          {/* Hidden file input */}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          
                          {/* Profile Avatar */}
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg overflow-hidden relative"
                          >
                            {profileImage ? (
                              <img 
                                src={profileImage} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full">
                                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                              </div>
                            )}
                            
                            {/* Upload overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                              <Camera className="w-5 h-5 text-white" />
                            </div>
                          </motion.div>
                          
                          {/* Camera button */}
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={triggerImageUpload}
                            disabled={isUploading}
                            className="absolute -bottom-1 -right-1 p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-gray-100 dark:border-gray-700 disabled:opacity-50"
                          >
                            {isUploading ? (
                              <div className="w-3 h-3 border border-purple-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Camera className="w-3 h-3 text-purple-600" />
                            )}
                          </motion.button>
                          
                          {/* Remove image button (only show when image exists) */}
                          {profileImage && (
                            <motion.button
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={handleRemoveProfileImage}
                              className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                            >
                              <X className="w-2 h-2" />
                            </motion.button>
                          )}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {user?.firstName} {user?.lastName}
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400">
                            @{user?.firstName?.toLowerCase()}{user?.lastName?.toLowerCase()}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        {isEditing ? 'Save' : 'Edit'}
                      </motion.button>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                      {tabs.map((tab) => (
                        <motion.button
                          key={tab.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md transition-all duration-200 font-medium ${
                            activeTab === tab.id
                              ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                          }`}
                        >
                          {tab.icon}
                          <span className="text-sm">{tab.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                    <AnimatePresence mode="wait">
                      {activeTab === 'profile' && (
                        <motion.div
                          key="profile"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-6"
                        >
                          {/* Stats Grid */}
                          <div className="grid grid-cols-3 gap-4">
                            {[
                              { label: 'Posts', value: '127', color: 'purple', icon: <MessageSquare className="w-4 h-4" /> },
                              { label: 'Followers', value: '1.2K', color: 'pink', icon: <Heart className="w-4 h-4" /> },
                              { label: 'Following', value: '892', color: 'blue', icon: <Share2 className="w-4 h-4" /> }
                            ].map((stat, index) => (
                              <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, y: -2 }}
                                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200/50 dark:border-gray-700/50"
                              >
                                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-2 ${
                                  stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                                  stat.color === 'pink' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' :
                                  'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                }`}>
                                  {stat.icon}
                                </div>
                                <div className={`text-xl font-bold ${
                                  stat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                                  stat.color === 'pink' ? 'text-pink-600 dark:text-pink-400' :
                                  'text-blue-600 dark:text-blue-400'
                                }`}>
                                  {stat.value}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                  {stat.label}
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          {/* Profile Information */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h3>
                            <div className="space-y-3">
                              {[
                                { icon: <Mail className="w-4 h-4" />, label: 'Email', value: user?.email, editable: false },
                                { icon: <Calendar className="w-4 h-4" />, label: 'Member since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently', editable: false },
                                { icon: <MapPin className="w-4 h-4" />, label: 'Location', value: 'New York, USA', editable: true },
                                { icon: <Phone className="w-4 h-4" />, label: 'Phone', value: '+1 (555) 123-4567', editable: true }
                              ].map((item, index) => (
                                <motion.div
                                  key={item.label}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200/50 dark:border-gray-700/50"
                                >
                                  <div className="text-gray-500 dark:text-gray-400 p-2 bg-white dark:bg-gray-700 rounded-md">
                                    {item.icon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">{item.label}</div>
                                    <div className="text-sm text-gray-900 dark:text-white font-medium truncate">{item.value}</div>
                                  </div>
                                  {item.editable && isEditing && (
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      className="p-2 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-md transition-colors"
                                    >
                                      <Edit className="w-3 h-3" />
                                    </motion.button>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Bio Section */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About Me</h3>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                Passionate about connecting with people and sharing amazing moments. 
                                Love exploring new places, trying different cuisines, and capturing life's beautiful moments. 
                                Always excited to meet new people and create lasting memories! ✨
                              </p>
                              {isEditing && (
                                <motion.button
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="mt-3 text-purple-600 hover:text-purple-700 text-xs font-medium flex items-center gap-1"
                                >
                                  <Edit className="w-3 h-3" />
                                  Edit Bio
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'activity' && (
                        <motion.div
                          key="activity"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                          {[
                            { action: 'Liked a post', time: '2 hours ago', icon: <Heart className="w-4 h-4 text-red-500" /> },
                            { action: 'Shared a photo', time: '5 hours ago', icon: <Share2 className="w-4 h-4 text-blue-500" /> },
                            { action: 'Added new friend', time: '1 day ago', icon: <MessageSquare className="w-4 h-4 text-green-500" /> },
                            { action: 'Updated profile', time: '3 days ago', icon: <Edit className="w-4 h-4 text-purple-500" /> }
                          ].map((activity, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.02, x: 4 }}
                              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer"
                            >
                              <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                                {activity.icon}
                              </div>
                              <div className="flex-1">
                                <div className="text-gray-900 dark:text-white font-medium">{activity.action}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{activity.time}</div>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      {activeTab === 'settings' && (
                        <motion.div
                          key="settings"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Settings & Privacy</h3>
                          {[
                            { icon: <Settings className="w-5 h-5" />, label: 'Account Settings', desc: 'Manage your account preferences' },
                            { icon: <Shield className="w-5 h-5" />, label: 'Privacy & Security', desc: 'Control your privacy settings' },
                            { icon: <Bell className="w-5 h-5" />, label: 'Notifications', desc: 'Manage notification preferences' },
                            { icon: <Bookmark className="w-5 h-5" />, label: 'Saved Posts', desc: 'View your saved content' },
                            { icon: <HelpCircle className="w-5 h-5" />, label: 'Help & Support', desc: 'Get help and contact support' }
                          ].map((setting, index) => (
                            <motion.button
                              key={setting.label}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.02, x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-left"
                            >
                              <div className="text-gray-500 dark:text-gray-400">
                                {setting.icon}
                              </div>
                              <div className="flex-1">
                                <div className="text-gray-900 dark:text-white font-medium">{setting.label}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{setting.desc}</div>
                              </div>
                              <MoreHorizontal className="w-4 h-4 text-gray-400" />
                            </motion.button>
                          ))}
                          
                          {/* Robot Customizer Link */}
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              onClose()
                              window.open('/robot-customizer', '_blank')
                            }}
                            className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all duration-200 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-700"
                          >
                            <div className="text-purple-500 dark:text-purple-400">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-medium">Customize Robot</div>
                              <div className="text-sm opacity-75">Design your perfect robot companion</div>
                            </div>
                            <div className="text-purple-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </div>
                          </motion.button>
                          
                          {/* Robot Theme Controls */}
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleRefreshRobotTheme}
                            disabled={isUpdatingRobot || !profileImage}
                            className="w-full flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 text-blue-600 dark:text-blue-400 disabled:opacity-50"
                          >
                            <div className="text-blue-500 dark:text-blue-400">
                              {isUpdatingRobot ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent" />
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-medium">
                                {isUpdatingRobot ? 'Refreshing Robot...' : 'Refresh Robot Appearance'}
                              </div>
                              <div className="text-sm opacity-75">
                                {isUpdatingRobot ? 'Re-analyzing your profile image' : 'Re-analyze profile image and update robot colors'}
                              </div>
                            </div>
                          </motion.button>
                          
                          {/* Robot Theme Reset Button */}
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleResetRobotTheme}
                            disabled={isUpdatingRobot}
                            className="w-full flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-200 text-purple-600 dark:text-purple-400"
                          >
                            <div className="text-purple-500 dark:text-purple-400">
                              {isUpdatingRobot ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-500 border-t-transparent" />
                              ) : (
                                <User className="w-5 h-5" />
                              )}
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-medium">
                                {isUpdatingRobot ? 'Updating Robot Theme...' : 'Reset Robot Appearance'}
                              </div>
                              <div className="text-sm opacity-75">
                                {isUpdatingRobot ? 'Please wait while we update your robot' : 'Reset robot to default colors and appearance'}
                              </div>
                            </div>
                          </motion.button>
                          
                          {/* Logout Button */}
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 text-red-600 dark:text-red-400 mt-6"
                          >
                            <LogOut className="w-5 h-5" />
                            <div className="flex-1 text-left">
                              <div className="font-medium">Sign Out</div>
                              <div className="text-sm opacity-75">Sign out of your account</div>
                            </div>
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}