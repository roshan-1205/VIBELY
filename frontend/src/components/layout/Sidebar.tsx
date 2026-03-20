import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUIStore } from '@/core/store/ui.store'
import { useAuth, useIsAuthenticated, useAuthUser } from '@/features/auth'
import { buttonTap, hwAcceleration } from '@/core'

const navigation = [
  { name: 'Home', href: '/', icon: '🏠' },
  { name: 'Feed', href: '/feed', icon: '📱' },
  { name: 'Create', href: '/create', icon: '✨' },
  { name: 'Profile', href: '/profile', icon: '👤' },
  { name: 'Auth Demo', href: '/auth-demo', icon: '🔐' },
  { name: 'Vibe Sync', href: '/vibe-sync', icon: '🌈' },
  { name: 'Design System', href: '/design-system', icon: '🎨' },
]

export function Sidebar() {
  const { openCreate } = useUIStore()
  const { logout } = useAuth()
  const isAuthenticated = useIsAuthenticated()
  const user = useAuthUser()

  // Don't show sidebar on auth pages
  if (!isAuthenticated) {
    return null
  }

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
        <div className="flex items-center gap-3 p-4 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-900 truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-sm text-slate-500 truncate">
              @{user?.username || 'username'}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <motion.button
          {...buttonTap}
          style={hwAcceleration}
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
          whileHover={{ scale: 1.02 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium">Sign out</span>
        </motion.button>
      </div>
    </motion.aside>
  )
}