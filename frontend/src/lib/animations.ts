/**
 * Animation Utilities - Vibely
 * Centralized animation system combining Framer Motion and GSAP
 * Performance-optimized for 60fps animations
 */

import { Variants } from 'framer-motion'
import { gsap } from './gsap'

// Performance CSS for hardware acceleration
export const hwAcceleration = {
  willChange: 'transform',
  backfaceVisibility: 'hidden' as const,
  perspective: 1000,
  transform: 'translateZ(0)', // Force hardware acceleration
}

// Animation timing constants
export const ANIMATION_TIMING = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.75,
} as const

// Stagger timing for lists
export const STAGGER_TIMING = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.15,
} as const

// Integration rules for choosing animation library
export const ANIMATION_RULES = {
  // Use Framer Motion for:
  FRAMER_MOTION: [
    'button interactions',
    'hover effects',
    'tap feedback',
    'modal animations',
    'page transitions',
    'component state changes',
  ],
  
  // Use GSAP for:
  GSAP: [
    'scroll-triggered animations',
    'complex timelines',
    'performance-critical animations',
    'parallax effects',
    'counter animations',
    'batch animations',
  ],
} as const

// Component-specific animation mappings
export const COMPONENT_ANIMATIONS = {
  // Feed components → GSAP scroll reveal
  feed: {
    library: 'gsap',
    type: 'scroll-reveal',
    animation: 'fadeInUp',
    stagger: STAGGER_TIMING.normal,
  },
  
  // Buttons → Framer Motion tap
  button: {
    library: 'framer-motion',
    type: 'interaction',
    animation: 'scaleTap',
    timing: ANIMATION_TIMING.fast,
  },
  
  // Cards → hover + scale
  card: {
    library: 'framer-motion',
    type: 'interaction',
    animation: 'cardHover',
    timing: ANIMATION_TIMING.normal,
  },
  
  // Modals → scale + fade
  modal: {
    library: 'framer-motion',
    type: 'state-change',
    animation: 'modalContent',
    timing: ANIMATION_TIMING.normal,
  },
  
  // Lists → stagger reveal
  list: {
    library: 'gsap',
    type: 'scroll-reveal',
    animation: 'staggerReveal',
    stagger: STAGGER_TIMING.normal,
  },
} as const

// Page transition variants
export const pageTransitions: Record<string, Variants> = {
  // Default page transition
  default: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: ANIMATION_TIMING.normal,
        ease: [0, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: { 
        duration: ANIMATION_TIMING.fast,
        ease: [0.4, 0, 1, 1]
      }
    },
  },
  
  // Slide transition
  slide: {
    initial: { opacity: 0, x: 100 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: ANIMATION_TIMING.normal,
        ease: [0, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0, 
      x: -100,
      transition: { 
        duration: ANIMATION_TIMING.fast,
        ease: [0.4, 0, 1, 1]
      }
    },
  },
  
  // Scale transition
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: ANIMATION_TIMING.normal,
        ease: [0.68, -0.55, 0.265, 1.55]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 1.05,
      transition: { 
        duration: ANIMATION_TIMING.fast,
        ease: [0.4, 0, 1, 1]
      }
    },
  },
}

// Utility functions for animation management
export const animationUtils = {
  // Get appropriate animation for component type
  getComponentAnimation: (componentType: keyof typeof COMPONENT_ANIMATIONS) => {
    return COMPONENT_ANIMATIONS[componentType]
  },
  
  // Create stagger configuration
  createStagger: (delay: number = STAGGER_TIMING.normal, delayChildren: number = 0) => ({
    animate: {
      transition: {
        staggerChildren: delay,
        delayChildren,
      },
    },
  }),
  
  // Create spring configuration
  createSpring: (stiffness: number = 300, damping: number = 30) => ({
    type: 'spring' as const,
    stiffness,
    damping,
  }),
  
  // Performance check - warn about expensive animations
  checkPerformance: (properties: string[]) => {
    const expensiveProps = ['width', 'height', 'top', 'left', 'right', 'bottom']
    const hasExpensive = properties.some(prop => expensiveProps.includes(prop))
    
    if (hasExpensive && process.env.NODE_ENV === 'development') {
      console.warn(
        '⚠️ Animation Performance Warning: Animating layout properties can cause jank. ' +
        'Consider using transform and opacity instead.',
        { properties }
      )
    }
    
    return !hasExpensive
  },
  
  // Preload animations for better performance
  preloadAnimations: () => {
    // Preload GSAP animations
    gsap.set('body', { visibility: 'visible' })
    
    // Set initial states for common animations
    gsap.set('[data-animate="fade-in-up"]', { opacity: 0, y: 50 })
    gsap.set('[data-animate="scale-in"]', { opacity: 0, scale: 0.8 })
    gsap.set('[data-animate="slide-in-left"]', { opacity: 0, x: -50 })
    gsap.set('[data-animate="slide-in-right"]', { opacity: 0, x: 50 })
  },
  
  // Cleanup animations on route change
  cleanupAnimations: () => {
    gsap.killTweensOf('*')
  },
}

// Animation performance monitoring
export const performanceMonitor = {
  // Track animation performance
  trackAnimation: (name: string, startTime: number) => {
    const endTime = performance.now()
    const duration = endTime - startTime
    
    if (duration > 16.67) { // More than one frame at 60fps
      console.warn(`Animation "${name}" took ${duration.toFixed(2)}ms (> 16.67ms)`)
    }
  },
  
  // Monitor frame rate during animations
  monitorFrameRate: () => {
    let lastTime = performance.now()
    let frameCount = 0
    
    const checkFrameRate = () => {
      const currentTime = performance.now()
      frameCount++
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        
        if (fps < 55) {
          console.warn(`Low frame rate detected: ${fps}fps`)
        }
        
        frameCount = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(checkFrameRate)
    }
    
    requestAnimationFrame(checkFrameRate)
  },
}

// Export everything for easy access
export * from './motion'
export * from './gsap'