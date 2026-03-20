# Vibely Frontend Architecture

## 🏗️ Overview

Vibely frontend is a premium, production-ready React application built with modern web technologies, delivering Stripe/Linear level quality and performance. The architecture emphasizes scalability, maintainability, and exceptional user experience.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Core Architecture](#core-architecture)
- [Performance Optimizations](#performance-optimizations)
- [Design System](#design-system)
- [State Management](#state-management)
- [Routing & Navigation](#routing--navigation)
- [API Integration](#api-integration)
- [Real-time Features](#real-time-features)
- [Build & Deployment](#build--deployment)
- [Development Workflow](#development-workflow)

## 🛠️ Tech Stack

### Core Technologies
- **React 18.3.1** - UI library with concurrent features
- **TypeScript 5.6.2** - Type safety and developer experience
- **Vite 6.0.1** - Fast build tool and dev server
- **Tailwind CSS 3.4.1** - Utility-first CSS framework

### State Management
- **Zustand 4.5.0** - Lightweight state management
- **TanStack Query 5.17.15** - Server state management
- **React Query Devtools** - Development debugging

### Animation & UI
- **Framer Motion 10.18.0** - Production-ready animations
- **GSAP 3.12.5** - High-performance animations
- **Tailwind Merge 2.2.1** - Conditional class merging

### Routing & Navigation
- **React Router DOM 7.13.1** - Client-side routing
- **React Virtuoso 4.18.3** - Virtualized lists

### Development Tools
- **ESLint 9.15.0** - Code linting
- **TypeScript ESLint 8.15.0** - TypeScript-specific linting
- **Prettier** - Code formatting
- **Web Vitals 3.5.2** - Performance monitoring

## 📁 Project Structure

```
src/
├── app/                          # Application shell
│   ├── App.tsx                   # Root component
│   └── routes/                   # Route definitions
│       ├── AppRoutes.tsx         # Main routing logic
│       └── DesignSystemDemo.tsx  # Component showcase
│
├── components/                   # Reusable UI components
│   ├── layout/                   # Layout components
│   ├── shared/                   # Shared demo components
│   └── ui/                       # Design system components
│       ├── Avatar.tsx            # User avatars with status
│       ├── Button.tsx            # Interactive buttons
│       ├── Card.tsx              # Glassmorphism cards
│       ├── Input.tsx             # Form inputs
│       ├── Skeleton.tsx          # Loading states
│       ├── Textarea.tsx          # Text areas
│       └── index.ts              # Component exports
│
├── core/                         # Core infrastructure
│   ├── api/                      # API client configuration
│   ├── components/               # Core components
│   │   ├── ErrorBoundary.tsx     # Error handling
│   │   ├── LazyImage.tsx         # Optimized images
│   │   └── Toast.tsx             # Notifications
│   ├── config/                   # Configuration
│   │   ├── env.ts                # Environment variables
│   │   └── featureFlags.ts       # Feature toggles
│   ├── hooks/                    # Custom hooks
│   ├── monitoring/               # Performance tracking
│   ├── providers/                # Context providers
│   ├── socket/                   # WebSocket management
│   ├── store/                    # Global state
│   └── utils/                    # Utility functions
│
├── features/                     # Feature modules
│   ├── auth/                     # Authentication
│   ├── create/                   # Post creation
│   ├── feed/                     # Social feed
│   └── profile/                  # User profiles
│
├── lib/                          # External library configurations
│   ├── animations.ts             # Animation presets
│   ├── gsap.ts                   # GSAP configuration
│   ├── motion.ts                 # Framer Motion variants
│   └── react-query.ts            # Query client setup
│
├── pages/                        # Page components
├── styles/                       # Global styles
└── types/                        # TypeScript definitions
```

## 🏛️ Core Architecture

### 1. Component Architecture

#### Atomic Design Principles
- **Atoms**: Basic UI elements (Button, Input, Avatar)
- **Molecules**: Component combinations (SearchBar, UserCard)
- **Organisms**: Complex UI sections (Header, Feed, Profile)
- **Templates**: Page layouts
- **Pages**: Complete views

#### Component Patterns
```typescript
// Compound Component Pattern
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Render Props Pattern
<LazyImage
  src="/image.jpg"
  renderLoading={() => <Skeleton />}
  renderError={() => <ErrorState />}
/>

// Hook Pattern
const { data, loading, error } = useFeed()
```

### 2. Feature-Based Architecture

Each feature is self-contained with:
- **Components**: UI components specific to the feature
- **Hooks**: Custom hooks for feature logic
- **Services**: API calls and business logic
- **Types**: TypeScript definitions
- **Tests**: Unit and integration tests

```typescript
// Feature structure example
features/feed/
├── components/
│   ├── FeedCard.tsx
│   ├── FeedList.tsx
│   └── FeedSkeleton.tsx
├── hooks/
│   ├── useFeed.ts
│   └── useFeedActions.ts
├── services/
│   └── feed.api.ts
├── types/
│   └── feed.types.ts
└── index.ts
```

### 3. Dependency Injection

```typescript
// Service injection pattern
interface FeedService {
  getFeed(params: FeedParams): Promise<FeedResponse>
}

// Implementation
class ApiFeedService implements FeedService {
  async getFeed(params: FeedParams) {
    return api.get('/feed', { params })
  }
}

// Usage in hooks
export function useFeed(service: FeedService = new ApiFeedService()) {
  return useQuery(['feed'], () => service.getFeed({}))
}
```

## ⚡ Performance Optimizations

### 1. Code Splitting & Lazy Loading

```typescript
// Route-based code splitting
const Feed = lazy(() => import('../features/feed/components/FeedPage'))
const Profile = lazy(() => import('../features/profile/components/ProfilePage'))
const Auth = lazy(() => import('../features/auth/components/AuthPage'))

// Component-based splitting
const HeavyComponent = lazy(() => import('./HeavyComponent'))

// Suspense boundaries with skeleton loaders
<Suspense fallback={<FeedSkeleton />}>
  <Feed />
</Suspense>
```

### 2. Bundle Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'tailwindcss'],
          query: ['@tanstack/react-query'],
          animation: ['gsap', 'framer-motion']
        }
      }
    }
  }
})
```

### 3. React Optimizations

```typescript
// Memoization patterns
const FeedCard = memo(({ post }: FeedCardProps) => {
  const handleLike = useCallback(() => {
    // Like logic
  }, [post.id])

  const stats = useMemo(() => ({
    likes: post.likesCount,
    comments: post.commentsCount
  }), [post.likesCount, post.commentsCount])

  return <Card>{/* Component JSX */}</Card>
})

// Virtualization for large lists
<Virtuoso
  data={posts}
  itemContent={(index, post) => <FeedCard post={post} />}
  components={{
    Footer: () => <LoadMoreButton />,
    ScrollSeekPlaceholder: () => <FeedCardSkeleton />
  }}
/>
```

### 4. Animation Performance

```typescript
// Hardware-accelerated animations
export const hwAcceleration = {
  willChange: 'transform',
  backfaceVisibility: 'hidden',
  perspective: 1000,
  transform: 'translateZ(0)'
}

// Optimized motion variants
export const cardHover = {
  whileHover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
  }
}

// Transform/opacity only animations
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: 'easeOut' }
}
```

## 🎨 Design System

### 1. Glassmorphism Theme

```css
/* CSS Variables for consistent theming */
:root {
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-bg-strong: rgba(255, 255, 255, 0.2);
  --glass-border: rgba(255, 255, 255, 0.2);
  --glass-shadow: rgba(0, 0, 0, 0.1);
  --vibe-glow: rgba(59, 130, 246, 0.3);
}

