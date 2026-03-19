import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes
      staleTime: 1000 * 60 * 5,
      
      // Cache time: 10 minutes
      gcTime: 1000 * 60 * 10,
      
      // Retry once on failure
      retry: 1,
      
      // Don't refetch on window focus
      refetchOnWindowFocus: false,
      
      // Don't refetch on reconnect by default
      refetchOnReconnect: false,
      
      // Error retry delay
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    
    mutations: {
      // Retry mutations once
      retry: 1,
      
      // Mutation retry delay
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})

// Query keys factory for consistent key management
export const queryKeys = {
  // User queries
  user: {
    all: ['user'] as const,
    profile: (id: string) => [...queryKeys.user.all, 'profile', id] as const,
    posts: (id: string) => [...queryKeys.user.all, 'posts', id] as const,
  },
  
  // Feed queries
  feed: {
    all: ['feed'] as const,
    infinite: (filters?: Record<string, unknown>) => 
      [...queryKeys.feed.all, 'infinite', filters] as const,
    trending: () => [...queryKeys.feed.all, 'trending'] as const,
  },
  
  // Post queries
  post: {
    all: ['post'] as const,
    detail: (id: string) => [...queryKeys.post.all, 'detail', id] as const,
    comments: (id: string) => [...queryKeys.post.all, 'comments', id] as const,
    likes: (id: string) => [...queryKeys.post.all, 'likes', id] as const,
  },
  
  // Vibe queries
  vibe: {
    all: ['vibe'] as const,
    analysis: (text: string) => [...queryKeys.vibe.all, 'analysis', text] as const,
    trends: () => [...queryKeys.vibe.all, 'trends'] as const,
  },
} as const