/**
 * ProfileDemo Component - Showcase Profile System
 * Demonstrates the premium profile features
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ProfilePage, CompactProfile } from '@/features/profile'
import { hwAcceleration } from '@/core'

/**
 * Demo component showcasing the profile system
 */
export function ProfileDemo() {
  const [selectedUserId, setSelectedUserId] = useState('user_123')
  const [viewMode, setViewMode] = useState<'full' | 'compact'>('full')

  const demoUsers = [
    { id: 'user_123', name: 'Alex Chen', username: 'alexchen' },
    { id: 'user_456', name: 'Sarah Wilson', username: 'sarahw' },
    { id: 'user_789', name: 'Mike Johnson', username: 'mikej' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Demo Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Premium Profile System
              </h1>
              <p className="text-gray-600 text-sm">
                Instagram + Threads + Linear quality with vibe sync
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* User Selector */}
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="px-3 py-2 bg-white/60 backdrop-blur-xl border border-white/20 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {demoUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} (@{user.username})
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('full')}
                  className={`
                    px-3 py-1.5 rounded-md text-sm font-medium transition-all
                    ${viewMode === 'full'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  Full Profile
                </button>
                <button
                  onClick={() => setViewMode('compact')}
                  className={`
                    px-3 py-1.5 rounded-md text-sm font-medium transition-all
                    ${viewMode === 'compact'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  Compact
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="p-4 md:p-8">
        {viewMode === 'full' ? (
          <ProfilePage userId={selectedUserId} />
        ) : (
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Compact Profile View
              </h2>
              <CompactProfile userId={selectedUserId} />
            </motion.div>

            {/* Feature Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-medium text-gray-900">
                Compact Features
              </h3>
              
              <div className="grid gap-3">
                {compactFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white/60 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{feature.icon}</div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Features Showcase */}
      {viewMode === 'full' && (
        <div className="bg-white/80 backdrop-blur-xl border-t border-white/20 mt-16">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Premium Profile Features
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Built with modern web technologies for the best user experience
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {profileFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                  className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-6"
                  style={hwAcceleration}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {feature.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Technical Stack */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Technical Implementation
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Frontend Stack
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      React 18 + TypeScript
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Framer Motion animations
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      TailwindCSS + Glassmorphism
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      React Virtuoso (performance)
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Key Features
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Real-time vibe sync
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      Virtualized post rendering
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                      Optimistic UI updates
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                      Hardware-accelerated animations
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Profile features data
 */
const profileFeatures = [
  {
    icon: '✨',
    title: 'Glassmorphism Design',
    description: 'Premium frosted glass effects with backdrop blur and gradient borders for a modern, sophisticated look.',
    tags: ['Design', 'Modern', 'Premium'],
  },
  {
    icon: '⚡',
    title: 'Virtualized Posts',
    description: 'Handle thousands of posts smoothly with React Virtuoso. Only renders visible items for optimal performance.',
    tags: ['Performance', 'Scalability', 'Smooth'],
  },
  {
    icon: '🎨',
    title: 'Real-time Vibe Sync',
    description: 'Profile UI adapts to user sentiment in real-time using CSS variables without React re-renders.',
    tags: ['Real-time', 'Performance', 'UX'],
  },
  {
    icon: '🎬',
    title: 'Smooth Animations',
    description: 'Hardware-accelerated animations with Framer Motion. Spring physics and micro-interactions throughout.',
    tags: ['Animation', 'Smooth', 'Interactive'],
  },
  {
    icon: '📊',
    title: 'Interactive Stats',
    description: 'Animated counters and growth indicators. Click stats to navigate to detailed views.',
    tags: ['Interactive', 'Analytics', 'Engaging'],
  },
  {
    icon: '🔄',
    title: 'Optimistic Updates',
    description: 'Instant UI feedback for likes, follows, and interactions. Automatic rollback on errors.',
    tags: ['Performance', 'UX', 'Reliability'],
  },
]

/**
 * Compact features data
 */
const compactFeatures = [
  {
    icon: '📱',
    title: 'Mobile Optimized',
    description: 'Responsive design that works perfectly on all screen sizes.',
  },
  {
    icon: '⚡',
    title: 'Lightweight',
    description: 'Minimal footprint while maintaining all essential features.',
  },
  {
    icon: '🎯',
    title: 'Focused UI',
    description: 'Clean, distraction-free interface highlighting key information.',
  },
  {
    icon: '🔗',
    title: 'Easy Integration',
    description: 'Drop-in component that works anywhere in your application.',
  },
]