/* Glassmorphism effects */
.glass-card {
  background: linear-gradient(135deg, var(--glass-bg) 0%, var(--glass-bg-strong) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 32px 0 var(--glass-shadow);
}
```

### 2. Component Variants

```typescript
// Variant system for consistent styling
const buttonVariants = {
  base: 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200',
  variants: {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    glass: 'bg-white/10 backdrop-blur-xl border border-white/20',
    ghost: 'hover:bg-gray-100 text-gray-700'
  },
  sizes: {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  }
}
```

### 3. Responsive Design

```typescript
// Mobile-first responsive utilities
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false)
  
  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)
    
    const listener = () => setMatches(media.matches)
    media.addListener(listener)
    return () => media.removeListener(listener)
  }, [query])
  
  return matches
}

// Usage
const isMobile = useMediaQuery('(max-width: 768px)')
const isTablet = useMediaQuery('(max-width: 1024px)')
```

## 🗄️ State Management

### 1. Zustand Stores

```typescript
// Auth store
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  
  login: async (credentials) => {
    const user = await authService.login(credentials)
    set({ user, isAuthenticated: true })
  },
  
  logout: () => {
    authService.logout()
    set({ user: null, isAuthenticated: false })
  }
}))

// Selectors for performance
export const useUser = () => useAuthStore(state => state.user)
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated)
```

### 2. Server State with TanStack Query

```typescript
// Query configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false
    }
  }
})

