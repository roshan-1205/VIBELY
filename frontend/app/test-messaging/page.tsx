'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSocket } from '@/contexts/SocketContext'
import { apiService } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function TestMessagingPage() {
  const { user } = useAuth()
  const { socket } = useSocket()
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addResult = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setTestResults(prev => [...prev, `${timestamp}: ${message}`])
  }

  const testAPI = async () => {
    setIsLoading(true)
    addResult('Starting API tests...')

    try {
      // Test 1: Get conversations
      addResult('Testing getConversations...')
      const conversationsResponse = await apiService.getConversations()
      addResult(`Conversations: ${conversationsResponse.success ? 'SUCCESS' : 'FAILED'} - ${conversationsResponse.message || 'OK'}`)

      // Test 2: Get messageable users
      addResult('Testing getMessageableUsers...')
      const usersResponse = await apiService.getMessageableUsers()
      addResult(`Messageable Users: ${usersResponse.success ? 'SUCCESS' : 'FAILED'} - ${usersResponse.message || 'OK'}`)

      // Test 3: Get unread count
      addResult('Testing getUnreadMessageCount...')
      const unreadResponse = await apiService.getUnreadMessageCount()
      addResult(`Unread Count: ${unreadResponse.success ? 'SUCCESS' : 'FAILED'} - ${unreadResponse.message || 'OK'}`)

      addResult('API tests completed!')
    } catch (error) {
      addResult(`API Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testSocket = () => {
    addResult('Testing socket connection...')
    
    if (!socket) {
      addResult('Socket not available')
      return
    }

    addResult(`Socket connected: ${socket.connected}`)
    
    // Test socket events
    socket.emit('test', { message: 'Hello from test page' })
    addResult('Test event sent')

    // Listen for socket events
    const handleConnect = () => addResult('Socket connected event')
    const handleDisconnect = () => addResult('Socket disconnected event')

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)

    setTimeout(() => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      addResult('Socket test completed')
    }, 2000)
  }

  const clearResults = () => {
    setTestResults([])
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <h1 className="text-2xl font-bold mb-4">Messaging Test</h1>
          <p>Please sign in to test messaging functionality.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Messaging System Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User Info */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">User Info</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>ID:</strong> {user._id}</p>
              <p><strong>Socket Connected:</strong> {socket?.connected ? '✅ Yes' : '❌ No'}</p>
            </div>
          </Card>

          {/* Test Controls */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            <div className="space-y-3">
              <Button 
                onClick={testAPI} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Testing API...' : 'Test API Endpoints'}
              </Button>
              <Button 
                onClick={testSocket}
                className="w-full"
                variant="outline"
              >
                Test Socket Connection
              </Button>
              <Button 
                onClick={clearResults}
                className="w-full"
                variant="secondary"
              >
                Clear Results
              </Button>
            </div>
          </Card>
        </div>

        {/* Test Results */}
        <Card className="p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
            {testResults.length > 0 ? (
              testResults.map((result, index) => (
                <div key={index} className="text-sm text-gray-700 mb-1">
                  {result}
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm">
                No test results yet. Click a test button to start.
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 flex gap-4">
          <Button asChild>
            <a href="/hero">Back to Hero</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/search">Go to Search</a>
          </Button>
        </div>
      </div>
    </div>
  )
}