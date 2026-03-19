import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

const navigation = [
  { name: 'Home', href: '/', icon: '🏠' },
  { name: 'Feed', href: '/feed', icon: '📱' },
  { name: 'Create', href: '/create', icon: '✨' },
  { name: 'Profile', href: '/profile', icon: '👤' },
  { name: 'Vibe Sync', href: '/vibe-sync', icon: '🌈' },
  { name: 'Design System', href: '/design-system', icon: '🎨' },
]

export function Sidebar() {
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