'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSocket } from '@/contexts/SocketContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function TestRealtimePage() {
  const { user } = useAuth()
  const { socket, isConnected, onlineUsers } = useSocket()
  const [connectionLog, setConnectionLog] = useState<string[]>([])
  const [testMessage, setTestMessage] = useState('')

  useEffect(() => {
    if (socket) {
      // Log connection events
      socket.on('connect', () => {
        addLog('✅ Connected to WebSocket server')
      })

      socket.on('disconnect', () => {
        addLog('❌ Disconnected from WebSocket server')
      })

      socket.on('connected', (data) => {
        addLog(`🎉 Server confirmed connection: ${JSON.stringify(data)}`)
      })

      socket.on('connect_error', (error) => {
        addLog(`🚨 Connection error: ${error.message}`)
      })

      // Test event listeners
      socket.on('test_response', (data) => {
        addLog(`📨 Test response received: ${JSON.stringify(data)}`)
      })

      return () => {
        socket.off('connect')
        socket.off('disconnect')
        socket.off('connected')
        socket.off('connect_error')
        socket.off('test_response')
      }
    }
  }, [socket])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setConnectionLog(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 19)])
  }

  const sendTestMessage = () => {
    if (socket && testMessage.trim()) {
      socket.emit('test_message', { message: testMessage.trim() })
      addLog(`📤 Sent test message: ${testMessage.trim()}`)
      setTestMessage('')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Real-time Test</h1>
          <p className="text-gray-600 mb-6">Please sign in to test real-time functionality.</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Real-time Connection Test</h1>
          <p className="text-gray-600">Testing WebSocket connectivity and real-time features</p>
        </div>

        {/* Connection Status */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="font-medium">WebSocket</span>
              <Badge variant={isConnected ? "default" : "destructive"}>
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="font-medium">Online Users</span>
              <Badge variant="secondary">{onlineUsers.length}</Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="font-medium">User ID</span>
              <Badge variant="outline">{user._id.slice(-6)}</Badge>
            </div>
          </div>
        </Card>

        {/* Test Controls */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder="Enter test message..."
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendTestMessage()}
              />
              <Button onClick={sendTestMessage} disabled={!isConnected || !testMessage.trim()}>
                Send Test
              </Button>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => addLog('🔄 Manual refresh triggered')}
              >
                Add Log Entry
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setConnectionLog([])}
              >
                Clear Log
              </Button>
              <Button variant="outline" asChild>
                <Link href="/realtime-demo">Go to Full Demo</Link>
              </Button>
            </div>
          </div>
        </Card>

        {/* Connection Log */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Connection Log</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
            {connectionLog.length === 0 ? (
              <div className="text-gray-500">No log entries yet...</div>
            ) : (
              connectionLog.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Debug Info */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">User Info</h3>
              <div className="space-y-1 text-gray-600">
                <div>Name: {user.firstName} {user.lastName}</div>
                <div>Email: {user.email}</div>
                <div>ID: {user._id}</div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Socket Info</h3>
              <div className="space-y-1 text-gray-600">
                <div>Connected: {isConnected ? 'Yes' : 'No'}</div>
                <div>Socket ID: {socket?.id || 'N/A'}</div>
                <div>Transport: {socket?.io?.engine?.transport?.name || 'N/A'}</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="text-center">
          <Button asChild>
            <Link href="/hero">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}