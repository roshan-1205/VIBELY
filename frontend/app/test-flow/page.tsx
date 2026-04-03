"use client"

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function TestFlowPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [testResults, setTestResults] = useState<string[]>([])

  useEffect(() => {
    const results: string[] = []
    
    // Test 1: Check if user is authenticated
    if (user) {
      results.push('✅ User is authenticated')
      results.push(`✅ User ID: ${user._id}`)
      results.push(`✅ User Name: ${user.firstName} ${user.lastName}`)
      results.push(`✅ User Email: ${user.email}`)
    } else {
      results.push('❌ User is not authenticated')
    }
    
    // Test 2: Check if hero page redirect works
    if (user && window.location.pathname !== '/hero') {
      results.push('⚠️ User is authenticated but not on hero page')
    } else if (user) {
      results.push('✅ User is on correct page (hero)')
    }
    
    // Test 3: Check localStorage
    const token = localStorage.getItem('vibely_token')
    const storedUser = localStorage.getItem('vibely_user')
    
    if (token) {
      results.push('✅ Auth token exists in localStorage')
    } else {
      results.push('❌ No auth token in localStorage')
    }
    
    if (storedUser) {
      results.push('✅ User data exists in localStorage')
    } else {
      results.push('❌ No user data in localStorage')
    }
    
    setTestResults(results)
  }, [user])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Vibely System Test</h1>
          <p className="text-muted-foreground">
            This page tests the authentication flow and system integration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Test Results */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Navigation</h2>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/">Home Page</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/hero">Hero Page</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* User Information */}
        {user && (
          <div className="mt-8 bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>ID:</strong> {user._id}
              </div>
              <div>
                <strong>Name:</strong> {user.firstName} {user.lastName}
              </div>
              <div>
                <strong>Email:</strong> {user.email}
              </div>
              <div>
                <strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}
              </div>
              <div>
                <strong>Email Verified:</strong> {user.isEmailVerified ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>If not logged in, go to Sign In page and log in with valid credentials</li>
            <li>After successful login, you should be automatically redirected to Hero page</li>
            <li>The Hero page should display the shuffle grid with "Explore The Future" and "With Us ❤️" text</li>
            <li>Profile avatar should be clickable and show profile popup</li>
            <li>Welcome popup should show only once per login session</li>
            <li>Profile image upload should work and persist across sessions</li>
          </ol>
        </div>
      </div>
    </div>
  )
}