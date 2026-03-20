import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUIStore } from '@/core/store/ui.store'
import { buttonTap, hwAcceleration } from '@/core'

const navigation = [
  { name: 'Home', href: '/', icon: '🏠' },
  { name: 'Feed', href: '/feed', icon: '📱' },
  { name: 'Create', href: '/create', icon: '✨' },
  { name: 'Profile', href: '/profile', icon: '👤' },
  { name: 'Vibe Sync', href: '/vibe-sync', icon: '🌈' },
  { name: 'Design System', href: '/design-system', icon: '🎨' },
]

export function Sidebar() {
  const { openCreate } = useUIStore()

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sidebar"
    >
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gradient bg-gradient-to-r from-accent-600 to-purple-600 bg-clip-text text-transparent">
          Vibely
        </h1>
        <p className="text-sm text-slate-500 mt-1">Share your vibe</p>
      </div>

      {/* Quick Create Button */}
      <motion.button
        {...buttonTap}
        style={hwAcceleration}
        onClick={openCreate}
        className="w-full mb-6 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        whileHover={{ scale: 1.02, y: -1 }}
      >
        <div className="flex items-center justify-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Create Post</span>
        </div>
      </motion.button>
      
      {/* Navigation */}
      <nav className="space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-accent-500 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* User section */}
      <div className="mt-auto pt-6 border-t border-white/20">
        <div className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            U
          </div>
          <div>
            <p className="font-medium text-slate-900">User</p>
            <p className="text-sm text-slate-500">@username</p>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}