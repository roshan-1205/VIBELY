'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, Users, UserPlus, MessageSquare, Heart } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { apiService, type User } from '@/services/api'
import { ProfileAvatar } from '@/components/ui/profile-avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default function SearchPage() {
  const { user: currentUser } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [discoverUsers, setDiscoverUsers] = useState<User[]>([])
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Debounced search function
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    try {
      setIsSearching(true)
      const response = await apiService.searchUsers(query.trim())
      if (response.success && response.data) {
        setSearchResults(response.data.users)
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, performSearch])

  // Load discover and online users
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true)
        const [discoverResponse, onlineResponse] = await Promise.all([
          apiService.discoverUsers(1, 10),
          apiService.getOnlineUsers(20)
        ])

        if (discoverResponse.success && discoverResponse.data) {
          setDiscoverUsers(discoverResponse.data.users)
        }

        if (onlineResponse.success && onlineResponse.data) {
          setOnlineUsers(onlineResponse.data.users)
        }
      } catch (error) {
        console.error('Error loading initial data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [])

  const handleFollowToggle = async (userId: string, isCurrentlyFollowing: boolean) => {
    try {
      const response = await apiService.followUser(userId)
      if (response.success) {
        // Update the user in all relevant arrays
        const updateUser = (user: User) => 
          user._id === userId 
            ? { ...user, isFollowing: response.data?.isFollowing }
            : user

        setSearchResults(prev => prev.map(updateUser))
        setDiscoverUsers(prev => prev.map(updateUser))
        setOnlineUsers(prev => prev.map(updateUser))
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
    }
  }

  const UserCard = ({ user }: { user: User }) => (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <ProfileAvatar
          userId={user._id}
          firstName={user.firstName}
          lastName={user.lastName}
          size="md"
          linkToProfile={true}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Link href={`/profile/${user._id}`}>
              <h3 className="font-semibold text-gray-900 hover:text-purple-600 transition-colors">
                {user.firstName} {user.lastName}
              </h3>
            </Link>
            {user.isOnline && (
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            )}
          </div>
          <p className="text-sm text-gray-500">{user.email}</p>
          {user.bio && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{user.bio}</p>
          )}
          {user.stats && (
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>{user.stats.posts} posts</span>
              <span>{user.stats.followers} followers</span>
              <span>{user.stats.following} following</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {user._id !== currentUser?._id && (
            <>
              <Button
                variant={user.isFollowing ? "default" : "outline"}
                size="sm"
                onClick={() => handleFollowToggle(user._id, user.isFollowing || false)}
              >
                <Heart className={`w-4 h-4 mr-1 ${user.isFollowing ? 'fill-current' : ''}`} />
                {user.isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/hero" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-md flex items-center justify-center text-white font-bold">
                  V
                </div>
                <span className="font-semibold text-lg">Vibely</span>
              </Link>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <Users className="w-3 h-3 mr-1" />
                Search Users
              </Badge>
            </div>
            <Link href="/hero">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            🔍 Find People on Vibely
          </motion.h1>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Results */}
          <div className="lg:col-span-2">
            {searchQuery ? (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Search Results {isSearching && <span className="text-sm text-gray-500">(searching...)</span>}
                </h2>
                {isSearching ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-4">
                    {searchResults.map((user) => (
                      <UserCard key={user._id} user={user} />
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                    <p className="text-gray-500">Try searching with different keywords</p>
                  </Card>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Discover New People</h2>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : discoverUsers.length > 0 ? (
                  <div className="space-y-4">
                    {discoverUsers.map((user) => (
                      <UserCard key={user._id} user={user} />
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No new users to discover</h3>
                    <p className="text-gray-500">Check back later for new members</p>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Online Users */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Online Now ({onlineUsers.length})
              </h3>
              {onlineUsers.length > 0 ? (
                <div className="space-y-3">
                  {onlineUsers.slice(0, 8).map((user) => (
                    <div key={user._id} className="flex items-center gap-3">
                      <ProfileAvatar
                        userId={user._id}
                        firstName={user.firstName}
                        lastName={user.lastName}
                        size="sm"
                        linkToProfile={true}
                      />
                      <div className="flex-1 min-w-0">
                        <Link href={`/profile/${user._id}`}>
                          <p className="text-sm font-medium text-gray-900 truncate hover:text-purple-600">
                            {user.firstName} {user.lastName}
                          </p>
                        </Link>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      {user._id !== currentUser?._id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFollowToggle(user._id, user.isFollowing || false)}
                        >
                          <UserPlus className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {onlineUsers.length > 8 && (
                    <p className="text-xs text-gray-500 text-center pt-2">
                      +{onlineUsers.length - 8} more online
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No users online right now</p>
              )}
            </Card>

            {/* Search Tips */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-3">💡 Search Tips</h3>
              <div className="space-y-2 text-sm text-purple-700">
                <p>• Search by first name, last name, or email</p>
                <p>• Use partial names to find matches</p>
                <p>• Check out the "Discover" section for new users</p>
                <p>• See who's online in the sidebar</p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}