// Custom hooks
export function useFeed(type: FeedType = 'timeline') {
  return useInfiniteQuery({
    queryKey: ['feed', type],
    queryFn: ({ pageParam = 0 }) => feedService.getFeed({ 
      type, 
      offset: pageParam 
    }),
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    staleTime: 2 * 60 * 1000 // 2 minutes for feed
  })
}

// Optimistic updates
export function useLikePost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: likePost,
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['feed'])
      
      // Snapshot previous value
      const previousFeed = queryClient.getQueryData(['feed'])
      
      // Optimistically update
      queryClient.setQueryData(['feed'], (old: any) => {
        // Update logic
      })
      
      return { previousFeed }
    },
    onError: (err, postId, context) => {
      // Rollback on error
      queryClient.setQueryData(['feed'], context?.previousFeed)
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries(['feed'])
    }
  })
}
```

## 🧭 Routing & Navigation

### 1. Route Configuration

```typescript
// Route definitions with lazy loading
export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={
        <Suspense fallback={<FeedSkeleton />}>
          <Feed />
        </Suspense>
      } />
      
      <Route path="/profile/:userId" element={
        <Suspense fallback={<ProfileSkeleton />}>
          <Profile />
        </Suspense>
      } />
      
      <Route path="/auth/*" element={
        <Suspense fallback={<AuthSkeleton />}>
          <AuthRoutes />
        </Suspense>
      } />
    </Route>
  </Routes>
)
```

### 2. Protected Routes

```typescript
// Route protection
interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireRole?: UserRole[]
  fallback?: React.ReactNode
}

export const ProtectedRoute = ({ 
  children, 
  requireAuth = true,
  requireRole,
  fallback = <Navigate to="/auth/login" />
}: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth()
  
  if (requireAuth && !isAuthenticated) {
    return fallback
  }
  
  if (requireRole && !requireRole.includes(user?.role)) {
    return <Navigate to="/unauthorized" />
  }
  
  return <>{children}</>
}
```

## 🌐 API Integration

### 1. API Client Configuration

```typescript
// Axios configuration
export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)
```

### 2. API Service Layer

```typescript
// Service abstraction
export class FeedService {
  async getFeed(params: FeedParams): Promise<FeedResponse> {
    const response = await apiClient.get('/feed', { params })
    return response.data
  }
  
  async createPost(data: CreatePostData): Promise<Post> {
    const response = await apiClient.post('/posts', data)
    return response.data
  }
  
  async likePost(postId: string): Promise<void> {
    await apiClient.post(`/posts/${postId}/like`)
  }
}

export const feedService = new FeedService()
```

## 🔄 Real-time Features

### 1. WebSocket Management

```typescript
// Socket manager
class SocketManager {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  
  connect() {
    this.socket = io(ENV.WEBSOCKET_URL, {
      auth: {
        token: useAuthStore.getState().token
      }
    })
    
    this.socket.on('connect', () => {
      console.log('Connected to server')
      this.reconnectAttempts = 0
    })
    
    this.socket.on('disconnect', () => {
      this.handleReconnect()
    })
    
    this.setupEventHandlers()
  }
  
  private setupEventHandlers() {
    this.socket?.on('post:liked', (data) => {
      // Update UI optimistically
      queryClient.setQueryData(['feed'], (old: any) => {
        // Update logic
      })
    })
    
    this.socket?.on('post:created', (post) => {
      // Add new post to feed
      queryClient.setQueryData(['feed'], (old: any) => {
        // Update logic
      })
    })
  }
}

export const socketManager = new SocketManager()
```

### 2. Real-time Hooks

```typescript
// Real-time data hook
export function useSocket(event: string, handler: (data: any) => void) {
  useEffect(() => {
    socketManager.on(event, handler)
    return () => socketManager.off(event, handler)
  }, [event, handler])
}

