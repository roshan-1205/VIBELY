"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function SimpleSignInPage() {
  const { login, user, isLoading, error } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('testuser@example.com')
  const [password, setPassword] = useState('TestPass123')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
    console.log(message)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    addLog('Starting login process...')

    try {
      addLog(`Attempting login with email: ${email}`)
      const success = await login(email, password)
      addLog(`Login result: ${success}`)
      
      if (success) {
        addLog('Login successful! User should be set in context.')
        addLog('Redirecting to hero page...')
        router.push('/hero')
      } else {
        addLog('Login failed - success was false')
      }
    } catch (err: any) {
      addLog(`Login error: ${err.message}`)
    } finally {
      setIsSubmitting(false)
      addLog('Login process completed')
    }
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Simple Sign In Test</h1>
        
        {/* Current State */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Current State</h2>
          <div className="space-y-2 text-sm">
            <div><strong>User:</strong> {user ? `${user.firstName} ${user.lastName} (${user.email})` : 'Not logged in'}</div>
            <div><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</div>
            <div><strong>Error:</strong> {error || 'None'}</div>
            <div><strong>Token:</strong> {typeof window !== 'undefined' && localStorage.getItem('vibely_token') ? 'Present' : 'Not found'}</div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Login Form</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Navigation</h2>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/signin')}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Go to Regular Sign In
            </button>
            <button
              onClick={() => router.push('/hero')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Go to Hero Page
            </button>
            <button
              onClick={() => router.push('/debug')}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              Go to Debug Page
            </button>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Logs</h2>
            <button
              onClick={clearLogs}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
            >
              Clear
            </button>
          </div>
          <div className="bg-gray-100 p-4 rounded max-h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-sm">No logs yet</p>
            ) : (
              <div className="space-y-1">
                {logs.map((log, index) => (
                  <div key={index} className="text-xs font-mono">{log}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}