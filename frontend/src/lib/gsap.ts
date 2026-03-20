/**
 * GSAP Animation System - Vibely
 * High-performance scroll-based animations using GSAP + ScrollTrigger
 * Optimized for 60fps performance
 */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

// Performance configuration
gsap.config({
  force3D: true,
  nullTargetWarn: false,
})

// Default GSAP settings for optimal performance
gsap.defaults({
  ease: 'power2.out',
  duration: 0.6,
})

// Animation presets for consistent timing
export const gsapEasings = {
  easeOut: 'power2.out',
  easeIn: 'power2.in',
  easeInOut: 'power2.inOut',
  bounce: 'back.out(1.7)',
  elastic: 'elastic.out(1, 0.3)',
  smooth: 'power1.out',
} as const

export const gsapDurations = {
  fast: 0.3,
  normal: 0.6,
  slow: 0.9,
  slower: 1.2,
} as const

// Common scroll animation configurations
export const scrollConfigs = {
  // Standard reveal - triggers when element enters viewport
  reveal: {
    trigger: null, // Will be set dynamically
    start: 'top 85%',
    end: 'bottom 15%',
    toggleActions: 'play none none reverse',
    once: true,
  },
  
  // Parallax effect
  parallax: {
    trigger: null,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  },
  
  // Pin element during scroll
  pin: {
    trigger: null,
    start: 'top top',
    end: 'bottom bottom',
    pin: true,
    pinSpacing: false,
  },
  
  // Batch animations for multiple elements
  batch: {
    start: 'top 90%',
    end: 'bottom 10%',
    toggleActions: 'play none none reverse',
    once: true,
  },
} as const

// Predefined animation functions
export const gsapAnimations = {
  // Fade in from bottom
  fadeInUp: (element: gsap.TweenTarget, options: gsap.TweenVars = {}) => {
    return gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 50,
        ...options.from,
      },
      {
        opacity: 1,
        y: 0,
        duration: gsapDurations.normal,
        ease: gsapEasings.easeOut,
        ...options,
      }
    )
  },

  // Fade in
  fadeIn: (element: gsap.TweenTarget, options: gsap.TweenVars = {}) => {
    return gsap.fromTo(
      element,
      {
        opacity: 0,
        ...options.from,
      },
      {
        opacity: 1,
        duration: gsapDurations.normal,
        ease: gsapEasings.easeOut,
        ...options,
      }
    )
  },

  // Scale in
  scaleIn: (element: gsap.TweenTarget, options: gsap.TweenVars = {}) => {
    return gsap.fromTo(
      element,
      {
        opacity: 0,
        scale: 0.8,
        ...options.from,
      },
      {
        opacity: 1,
        scale: 1,
        duration: gsapDurations.normal,
        ease: gsapEasings.bounce,
        ...options,
      }
    )
  },

  // Slide in from left
  slideInLeft: (element: gsap.TweenTarget, options: gsap.TweenVars = {}) => {
    return gsap.fromTo(
      element,
      {
        opacity: 0,
        x: -50,
        ...options.from,
      },
      {
        opacity: 1,
        x: 0,
        duration: gsapDurations.normal,
        ease: gsapEasings.easeOut,
        ...options,
      }
    )
  },

  // Slide in from right
  slideInRight: (element: gsap.TweenTarget, options: gsap.TweenVars = {}) => {
    return gsap.fromTo(
      element,
      {
        opacity: 0,
        x: 50,
        ...options.from,
      },
      {
        opacity: 1,
        x: 0,
        duration: gsapDurations.normal,
        ease: gsapEasings.easeOut,
        ...options,
      }
    )
  },

  // Stagger reveal for lists
  staggerReveal: (elements: gsap.TweenTarget, options: gsap.TweenVars = {}) => {
    return gsap.fromTo(
      elements,
      {
        opacity: 0,
        y: 30,
        ...options.from,
      },
      {
        opacity: 1,
        y: 0,
        duration: gsapDurations.normal,
        ease: gsapEasings.easeOut,
        stagger: 0.1,
        ...options,
      }
    )
  },

  // Parallax movement
  parallax: (element: gsap.TweenTarget, distance: number = 100) => {
    return gsap.fromTo(
      element,
      {
        y: -distance,
      },
      {
        y: distance,
        ease: 'none',
      }
    )
  },

  // Counter animation
  counter: (element: gsap.TweenTarget, endValue: number, options: gsap.TweenVars = {}) => {
    const obj = { value: 0 }
    return gsap.to(obj, {
      value: endValue,
      duration: gsapDurations.slow,
      ease: gsapEasings.easeOut,
      onUpdate: () => {
        if (element instanceof Element) {
          element.textContent = Math.round(obj.value).toString()
        }
      },
      ...options,
    })
  },
} as const

// Utility functions
export const createScrollTrigger = (
  element: gsap.TweenTarget,
  animation: gsap.core.Tween | gsap.core.Timeline,
  config: Partial<ScrollTrigger.Vars> = {}
) => {
  return ScrollTrigger.create({
    trigger: element,
    animation,
    ...scrollConfigs.reveal,
    ...config,
  })
}

// Batch animations for performance
export const createBatchAnimation = (
  selector: string,
  animationFn: (element: Element) => gsap.core.Tween,
  config: Partial<ScrollTrigger.BatchVars> = {}
) => {
  return ScrollTrigger.batch(selector, {
    onEnter: (elements) => {
      elements.forEach((element) => animationFn(element))
    },
    ...scrollConfigs.batch,
    ...config,
  })
}

// Refresh ScrollTrigger (useful after dynamic content changes)
export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh()
}

// Kill all ScrollTriggers (cleanup)
export const killAllScrollTriggers = () => {
  ScrollTrigger.killAll()
}

// Performance monitoring
export const enableScrollTriggerDebug = () => {
  ScrollTrigger.config({ 
    limitCallbacks: true,
    syncInterval: 150 
  })
}

// Export GSAP instance for direct use
export { gsap, ScrollTrigger }

// Export default timeline for complex animations
export const createTimeline = (options: gsap.TimelineVars = {}) => {
  return gsap.timeline({
    ease: gsapEasings.easeOut,
    ...options,
  })
}

// Initialize GSAP with optimal settings
export const initGSAP = () => {
  // GSAP is already configured at the top of this file
  // This function exists for backward compatibility
  
  // Set initial states for common animated elements
  gsap.set('[data-animate="fade-in-up"]', { opacity: 0, y: 50 })
  gsap.set('[data-animate="scale-in"]', { opacity: 0, scale: 0.8 })
  gsap.set('[data-animate="slide-in-left"]', { opacity: 0, x: -50 })
  gsap.set('[data-animate="slide-in-right"]', { opacity: 0, x: 50 })
  
  // Enable debug mode in development
  if (import.meta.env.DEV) {
    enableScrollTriggerDebug()
  }
  
  console.log('🎬 GSAP Animation System initialized')
}