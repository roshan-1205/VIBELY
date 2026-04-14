"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
  }

  // Redirect authenticated users to hero page
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/hero')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-6 md:px-8 lg:px-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto">
        <div className="space-y-3 sm:space-y-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl sm:text-2xl mx-auto">
            V
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Welcome to Vibely
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-md sm:max-w-lg md:max-w-2xl mx-auto px-4">
            Connect with friends, share your moments, and discover new experiences together.
          </p>
        </div>
        
        {user ? (
          // Authenticated user content
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 border shadow-sm mx-4 sm:mx-0">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Hello, {user.firstName}! 👋
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Welcome back to Vibely. Ready to explore?
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/hero">Go to Dashboard</Link>
              </Button>
              <Button variant="outline" size="lg" onClick={handleLogout} className="w-full sm:w-auto">
                Logout
              </Button>
            </div>
          </div>
        ) : (
          // Non-authenticated user content
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/signin">Sign In</Link>
            </Button>
          </div>
        )}
        
        <div className="text-xs sm:text-sm text-gray-500 px-4">
          {user ? (
            `Logged in as ${user.email}`
          ) : (
            'Join thousands of users already using Vibely'
          )}
        </div>
      </div>
    </main>
  )
}