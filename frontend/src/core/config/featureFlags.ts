/**
 * Feature Flags System - Dynamic Feature Control
 * Toggle features without redeployment
 */

import React from 'react'

interface FeatureFlags {
  enableRealtime: boolean
  enableNotifications: boolean
  enableVibeSync: boolean
  enableVirtualization: boolean
  enableImageOptimization: boolean
  enablePrefetching: boolean
  enableAnimations: boolean
  enableGlassmorphism: boolean
  enableDarkMode: boolean
  enableAIRecommendations: boolean
  enableAdvancedAnalytics: boolean
  enableBetaFeatures: boolean
}

const defaultFlags: FeatureFlags = {
  enableRealtime: true,
  enableNotifications: true,
  enableVibeSync: true,
  enableVirtualization: true,
  enableImageOptimization: true,
  enablePrefetching: true,
  enableAnimations: typeof window !== 'undefined' ? !window.matchMedia('(prefers-reduced-motion: reduce)').matches : true,
  enableGlassmorphism: true,
  enableDarkMode: true,
  enableAIRecommendations: import.meta.env.DEV,
  enableAdvancedAnalytics: import.meta.env.PROD,
  enableBetaFeatures: import.meta.env.DEV,
}

export const flags: FeatureFlags = {
  ...defaultFlags,
}

export function useFeatureFlag(flag: keyof FeatureFlags): boolean {
  return flags[flag]
}

export function FeatureFlag({ 
  flag, 
  children, 
  fallback = null 
}: { 
  flag: keyof FeatureFlags
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  return flags[flag] ? children : fallback
}

if (import.meta.env.DEV && typeof window !== 'undefined') {
  // @ts-ignore
  window.vibelyFlags = flags
  console.log('🚩 Feature Flags:', flags)
}