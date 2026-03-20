import React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../../lib/react-query'
import { ENV, validateEnv } from '../config/env'
import { logger } from '../utils/logger'
import { socketManager } from '../socket/socket'
import { useAuthStore } from '../store/auth.store'
import { useUIStore } from '../store/ui.store'

// Lazy load devtools only in development
const ReactQueryDevtools = React.lazy(() =>
  import('@tanstack/react-query-devtools').then(
    (d) => ({ default: d.ReactQueryDevtools }),
    () => ({ default: () => null }) // Fallback if devtools not installed
  )
)

interface GlobalProviderProps {
  children: React.ReactNode
}

// Initialize app on provider mount
function useAppInitialization() {
  React.useEffect(() => {
    // Validate environment variables
    try {
      validateEnv()
      logger.info('Environment validation passed')
    } catch (error) {
      logger.error('Environment validation failed:', error)
    }

    // Initialize theme
    const theme = useUIStore.getState().theme
    const vibeMode = useUIStore.getState().vibeMode
    
    document.documentElement.setAttribute('data-theme', theme)
    if (vibeMode) {
      document.documentElement.setAttribute('data-vibe', vibeMode)
    }

    // Initialize socket connection if user is authenticated
    const isAuthenticated = useAuthStore.getState().isAuthenticated
    if (isAuthenticated && ENV.ENABLE_WEBSOCKETS) {
      socketManager.connect()
    }

    logger.info('App initialized successfully', {
      version: ENV.APP_VERSION,
      environment: ENV.IS_DEVELOPMENT ? 'development' : 'production',
      features: {
        websockets: ENV.ENABLE_WEBSOCKETS,
        analytics: ENV.ENABLE_ANALYTICS,
      },
    })

    // Cleanup on unmount
    return () => {
      socketManager.disconnect()
    }
  }, [])
}

export function GlobalProvider({ children }: GlobalProviderProps) {
  useAppInitialization()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {ENV.IS_DEVELOPMENT && (
        <React.Suspense fallback={null}>
          <ReactQueryDevtools />
        </React.Suspense>
      )}
    </QueryClientProvider>
  )
}