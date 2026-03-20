/**
 * Feed Page - Main Social Feed
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useIsAuthenticated, useUser } from '@/core/store/auth.store'

export function FeedPage() {
  const isAuthenticated = useIsAuthenticated()
  const user = useUser()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Please log in to view your feed
          </h2>
          <a 
            href="/login" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome to Vibely Feed! 🎉
          </h1>
          <p className="text-gray-600 text-lg">
            Hello {user?.name || user?.username}! Your social feed is ready.
          </p>
        </div>

        <div className="space-y-6">
          {/* Sample Posts */}
          <div className="glass-card bg-white/50 p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                V
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-900">Vibely Team</h3>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
            <p className="text-gray-800 mb-4">
              🚀 Welcome to Vibely! Your premium social media experience with AI-powered vibe analysis is now live. 
              Share your thoughts, connect with friends, and let the good vibes flow!
            </p>
            <div className="flex items-center space-x-6 text-gray-500">
              <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
                <span>❤️</span>
                <span>42</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
                <span>💬</span>
                <span>8</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
                <span>🔄</span>
                <span>Share</span>
              </button>
            </div>
          </div>

          <div className="glass-card bg-white/50 p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-900">{user?.name || 'You'}</h3>
                <p className="text-sm text-gray-500">Just now</p>
              </div>
            </div>
            <p className="text-gray-800 mb-4">
              Just logged into Vibely! Excited to explore this amazing social platform. 
              The glassmorphism design looks absolutely stunning! ✨
            </p>
            <div className="flex items-center space-x-6 text-gray-500">
              <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
                <span>❤️</span>
                <span>1</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
                <span>💬</span>
                <span>0</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
                <span>🔄</span>
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Create Post Section */}
          <div className="glass-card bg-white/30 p-6 rounded-xl border-2 border-dashed border-blue-300">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Share your vibe! 
              </h3>
              <p className="text-gray-600 mb-4">
                What's on your mind today?
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                Create Post ✨
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            🎊 Congratulations! You've successfully logged into Vibely. 
            <br />
            The complete social media platform is now ready for you to explore!
          </p>
        </div>
      </motion.div>
    </div>
  )
}