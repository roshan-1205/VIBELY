/**
 * Feature Flags Configuration
 * Toggle features without code changes
 */

import { ENV } from './env'

export interface FeatureFlags {
  // Core Features
  enableRealtime: boolean
  enableNewFeedUI: boolean
  enableVibeSync: boolean
  enableNotifications: boolean
  
  // Experimental Features
  enableAIRecommendations: boolean
  enableAdvancedSearch: boolean
  enableDarkMode: boolean
  enableBetaFeatures: boolean
  
  // Performance Features
  enableVirtualization: boolean
  enableImageOptimization: boolean
  enableLazyLoading: boolean
  
  // Social Features
  enableComments: boolean
  enableLikes: boolean
  enableSharing: boolean
  enableFollowing: boolean
  
  // Analytics & Monitoring
  enableAnalytics: boolean
  enableErrorTracking: boolean
  enablePerformanceMonitoring: boolean
}

// Default feature flags
const defaultFlags: FeatureFlags = {
  // Core Features
  enableRealtime: true,
  enableNewFeedUI: true,
  enableVibeSync: true,
  enableNotifications: true,
  
  // Experimental Features
  enableAIRecommendations: false,
  enableAdvancedSearch: false,
  enableDarkMode: true,
  enableBetaFeatures: ENV.IS_DEVELOPMENT,
  
  // Performance Features
  enableVirtualization: true,
  enableImageOptimization: true,
  enableLazyLoading: true,
  
  // Social Features
  enableComments: true,
  enableLikes: true,
  enableSharing: true,
  enableFollowing: true,
  
  // Analytics & Monitoring
  enableAnalytics: ENV.ENABLE_ANALYTICS,
  enableErrorTracking: ENV.ENABLE_SENTRY,
  enablePerformanceMonitoring: ENV.IS_PRODUCTION,
}

// Environment-specific overrides
const developmentFlags: Partial<FeatureFlags> = {
  enableBetaFeatures: true,
  enableAnalytics: false,
  enableErrorTracking: false,
  enablePerformanceMonitoring: false,
}

const productionFlags: Partial<FeatureFlags> = {
  enableBetaFeatures: false,
  enableAnalytics: true,
  enableErrorTracking: true,
  enablePerformanceMonitoring: true,
}

// Merge flags based on environment
function createFeatureFlags(): FeatureFlags {
  let flags = { ...defaultFlags }
  
  if (ENV.IS_DEVELOPMENT) {
    flags = { ...flags, ...developmentFlags }
  }
  
  if (ENV.IS_PRODUCTION) {
    flags = { ...flags, ...productionFlags }
  }
  
  // Override with environment variables if present
  Object.keys(flags).forEach(key => {
    const envKey = `VITE_FEATURE_${key.toUpperCase()}`
    const envValue = import.meta.env[envKey]
    
    if (envValue !== undefined) {
      ;(flags as any)[key] = envValue === 'true' || envValue === '1'
    }
  })
  
  return flags
}

export const flags = createFeatureFlags()

// Helper functions
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return flags[feature]
}

export function getEnabledFeatures(): (keyof FeatureFlags)[] {
  return Object.keys(flags).filter(key => 
    flags[key as keyof FeatureFlags]
  ) as (keyof FeatureFlags)[]
}

export function getDisabledFeatures(): (keyof FeatureFlags)[] {
  return Object.keys(flags).filter(key => 
    !flags[key as keyof FeatureFlags]
  ) as (keyof FeatureFlags)[]
}

// Runtime feature flag updates (for A/B testing, etc.)
class FeatureFlagManager {
  private runtimeFlags: Partial<FeatureFlags> = {}
  
  setFlag(feature: keyof FeatureFlags, enabled: boolean) {
    this.runtimeFlags[feature] = enabled
  }
  
  getFlag(feature: keyof FeatureFlags): boolean {
    return this.runtimeFlags[feature] ?? flags[feature]
  }
  
  resetFlag(feature: keyof FeatureFlags) {
    delete this.runtimeFlags[feature]
  }
  
  resetAllFlags() {
    this.runtimeFlags = {}
  }
  
  getAllFlags(): FeatureFlags {
    return { ...flags, ...this.runtimeFlags }
  }
}

export const featureFlagManager = new FeatureFlagManager()

// Export for convenience
export default flags