// Usage
export function useFeedUpdates() {
  const queryClient = useQueryClient()
  
  useSocket('post:created', (post) => {
    queryClient.setQueryData(['feed'], (old: any) => {
      // Add new post
    })
  })
  
  useSocket('post:liked', ({ postId, likesCount }) => {
    queryClient.setQueryData(['feed'], (old: any) => {
      // Update likes count
    })
  })
}
```

## 🚀 Build & Deployment

### 1. Build Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  
  build: {
    target: 'es2020',
    minify: 'terser',
    sourcemap: true,
    
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'tailwindcss'],
          query: ['@tanstack/react-query'],
          animation: ['gsap']
        }
      }
    }
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion']
  }
})
```

### 2. Environment Configuration

```typescript
// Environment variables
interface Environment {
  API_BASE_URL: string
  WEBSOCKET_URL: string
  APP_VERSION: string
  IS_DEVELOPMENT: boolean
  IS_PRODUCTION: boolean
  ENABLE_ANALYTICS: boolean
  ENABLE_WEBSOCKETS: boolean
}

export const ENV: Environment = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  WEBSOCKET_URL: import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8000',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_WEBSOCKETS: import.meta.env.VITE_ENABLE_WEBSOCKETS === 'true'
}
```

### 3. Performance Monitoring

```typescript
// Web Vitals tracking
export class PerformanceMonitor {
  private config: PerformanceConfig
  
  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = {
      enableWebVitals: true,
      enableBundleAnalysis: ENV.IS_DEVELOPMENT,
      sampleRate: ENV.IS_PRODUCTION ? 0.1 : 1,
      ...config
    }
    
    this.init()
  }
  
  private async initWebVitals() {
    const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals')
    
    getCLS(this.reportMetric)
    getFID(this.reportMetric)
    getFCP(this.reportMetric)
    getLCP(this.reportMetric)
    getTTFB(this.reportMetric)
  }
  
  private reportMetric = (metric: any) => {
    if (ENV.IS_DEVELOPMENT) {
      console.log(`${metric.name}: ${metric.value}`)
    }
    
    // Send to analytics service
    if (this.config.reportingEndpoint) {
      fetch(this.config.reportingEndpoint, {
        method: 'POST',
        body: JSON.stringify(metric)
      })
    }
  }
}
```

## 🔧 Development Workflow

### 1. Code Quality

```json
// ESLint configuration
{
  "extends": [
    "@eslint/js/recommended",
    "@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "react-hooks/exhaustive-deps": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

### 2. Testing Strategy

```typescript
// Component testing
describe('FeedCard', () => {
  it('renders post content correctly', () => {
    const post = mockPost()
    render(<FeedCard post={post} />)
    
    expect(screen.getByText(post.content)).toBeInTheDocument()
    expect(screen.getByText(post.author.name)).toBeInTheDocument()
  })
  
  it('handles like interaction', async () => {
    const onLike = jest.fn()
    const post = mockPost()
    
    render(<FeedCard post={post} onLike={onLike} />)
    
    await user.click(screen.getByRole('button', { name: /like/i }))
    expect(onLike).toHaveBeenCalledWith(post.id)
  })
})

// Hook testing
describe('useFeed', () => {
  it('fetches feed data', async () => {
    const { result } = renderHook(() => useFeed())
    
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    
    expect(result.current.data).toBeDefined()
  })
})
```

### 3. Development Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

## 📊 Performance Metrics

### Target Metrics
- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **First Input Delay**: < 100ms
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

### Bundle Size Targets
- **Initial Bundle**: < 250KB gzipped
- **Vendor Chunk**: < 200KB gzipped
- **Route Chunks**: < 50KB gzipped each
- **Total Assets**: < 1MB gzipped

## 🔮 Future Enhancements

### Planned Features
1. **Progressive Web App (PWA)** - Offline support and app-like experience
2. **Micro-frontends** - Feature-based deployment and scaling
3. **Advanced Caching** - Service worker and cache strategies
4. **A/B Testing** - Feature flag-based experimentation
5. **Advanced Analytics** - User behavior tracking and insights
6. **Accessibility Improvements** - WCAG 2.1 AA compliance
7. **Internationalization** - Multi-language support
8. **Advanced Animations** - Shared element transitions

### Technical Debt
- Migrate from GSAP to Framer Motion completely
- Implement comprehensive error boundaries
- Add comprehensive test coverage (>90%)
- Optimize bundle splitting further
- Implement advanced caching strategies

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainers**: Vibely Development Team