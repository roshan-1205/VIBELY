/**
 * CreatePostDemo Component - Vibely Post Creation Demo
 * Showcase the premium post creation system
 */

// Remove unused React import
import { motion } from 'framer-motion'
import { useUIStore } from '@/core/store/ui.store'
import { CreatePostModal } from '@/features/create'
import { buttonTap, hwAcceleration } from '@/core'

/**
 * Demo component showcasing the create post system
 */
export function CreatePostDemo() {
  const { openCreate } = useUIStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Premium Post Creation System
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Experience Instagram/Threads level UX with real-time vibe sync, glassmorphism design, 
            and optimistic updates. Built with React, TypeScript, and Framer Motion.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </motion.div>

        {/* Demo Actions */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center space-y-6"
        >
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Try the Create Post Experience
            </h2>
            <p className="text-gray-600">
              Click below to open the premium post creation modal
            </p>
          </div>

          {/* Create Post Button */}
          <motion.button
            {...buttonTap}
            style={hwAcceleration}
            onClick={openCreate}
            className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create New Post</span>
          </motion.button>

          {/* Keyboard Shortcut Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-gray-500"
          >
            <span>Pro tip: Use </span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">⌘</kbd>
            <span> + </span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">K</kbd>
            <span> for quick access</span>
          </motion.div>
        </motion.div>

        {/* Technical Details */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Technical Implementation
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Frontend Stack</h4>
              <ul className="space-y-1">
                <li>• React 18 + TypeScript</li>
                <li>• Framer Motion animations</li>
                <li>• TailwindCSS + Glassmorphism</li>
                <li>• Zustand state management</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Key Features</h4>
              <ul className="space-y-1">
                <li>• Real-time vibe sync (no re-renders)</li>
                <li>• Optimistic UI updates</li>
                <li>• Hardware-accelerated animations</li>
                <li>• Drag & drop media upload</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal />
    </div>
  )
}

/**
 * Feature card component
 */
function FeatureCard({ 
  feature, 
  index 
}: { 
  feature: typeof features[0]
  index: number 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ y: -5 }}
      style={hwAcceleration}
    >
      <div className="space-y-4">
        {/* Icon */}
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl">
          {feature.icon}
        </div>

        {/* Content */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">
            {feature.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {feature.description}
          </p>
        </div>

        {/* Tags */}
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
      </div>
    </motion.div>
  )
}

/**
 * Feature data
 */
const features = [
  {
    icon: '✨',
    title: 'Real-time Vibe Sync',
    description: 'UI responds to your mood as you type. CSS variables update without React re-renders for smooth performance.',
    tags: ['Performance', 'UX', 'Real-time'],
  },
  {
    icon: '🎨',
    title: 'Glassmorphism Design',
    description: 'Premium frosted glass effect with backdrop blur, soft shadows, and gradient borders for modern aesthetics.',
    tags: ['Design', 'Modern', 'Premium'],
  },
  {
    icon: '⚡',
    title: 'Optimistic Updates',
    description: 'Posts appear instantly in the feed while uploading in background. Automatic rollback on errors.',
    tags: ['Performance', 'UX', 'Reliability'],
  },
  {
    icon: '🎬',
    title: 'Smooth Animations',
    description: 'Hardware-accelerated animations with Framer Motion. Spring physics and micro-interactions.',
    tags: ['Animation', 'Smooth', 'Interactive'],
  },
  {
    icon: '📱',
    title: 'Responsive Modal',
    description: 'Adaptive design that works on desktop and mobile. ESC to close, click outside to dismiss.',
    tags: ['Responsive', 'Accessibility', 'Mobile'],
  },
  {
    icon: '🖼️',
    title: 'Media Upload',
    description: 'Drag & drop support for images and videos. Preview with remove buttons and file size indicators.',
    tags: ['Upload', 'Media', 'Drag & Drop'],
  },
]