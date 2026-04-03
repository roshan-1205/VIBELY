"use client"

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'

// Icons for alerts
const AlertCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const CheckCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
)

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

const WarningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

export default function TestAlertsPage() {
  const [showDemoAlerts, setShowDemoAlerts] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <div className="w-12 h-12 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold text-xl">
              V
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Alert System Demo</h1>
          <p className="text-gray-600">Enhanced alerts for login and signup pages</p>
        </div>

        <div className="space-y-6">
          {/* Error Alerts */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Error Alerts</h2>
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle />
                <AlertDescription>
                  Invalid email or password. Please check your credentials and try again.
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <AlertCircle />
                <AlertDescription>
                  An account with this email already exists. Please try signing in instead.
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <AlertCircle />
                <AlertDescription>
                  Your account has been deactivated. Please contact support for assistance.
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <AlertCircle />
                <AlertDescription>
                  Password must contain at least one uppercase letter, one lowercase letter, and one number.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Success Alerts */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Success Alerts</h2>
            <div className="space-y-4">
              <Alert variant="success">
                <CheckCircle />
                <AlertDescription>
                  Login successful! Redirecting to your dashboard...
                </AlertDescription>
              </Alert>

              <Alert variant="success">
                <CheckCircle />
                <AlertDescription>
                  Account created successfully! Welcome to Vibely!
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Warning Alerts */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Warning Alerts</h2>
            <div className="space-y-4">
              <Alert variant="warning">
                <WarningIcon />
                <AlertDescription>
                  Your session will expire in 5 minutes. Please save your work.
                </AlertDescription>
              </Alert>

              <Alert variant="warning">
                <WarningIcon />
                <AlertDescription>
                  Too many login attempts. Please wait 15 minutes before trying again.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Info Alerts */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Info Alerts</h2>
            <div className="space-y-4">
              <Alert variant="info">
                <InfoIcon />
                <AlertDescription>
                  We've sent a verification email to your address. Please check your inbox.
                </AlertDescription>
              </Alert>

              <Alert variant="info">
                <InfoIcon />
                <AlertDescription>
                  Your password must be at least 6 characters long and contain uppercase, lowercase, and numbers.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Interactive Demo</h2>
            <div className="space-y-4">
              <Button 
                onClick={() => setShowDemoAlerts(!showDemoAlerts)}
                className="mb-4"
              >
                {showDemoAlerts ? 'Hide' : 'Show'} Demo Alerts
              </Button>

              {showDemoAlerts && (
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <AlertCircle />
                    <AlertTitle>Login Failed</AlertTitle>
                    <AlertDescription>
                      The password you entered is incorrect. Please try again or reset your password.
                    </AlertDescription>
                  </Alert>

                  <Alert variant="success">
                    <CheckCircle />
                    <AlertTitle>Welcome Back!</AlertTitle>
                    <AlertDescription>
                      You have successfully signed in to your Vibely account.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h2 className="text-xl font-semibold mb-4">Test the Enhanced Login System</h2>
            <div className="space-x-4">
              <Button asChild>
                <Link href="/signin">Test Sign In</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/signup">Test Sign Up</Link>
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Try entering invalid credentials to see the enhanced error messages in action!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}