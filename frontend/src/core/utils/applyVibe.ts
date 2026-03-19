/**
 * Apply Vibe - Direct CSS Variable Manipulation
 * Zero re-render theme application with GPU-optimized animations
 */

import { type VibeTheme, vibeThemes, getVibeIntensity } from './sentimentToVibe'

interface VibeConfig {
  enableTransitions?: boolean
  transitionDuration?: number
  enableGlow?: boolean
  intensity?: number
}

/**
 * CSS variable names for vibe theming
 */
const CSS_VARIABLES = {
  bgPrimary: '--bg-primary',
  bgSecondary: '--bg-secondary',
  accent: '--accent',
  accentSoft: '--accent-soft',
  vibeGlow: '--vibe-glow',
  textPrimary: '--text-primary',
  textSecondary: '--text-secondary',
  glassBackground: '--glass-bg',
  glassBorder: '--glass-border',
  
  // Animation variables
  transitionDuration: '--vibe-transition-duration',
  glowIntensity: '--vibe-glow-intensity',
} as const

/**
 * Performance-optimized CSS variable setter
 * Uses batch updates and requestAnimationFrame for smooth performance
 */
class VibeApplier {
  private pendingUpdates = new Map<string, string>()
  private animationFrame: number | null = null
  private isTransitioning = false

  /**
   * Queue CSS variable update
   */
  private queueUpdate(property: string, value: string): void {
    this.pendingUpdates.set(property, value)
    
    if (!this.animationFrame) {
      this.animationFrame = requestAnimationFrame(() => {
        this.flushUpdates()
      })
    }
  }

  /**
   * Apply all queued updates in a single batch
   */
  private flushUpdates(): void {
    const root = document.documentElement
    
    // Apply all updates in a single batch to minimize reflows
    this.pendingUpdates.forEach((value, property) => {
      root.style.setProperty(property, value)
    })
    
    this.pendingUpdates.clear()
    this.animationFrame = null
  }

  /**
   * Apply vibe theme with performance optimizations
   */
  applyVibe(theme: VibeTheme, config: VibeConfig): void {
    const colors = vibeThemes[theme]
    const intensity = config.intensity || 1
    
    // Set transition duration if transitions are enabled
    if (config.enableTransitions && !this.isTransitioning) {
      this.isTransitioning = true
      this.queueUpdate(CSS_VARIABLES.transitionDuration, `${config.transitionDuration}ms`)
      
      // Enable CSS transitions
      this.enableTransitions(config.transitionDuration || 800)
      
      // Reset transition flag after animation completes
      setTimeout(() => {
        this.isTransitioning = false
      }, config.transitionDuration || 800)
    }

    // Apply background with GPU acceleration
    this.queueUpdate(CSS_VARIABLES.bgPrimary, colors.bgPrimary)
    this.queueUpdate(CSS_VARIABLES.bgSecondary, colors.bgSecondary)
    
    // Apply accent colors
    this.queueUpdate(CSS_VARIABLES.accent, colors.accent)
    this.queueUpdate(CSS_VARIABLES.accentSoft, colors.accentSoft)
    
    // Apply text colors
    this.queueUpdate(CSS_VARIABLES.textPrimary, colors.textPrimary)
    this.queueUpdate(CSS_VARIABLES.textSecondary, colors.textSecondary)
    
    // Apply glass effects
    this.queueUpdate(CSS_VARIABLES.glassBackground, colors.glassBackground)
    this.queueUpdate(CSS_VARIABLES.glassBorder, colors.glassBorder)
    
    // Apply vibe glow with intensity
    if (config.enableGlow) {
      const glowColor = this.adjustGlowIntensity(colors.vibeGlow, intensity)
      this.queueUpdate(CSS_VARIABLES.vibeGlow, glowColor)
      this.queueUpdate(CSS_VARIABLES.glowIntensity, intensity.toString())
    }

    // Add vibe class to body for additional styling
    this.updateBodyClass(theme)
  }

