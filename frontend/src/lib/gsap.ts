import { gsap } from 'gsap'

// GSAP effect configuration interface
interface EffectConfig {
  duration?: number
  ease?: string
  stagger?: number
  distance?: number
  startScale?: number
  glowSize?: number
  [key: string]: unknown
}

// GSAP configuration and utilities
export const initGSAP = () => {
  // Set default GSAP settings
  gsap.defaults({
    duration: 0.6,
    ease: 'power2.out',
  })
  
  // Register common animations
  gsap.registerEffect({
    name: 'fadeInUp',
    effect: (targets: gsap.TweenTarget, config: EffectConfig) => {
      return gsap.fromTo(targets, 
        { 
          opacity: 0, 
          y: config.distance || 30 
        },
        { 
          opacity: 1, 
          y: 0, 
          duration: config.duration || 0.6,
          ease: config.ease || 'power2.out',
          stagger: config.stagger || 0.1
        }
      )
    },
    defaults: { duration: 0.6, distance: 30 },
    extendTimeline: true,
  })
  
  gsap.registerEffect({
    name: 'scaleIn',
    effect: (targets: gsap.TweenTarget, config: EffectConfig) => {
      return gsap.fromTo(targets,
        { 
          scale: config.startScale || 0.8, 
          opacity: 0 
        },
        { 
          scale: 1, 
          opacity: 1, 
          duration: config.duration || 0.4,
          ease: config.ease || 'back.out(1.7)'
        }
      )
    },
    defaults: { duration: 0.4, startScale: 0.8 },
    extendTimeline: true,
  })
  
  gsap.registerEffect({
    name: 'vibeGlow',
    effect: (targets: gsap.TweenTarget, config: EffectConfig) => {
      return gsap.to(targets, {
        boxShadow: `0 0 ${config.glowSize || 20}px var(--vibe-glow)`,
        duration: config.duration || 1,
        ease: config.ease || 'power2.inOut',
        yoyo: true,
        repeat: -1,
      })
    },
    defaults: { duration: 1, glowSize: 20 },
    extendTimeline: true,
  })
}

// Animation presets
export const animations = {
  fadeInUp: (element: gsap.TweenTarget, delay = 0) => {
    return gsap.fromTo(element,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, delay, ease: 'power2.out' }
    )
  },
  
  scaleIn: (element: gsap.TweenTarget, delay = 0) => {
    return gsap.fromTo(element,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, delay, ease: 'back.out(1.7)' }
    )
  },
  
  slideInLeft: (element: gsap.TweenTarget, delay = 0) => {
    return gsap.fromTo(element,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, delay, ease: 'power2.out' }
    )
  },
  
  slideInRight: (element: gsap.TweenTarget, delay = 0) => {
    return gsap.fromTo(element,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, delay, ease: 'power2.out' }
    )
  },
  
  vibeGlow: (element: gsap.TweenTarget) => {
    return gsap.to(element, {
      boxShadow: '0 0 20px var(--vibe-glow)',
      duration: 1,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1,
    })
  },
}

// Scroll-triggered animations
export const scrollAnimations = {
  fadeInOnScroll: (element: gsap.TweenTarget) => {
    return gsap.fromTo(element,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element as Element,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  },
}