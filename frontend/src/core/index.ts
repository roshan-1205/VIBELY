/**
 * Core Infrastructure Exports
 * Centralized exports for all core functionality
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
export { 
  useScrollAnim, 
  useScrollFadeInUp, 
  useScrollScaleIn, 
  useScrollSlideInLeft, 
  useScrollSlideInRight, 
  useScrollStaggerReveal, 
  useScrollParallax, 
  useScrollCounter, 
  useScrollBatch 
} from './hooks/useScrollAnim'

// Socket
export { socketManager, useSocket, type SocketEvents } from './socket/socket'

// Utils
export { logger } from './utils/logger'
export * from './utils/helpers'

// Config
export { ENV, validateEnv, isDevelopment, isProduction } from './config/env'
export {
  flags,
  isFeatureEnabled,
  getEnabledFeatures,
  getDisabledFeatures,
  featureFlagManager,
  type FeatureFlags,
} from './config/featureFlags'

// Providers
export { GlobalProvider } from './providers/GlobalProvider'

// Components
export { ErrorBoundary } from './components/ErrorBoundary'

// Animations (from lib)
export {
  // Motion variants
  fadeInUp,
  fadeIn,
  scaleIn,
  slideInLeft,
  slideInRight,
  staggerContainer,
  staggerItem,
  pageTransition,
  modalBackdrop,
  modalContent,
  
  // Interactive animations
  scaleTap,
  hoverGlow,
  hoverScale,
  hoverLift,
  buttonTap,
  cardHover,
  
  // Hardware acceleration
  hwAcceleration,
  
  // Utilities
  easings,
  durations,
  transitions,
  createStagger,
  fastStagger,
  normalStagger,
  slowStagger,
} from '../lib/motion'

export {
  // GSAP animations
  gsap,
  ScrollTrigger,
  gsapAnimations,
  gsapEasings,
  gsapDurations,
  scrollConfigs,
  createScrollTrigger,
  createBatchAnimation,
  createTimeline,
  refreshScrollTrigger,
  killAllScrollTriggers,
  initGSAP,
} from '../lib/gsap'