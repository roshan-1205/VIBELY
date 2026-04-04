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
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-2xl mx-auto">
            V
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Welcome to Vibely</h1>
          <p className="text-xl text-gray-600 max-w-md">
            Connect with friends, share your moments, and discover new experiences together.
          </p>
        </div>
        
        {user ? (
          // Authenticated user content
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Hello, {user.firstName}! 👋
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Welcome back to Vibely. Ready to explore?
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/hero">Go to Dashboard</Link>
              </Button>
              <Button variant="outline" size="lg" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        ) : (
          // Non-authenticated user content
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/simple-login">Quick Test Login</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/hero">View Hero Demo</Link>
            </Button>
          </div>
        )}
        
        <div className="text-sm text-gray-500">
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