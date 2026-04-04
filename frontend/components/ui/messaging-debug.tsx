'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSocket } from '@/contexts/SocketContext'
import { apiService } from '@/services/api'
import { Card } from './card'
import { Button } from './button'

export function MessagingDebug() {
  const { user } = useAuth()
  const { socket } = useSocket()
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev.slice(-9), `${timestamp}: ${message}`])
  }

  useEffect(() => {
    if (!socket) return

    const handleConnect = () => addLog('Socket connected')
    const handleDisconnect = () => addLog('Socket disconnected')
    const handleMessageReceived = (data: any) => addLog(`Message received from ${data.sender?.firstName}`)
    const handleTypingStart = (data: any) => addLog(`${data.sender?.firstName} started typing`)
    const handleTypingStop = (data: any) => addLog(`Typing stopped`)

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('message:received', handleMessageReceived)
    socket.on('message:typing:start', handleTypingStart)
    socket.on('message:typing:stop', handleTypingStop)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('message:received', handleMessageReceived)
      socket.off('message:typing:start', handleTypingStart)
      socket.off('message:typing:stop', handleTypingStop)
    }
  }, [socket])

  const loadDebugInfo = async () => {
    try {
      const [conversations, messageableUsers, unreadCount] = await Promise.all([
        apiService.getConversations(),
        apiService.getMessageableUsers(),
        apiService.getUnreadMessageCount()
      ])

      setDebugInfo({
        conversations: conversations.data?.conversations?.length || 0,
        messageableUsers: messageableUsers.data?.users?.length || 0,
        unreadCount: unreadCount.data?.count || 0,
        socketConnected: socket?.connected || false,
        userId: user?._id
      })
    } catch (error) {
      addLog(`Error loading debug info: ${error}`)
    }
  }

  useEffect(() => {
    if (user) {
      loadDebugInfo()
    }
  }, [user, socket])

  if (!user) return null

  return (
    <Card className="fixed top-4 right-4 p-4 w-80 z-50 bg-white/95 backdrop-blur">
      <h3 className="font-semibold mb-2">Messaging Debug</h3>
      
      <div className="space-y-2 text-sm">
        <div>User: {user.firstName} {user.lastName}</div>
        <div>Socket: {debugInfo.socketConnected ? '🟢 Connected' : '🔴 Disconnected'}</div>
        <div>Conversations: {debugInfo.conversations}</div>
        <div>Messageable Users: {debugInfo.messageableUsers}</div>
        <div>Unread Count: {debugInfo.unreadCount}</div>
      </div>

      <Button onClick={loadDebugInfo} size="sm" className="mt-2 w-full">
        Refresh
      </Button>

      <div className="mt-3">
        <h4 className="font-medium text-xs mb-1">Recent Logs:</h4>
        <div className="bg-gray-100 p-2 rounded text-xs max-h-32 overflow-y-auto">
          {logs.length > 0 ? (
            logs.map((log, i) => (
              <div key={i} className="text-gray-700">{log}</div>
            ))
          ) : (
            <div className="text-gray-500">No logs yet...</div>
          )}
        </div>
      </div>

      <Button 
        onClick={() => setLogs([])} 
        variant="outline" 
        size="sm" 
        className="mt-2 w-full"
      >
        Clear Logs
      </Button>
    </Card>
  )
}