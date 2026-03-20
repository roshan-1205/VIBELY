import { useAuthStore } from '../store/auth.store'
import { logger } from '../utils/logger'

export interface SocketEvents {
  // Connection events
  connect: () => void
  disconnect: (reason: string) => void
  error: (error: Error) => void
  
  // Post events
  'post:new': (post: any) => void
  'post:updated': (post: any) => void
  'post:liked': (data: { postId: string; userId: string; likesCount: number }) => void
  'post:commented': (data: { postId: string; comment: any }) => void
  
  // User events
  'user:online': (userId: string) => void
  'user:offline': (userId: string) => void
  
  // Vibe events
  'vibe:sync': (data: { vibeMode: string; intensity: number }) => void
  'vibe:trend': (data: { trend: string; count: number }) => void
  
  // Notification events
  'notification:new': (notification: any) => void
}

class SocketManager {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private eventListeners: Map<string, Set<Function>> = new Map()
  private heartbeatInterval: NodeJS.Timeout | null = null

  constructor() {
    // Don't auto-connect, let the app decide when to connect
  }

  connect() {
    const token = useAuthStore.getState().token
    
    if (!token) {
      logger.warn('No auth token available for socket connection')
      return
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:8000'
    const wsUrl = `${socketUrl}/ws?token=${encodeURIComponent(token)}`
    
    try {
      this.ws = new WebSocket(wsUrl)
      this.setupEventListeners()
    } catch (error) {
      logger.error('Failed to create WebSocket connection:', error)
      this.handleReconnect()
    }
  }

  private setupEventListeners() {
    if (!this.ws) return

    this.ws.onopen = () => {
      logger.info('WebSocket connected')
      this.reconnectAttempts = 0
      this.startHeartbeat()
      this.emit('connect')
    }

    this.ws.onclose = (event) => {
      logger.warn('WebSocket disconnected:', event.reason)
      this.stopHeartbeat()
      this.emit('disconnect', event.reason)
      
      // Attempt to reconnect unless it was a clean close
      if (event.code !== 1000) {
        this.handleReconnect()
      }
    }

    this.ws.onerror = (error) => {
      logger.error('WebSocket error:', error)
      this.emit('error', new Error('WebSocket connection error'))
    }

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        this.handleMessage(data)
      } catch (error) {
        logger.error('Failed to parse WebSocket message:', error)
      }
    }
  }

  private handleMessage(data: any) {
    const { type, payload } = data
    
    if (!type) {
      logger.warn('Received message without type:', data)
      return
    }

    // Handle heartbeat
    if (type === 'ping') {
      this.send('pong')
      return
    }

    // Emit the event to listeners
    this.emit(type, payload)
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send('ping')
      }
    }, 30000) // Send ping every 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.error('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
    
    logger.info(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`)
    
    setTimeout(() => {
      this.connect()
    }, delay)
  }

  // Event emitter methods
  on<K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }
    this.eventListeners.get(event)!.add(callback)
  }

  off<K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]) {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.delete(callback)
    }
  }

  private emit(event: string, ...args: any[]) {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(...args)
        } catch (error) {
          logger.error('Error in socket event listener:', error)
        }
      })
    }
  }

  // Send events to server
  send(type: string, payload?: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type, payload })
      this.ws.send(message)
    } else {
      logger.warn('WebSocket not connected, cannot send message:', type)
    }
  }

  disconnect() {
    this.stopHeartbeat()
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect')
      this.ws = null
    }
    this.eventListeners.clear()
  }

  get isConnected() {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

// Create singleton instance
export const socketManager = new SocketManager()

// React hook for using socket events
export function useSocket() {
  return {
    socket: socketManager,
    isConnected: socketManager.isConnected,
    on: socketManager.on.bind(socketManager),
    off: socketManager.off.bind(socketManager),
    send: socketManager.send.bind(socketManager),
  }
}