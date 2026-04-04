'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setMessage('')

    if (!email.trim()) {
      setError('Email is required')
      setIsSubmitting(false)
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.trim() })
      })

      const data = await response.json()

      if (data.success) {
        setIsSuccess(true)
        setMessage(data.message)
      } else {
        setError(data.message || 'Failed to send reset email')
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-8">
      <Card className="p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block mb-4">
            <div className="w-12 h-12 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold text-xl mx-auto">
              V
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h1>
          <p className="text-gray-600">
            {isSuccess 
              ? "Check your email for reset instructions" 
              : "Enter your email to receive a password reset link"
            }
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {message && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{message}</AlertDescription>
          </Alert>
        )}

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                disabled={isSubmitting}
                className="w-full"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending Reset Link...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-green-500 text-4xl">📧</div>
            <p className="text-sm text-gray-600">
              If an account with that email exists, we've sent you a password reset link.
            </p>
            <p className="text-sm text-gray-600">
              Please check your email and follow the instructions to reset your password.
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/signin" className="text-sm text-blue-600 hover:underline">
            Back to Sign In
          </Link>
          <span className="mx-2 text-gray-400">|</span>
          <Link href="/signup" className="text-sm text-blue-600 hover:underline">
            Create Account
          </Link>
          <span className="mx-2 text-gray-400">|</span>
          <Link href="/oauth-test" className="text-sm text-purple-600 hover:underline">
            Test OAuth
          </Link>
        </div>
      </Card>
    </div>
  )
}