'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Mail, MapPin, Heart, MessageSquare, Share2, MoreHorizontal } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { apiService, type User } from '@/services/api'
import { AdaptiveSplineScene } from '@/components/ui/adaptive-spline'
import { ProfileAvatar } from '@/components/ui/profile-avatar'
import { VoiceWelcome } from '@/components/ui/voice-welcome'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Spotlight } from '@/components/ui/spotlight'
import { useProfileImage } from '@/hooks/useProfileImage'
import AvatarNotifications from '@/components/ui/avatar-notifications'
import { PostsFeed } from '@/components/ui/posts-feed'
import Link from 'next/link'

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user: currentUser } = useAuth()
  const [profileUser, setProfileUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null)
  
  const userId = params.userId as string
  const { profileImage } = useProfileImage(userId)
  
  const isOwnProfile = currentUser?._id === userId

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return

      try {
        setIsLoading(true)
        setError(null)

        // If viewing own profile, use current user data
        if (isOwnProfile && currentUser) {
          const profileResponse = await apiService.getProfile()
          if (profileResponse.success && profileResponse.data) {
            setProfileUser(profileResponse.data.user)
          } else {
            setProfileUser(currentUser)
          }
        } else {
          // Fetch other user's profile
          const profileResponse = await apiService.getUserProfile(userId)
          if (profileResponse.success && profileResponse.data) {
            setProfileUser(profileResponse.data.user)
            setIsFollowing(profileResponse.data.user.isFollowing ?? null)
          } else {
            throw new Error('Profile not found')
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
        setError(err instanceof Error ? err.message : 'Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [userId, currentUser, isOwnProfile])

  const handleFollowToggle = async () => {
    if (!profileUser || isOwnProfile) return

    try {
      const response = await apiService.followUser(profileUser._id)
      if (response.success && response.data) {
        setIsFollowing(response.data.isFollowing)
        // Update follower count in profile user
        if (profileUser.stats) {
          setProfileUser({
            ...profileUser,
            stats: {
              ...profileUser.stats,
              followers: response.data.followerCount
            }
          })
        }
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'This profile does not exist.'}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const memberSince = new Date(profileUser.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <ProfileAvatar
                  userId={profileUser._id}
                  firstName={profileUser.firstName}
                  lastName={profileUser.lastName}
                  size="sm"
                />
                <div>
                  <h1 className="font-semibold text-gray-900">
                    {profileUser.firstName} {profileUser.lastName}
                  </h1>
                  <p className="text-sm text-gray-500">@{profileUser.firstName.toLowerCase()}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <AvatarNotifications />
              {!isOwnProfile && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleFollowToggle}
                    disabled={isFollowing === null}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-current text-red-500' : ''}`} />
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </>
              )}
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Robot & Voice Welcome */}
          <div className="lg:col-span-2">
            <Card className="p-0 overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative">
              <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
              />
              
              {/* Voice Welcome - Prominent Position */}
              <div className="absolute top-6 right-6 z-20">
                <VoiceWelcome
                  profileOwnerName={`${profileUser.firstName} ${profileUser.lastName}`}
                  visitorName={currentUser ? `${currentUser.firstName}` : undefined}
                  customMessage={
                    isOwnProfile 
                      ? `Welcome back, ${profileUser.firstName}!`
                      : `Hello! Welcome to ${profileUser.firstName}'s profile.`
                  }
                  size="lg"
                  showControls={true}
                  className="drop-shadow-2xl"
                />
              </div>

              {/* Robot Scene */}
              <div className="h-96 relative">
                <AdaptiveSplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                  profileImage={profileImage}
                  userId={profileUser._id}
                  debug={false}
                />
              </div>

              {/* Profile Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-white"
                >
                  <h2 className="text-3xl font-bold mb-2">
                    {profileUser.firstName} {profileUser.lastName}
                  </h2>
                  <p className="text-white/80 mb-4">
                    {isOwnProfile ? 'Your Digital Space' : `${profileUser.firstName}'s Digital Space`}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Member since {memberSince}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>{profileUser.email}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </Card>
          </div>

          {/* Right Column - Profile Details */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Profile Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {profileUser.stats?.posts || 0}
                  </div>
                  <div className="text-sm text-gray-500">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">
                    {profileUser.stats?.followers || 0}
                  </div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {profileUser.stats?.following || 0}
                  </div>
                  <div className="text-sm text-gray-500">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {profileUser.isOnline ? 'Online' : 'Offline'}
                  </div>
                  <div className="text-sm text-gray-500">Status</div>
                </div>
              </div>
            </Card>

            {/* About Card */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">About</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {isOwnProfile 
                  ? "This is your profile! Your robot assistant will welcome visitors and help them learn more about you."
                  : `Welcome to ${profileUser.firstName}'s profile! This is their digital space where you can learn more about them and connect.`
                }
              </p>
            </Card>

            {/* Robot Info Card */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-4">🤖 Robot Assistant</h3>
              <p className="text-purple-700 text-sm leading-relaxed mb-4">
                {isOwnProfile 
                  ? "Your robot welcomes visitors to your profile with personalized voice messages."
                  : `${profileUser.firstName}'s robot welcomes you to their profile. The robot's appearance adapts to ${profileUser.firstName}'s profile image.`
                }
              </p>
              <div className="flex items-center gap-2 text-xs text-purple-600">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Robot Assistant Active</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {isOwnProfile ? 'Your Posts' : `${profileUser.firstName}'s Posts`}
          </h2>
          <PostsFeed userId={profileUser._id} />
        </div>
      </main>
    </div>
  )
}