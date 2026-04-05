'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  X, 
  Send, 
  Search, 
  Users, 
  Minimize2, 
  Maximize2,
  MoreVertical,
  Trash2,
  Phone,
  Video
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useSocket } from '@/contexts/SocketContext'
import { apiService, type User, type Message, type Conversation } from '@/services/api'
import { ProfileAvatar } from './profile-avatar'
import { Button } from './button'
import { Input } from './input'
import { Card } from './card'
import { Badge } from './badge'
import { cn } from '@/lib/utils'

interface MessagingPopupProps {
  isOpen: boolean
  onClose: () => void
  initialUserId?: string
}

export function MessagingPopup({ isOpen, onClose, initialUserId }: MessagingPopupProps) {
  const { user: currentUser, isLoading: authLoading } = useAuth()
  const { socket } = useSocket()
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeView, setActiveView] = useState<'conversations' | 'chat' | 'users'>('conversations')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [messageableUsers, setMessageableUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const [unreadCount, setUnreadCount] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Don't render if user is not authenticated
  if (!currentUser || authLoading) {
    return null
  }

  // Load initial data
  useEffect(() => {
    if (isOpen && currentUser) {
      console.log('Loading messaging data for user:', currentUser._id)
      loadConversations()
      loadMessageableUsers()
      loadUnreadCount()
    }
  }, [isOpen, currentUser])

  // Handle initial user selection
  useEffect(() => {
    if (initialUserId && messageableUsers.length > 0) {
      const user = messageableUsers.find(u => u._id === initialUserId)
      if (user) {
        console.log('Selecting initial user:', user.firstName)
        handleUserSelect(user)
      }
    }
  }, [initialUserId, messageableUsers])

  // Debounced search for messageable users
  useEffect(() => {
    if (activeView === 'users') {
      const timer = setTimeout(() => {
        loadMessageableUsers()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [searchQuery, activeView])

  // Debounced search for conversations
  useEffect(() => {
    if (activeView === 'conversations') {
      const timer = setTimeout(() => {
        loadConversations()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [searchQuery, activeView])

  // Clear search when switching views
  useEffect(() => {
    setSearchQuery('')
  }, [activeView])

  // Socket event listeners
  useEffect(() => {
    if (!socket || !currentUser) {
      console.log('Socket or user not available:', { socket: !!socket, user: !!currentUser })
      return
    }

    console.log('Setting up socket listeners for messaging')

    const handleNewMessage = (data: { message: Message; sender: User }) => {
      console.log('New message received:', data)
      const { message, sender } = data
      
      // Add message to current conversation if it's active
      if (selectedUser && (sender._id === selectedUser._id || message.sender._id === selectedUser._id)) {
        setMessages(prev => {
          // Avoid duplicates
          const exists = prev.some(msg => msg._id === message._id)
          if (exists) return prev
          return [...prev, message]
        })
        
        // Mark as read if conversation is active
        if (sender._id === selectedUser._id) {
          apiService.markMessagesAsRead(sender._id)
        }
      }
      
      // Update conversations list
      loadConversations()
      loadUnreadCount()
    }

    const handleMessageReceived = (data: { 
      senderId: string; 
      recipientId: string; 
      content: string; 
      sender: User; 
      timestamp: string;
      conversationId: string;
      messageId?: string;
    }) => {
      console.log('Message received via socket:', data)
      
      // Create new message object
      const newMessage: Message = {
        _id: data.messageId || `temp_${Date.now()}`,
        sender: data.sender,
        recipient: currentUser,
        content: data.content,
        messageType: 'text',
        isRead: data.senderId === currentUser._id,
        createdAt: data.timestamp,
        updatedAt: data.timestamp
      }

      // Add to current conversation if it matches
      if (selectedUser && (data.senderId === selectedUser._id || data.senderId === currentUser._id)) {
        setMessages(prev => {
          // Avoid duplicates
          const exists = prev.some(msg => msg._id === newMessage._id)
          if (exists) return prev
          return [...prev, newMessage]
        })
        
        // Auto-mark as read if viewing conversation and message is from other user
        if (data.senderId === selectedUser._id) {
          setTimeout(() => {
            apiService.markMessagesAsRead(data.senderId)
          }, 500)
        }
      }
      
      // Update conversations and unread count
      loadConversations()
      loadUnreadCount()
    }

    const handleTypingStart = (data: { senderId: string; sender: User }) => {
      console.log('Typing started:', data)
      if (selectedUser && data.senderId === selectedUser._id) {
        setTypingUsers(prev => new Set(prev).add(data.senderId))
      }
    }

    const handleTypingStop = (data: { senderId: string }) => {
      console.log('Typing stopped:', data)
      setTypingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(data.senderId)
        return newSet
      })
    }

    const handleConnected = () => {
      setConnectionStatus('connected')
      console.log('Socket connected for messaging')
    }

    const handleDisconnected = () => {
      setConnectionStatus('disconnected')
      console.log('Socket disconnected for messaging')
    }

    // Register socket event listeners
    socket.on('message:new', handleNewMessage)
    socket.on('message:received', handleMessageReceived)
    socket.on('message:typing:start', handleTypingStart)
    socket.on('message:typing:stop', handleTypingStop)
    socket.on('connect', handleConnected)
    socket.on('disconnect', handleDisconnected)

    // Set initial connection status
    if (socket.connected) {
      setConnectionStatus('connected')
    }

    return () => {
      console.log('Cleaning up socket listeners')
      socket.off('message:new', handleNewMessage)
      socket.off('message:received', handleMessageReceived)
      socket.off('message:typing:start', handleTypingStart)
      socket.off('message:typing:stop', handleTypingStop)
      socket.off('connect', handleConnected)
      socket.off('disconnect', handleDisconnected)
    }
  }, [socket, currentUser, selectedUser?._id]) // Use selectedUser._id instead of selectedUser to prevent unnecessary re-renders

  // Cleanup when popup closes
  useEffect(() => {
    if (!isOpen) {
      // Clean up state when popup closes
      if (selectedUser && socket) {
        socket.emit('conversation:leave', { otherUserId: selectedUser._id })
      }
      
      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      
      // Reset state
      setSelectedUser(null)
      setMessages([])
      setSearchQuery('')
      setActiveView('conversations')
      setNewMessage('')
      setTypingUsers(new Set())
    }
  }, [isOpen, selectedUser, socket])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversations = async () => {
    try {
      console.log('Loading conversations...')
      setIsLoading(true)
      const response = await apiService.getConversations()
      console.log('Conversations response:', response)
      
      if (response.success && response.data) {
        let filteredConversations = response.data.conversations
        
        // Filter conversations based on search query
        if (searchQuery && activeView === 'conversations') {
          filteredConversations = response.data.conversations.filter(conv => 
            conv.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conv.user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conv.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }
        
        setConversations(filteredConversations)
        console.log('Loaded conversations:', filteredConversations.length)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMessageableUsers = async () => {
    try {
      console.log('Loading messageable users with query:', searchQuery)
      const response = await apiService.getMessageableUsers(searchQuery)
      console.log('Messageable users response:', response)
      
      if (response.success && response.data) {
        setMessageableUsers(response.data.users)
        console.log('Loaded messageable users:', response.data.users.length)
      }
    } catch (error) {
      console.error('Error loading messageable users:', error)
    }
  }

  const loadUnreadCount = async () => {
    try {
      const response = await apiService.getUnreadMessageCount()
      if (response.success && response.data) {
        setUnreadCount(response.data.count)
        console.log('Unread count:', response.data.count)
      }
    } catch (error) {
      console.error('Error loading unread count:', error)
    }
  }

  const loadConversation = async (userId: string) => {
    // Prevent loading the same conversation multiple times
    if (isLoading) {
      console.log('Already loading conversation, skipping')
      return
    }

    try {
      console.log('Loading conversation with user:', userId)
      setIsLoading(true)
      const response = await apiService.getConversation(userId)
      console.log('Conversation response:', response)
      
      if (response.success && response.data) {
        setMessages(response.data.messages)
        setSelectedUser(response.data.otherUser)
        console.log('Loaded messages:', response.data.messages.length)
        
        // Mark messages as read
        await apiService.markMessagesAsRead(userId)
        loadUnreadCount()
      }
    } catch (error) {
      console.error('Error loading conversation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserSelect = (user: User) => {
    console.log('Selecting user:', user.firstName, user._id)
    
    // Prevent re-selecting the same user
    if (selectedUser && selectedUser._id === user._id) {
      console.log('User already selected, skipping')
      return
    }

    // Leave previous conversation room if any
    if (selectedUser && socket) {
      socket.emit('conversation:leave', { otherUserId: selectedUser._id })
    }

    setSelectedUser(user)
    setActiveView('chat')
    setMessages([]) // Clear previous messages
    loadConversation(user._id)

    // Join conversation room via socket
    if (socket) {
      console.log('Joining conversation room with:', user._id)
      socket.emit('conversation:join', { otherUserId: user._id })
    }
  }

  const handleSendMessage = async () => {
    if (!selectedUser || !newMessage.trim() || isSending) return

    const messageContent = newMessage.trim()
    console.log('Sending message:', messageContent, 'to:', selectedUser.firstName)
    
    try {
      setIsSending(true)
      setNewMessage('') // Clear input immediately for better UX
      
      // Send via API to save to database
      const response = await apiService.sendMessage(selectedUser._id, messageContent)
      console.log('Send message response:', response)
      
      if (response.success && response.data) {
        // Add message to current conversation
        setMessages(prev => [...prev, response.data!.message])
        
        // Send via socket for real-time delivery to other user
        if (socket) {
          console.log('Sending via socket to:', selectedUser._id)
          socket.emit('message:send', {
            recipientId: selectedUser._id,
            content: messageContent,
            messageType: 'text',
            messageId: response.data.message._id
          })
        }

        // Update conversations list
        loadConversations()
      } else {
        // Restore message content on failure
        setNewMessage(messageContent)
        console.error('Failed to send message:', response.message)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Restore message content on error
      setNewMessage(messageContent)
    } finally {
      setIsSending(false)
    }
  }

  const handleTyping = useCallback((value: string) => {
    if (!socket || !selectedUser) return

    // Only emit typing events if there's actual content
    if (value.trim()) {
      socket.emit('message:typing:start', { recipientId: selectedUser._id })

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('message:typing:stop', { recipientId: selectedUser._id })
      }, 1000)
    } else {
      // Stop typing immediately if input is empty
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      socket.emit('message:typing:stop', { recipientId: selectedUser._id })
    }
  }, [socket, selectedUser])

  const handleMessageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewMessage(value)
    handleTyping(value)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const ConversationsList = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Messages</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveView('users')}
          >
            <Users className="w-4 h-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-8"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          </div>
        ) : conversations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 p-4">
            {conversations.map((conversation) => (
              <div
                key={conversation.user._id}
                onClick={() => !isLoading && handleUserSelect(conversation.user)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-lg border transition-colors",
                  isLoading 
                    ? "cursor-not-allowed opacity-50" 
                    : "hover:bg-gray-50 hover:border-purple-200 cursor-pointer"
                )}
              >
                <div className="relative">
                  <ProfileAvatar
                    userId={conversation.user._id}
                    firstName={conversation.user.firstName}
                    lastName={conversation.user.lastName}
                    size="md"
                  />
                  {conversation.user.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900 truncate">
                      {conversation.user.firstName} {conversation.user.lastName}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <Badge variant="default" className="bg-purple-600 text-white text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage.sender._id === currentUser?._id ? 'You: ' : ''}
                      {conversation.lastMessage.content}
                    </p>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {formatTime(conversation.lastMessage.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageCircle className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
            <p className="text-gray-500 mb-4">Start a conversation with someone you follow</p>
            <Button onClick={() => setActiveView('users')}>
              Find People to Message
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  const UsersList = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveView('conversations')}
          >
            ← Back
          </Button>
          <h3 className="font-semibold text-lg">Start New Chat</h3>
          <div></div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-8"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="mt-2 text-xs text-gray-500 bg-blue-50 p-2 rounded">
          💡 You can only message people you follow and who follow you back
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {messageableUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {messageableUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => !isLoading && handleUserSelect(user)}
                className={cn(
                  "flex flex-col items-center gap-3 p-4 rounded-lg border transition-colors text-center",
                  isLoading 
                    ? "cursor-not-allowed opacity-50" 
                    : "hover:bg-gray-50 hover:border-purple-200 cursor-pointer"
                )}
              >
                <div className="relative">
                  <ProfileAvatar
                    userId={user._id}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    size="lg"
                  />
                  {user.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">{user.email}</p>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Mutual Follow
                    </Badge>
                    {user.isOnline && (
                      <Badge variant="default" className="text-xs bg-green-100 text-green-700">
                        Online
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No one to message</h3>
            <p className="text-gray-500 mb-4">You can only message people you follow and who follow you back</p>
            <div className="text-sm text-gray-400 bg-gray-50 p-3 rounded-lg max-w-sm">
              <p className="font-medium mb-2">To start messaging:</p>
              <p>1. Follow someone you'd like to chat with</p>
              <p>2. Wait for them to follow you back</p>
              <p>3. They'll appear here once it's mutual!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const ChatView = () => (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveView('conversations')}
            >
              ← Back
            </Button>
            {selectedUser && (
              <>
                <div className="relative">
                  <ProfileAvatar
                    userId={selectedUser._id}
                    firstName={selectedUser.firstName}
                    lastName={selectedUser.lastName}
                    size="sm"
                  />
                  {selectedUser.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-400 rounded-full border border-white"></div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedUser.isOnline ? (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        Online
                      </span>
                    ) : (
                      `Last seen ${formatTime(selectedUser.lastSeen || '')}`
                    )}
                    {connectionStatus !== 'connected' && (
                      <span className="ml-2 text-orange-500">
                        • {connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
                      </span>
                    )}
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          </div>
        ) : messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message._id}
              className={cn(
                "flex",
                message.sender._id === currentUser?._id ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                  message.sender._id === currentUser?._id
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-900"
                )}
              >
                <p className="text-sm">{message.content}</p>
                <div className={cn(
                  "flex items-center justify-end gap-1 mt-1 text-xs",
                  message.sender._id === currentUser?._id ? "text-purple-200" : "text-gray-500"
                )}>
                  <span>{formatTime(message.createdAt)}</span>
                  {message.sender._id === currentUser?._id && message.isRead && (
                    <span>✓✓</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageCircle className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start the conversation</h3>
            <p className="text-gray-500">Send a message to get things started</p>
          </div>
        )}
        
        {/* Typing indicator */}
        {typingUsers.size > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-500 ml-2">typing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={handleMessageInputChange}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={(e) => {
          // Close on backdrop click
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            height: isMinimized ? 60 : 'min(600px, 90vh)'
          }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-5xl mx-4 bg-white rounded-lg shadow-2xl border overflow-hidden max-h-[90vh]"
          style={{ 
            height: isMinimized ? '60px' : 'min(600px, 90vh)',
            width: 'min(1200px, 90vw)'
          }}
        >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <span className="font-semibold">
              {activeView === 'chat' && selectedUser 
                ? `${selectedUser.firstName} ${selectedUser.lastName}`
                : activeView === 'users'
                ? 'New Chat'
                : 'Messages'
              }
            </span>
            {unreadCount > 0 && !isMinimized && (
              <Badge variant="secondary" className="bg-white/20 text-white">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-white/20"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="flex-1 flex flex-col" style={{ height: 'calc(100% - 64px)' }}>
            <div className="flex-1 overflow-hidden">
              {activeView === 'conversations' && <ConversationsList />}
              {activeView === 'users' && <UsersList />}
              {activeView === 'chat' && <ChatView />}
            </div>
          </div>
        )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}