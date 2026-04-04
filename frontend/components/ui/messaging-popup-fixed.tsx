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
  Maximize2
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useSocket } from '@/contexts/SocketContext'
import { apiService, type User, type Message, type Conversation } from '@/services/api'
import { ProfileAvatar } from './profile-avatar'
import { Button } from './button'
import { Input } from './input'
import { Badge } from './badge'
import { cn } from '@/lib/utils'

interface MessagingPopupProps {
  isOpen: boolean
  onClose: () => void
  initialUserId?: string
}

export function MessagingPopup({ isOpen, onClose, initialUserId }: MessagingPopupProps) {
  const { user: currentUser } = useAuth()
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
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Don't render if user is not authenticated
  if (!currentUser) {
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

  // Socket event listeners
  useEffect(() => {
    if (!socket || !currentUser) return

    const handleMessageReceived = (data: any) => {
      console.log('Message received via socket:', data)
      
      const newMessage: Message = {
        _id: data.messageId || `temp_${Date.now()}`,
        sender: data.sender,
        recipient: currentUser,
        content: data.content,
        messageType: 'text',
        isRead: false,
        createdAt: data.timestamp,
        updatedAt: data.timestamp
      }

      // Add to current conversation if it matches
      if (selectedUser && data.senderId === selectedUser._id) {
        setMessages(prev => [...prev, newMessage])
      }
      
      // Update conversations and unread count
      loadConversations()
      loadUnreadCount()
    }

    const handleTypingStart = (data: any) => {
      if (selectedUser && data.senderId === selectedUser._id) {
        setTypingUsers(prev => new Set(prev).add(data.senderId))
      }
    }

    const handleTypingStop = (data: any) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(data.senderId)
        return newSet
      })
    }

    socket.on('message:received', handleMessageReceived)
    socket.on('message:typing:start', handleTypingStart)
    socket.on('message:typing:stop', handleTypingStop)

    return () => {
      socket.off('message:received', handleMessageReceived)
      socket.off('message:typing:start', handleTypingStart)
      socket.off('message:typing:stop', handleTypingStop)
    }
  }, [socket, currentUser, selectedUser?._id])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Cleanup when popup closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedUser(null)
      setMessages([])
      setSearchQuery('')
      setActiveView('conversations')
      setNewMessage('')
      setTypingUsers(new Set())
    }
  }, [isOpen])

  const loadConversations = async () => {
    try {
      console.log('Loading conversations...')
      const response = await apiService.getConversations()
      console.log('Conversations response:', response)
      
      if (response.success && response.data) {
        setConversations(response.data.conversations)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    }
  }

  const loadMessageableUsers = async () => {
    try {
      console.log('Loading messageable users...')
      const response = await apiService.getMessageableUsers(searchQuery)
      console.log('Messageable users response:', response)
      
      if (response.success && response.data) {
        setMessageableUsers(response.data.users)
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
      }
    } catch (error) {
      console.error('Error loading unread count:', error)
    }
  }

  const loadConversation = async (userId: string) => {
    try {
      console.log('Loading conversation with user:', userId)
      setIsLoading(true)
      const response = await apiService.getConversation(userId)
      console.log('Conversation response:', response)
      
      if (response.success && response.data) {
        setMessages(response.data.messages)
        setSelectedUser(response.data.otherUser)
        
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
    setSelectedUser(user)
    setActiveView('chat')
    setMessages([])
    loadConversation(user._id)

    // Join conversation room via socket
    if (socket) {
      socket.emit('conversation:join', { otherUserId: user._id })
    }
  }

  const handleSendMessage = async () => {
    if (!selectedUser || !newMessage.trim() || isSending) return

    const messageContent = newMessage.trim()
    console.log('Sending message:', messageContent, 'to:', selectedUser.firstName)
    
    try {
      setIsSending(true)
      setNewMessage('') // Clear input immediately
      
      // Send via API to save to database
      const response = await apiService.sendMessage(selectedUser._id, messageContent)
      console.log('Send message response:', response)
      
      if (response.success && response.data) {
        // Add message to current conversation
        setMessages(prev => [...prev, response.data.message])
        
        // Send via socket for real-time delivery
        if (socket) {
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
      setNewMessage(messageContent)
    } finally {
      setIsSending(false)
    }
  }

  const handleTyping = (value: string) => {
    if (!socket || !selectedUser) return

    if (value.trim()) {
      socket.emit('message:typing:start', { recipientId: selectedUser._id })

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('message:typing:stop', { recipientId: selectedUser._id })
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-4xl mx-4 bg-white rounded-lg shadow-2xl border overflow-hidden"
          style={{ height: isMinimized ? '60px' : '600px' }}
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
            <div className="flex flex-col h-[536px]">
              {/* Conversations List */}
              {activeView === 'conversations' && (
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
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    {conversations.length > 0 ? (
                      <div className="p-4 space-y-2">
                        {conversations.map((conversation) => (
                          <div
                            key={conversation.user._id}
                            onClick={() => handleUserSelect(conversation.user)}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border"
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
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-900 truncate">
                                  {conversation.user.firstName} {conversation.user.lastName}
                                </p>
                                <span className="text-xs text-gray-500">
                                  {formatTime(conversation.lastMessage.createdAt)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600 truncate">
                                  {conversation.lastMessage.sender._id === currentUser?._id ? 'You: ' : ''}
                                  {conversation.lastMessage.content}
                                </p>
                                {conversation.unreadCount > 0 && (
                                  <Badge variant="default" className="ml-2 bg-purple-600 text-white">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
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
              )}

              {/* Users List */}
              {activeView === 'users' && (
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
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    {messageableUsers.length > 0 ? (
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {messageableUsers.map((user) => (
                          <div
                            key={user._id}
                            onClick={() => handleUserSelect(user)}
                            className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <div className="relative">
                              <ProfileAvatar
                                userId={user._id}
                                firstName={user.firstName}
                                lastName={user.lastName}
                                size="md"
                              />
                              {user.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                              <Badge variant="secondary" className="text-xs mt-1">
                                Mutual Follow
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Users className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No one to message</h3>
                        <p className="text-gray-500">You can only message people you follow and who follow you back</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Chat View */}
              {activeView === 'chat' && selectedUser && (
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
                            {selectedUser.isOnline ? 'Online' : 'Offline'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length > 0 ? (
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
                        onChange={(e) => {
                          setNewMessage(e.target.value)
                          handleTyping(e.target.value)
                        }}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                        disabled={isSending}
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
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}