'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

export default function SimpleLoginPage() {
  const { login, user, isLoading, error } = useAuth()
  const [email, setEmail] = useState('test@vibely.com')
  const [password, setPassword] = useState('test123')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    console.log('Attempting login with:', { email, password: '[HIDDEN]' })
    const success = await login(email, password)
    console.log('Login result:', success)
    
    setIsSubmitting(false)
  }

  const handleQuickLogin = async (testEmail: string, testPassword: string) => {
    setEmail(testEmail)
    setPassword(testPassword)
    setIsSubmitting(true)
    
    console.log('Quick login with:', { email: testEmail, password: '[HIDDEN]' })
    const success = await login(testEmail, testPassword)
    console.log('Quick login result:', success)
    
    setIsSubmitting(false)
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-8">
        <Card className="p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-green-600 mb-4">✅ Login Successful!</h1>
          <div className="space-y-2 text-left">
            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user._id}</p>
            <p><strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}</p>
          </div>
          <div className="mt-6 space-y-3">
            <Button asChild className="w-full">
              <Link href="/hero">Go to Dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/realtime-demo">Real-time Demo</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/system-test">System Test</Link>
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-8">
      <Card className="p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Simple Login Test</h1>
          <p className="text-gray-600">Test authentication functionality</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={isSubmitting}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-3">Quick Login (Test Accounts):</p>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-left justify-start"
              onClick={() => handleQuickLogin('test@vibely.com', 'test123')}
              disabled={isSubmitting}
            >
              Test User (test@vibely.com / test123)
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-left justify-start"
              onClick={() => handleQuickLogin('demo@vibely.com', 'demo123')}
              disabled={isSubmitting}
            >
              Demo Account (demo@vibely.com / demo123)
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/signup" className="text-sm text-blue-600 hover:underline">
            Create New Account
          </Link>
          <span className="mx-2 text-gray-400">|</span>
          <Link href="/signin" className="text-sm text-blue-600 hover:underline">
            Full Login Page
          </Link>
        </div>
      </Card>
    </div>
  )
}