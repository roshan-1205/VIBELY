'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const token = searchParams.get('token')
        const provider = searchParams.get('provider')
        const error = searchParams.get('error')

        if (error) {
          setStatus('error')
          setMessage('Authentication failed. Please try again.')
          return
        }

        if (!token) {
          setStatus('error')
          setMessage('No authentication token received.')
          return
        }

        // Store the token
        localStorage.setItem('vibely_token', token)
        
        // Verify the token by making a request to get user data
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-token`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data?.user) {
            localStorage.setItem('vibely_user', JSON.stringify(data.data.user))
            setStatus('success')
            setMessage(`Successfully signed in with ${provider}!`)
            
            // Immediate redirect for better UX
            router.push('/hero')
          } else {
            throw new Error('Invalid token response')
          }
        } else {
          throw new Error('Token verification failed')
        }

      } catch (error) {
        console.error('OAuth callback error:', error)
        setStatus('error')
        setMessage('Authentication failed. Please try again.')
        
        // Clear any stored tokens
        localStorage.removeItem('vibely_token')
        localStorage.removeItem('vibely_user')
      }
    }

    handleOAuthCallback()
  }, [searchParams, router])

  if (user) {
    // User is already authenticated, redirect to dashboard
    router.push('/hero')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-8">
      <Card className="p-8 text-center max-w-md">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold mb-2">Completing Sign In...</h1>
            <p className="text-gray-600">Please wait while we set up your account.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-green-500 text-4xl mb-4">✅</div>
            <h1 className="text-xl font-semibold text-green-600 mb-2">Sign In Successful!</h1>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-red-500 text-4xl mb-4">❌</div>
            <h1 className="text-xl font-semibold text-red-600 mb-2">Sign In Failed</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/signin">Try Again</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-8">
        <Card className="p-8 text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold mb-2">Loading...</h1>
          <p className="text-gray-600">Please wait...</p>
        </Card>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}