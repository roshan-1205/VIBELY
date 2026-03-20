/**
 * ProfileTabs Component - Animated Tab Navigation
 * Smooth transitions with animated underline indicator
 */

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { hwAcceleration } from '@/core'
import type { ProfileTabType } from '../types/profile.types'

interface ProfileTab {
  id: ProfileTabType
  label: string
  count?: number
  icon?: React.ReactNode
}

interface ProfileTabsProps {
  activeTab: ProfileTabType
  onTabChange: (tab: ProfileTabType) => void
  tabs?: ProfileTab[]
  className?: string
}

const defaultTabs: ProfileTab[] = [
  {
    id: 'posts',
    label: 'Posts',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    id: 'media',
    label: 'Media',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'liked',
    label: 'Liked',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: 'replies',
    label: 'Replies',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
]

export function ProfileTabs({ 
  activeTab, 
  onTabChange, 
  tabs = defaultTabs,
  className = '' 
}: ProfileTabsProps) {
  const [hoveredTab, setHoveredTab] = React.useState<ProfileTabType | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg ${className}`}
      style={hwAcceleration}
    >
      <div className="relative">
        {/* Tab Navigation */}
        <div className="flex">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              onClick={() => onTabChange(tab.id)}
              onMouseEnter={() => setHoveredTab(tab.id)}
              onMouseLeave={() => setHoveredTab(null)}
              className={`
                relative flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium
                transition-all duration-200 rounded-2xl
                ${activeTab === tab.id
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
              style={hwAcceleration}
            >
              {/* Tab Content */}
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`
                      px-2 py-0.5 text-xs rounded-full font-medium
                      ${activeTab === tab.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-500'
                      }
                    `}
                  >
                    {formatCount(tab.count)}
                  </motion.span>
                )}
              </motion.div>

              {/* Hover Background */}
              <AnimatePresence>
                {hoveredTab === tab.id && activeTab !== tab.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 bg-gray-50 rounded-2xl"
                    style={{ zIndex: -1 }}
                  />
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {/* Active Tab Indicator */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          layoutId="activeTabIndicator"
          initial={false}
          animate={{
            x: `${tabs.findIndex(tab => tab.id === activeTab) * (100 / tabs.length)}%`,
            width: `${100 / tabs.length}%`,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        />

        {/* Active Tab Background */}
        <motion.div
          className="absolute inset-0 bg-blue-50/50 rounded-2xl pointer-events-none"
          layoutId="activeTabBackground"
          initial={false}
          animate={{
            x: `${tabs.findIndex(tab => tab.id === activeTab) * (100 / tabs.length)}%`,
            width: `${100 / tabs.length}%`,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
          style={{ zIndex: -1 }}
        />
      </div>
    </motion.div>
  )
}

/**
 * Compact tabs for mobile
 */
export function CompactProfileTabs({ activeTab, onTabChange, tabs = defaultTabs }: ProfileTabsProps) {
  return (
    <div className="flex bg-gray-100 rounded-xl p-1">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            relative flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium
            rounded-lg transition-all duration-200
            ${activeTab === tab.id
              ? 'text-blue-600 bg-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
          whileTap={{ scale: 0.95 }}
          style={hwAcceleration}
        >
          {tab.icon}
          <span className="hidden sm:inline">{tab.label}</span>
          {tab.count !== undefined && (
            <span className={`
              px-1.5 py-0.5 text-xs rounded-full font-medium
              ${activeTab === tab.id
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-200 text-gray-500'
              }
            `}>
              {formatCount(tab.count)}
            </span>
          )}
        </motion.button>
      ))}
    </div>
  )
}

/**
 * Vertical tabs for sidebar layout
 */
export function VerticalProfileTabs({ activeTab, onTabChange, tabs = defaultTabs }: ProfileTabsProps) {
  return (
    <div className="space-y-2">
      {tabs.map((tab, index) => (
        <motion.button
          key={tab.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 * index }}
          onClick={() => onTabChange(tab.id)}
          className={`
            w-full flex items-center gap-3 px-4 py-3 text-sm font-medium
            rounded-xl transition-all duration-200
            ${activeTab === tab.id
              ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }
          `}
          whileHover={{ x: activeTab !== tab.id ? 4 : 0 }}
          whileTap={{ scale: 0.98 }}
          style={hwAcceleration}
        >
          {tab.icon}
          <span className="flex-1 text-left">{tab.label}</span>
          {tab.count !== undefined && (
            <span className={`
              px-2 py-1 text-xs rounded-full font-medium
              ${activeTab === tab.id
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-500'
              }
            `}>
              {formatCount(tab.count)}
            </span>
          )}
        </motion.button>
      ))}
    </div>
  )
}

/**
 * Tab content wrapper with animations
 */
export function TabContent({ 
  activeTab, 
  children 
}: { 
  activeTab: ProfileTabType
  children: React.ReactNode 
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="mt-6"
        style={hwAcceleration}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Format count numbers for display
 */
function formatCount(count: number): string {
  if (count < 1000) return count.toString()
  if (count < 1000000) return Math.floor(count / 1000) + 'K'
  return Math.floor(count / 1000000) + 'M'
}