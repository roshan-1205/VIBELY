'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSocket } from '@/contexts/SocketContext'
import { apiService } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'error'
  message: string
  duration?: number
}

export default function SystemTestPage() {
  const { user } = useAuth()
  const { socket, isConnected } = useSocket()
  const [tests, setTests] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const updateTest = (name: string, status: TestResult['status'], message: string, duration?: number) => {
    setTests(prev => prev.map(test => 
      test.name === name 
        ? { ...test, status, message, duration }
        : test
    ))
  }

  const runTests = async () => {
    setIsRunning(true)
    
    // Initialize tests
    const initialTests: TestResult[] = [
      { name: 'Authentication', status: 'pending', message: 'Checking user authentication...' },
      { name: 'API Health', status: 'pending', message: 'Testing API connectivity...' },
      { name: 'WebSocket Connection', status: 'pending', message: 'Testing real-time connection...' },
      { name: 'User Profile', status: 'pending', message: 'Loading user profile...' },
      { name: 'Posts API', status: 'pending', message: 'Testing posts functionality...' },
      { name: 'Search API', status: 'pending', message: 'Testing user search...' },
      { name: 'Notifications API', status: 'pending', message: 'Testing notifications...' }
    ]
    
    setTests(initialTests)

    // Test 1: Authentication
    const authStart = Date.now()
    try {
      if (user) {
        updateTest('Authentication', 'success', `Authenticated as ${user.firstName} ${user.lastName}`, Date.now() - authStart)
      } else {
        updateTest('Authentication', 'error', 'No user authenticated', Date.now() - authStart)
      }
    } catch (error) {
      updateTest('Authentication', 'error', `Auth error: ${error}`, Date.now() - authStart)
    }

    // Test 2: API Health
    const healthStart = Date.now()
    try {
      const response = await apiService.healthCheck()
      if (response.success) {
        updateTest('API Health', 'success', 'API is responding correctly', Date.now() - healthStart)
      } else {
        updateTest('API Health', 'error', 'API health check failed', Date.now() - healthStart)
      }
    } catch (error) {
      updateTest('API Health', 'error', `API error: ${error}`, Date.now() - healthStart)
    }

    // Test 3: WebSocket Connection
    const wsStart = Date.now()
    try {
      if (isConnected && socket) {
        updateTest('WebSocket Connection', 'success', `Connected with socket ID: ${socket.id}`, Date.now() - wsStart)
      } else {
        updateTest('WebSocket Connection', 'error', 'WebSocket not connected', Date.now() - wsStart)
      }
    } catch (error) {
      updateTest('WebSocket Connection', 'error', `WebSocket error: ${error}`, Date.now() - wsStart)
    }

    // Test 4: User Profile
    const profileStart = Date.now()
    try {
      const response = await apiService.getProfile()
      if (response.success && response.data) {
        updateTest('User Profile', 'success', `Profile loaded for ${response.data.user.email}`, Date.now() - profileStart)
      } else {
        updateTest('User Profile', 'error', 'Failed to load profile', Date.now() - profileStart)
      }
    } catch (error) {
      updateTest('User Profile', 'error', `Profile error: ${error}`, Date.now() - profileStart)
    }

    // Test 5: Posts API
    const postsStart = Date.now()
    try {
      const response = await apiService.getPosts(1, 5)
      if (response.success) {
        updateTest('Posts API', 'success', `Loaded ${response.data?.posts?.length || 0} posts`, Date.now() - postsStart)
      } else {
        updateTest('Posts API', 'error', 'Failed to load posts', Date.now() - postsStart)
      }
    } catch (error) {
      updateTest('Posts API', 'error', `Posts error: ${error}`, Date.now() - postsStart)
    }

    // Test 6: Search API
    const searchStart = Date.now()
    try {
      const response = await apiService.searchUsers('test', 1, 5)
      if (response.success) {
        updateTest('Search API', 'success', `Search returned ${response.data?.users?.length || 0} results`, Date.now() - searchStart)
      } else {
        updateTest('Search API', 'error', 'Search API failed', Date.now() - searchStart)
      }
    } catch (error) {
      updateTest('Search API', 'error', `Search error: ${error}`, Date.now() - searchStart)
    }

    // Test 7: Notifications API
    const notifStart = Date.now()
    try {
      const response = await apiService.getNotifications(1, 5)
      if (response.success) {
        updateTest('Notifications API', 'success', `Loaded ${response.data?.notifications?.length || 0} notifications`, Date.now() - notifStart)
      } else {
        updateTest('Notifications API', 'error', 'Notifications API failed', Date.now() - notifStart)
      }
    } catch (error) {
      updateTest('Notifications API', 'error', `Notifications error: ${error}`, Date.now() - notifStart)
    }

    setIsRunning(false)
  }

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'error': return 'text-red-600'
      case 'pending': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'pending': return '⏳'
      default: return '⚪'
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">System Test</h1>
          <p className="text-gray-600 mb-6">Please sign in to run system tests.</p>
          <Link href="/signin">
            <Button>Sign In</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">VIBELY System Test</h1>
          <p className="text-gray-600">Comprehensive system functionality testing</p>
        </div>

        {/* System Status */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${user ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="font-medium">Authentication</span>
              <Badge variant={user ? "default" : "destructive"}>
                {user ? "Authenticated" : "Not Authenticated"}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="font-medium">WebSocket</span>
              <Badge variant={isConnected ? "default" : "destructive"}>
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="font-medium">User</span>
              <Badge variant="outline">{user.firstName} {user.lastName}</Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="font-medium">Socket ID</span>
              <Badge variant="secondary">{socket?.id?.slice(-6) || 'N/A'}</Badge>
            </div>
          </div>
        </Card>

        {/* Test Controls */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Test Suite</h2>
            <Button onClick={runTests} disabled={isRunning}>
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Button>
          </div>
          
          {tests.length > 0 && (
            <div className="space-y-3">
              {tests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getStatusIcon(test.status)}</span>
                    <span className="font-medium">{test.name}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm ${getStatusColor(test.status)}`}>
                      {test.message}
                    </div>
                    {test.duration && (
                      <div className="text-xs text-gray-500">
                        {test.duration}ms
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" asChild>
              <Link href="/hero">Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/realtime-demo">Real-time Demo</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/test-realtime">Connection Test</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/search">Search Users</Link>
            </Button>
          </div>
        </Card>

        {/* Debug Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <div>User ID: {user._id}</div>
            <div>Email: {user.email}</div>
            <div>Socket Connected: {isConnected ? 'Yes' : 'No'}</div>
            <div>Socket ID: {socket?.id || 'N/A'}</div>
            <div>Transport: {socket?.io?.engine?.transport?.name || 'N/A'}</div>
            <div>Timestamp: {new Date().toISOString()}</div>
          </div>
        </Card>
      </div>
    </div>
  )
}