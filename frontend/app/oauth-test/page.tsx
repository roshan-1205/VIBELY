'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useState, useEffect } from 'react'

export default function OAuthTestPage() {
  const [backendStatus, setBackendStatus] = useState<'loading' | 'connected' | 'error'>('loading')
  const [oauthStatus, setOauthStatus] = useState<{
    google: boolean
    microsoft: boolean
  }>({ google: false, microsoft: false })

  useEffect(() => {
    checkBackendStatus()
  }, [])

  const checkBackendStatus = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
      if (response.ok) {
        setBackendStatus('connected')
        // Check OAuth configuration by attempting to access OAuth endpoints
        checkOAuthConfig()
      } else {
        setBackendStatus('error')
      }
    } catch (error) {
      setBackendStatus('error')
    }
  }

  const checkOAuthConfig = async () => {
    try {
      // Test Google OAuth endpoint
      const googleResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
        method: 'HEAD'
      })
      
      // Test Microsoft OAuth endpoint  
      const microsoftResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/microsoft`, {
        method: 'HEAD'
      })

      setOauthStatus({
        google: googleResponse.status !== 500,
        microsoft: microsoftResponse.status !== 500
      })
    } catch (error) {
      console.error('OAuth config check failed:', error)
    }
  }

  const testGoogleOAuth = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
  }

  const testMicrosoftOAuth = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/microsoft`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">OAuth Integration Test</h1>
          <p className="text-gray-600">Test Google and Microsoft OAuth integration</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Backend Status */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Backend Status</h2>
            {backendStatus === 'loading' && (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Checking backend connection...</span>
              </div>
            )}
            {backendStatus === 'connected' && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  ✅ Backend server is running and accessible
                </AlertDescription>
              </Alert>
            )}
            {backendStatus === 'error' && (
              <Alert variant="destructive">
                <AlertDescription>
                  ❌ Cannot connect to backend server
                </AlertDescription>
              </Alert>
            )}
          </Card>

          {/* OAuth Configuration Status */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">OAuth Configuration</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Google OAuth:</span>
                <span className={oauthStatus.google ? 'text-green-600' : 'text-red-600'}>
                  {oauthStatus.google ? '✅ Configured' : '❌ Not Configured'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Microsoft OAuth:</span>
                <span className={oauthStatus.microsoft ? 'text-green-600' : 'text-red-600'}>
                  {oauthStatus.microsoft ? '✅ Configured' : '❌ Not Configured'}
                </span>
              </div>
            </div>
          </Card>

          {/* Google OAuth Test */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google OAuth Test
            </h2>
            <p className="text-gray-600 mb-4">
              Test Google OAuth integration by clicking the button below.
            </p>
            <Button 
              onClick={testGoogleOAuth}
              disabled={!oauthStatus.google || backendStatus !== 'connected'}
              className="w-full"
            >
              {oauthStatus.google ? 'Test Google Sign In' : 'Google OAuth Not Configured'}
            </Button>
            {!oauthStatus.google && (
              <p className="text-sm text-red-600 mt-2">
                Configure Google OAuth credentials in backend/.env
              </p>
            )}
          </Card>

          {/* Microsoft OAuth Test */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#f1511b" d="M11.4 11.4H0V0h11.4z"/>
                <path fill="#80cc28" d="M24 11.4H12.6V0H24z"/>
                <path fill="#00adef" d="M11.4 24H0V12.6h11.4z"/>
                <path fill="#fbbc09" d="M24 24H12.6V12.6H24z"/>
              </svg>
              Microsoft OAuth Test
            </h2>
            <p className="text-gray-600 mb-4">
              Test Microsoft OAuth integration by clicking the button below.
            </p>
            <Button 
              onClick={testMicrosoftOAuth}
              disabled={!oauthStatus.microsoft || backendStatus !== 'connected'}
              className="w-full"
            >
              {oauthStatus.microsoft ? 'Test Microsoft Sign In' : 'Microsoft OAuth Not Configured'}
            </Button>
            {!oauthStatus.microsoft && (
              <p className="text-sm text-red-600 mt-2">
                Configure Microsoft OAuth credentials in backend/.env
              </p>
            )}
          </Card>
        </div>

        {/* Setup Instructions */}
        <Card className="p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              To enable OAuth integration, you need to obtain credentials from Google and Microsoft:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-blue-600">Google OAuth Setup:</h3>
                <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
                  <li>Go to <a href="https://console.cloud.google.com/" target="_blank" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
                  <li>Create/select project and enable Google+ API</li>
                  <li>Create OAuth 2.0 credentials</li>
                  <li>Add redirect URI: <code className="bg-gray-100 px-1 rounded">http://localhost:5001/api/auth/google/callback</code></li>
                  <li>Update GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env</li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold text-orange-600">Microsoft OAuth Setup:</h3>
                <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
                  <li>Go to <a href="https://portal.azure.com/" target="_blank" className="text-blue-600 hover:underline">Azure Portal</a></li>
                  <li>Register new application in Azure AD</li>
                  <li>Add redirect URI: <code className="bg-gray-100 px-1 rounded">http://localhost:5001/api/auth/microsoft/callback</code></li>
                  <li>Create client secret</li>
                  <li>Update MICROSOFT_CLIENT_ID and MICROSOFT_CLIENT_SECRET in .env</li>
                </ol>
              </div>
            </div>
            <Alert className="mt-4">
              <AlertDescription>
                📖 See <code>OAUTH_SETUP_GUIDE.md</code> for detailed step-by-step instructions.
              </AlertDescription>
            </Alert>
          </div>
        </Card>

        <div className="text-center mt-6">
          <Button asChild variant="outline">
            <a href="/signin">← Back to Sign In</a>
          </Button>
        </div>
      </div>
    </div>
  )
}