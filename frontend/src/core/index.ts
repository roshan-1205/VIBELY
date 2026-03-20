/**
 * Core Infrastructure Exports - Minimal Working Version
 */

// API
export { apiClient, api, endpoints } from './api/client'
export { API } from './api/endpoints'

// Stores
export {
  useAuthStore,
  useAuth,
  useAuthActions,
  useUser,
  useIsAuthenticated,
  type User,
} from './store/auth.store'

export {
  useUIStore,
  useTheme,
  useVibeMode,
  useModal,
  useGlobalLoading,
  useSidebar,
  useUIActions,
  type Theme,
  type VibeMode,
} from './store/ui.store'

// Hooks
export { useDebounce, useDebouncedCallback } from './hooks/useDebounce'
export { useEventListener, useKeyboardShortcut } from './hooks/useEventListener'
export { useLocalStorage } from './hooks/useLocalStorage'
export { useOnlineStatus } from './hooks/useOnlineStatus'
export { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop, useIsDarkMode } from './hooks/useMediaQuery'

// Socket
export { socketManager, useSocket, type SocketEvents } from './socket/socket'

// Utils
export { logger } from './utils/logger'
export * from './utils/helpers'

// Config
export { ENV, validateEnv, isDevelopment, isProduction } from './config/env'
export { flags, useFeatureFlag, FeatureFlag } from './config/featureFlags'

// Providers
export { GlobalProvider } from './providers/GlobalProvider'

// Components
export { ErrorBoundary } from './components/ErrorBoundary'
export { LazyImage } from './components/LazyImage'
export { ToastContainer, useToast } from './components/Toast'

// Motion exports from lib/motion
export {
  fadeInUp,
  staggerContainer,
  staggerItem,
  buttonTap,
  cardHover,
  hoverLift,
  hoverGlow,
  scaleTap,
} from '../lib/motion'

// Performance constants
export const hwAcceleration = {
  willChange: 'transform' as const,
  backfaceVisibility: 'hidden' as const,
  perspective: 1000,
  transform: 'translateZ(0)',
}

// Placeholder hooks for missing functionality
export const useScrollFadeInUp = (ref?: any, options?: any) => ({})
export const useScrollStaggerReveal = (ref?: any, options?: any) => ({})

export const cardHoverMotion = {
  whileHover: {
    scale: 1.02,
    y: -4,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
  },
}

export const buttonTapMotion = {
  whileTap: { 
    scale: 0.96,
    transition: { duration: 0.1, ease: [0.4, 0, 0.2, 1] }
  },
}