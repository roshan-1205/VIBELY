/**
 * FeedDemo Component - Vibely Social Media Feed
 * Demonstration of the complete feed system
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FeedListWithHeader } from '@/features/feed'
import { buttonTap, hwAcceleration, fadeInUp } from '@/core'

export function FeedDemo() {
  const [feedType, setFeedType] = useState<'timeline' | 'explore' | 'trending'>('timeline')

  const feedTabs = [
    { id: 'timeline', label: 'Timeline', icon: '🏠' },
    { id: 'explore', label: 'Explore', icon: '🔍' },
    { id: 'trending', label: 'Trending', icon: '🔥' },
  ] as const

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        style={hwAcceleration}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Vibely Feed System
        </h1>
        <p className="text-lg text-gray-600">
          Production-ready social media feed with infinite scroll, virtualization, and vibe sync
        </p>
      </motion.div>

      {/* Feed Type Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center"
      >
        <div className="glass-card rounded-2xl p-2 flex space-x-2">
          {feedTabs.map((tab) => (
            <motion.button
              key={tab.id}
              {...buttonTap}
              style={hwAcceleration}
              onClick={() => setFeedType(tab.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                feedType === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Feed Features Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">🚀 Feed Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-green-600">✅ Performance</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• React Virtuoso virtualization</li>
              <li>• Infinite scroll with TanStack Query</li>
              <li>• Hardware-accelerated animations</li>
              <li>• Optimistic UI updates</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-blue-600">🎨 User Experience</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Smooth Framer Motion interactions</li>
              <li>• GSAP scroll animations</li>
              <li>• Vibe sync integration</li>
              <li>• Glass morphism design</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-purple-600">⚡ Scalability</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Handles 10k+ posts</li>
              <li>• Minimal re-renders</li>
              <li>• Smart caching strategy</li>
              <li>• Error boundaries</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-orange-600">🔧 Developer Experience</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• TypeScript throughout</li>
              <li>• Clean separation of concerns</li>
              <li>• Comprehensive error handling</li>
              <li>• Extensive documentation</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Feed Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl overflow-hidden"
        style={{ height: '600px' }}
      >
        <FeedListWithHeader
          type={feedType}
          title={`${feedTabs.find(tab => tab.id === feedType)?.label} Feed`}
          subtitle="Scroll to see infinite loading and smooth animations"
          action={
            <motion.button
              {...buttonTap}
              style={hwAcceleration}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
              onClick={() => window.location.reload()}
            >
              Refresh
            </motion.button>
          }
        />
      </motion.div>

      {/* Technical Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">🔧 Technical Implementation</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Data Layer</h4>
            <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
{`// TanStack Query v5 with infinite scroll
const { posts, fetchNextPage, hasNextPage } = useFeed({
  type: 'timeline',
  limit: 20
})

// Optimistic mutations
const { handleLike, handleComment } = useFeedActions()`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Virtualization</h4>
            <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
{`// React Virtuoso for 10k+ posts
<Virtuoso
  data={posts}
  endReached={fetchNextPage}
  itemContent={(index, post) => <FeedCard post={post} />}
  overscan={5}
  increaseViewportBy={1000}
/>`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Vibe Sync Integration</h4>
            <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
{`// Zero re-render vibe sync
useVibeSync(post.sentimentScore, {
  enableTransitions: true,
  transitionDuration: 600,
  enableGlow: true
})`}
            </pre>
          </div>
        </div>
      </motion.div>
    </div>
  )
}