  /**
   * Enable smooth CSS transitions
   */
  private enableTransitions(duration: number): void {
    const root = document.documentElement
    const transitionProperties = [
      'background',
      'background-color',
      'color',
      'border-color',
      'box-shadow',
    ]
    
    const transition = transitionProperties
      .map(prop => `${prop} ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`)
      .join(', ')
    
    root.style.setProperty('--vibe-transition', transition)
    
    // Apply transition to root element
    root.style.transition = transition
    
    // Remove transition after animation completes to avoid performance issues
    setTimeout(() => {
      root.style.transition = ''
    }, duration + 100)
  }

  /**
   * Adjust glow intensity based on sentiment strength
   */
  private adjustGlowIntensity(baseGlow: string, intensity: number): string {
    // Extract RGBA values and adjust alpha
    const match = baseGlow.match(/rgba?\(([^)]+)\)/)
    if (!match) return baseGlow
    
    const values = match[1].split(',').map(v => v.trim())
    if (values.length >= 3) {
      const alpha = values[3] ? parseFloat(values[3]) : 1
      const adjustedAlpha = Math.min(alpha * intensity, 1)
      return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${adjustedAlpha})`
    }
    
    return baseGlow
  }

  /**
   * Update body class for theme-specific styling
   */
  private updateBodyClass(theme: VibeTheme): void {
    const body = document.body
    const vibeClasses = ['vibe-calm', 'vibe-neutral', 'vibe-vibrant']
    
    // Remove existing vibe classes
    vibeClasses.forEach(cls => body.classList.remove(cls))
    
    // Add new vibe class
    body.classList.add(`vibe-${theme}`)
  }

  /**
   * Reset to default theme
   */
  reset(): void {
    this.applyVibe('neutral', {
      enableTransitions: true,
      transitionDuration: 600,
      enableGlow: false,
      intensity: 1,
    })
  }
}

// Singleton instance for performance
const vibeApplier = new VibeApplier()

/**
 * Main function to apply vibe theme
 * Optimized for zero re-renders and maximum performance
 */
export function applyVibe(theme: VibeTheme, config: VibeConfig = {}): void {
  const defaultConfig = {
    enableTransitions: true,
    transitionDuration: 800,
    enableGlow: true,
    intensity: 1,
    ...config,
  }
  
  vibeApplier.applyVibe(theme, defaultConfig)
}

/**
 * Apply vibe with custom intensity based on sentiment score
 */
export function applyVibeWithScore(score: number, config: VibeConfig = {}): void {
  const theme = score < -0.3 ? 'calm' : score > 0.3 ? 'vibrant' : 'neutral'
  const intensity = getVibeIntensity(score)
  
  applyVibe(theme, {
    ...config,
    intensity,
  })
}

/**
 * Preload CSS for instant theme switching
 */
export function preloadVibeCSS(): void {
  const style = document.createElement('style')
  style.textContent = `
    :root {
      --vibe-transition-duration: 800ms;
      --vibe-glow-intensity: 1;
    }
    
    .vibe-calm {
      --vibe-theme: 'calm';
    }
    
    .vibe-neutral {
      --vibe-theme: 'neutral';
    }
    
    .vibe-vibrant {
      --vibe-theme: 'vibrant';
    }
    
    /* GPU-accelerated glow animation */
    @keyframes vibeGlow {
      0%, 100% { 
        box-shadow: 0 0 20px var(--vibe-glow);
        transform: translateZ(0);
      }
      50% { 
        box-shadow: 0 0 40px var(--vibe-glow);
        transform: translateZ(0);
      }
    }
    
    .vibe-glow-animate {
      animation: vibeGlow 2s ease-in-out infinite;
      will-change: box-shadow;
    }
    
    /* Smooth background transitions */
    body {
      background: var(--bg-primary);
      transition: var(--vibe-transition);
      will-change: background;
    }
  `
  
  document.head.appendChild(style)
}

/**
 * Reset all vibe styling
 */
export function resetVibe(): void {
  vibeApplier.reset()
}

/**
 * Get current vibe theme from CSS
 */
export function getCurrentVibe(): VibeTheme | null {
  const body = document.body
  if (body.classList.contains('vibe-calm')) return 'calm'
  if (body.classList.contains('vibe-vibrant')) return 'vibrant'
  if (body.classList.contains('vibe-neutral')) return 'neutral'
  return null
}