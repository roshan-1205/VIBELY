/**
 * useScrollAnim Hook - Vibely Animation System
 * High-performance scroll-based animations using GSAP + ScrollTrigger
 * Animate elements when they enter the viewport
 */

import { useEffect, useRef, RefObject } from 'react'
import { gsap, ScrollTrigger, gsapAnimations, scrollConfigs } from '../../lib/gsap'

export interface ScrollAnimOptions {
  // Animation properties
  y?: number
  x?: number
  opacity?: number
  scale?: number
  rotation?: number
  
  // Timing
  duration?: number
  delay?: number
  ease?: string
  
  // ScrollTrigger options
  trigger?: string | Element
  start?: string
  end?: string
  scrub?: boolean | number
  pin?: boolean
  once?: boolean
  
  // Stagger (for multiple elements)
  stagger?: number
  
  // Custom animation function
  customAnimation?: (element: gsap.TweenTarget) => gsap.core.Tween
}

/**
 * Hook for animating elements on scroll
 * 
 * @param ref - React ref to the element to animate
 * @param options - Animation configuration options
 * @returns ScrollTrigger instance for manual control
 */
export function useScrollAnim<T extends Element>(
  ref: RefObject<T>,
  options: ScrollAnimOptions = {}
) {
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const {
      // Animation properties with defaults
      y = 50,
      x = 0,
      opacity = 0,
      scale = 1,
      rotation = 0,
      
      // Timing
      duration = 0.6,
      delay = 0,
      ease = 'power2.out',
      
      // ScrollTrigger options
      trigger,
      start = 'top 85%',
      end = 'bottom 15%',
      scrub = false,
      pin = false,
      once = true,
      
      // Stagger
      stagger = 0,
      
      // Custom animation
      customAnimation,
    } = options

    // Use custom animation if provided
    if (customAnimation) {
      const animation = customAnimation(element)
      
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: trigger || element,
        start,
        end,
        scrub,
        pin,
        once,
        animation,
      })
      
      return
    }

    // Create the animation
    const fromVars: gsap.TweenVars = {}
    const toVars: gsap.TweenVars = {
      duration,
      delay,
      ease,
    }

    // Set initial state (from)
    if (opacity !== 1) fromVars.opacity = opacity
    if (y !== 0) fromVars.y = y
    if (x !== 0) fromVars.x = x
    if (scale !== 1) fromVars.scale = scale
    if (rotation !== 0) fromVars.rotation = rotation

    // Set final state (to)
    toVars.opacity = 1
    toVars.y = 0
    toVars.x = 0
    toVars.scale = 1
    toVars.rotation = 0

    // Add stagger if specified
    if (stagger > 0) {
      toVars.stagger = stagger
    }

    // Create the animation
    const animation = gsap.fromTo(element, fromVars, toVars)

    // Create ScrollTrigger
    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: trigger || element,
      start,
      end,
      scrub,
      pin,
      once,
      animation,
    })

    // Cleanup function
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill()
        scrollTriggerRef.current = null
      }
    }
  }, [ref, options])

  return scrollTriggerRef.current
}

/**
 * Hook for fade in up animation (most common use case)
 */
export function useScrollFadeInUp<T extends Element>(
  ref: RefObject<T>,
  options: Omit<ScrollAnimOptions, 'y' | 'opacity'> = {}
) {
  return useScrollAnim(ref, {
    y: 50,
    opacity: 0,
    ...options,
  })
}

/**
 * Hook for scale in animation
 */
export function useScrollScaleIn<T extends Element>(
  ref: RefObject<T>,
  options: Omit<ScrollAnimOptions, 'scale' | 'opacity'> = {}
) {
  return useScrollAnim(ref, {
    scale: 0.8,
    opacity: 0,
    ease: 'back.out(1.7)',
    ...options,
  })
}

/**
 * Hook for slide in from left
 */
export function useScrollSlideInLeft<T extends Element>(
  ref: RefObject<T>,
  options: Omit<ScrollAnimOptions, 'x' | 'opacity'> = {}
) {
  return useScrollAnim(ref, {
    x: -50,
    opacity: 0,
    ...options,
  })
}

/**
 * Hook for slide in from right
 */
export function useScrollSlideInRight<T extends Element>(
  ref: RefObject<T>,
  options: Omit<ScrollAnimOptions, 'x' | 'opacity'> = {}
) {
  return useScrollAnim(ref, {
    x: 50,
    opacity: 0,
    ...options,
  })
}

/**
 * Hook for stagger reveal animation (for lists)
 */
export function useScrollStaggerReveal<T extends Element>(
  ref: RefObject<T>,
  options: ScrollAnimOptions = {}
) {
  return useScrollAnim(ref, {
    y: 30,
    opacity: 0,
    stagger: 0.1,
    ...options,
  })
}

/**
 * Hook for parallax effect
 */
export function useScrollParallax<T extends Element>(
  ref: RefObject<T>,
  distance: number = 100,
  options: Omit<ScrollAnimOptions, 'y' | 'scrub'> = {}
) {
  return useScrollAnim(ref, {
    customAnimation: (element) => gsapAnimations.parallax(element, distance),
    scrub: true,
    once: false,
    start: 'top bottom',
    end: 'bottom top',
    ...options,
  })
}

/**
 * Hook for counter animation
 */
export function useScrollCounter<T extends Element>(
  ref: RefObject<T>,
  endValue: number,
  options: ScrollAnimOptions = {}
) {
  return useScrollAnim(ref, {
    customAnimation: (element) => gsapAnimations.counter(element, endValue),
    ...options,
  })
}

/**
 * Utility hook for batch animations
 * Use this for animating multiple elements with the same animation
 */
export function useScrollBatch(
  selector: string,
  animationType: 'fadeInUp' | 'scaleIn' | 'slideInLeft' | 'slideInRight' = 'fadeInUp',
  options: ScrollAnimOptions = {}
) {
  useEffect(() => {
    const animationMap = {
      fadeInUp: gsapAnimations.fadeInUp,
      scaleIn: gsapAnimations.scaleIn,
      slideInLeft: gsapAnimations.slideInLeft,
      slideInRight: gsapAnimations.slideInRight,
    }

    const animation = animationMap[animationType]
    
    const batch = ScrollTrigger.batch(selector, {
      onEnter: (elements) => {
        elements.forEach((element, index) => {
          animation(element, {
            delay: (options.stagger || 0.1) * index,
            ...options,
          })
        })
      },
      start: options.start || 'top 90%',
      once: options.once !== false,
    })

    return () => {
      batch.forEach(trigger => trigger.kill())
    }
  }, [selector, animationType, options])
}