/**
 * useVibeSync Hook - Zero Re-render Global UI System
 * Performance-focused sentiment-based theming with direct CSS manipulation
 */

/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useRef } from 'react'
import { applyVibe } from '@/core/utils/applyVibe'
import { sentimentToVibe } from '@/core/utils/sentimentToVibe'

interface VibeConfig {
  enableTransitions?: boolean
  transitionDuration?: number
  enableGlow?: boolean
  intensity?: number
}

const defaultConfig: VibeConfig = {
  enableTransitions: true,
  transitionDuration: 800,
  enableGlow: true,
  intensity: 1,
}

/**
 * Zero re-render hook for global vibe synchronization
 * Updates CSS variables directly without triggering React updates
 */
export function useVibeSync(
  sentimentScore: number,
  config: VibeConfig = defaultConfig
) {
  const lastScoreRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Skip if score hasn't changed (performance optimization)
    if (lastScoreRef.current === sentimentScore) return

    // Capture current ref values for cleanup
    const currentAnimationFrame = animationFrameRef.current
    const currentTimeout = transitionTimeoutRef.current

    // Cancel any pending animations
    if (currentAnimationFrame) {
      cancelAnimationFrame(currentAnimationFrame)
    }
    if (currentTimeout) {
      clearTimeout(currentTimeout)
    }

    // Use requestAnimationFrame for smooth updates
    animationFrameRef.current = requestAnimationFrame(() => {
      const vibeTheme = sentimentToVibe(sentimentScore)
      applyVibe(vibeTheme, config)
      lastScoreRef.current = sentimentScore
    })

    // Cleanup function
    return () => {
      const frameToCancel = animationFrameRef.current
      const timeoutToCancel = transitionTimeoutRef.current
      
      if (frameToCancel) {
        cancelAnimationFrame(frameToCancel)
      }
      if (timeoutToCancel) {
        clearTimeout(timeoutToCancel)
      }
    }
  }, [sentimentScore, config])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const frameToCancel = animationFrameRef.current
      const timeoutToCancel = transitionTimeoutRef.current
      
      if (frameToCancel) {
        cancelAnimationFrame(frameToCancel)
      }
      if (timeoutToCancel) {
        clearTimeout(timeoutToCancel)
      }
    }
  }, [])

  // Return current vibe state (without causing re-renders)
  return {
    currentVibe: sentimentToVibe(sentimentScore),
    score: sentimentScore,
  }
}

/**
 * Batch multiple sentiment updates for performance
 */
export function useBatchedVibeSync() {
  const batchRef = useRef<number[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const addScore = (score: number) => {
    batchRef.current.push(score)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Batch updates every 16ms (60fps)
    timeoutRef.current = setTimeout(() => {
      if (batchRef.current.length > 0) {
        // Use the most recent score
        const latestScore = batchRef.current[batchRef.current.length - 1]
        const vibeTheme = sentimentToVibe(latestScore)
        applyVibe(vibeTheme, defaultConfig)
        batchRef.current = []
      }
    }, 16)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return { addScore }
}

/**
 * Global vibe sync for multiple components
 */
let globalVibeScore = 0
const vibeListeners = new Set<(score: number) => void>()

export const globalVibeSync = {
  setScore: (score: number) => {
    if (globalVibeScore !== score) {
      globalVibeScore = score
      const vibeTheme = sentimentToVibe(score)
      applyVibe(vibeTheme, defaultConfig)
      
      // Notify listeners without causing re-renders
      vibeListeners.forEach(listener => listener(score))
    }
  },
  
  getScore: () => globalVibeScore,
  
  subscribe: (listener: (score: number) => void) => {
    vibeListeners.add(listener)
    return () => vibeListeners.delete(listener)
  },
  
  reset: () => {
    globalVibeScore = 0
    const vibeTheme = sentimentToVibe(0)
    applyVibe(vibeTheme, defaultConfig)
  }
}