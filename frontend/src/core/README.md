# Vibely Core Infrastructure

This directory contains all the global systems and infrastructure for the Vibely frontend application, built with strict performance, scalability, and clean architecture principles.

## 🏗️ Architecture Overview

```
/src/core/
├── api/           # API client & endpoints
├── store/         # Zustand global state
├── hooks/         # Reusable custom hooks
├── socket/        # WebSocket management
├── utils/         # Utility functions
├── config/        # Environment & feature flags
├── providers/     # Global providers
└── index.ts       # Centralized exports
```

## 📡 API Client

### Features
- Axios instance with 10s timeout
- Automatic token attachment from Zustand store
- Global error handling (401 → logout, 500 → logging)
- Request/response logging in development
- Centralized endpoint management

### Usage
```typescript
import { api, API } from '@/core'

// Using the helper methods
const response = await api.get(API.FEED)
const user = await api.post(API.LOGIN, { email, password })

// Direct axios instance
import { apiClient } from '@/core'
const response = await apiClient.get('/custom-endpoint')
```

## 🧠 State Management (Zustand)

### Auth Store
```typescript
import { useAuth, useAuthActions } from '@/core'

function Component() {
  const { user, isAuthenticated } = useAuth()
  const { setAuth, logout } = useAuthActions()
  
  // Optimized selectors prevent unnecessary re-renders
  const user = useUser() // Only re-renders when user changes
}
```

### UI Store
```typescript
import { useTheme, useModal, useUIActions } from '@/core'

function Component() {
  const theme = useTheme()
  const modal = useModal()
  const { setTheme, openModal } = useUIActions()
}
```

## ⚡ Custom Hooks

### Performance Hooks
```typescript
import { useDebounce, useDebouncedCallback } from '@/core'

// Debounce values (search inputs)
const debouncedSearch = useDebounce(searchTerm, 300)

// Debounce callbacks (API calls)
const debouncedSave = useDebouncedCallback(saveData, 500)
```

### Utility Hooks
```typescript
import { 
  useEventListener, 
  useKeyboardShortcut,
  useLocalStorage,
  useOnlineStatus,
  useMediaQuery 
} from '@/core'

// Event listeners with cleanup
useEventListener('resize', handleResize)

// Keyboard shortcuts
useKeyboardShortcut(['ctrl', 'k'], openSearch)

// Responsive design
const isMobile = useIsMobile()
const isOnline = useOnlineStatus()
```

## 🔌 WebSocket System

### Features
- Auto-reconnect with exponential backoff
- Heartbeat/ping-pong for connection health
- Event-driven architecture
- Automatic cleanup

### Usage
```typescript
import { useSocket } from '@/core'

function Component() {
  const { socket, isConnected, on, off, send } = useSocket()
  
  useEffect(() => {
    const handleNewPost = (post) => {
      // Handle new post
    }
    
    on('post:new', handleNewPost)
    return () => off('post:new', handleNewPost)
  }, [])
  
  const likePost = (postId) => {
    send('post:like', { postId })
  }
}
```

## 🎯 Feature Flags

### Configuration
```typescript
import { flags, isFeatureEnabled } from '@/core'

// Static flags
if (flags.enableRealtime) {
  // Enable real-time features
}

// Dynamic checks
if (isFeatureEnabled('enableNewFeedUI')) {
  // Show new UI
}
```

### Environment Overrides
```bash
# .env
VITE_FEATURE_ENABLEREALTIME=true
VITE_FEATURE_ENABLEBETAFEATURES=false
```

## 📊 Logging System

### Development vs Production
```typescript
import { logger } from '@/core'

logger.debug('Debug info', { data })     // Dev only
logger.info('Info message', { data })    // Dev only
logger.warn('Warning', { data })         // Dev + external service
logger.error('Error', error)             // Always + external service
```

### Performance Logging
```typescript
logger.time('expensive-operation')
// ... expensive operation
logger.timeEnd('expensive-operation')
```

## 🔧 Configuration

### Environment Variables
```typescript
import { ENV } from '@/core'

const apiUrl = ENV.API_URL
const isProduction = ENV.IS_PRODUCTION
```

### Validation
```typescript
import { validateEnv } from '@/core'

// Validates required environment variables
validateEnv() // Throws if missing required vars
```

## 🚀 Global Provider Setup

### App Integration
```typescript
import { GlobalProvider } from '@/core'

function App() {
  return (
    <GlobalProvider>
      <YourApp />
    </GlobalProvider>
  )
}
```

### What it provides:
- React Query client with optimized defaults
- Environment validation
- Theme initialization
- Socket connection management
- Development tools (React Query Devtools)

## 📈 Performance Optimizations

### Zustand Selectors
```typescript
// ❌ Bad - causes re-renders on any auth state change
const authState = useAuthStore()

// ✅ Good - only re-renders when user changes
const user = useUser()
const isAuthenticated = useIsAuthenticated()
```

### React Query Configuration
- 5-minute stale time
- 1 retry on failure
- No refetch on window focus
- Exponential backoff retry delay

### Bundle Optimization
- Tree-shakeable exports
- Lazy-loaded development tools
- Minimal core bundle size

## 🛡️ Error Handling

### API Errors
- 401: Automatic logout and redirect
- 403: Access forbidden logging
- 500+: Server error logging
- Network: Connection error handling

### Socket Errors
- Connection failures with retry logic
- Message parsing error handling
- Graceful degradation when offline

## 🔒 Security

### Token Management
- Secure token storage in Zustand with persistence
- Automatic token attachment to requests
- Token cleanup on logout

### WebSocket Security
- Token-based authentication
- Secure WebSocket connections (WSS in production)
- Message validation

## 📝 Usage Examples

### Complete Auth Flow
```typescript
import { useAuth, useAuthActions, api, API } from '@/core'

function LoginForm() {
  const { isLoading } = useAuth()
  const { setAuth, setLoading } = useAuthActions()
  
  const handleLogin = async (credentials) => {
    setLoading(true)
    try {
      const response = await api.post(API.LOGIN, credentials)
      setAuth(response.data.user, response.data.token)
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setLoading(false)
    }
  }
}
```

### Real-time Updates
```typescript
import { useSocket, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/react-query'

function PostList() {
  const queryClient = useQueryClient()
  const { on, off } = useSocket()
  
  useEffect(() => {
    const handleNewPost = (post) => {
      queryClient.setQueryData(queryKeys.feed.infinite(), (old) => {
        // Update cache with new post
      })
    }
    
    on('post:new', handleNewPost)
    return () => off('post:new', handleNewPost)
  }, [])
}
```

## 🚦 Best Practices

1. **Always use selectors** to prevent unnecessary re-renders
2. **Import from core index** for consistent API
3. **Use feature flags** for gradual rollouts
4. **Handle errors gracefully** with fallbacks
5. **Log appropriately** for debugging and monitoring
6. **Validate environment** on app startup
7. **Clean up subscriptions** in useEffect cleanup
8. **Use TypeScript** for type safety throughout

## 🔄 Migration Guide

If migrating from existing code:

1. Replace direct localStorage usage with Zustand stores
2. Replace manual API calls with the centralized client
3. Replace manual WebSocket code with the socket manager
4. Replace console.log with the logger system
5. Move environment variables to the config system