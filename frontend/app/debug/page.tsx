"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function DebugPage() {
  const { user, login, signup, isLoading, error, clearError } = useAuth()
  const router = useRouter()
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [testResults, setTestResults] = useState<any[]>([])

  useEffect(() => {
    // Collect debug information
    const info = {
      user: user,
      isLoading: isLoading,
      error: error,
      localStorage: {
        token: typeof window !== 'undefined' ? localStorage.getItem('vibely_token') : null,
        user: typeof window !== 'undefined' ? localStorage.getItem('vibely_user') : null,
      },
      environment: {
        apiUrl: process.env.NEXT_PUBLIC_API_URL,
        currentUrl: typeof window !== 'undefined' ? window.location.href : null,
      }
    }
    setDebugInfo(info)
  }, [user, isLoading, error])

  const testLogin = async () => {
    const result = { timestamp: new Date().toISOString(), action: 'login' }
    try {
      console.log('Starting login test...')
      const success = await login('testuser@example.com', 'TestPass123')
      setTestResults(prev => [...prev, { ...result, success, error: null }])
      console.log('Login test result:', success)
    } catch (err: any) {
      console.error('Login test error:', err)
      setTestResults(prev => [...prev, { ...result, success: false, error: err.message }])
    }
  }

  const testSignup = async () => {
    const result = { timestamp: new Date().toISOString(), action: 'signup' }
    try {
      console.log('Starting signup test...')
      const success = await signup(
        `test${Date.now()}@example.com`, 
        'TestPass123', 
        'Test', 
        'User'
      )
      setTestResults(prev => [...prev, { ...result, success, error: null }])
      console.log('Signup test result:', success)
    } catch (err: any) {
      console.error('Signup test error:', err)
      setTestResults(prev => [...prev, { ...result, success: false, error: err.message }])
    }
  }

  const clearStorage = () => {
    localStorage.removeItem('vibely_token')
    localStorage.removeItem('vibely_user')
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Authentication Debug Page</h1>
        
        {/* Current State */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Current Authentication State</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={testLogin}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Test Login
            </button>
            <button
              onClick={testSignup}
              disabled={isLoading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              Test Signup
            </button>
            <button
              onClick={clearStorage}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear Storage
            </button>
            <button
              onClick={() => router.push('/signin')}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Go to Sign In
            </button>
            <button
              onClick={() => router.push('/hero')}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              Go to Hero
            </button>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          {testResults.length === 0 ? (
            <p className="text-gray-500">No tests run yet.</p>
          ) : (
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="border rounded p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{result.action}</span>
                    <span className="text-sm text-gray-500">{result.timestamp}</span>
                  </div>
                  <div className={`p-3 rounded text-sm ${
                    result.success 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    <div className="font-medium mb-1">
                      {result.success ? '✅ Success' : '❌ Failed'}
                    </div>
                    {result.error && (
                      <div className="text-xs">Error: {result.error}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-800">Current Error</h2>
            <p className="text-red-700">{error}</p>
            <button
              onClick={clearError}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear Error
            </button>
          </div>
        )}
      </div>
    </div>
  )
}