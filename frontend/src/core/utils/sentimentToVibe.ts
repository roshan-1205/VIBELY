/**
 * Sentiment to Vibe Mapping - Performance Optimized
 * Maps sentiment scores to vibe themes with smooth interpolation
 */

export type VibeTheme = 'calm' | 'neutral' | 'vibrant'

export interface VibeColors {
  bgPrimary: string
  bgSecondary: string
  accent: string
  accentSoft: string
  vibeGlow: string
  textPrimary: string
  textSecondary: string
  glassBackground: string
  glassBorder: string
}

/**
 * Vibe theme definitions with GPU-optimized gradients
 */
export const vibeThemes: Record<VibeTheme, VibeColors> = {
  calm: {
    bgPrimary: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 50%, #c7d2fe 100%)',
    bgSecondary: '#f1f5f9',
    accent: '#6366f1',
    accentSoft: 'rgba(99, 102, 241, 0.1)',
    vibeGlow: 'rgba(99, 102, 241, 0.4)',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    glassBackground: 'rgba(99, 102, 241, 0.08)',
    glassBorder: 'rgba(99, 102, 241, 0.15)',
  },
  
  neutral: {
    bgPrimary: 'linear-gradient(135deg, #fafbfc 0%, #f1f5f9 50%, #e2e8f0 100%)',
    bgSecondary: '#f8fafc',
    accent: '#64748b',
    accentSoft: 'rgba(100, 116, 139, 0.1)',
    vibeGlow: 'rgba(100, 116, 139, 0.3)',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    glassBackground: 'rgba(100, 116, 139, 0.05)',
    glassBorder: 'rgba(100, 116, 139, 0.1)',
  },
  
  vibrant: {
    bgPrimary: 'linear-gradient(135deg, #fef7f0 0%, #fed7aa 30%, #fb7185 70%, #f43f5e 100%)',
    bgSecondary: '#fef2f2',
    accent: '#f43f5e',
    accentSoft: 'rgba(244, 63, 94, 0.1)',
    vibeGlow: 'rgba(244, 63, 94, 0.5)',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    glassBackground: 'rgba(244, 63, 94, 0.08)',
    glassBorder: 'rgba(244, 63, 94, 0.15)',
  },
}

/**
 * Maps sentiment score to vibe theme with performance optimization
 * Uses cached results to avoid repeated calculations
 */
const vibeCache = new Map<number, VibeTheme>()

export function sentimentToVibe(score: number): VibeTheme {
  // Round to 2 decimal places for cache efficiency
  const roundedScore = Math.round(score * 100) / 100
  
  // Check cache first
  if (vibeCache.has(roundedScore)) {
    return vibeCache.get(roundedScore)!
  }
  
  let vibe: VibeTheme
  
  if (score < -0.3) {
    vibe = 'calm'
  } else if (score > 0.3) {
    vibe = 'vibrant'
  } else {
    vibe = 'neutral'
  }
  
  // Cache the result (limit cache size for memory efficiency)
  if (vibeCache.size > 100) {
    const firstKey = vibeCache.keys().next().value
    if (firstKey !== undefined) {
      vibeCache.delete(firstKey)
    }
  }
  vibeCache.set(roundedScore, vibe)
  
  return vibe
}

/**
 * Get interpolated colors between two vibe themes
 * Used for smooth transitions
 */
export function interpolateVibeColors(
  fromTheme: VibeTheme,
  toTheme: VibeTheme,
  progress: number
): Partial<VibeColors> {
  const from = vibeThemes[fromTheme]
  const to = vibeThemes[toTheme]
  
  // For gradients, we'll use the target theme directly
  // Interpolation of gradients is complex and not worth the performance cost
  return progress > 0.5 ? to : from
}

/**
 * Get vibe intensity based on score magnitude
 */
export function getVibeIntensity(score: number): number {
  return Math.min(Math.abs(score), 1)
}

/**
 * Get vibe description for accessibility
 */
export function getVibeDescription(theme: VibeTheme): string {
  const descriptions = {
    calm: 'Calm and peaceful atmosphere',
    neutral: 'Balanced and neutral mood',
    vibrant: 'Energetic and vibrant feeling',
  }
  return descriptions[theme]
}

/**
 * Preload vibe themes for instant switching
 */
export function preloadVibeThemes(): void {
  // Pre-calculate common sentiment scores
  const commonScores = [-1, -0.5, -0.3, 0, 0.3, 0.5, 1]
  commonScores.forEach(score => sentimentToVibe(score))
}

/**
 * Reset vibe cache (useful for memory management)
 */
export function clearVibeCache(): void {
  vibeCache.clear()
}