"use client"

import { ShuffleHero } from '@/components/ui/shuffle-grid'
import { LimelightNav, NavItem } from '@/components/ui/limelight-nav'
import { WelcomePopup } from '@/components/ui/welcome-popup'
import { ProfilePopup } from '@/components/ui/profile-popup'
import { ProfileAvatar } from '@/components/ui/profile-avatar'
import { VoiceWelcomeCompact } from '@/components/ui/voice-welcome'
import AvatarNotifications from '@/components/ui/avatar-notifications'
import { PostsFeed } from '@/components/ui/posts-feed'
import { MessagingPopup } from '@/components/ui/messaging-popup-fixed'
import { CreatePostPopup } from '@/components/ui/create-post-popup'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Home, Search, PlusCircle, Heart, User, MessageCircle } from 'lucide-react'

export default function HeroPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [showWelcomePopup, setShowWelcomePopup] = useState(false)
  const [showProfilePopup, setShowProfilePopup] = useState(false)
  const [showMessagingPopup, setShowMessagingPopup] = useState(false)
  const [showCreatePostPopup, setShowCreatePostPopup] = useState(false)

  // Social media navigation items
  const socialNavItems: NavItem[] = [
    { 
      id: 'home', 
      icon: <Home />, 
      label: 'Home', 
      onClick: () => console.log('Home clicked') 
    },
    { 
      id: 'search', 
      icon: <Search />, 
      label: 'Search', 
      onClick: () => router.push('/search') 
    },
    { 
      id: 'create', 
      icon: <PlusCircle />, 
      label: 'Create', 
      onClick: () => setShowCreatePostPopup(true) 
    },
    { 
      id: 'activity', 
      icon: <Heart />, 
      label: 'Activity', 
      onClick: () => router.push('/posts-showcase') 
    },
    { 
      id: 'messages', 
      icon: <MessageCircle />, 
      label: 'Messages', 
      onClick: () => setShowMessagingPopup(true) 
    },
    { 
      id: 'profile', 
      icon: <User />, 
      label: 'Profile', 
      onClick: () => setShowProfilePopup(true)
    },
  ]

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin')
    }
  }, [user, isLoading, router])

  // Show welcome popup only once when user logs in
  useEffect(() => {
    if (user && !isLoading) {
      const hasSeenWelcome = localStorage.getItem(`vibely_welcome_${user._id}`)
      if (!hasSeenWelcome) {
        setShowWelcomePopup(true)
      }
    }
  }, [user, isLoading])

  const handleCloseWelcomePopup = () => {
    setShowWelcomePopup(false)
    if (user) {
      localStorage.setItem(`vibely_welcome_${user._id}`, 'true')
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect via useEffect
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Welcome Popup - Shows only once when user logs in */}
      <WelcomePopup 
        isOpen={showWelcomePopup}
        onClose={handleCloseWelcomePopup}
        userName={user?.firstName}
        userEmail={user?.email}
      />

      {/* Profile Popup - Shows when user clicks profile icon */}
      <ProfilePopup 
        isOpen={showProfilePopup}
        onClose={() => setShowProfilePopup(false)}
      />

      {/* Messaging Popup - Shows when user clicks messages icon */}
      <MessagingPopup 
        isOpen={showMessagingPopup}
        onClose={() => setShowMessagingPopup(false)}
      />

      {/* Create Post Popup - Shows when user clicks create icon */}
      <CreatePostPopup 
        isOpen={showCreatePostPopup}
        onClose={() => setShowCreatePostPopup(false)}
      />

      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold">
            V
          </div>
          <span className="font-semibold text-lg">Vibely</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <AvatarNotifications />
            <ProfileAvatar 
              userId={user._id}
              firstName={user.firstName}
              lastName={user.lastName}
              size="sm"
              onClick={() => setShowProfilePopup(true)}
            />
            <span>Welcome, {user.firstName}!</span>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </nav>

      {/* Welcome Message */}
      <div className="max-w-6xl mx-auto px-8 py-4">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-8 relative">
          <div className="flex items-center gap-3 mb-2">
            <ProfileAvatar 
              userId={user._id}
              firstName={user.firstName}
              lastName={user.lastName}
              size="md"
              onClick={() => setShowProfilePopup(true)}
            />
            <h2 className="text-lg font-semibold text-primary">
              🎉 Welcome to Vibely, {user.firstName} {user.lastName}!
            </h2>
            {/* Voice Welcome */}
            <div className="ml-auto">
              <VoiceWelcomeCompact
                profileOwnerName={`${user.firstName} ${user.lastName}`}
                visitorName={user.firstName}
                customMessage={`Welcome to Vibely, ${user.firstName}!`}
                className="ml-2"
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            You've successfully signed in with {user.email}. Explore the amazing features below!
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-blue-950/20">
        <ShuffleHero />
      </div>

      {/* Posts Feed Section */}
      <section className="py-8 px-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-foreground mb-6">Your Feed</h2>
        <PostsFeed />
      </section>

      {/* Additional Content */}
      <section className="py-16 px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Experience the Difference
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users who have transformed their daily routine with our innovative approach. 
            Discover what makes us unique and why our community keeps growing.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Experience blazing fast performance with our optimized platform designed for speed.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your data is protected with enterprise-grade security and privacy measures.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Community Driven</h3>
              <p className="text-muted-foreground">
                Join a vibrant community of like-minded individuals sharing the same goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Dashboard Section */}
      <section className="py-16 px-8 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            Your Dashboard
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {user.firstName} {user.lastName}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">User ID:</span> {user._id}</p>
                <p><span className="font-medium">Member since:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
                <p><span className="font-medium">Email Verified:</span> {user.isEmailVerified ? '✅ Yes' : '❌ No'}</p>
                <p><span className="font-medium">Last Login:</span> {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}</p>
                <p><span className="font-medium">Account Status:</span> {user.isActive ? '✅ Active' : '❌ Inactive'}</p>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Edit Profile
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/posts-showcase')}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Posts Showcase
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold text-sm">
              V
            </div>
            <span className="font-semibold">Vibely</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2026 Vibely. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Floating Social Media Navigation */}
      <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        showProfilePopup || showMessagingPopup || showCreatePostPopup ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100 pointer-events-auto translate-y-0'
      }`}>
        <LimelightNav 
          items={socialNavItems}
          defaultActiveIndex={0}
          className="bg-background/95 backdrop-blur-md border-2 shadow-2xl shadow-primary/20 rounded-2xl"
          limelightClassName="bg-gradient-to-r from-purple-500 to-pink-500"
          onTabChange={(index) => console.log(`Switched to tab ${index}`)}
        />
      </div>
    </main>
  )
}