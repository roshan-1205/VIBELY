/**
 * Home Page - Main Landing Page After Login
 */
import { motion } from 'framer-motion'
import { useUser } from '@/core/store/auth.store'
import { Link } from 'react-router-dom'

export function HomePage() {
  const user = useUser()

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold text-gradient bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
          Welcome to Vibely! 🎉
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Hello <span className="font-semibold text-blue-600">{user?.name || user?.username}</span>! 
          Your premium social media experience awaits.
        </p>
        <p className="text-lg text-gray-500">
          Connect, share, and let the good vibes flow! ✨
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Feed Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Social Feed</h3>
            <p className="text-gray-600 mb-4">
              Discover amazing content from your friends and the community
            </p>
            <Link 
              to="/feed"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
            >
              View Feed
            </Link>
          </div>
        </motion.div>

        {/* Create Post Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Create Post</h3>
            <p className="text-gray-600 mb-4">
              Share your thoughts, moments, and vibes with the world
            </p>
            <Link 
              to="/create"
              className="inline-block px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
            >
              Create Now
            </Link>
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-card hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Your Profile</h3>
            <p className="text-gray-600 mb-4">
              Customize your profile and manage your account settings
            </p>
            <Link 
              to="/profile"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
            >
              View Profile
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="glass-card p-8 mb-8"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          What makes Vibely special? 🌟
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🚀</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Fast & Modern</h4>
            <p className="text-sm text-gray-600">Lightning-fast performance with modern design</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🔒</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Secure</h4>
            <p className="text-sm text-gray-600">Your data is protected with enterprise-grade security</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🎨</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Beautiful UI</h4>
            <p className="text-sm text-gray-600">Glassmorphism design that's easy on the eyes</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">⚡</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Real-time</h4>
            <p className="text-sm text-gray-600">Instant updates and live interactions</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-center"
      >
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
          Ready to get started? 🎯
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/feed"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Explore Feed 📱
          </Link>
          <Link 
            to="/create"
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Create Post ✨
          </Link>
        </div>
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-12 text-center"
      >
        <div className="inline-block glass-card bg-green-50 border-green-200 p-6 rounded-xl">
          <div className="flex items-center justify-center mb-3">
            <span className="text-3xl mr-3">🎊</span>
            <h4 className="text-lg font-semibold text-green-800">Login Successful!</h4>
          </div>
          <p className="text-green-700">
            Welcome to Vibely! You're now part of our amazing community. 
            <br />
            Start exploring and sharing your vibes! 🌈
          </p>
        </div>
      </motion.div>
    </div>
  )
}