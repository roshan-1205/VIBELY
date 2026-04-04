'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Activity, Bell, MessageSquare, Heart, UserPlus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useSocket } from '@/contexts/SocketContext'
import { apiService, type User, type Post, type NotificationItem } from '@/services/api'
import { PostsFeed } from '@/components/ui/posts-feed'
import AvatarNotifications from '@/components/ui/avatar-notifications'
import { ProfileAvatar } from '@/components/ui/profile-avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function RealtimeDemoPage() {
  const { user } = useAuth()
  const { isConnected, onlineUsers } = useSocket()
  const [onlineUsersList, setOnlineUsersList] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    onlineUsers: 0,
    totalPosts: 0,
    totalActivities: 0
  })

  useEffect(() => {
    loadOnlineUsers()
    loadStats()
  }, [])

  const loadOnlineUsers = async () => {
    try {
      const response = await apiService.getOnlineUsers(20)
      if (response.success && response.data) {
        setOnlineUsersList(response.data.users)
      }
    } catch (error) {
      console.error('Error loading online users:', error)
    }
  }

  const loadStats = async () => {
    try {
      const response = await apiService.getUserStats()
      if (response.success && response.data) {
        setStats(response.data.stats)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    try {
      setIsSearching(true)
      const response = await apiService.searchUsers(searchQuery.trim())
      if (response.success && response.data) {
        setSearchResults(response.data.users)
      }
    } catch (error) {
      console.error('Error searching users:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleFollowUser = async (userId: string) => {
    try {
      const response = await apiService.followUser(userId)
      if (response.success) {
        // Update search results to reflect follow status
        setSearchResults(prev => 
          prev.map(user => 
            user._id === userId 
              ? { ...user, isFollowing: response.data.isFollowing }
              : user
          )
        )
      }
    } catch (error) {
      console.error('Error following user:', error)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Real-time Demo</h1>
          <p className="text-gray-600 mb-6">Please sign in to access the real-time social platform demo.</p>
          <Link href="/signin">
            <Button>Sign In</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Vibely Real-time Demo</h1>
              <Badge variant={isConnected ? "default" : "destructive"}>
                {isConnected ? "🟢 Live" : "🔴 Offline"}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <AvatarNotifications />
              <ProfileAvatar
                userId={user._id}
                firstName={user.firstName}
                lastName={user.lastName}
                size="md"
                linkToProfile={true}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Stats & Online Users */}
          <div className="lg:col-span-1 space-y-6">
            {/* Real-time Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Live Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Online Users</span>
                  <Badge variant="secondary">{onlineUsers.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Users</span>
                  <span className="text-sm font-medium">{stats.totalUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Posts</span>
                  <span className="text-sm font-medium">{stats.totalPosts}</span>
                </div>
              </div>
            </Card>

            {/* Online Users */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Online Now ({onlineUsersList.length})
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {onlineUsersList.map((onlineUser) => (
                  <motion.div
                    key={onlineUser._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                  >
                    <div className="relative">
                      <ProfileAvatar
                        userId={onlineUser._id}
                        firstName={onlineUser.firstName}
                        lastName={onlineUser.lastName}
                        size="sm"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/profile/${onlineUser._id}`}>
                        <p className="text-sm font-medium text-gray-900 truncate hover:text-purple-600">
                          {onlineUser.firstName} {onlineUser.lastName}
                        </p>
                      </Link>
                    </div>
                  </motion.div>
                ))}
                {onlineUsersList.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No other users online
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Main Content - Posts Feed */}
          <div className="lg:col-span-2">
            <PostsFeed className="space-y-6" />
          </div>

          {/* Right Sidebar - Search & Discover */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Search */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Find Users</h3>
              <div className="space-y-4">
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {isSearching && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                  </div>
                )}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {searchResults.map((searchUser) => (
                    <div key={searchUser._id} className="flex items-center gap-3">
                      <ProfileAvatar
                        userId={searchUser._id}
                        firstName={searchUser.firstName}
                        lastName={searchUser.lastName}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <Link href={`/profile/${searchUser._id}`}>
                          <p className="text-sm font-medium text-gray-900 truncate hover:text-purple-600">
                            {searchUser.firstName} {searchUser.lastName}
                          </p>
                        </Link>
                      </div>
                      {searchUser._id !== user._id && (
                        <Button
                          size="sm"
                          variant={searchUser.isFollowing ? "outline" : "default"}
                          onClick={() => handleFollowUser(searchUser._id)}
                        >
                          {searchUser.isFollowing ? "Following" : "Follow"}
                        </Button>
                      )}
                    </div>
                  ))}
                  {searchQuery && !isSearching && searchResults.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No users found
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Real-time Features Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Features</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Live posts & updates</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Instant notifications</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Online user status</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Live reactions & comments</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}