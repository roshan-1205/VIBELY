/**
 * Motion System - Vibely Design System
 * High-performance animation variants and presets for Framer Motion
 * Optimized for 60fps performance and smooth interactions
 */

// Define types locally since Framer Motion exports may vary
type Variants = {
  [key: string]: {
    [key: string]: string | number | boolean | object | undefined
  }
}

type Transition = {
  duration?: number
  ease?: number[] | string
  delay?: number
  type?: string
  stiffness?: number
  damping?: number
  repeat?: number
}

// Performance-optimized easing functions
export const easings = {
  easeInOut: [0.4, 0, 0.2, 1] as number[],
  easeOut: [0, 0, 0.2, 1] as number[],
  easeIn: [0.4, 0, 1, 1] as number[],
  bounce: [0.68, -0.55, 0.265, 1.55] as number[],
  elastic: [0.175, 0.885, 0.32, 1.275] as number[],
  sharp: [0.4, 0, 0.6, 1] as number[],
} as const

// Duration presets for consistent timing
export const durations = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.75,
} as const

// Common transitions
export const transitions = {
  instant: { duration: durations.instant, ease: easings.easeOut },
  fast: { duration: durations.fast, ease: easings.easeOut },
  normal: { duration: durations.normal, ease: easings.easeInOut },
  slow: { duration: durations.slow, ease: easings.easeInOut },
  bounce: { duration: durations.normal, ease: easings.bounce },
  elastic: { duration: durations.slow, ease: easings.elastic },
  sharp: { duration: durations.fast, ease: easings.sharp },
} as const

// 1. FADE IN UP - Core entrance animation
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 40,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easings.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: transitions.fast,
  },
}

// 2. SCALE TAP - Fast response feel
export const scaleTap = {
  whileTap: { 
    scale: 0.96,
    transition: { duration: 0.1, ease: easings.easeOut }
  },
}

// 3. HOVER GLOW - Subtle scale with shadow glow
export const hoverGlow = {
  whileHover: {
    scale: 1.03,
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12), 0 0 20px var(--vibe-glow, rgba(59, 130, 246, 0.3))',
    transition: transitions.fast,
  },
}

// 4. STAGGER CONTAINER - Children animation orchestration
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },
}

// Enhanced fade animations
export const fadeIn: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
}

// Scale animations for modals and cards
export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: transitions.bounce,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitions.fast,
  },
}

// Slide animations
export const slideInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -30,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    x: -30,
    transition: transitions.fast,
  },
}

export const slideInRight: Variants = {
  initial: {
    opacity: 0,
    x: 30,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    x: 30,
    transition: transitions.fast,
  },
}

// Interactive animations with performance optimization
export const hoverScale = {
  whileHover: { 
    scale: 1.02,
    transition: transitions.fast,
  },
}

export const hoverLift = {
  whileHover: {
    y: -2,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: transitions.normal,
  },
}

// Button interactions
export const buttonTap = {
  whileTap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  },
  whileHover: {
    scale: 1.02,
    transition: transitions.fast,
  },
}

// Card interactions
export const cardHover = {
  whileHover: {
    y: -4,
    scale: 1.02,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: transitions.normal,
  },
}

// Loading animations
export const pulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: easings.easeInOut,
    },
  },
}

export const spin: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

// Page transitions with route changes
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easings.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: easings.easeIn,
    },
  },
}

// Modal animations
export const modalBackdrop: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
}

export const modalContent: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.bounce,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: transitions.fast,
  },
}

// Notification animations
export const slideInFromTop: Variants = {
  initial: {
    opacity: 0,
    y: -100,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.bounce,
  },
  exit: {
    opacity: 0,
    y: -100,
    transition: transitions.normal,
  },
}

// Vibe-specific animations
export const vibeGlow: Variants = {
  animate: {
    boxShadow: [
      '0 0 20px var(--vibe-glow)',
      '0 0 40px var(--vibe-glow)',
      '0 0 20px var(--vibe-glow)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: easings.easeInOut,
    },
  },
}

// Stagger utilities
export const createStagger = (staggerDelay = 0.1, delayChildren = 0) => ({
  animate: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
})

// Fast stagger for lists
export const fastStagger = createStagger(0.05, 0)
export const normalStagger = createStagger(0.1, 0.1)
export const slowStagger = createStagger(0.15, 0.2)

// Spring utilities
export const createSpring = (stiffness = 300, damping = 30): Transition => ({
  type: 'spring',
  stiffness,
  damping,
})

// Performance-optimized variants collection
export const motionVariants = {
  fadeInUp,
  fadeIn,
  scaleIn,
  slideInLeft,
  slideInRight,
  staggerContainer,
  staggerItem,
  pulse,
  spin,
  pageTransition,
  modalBackdrop,
  modalContent,
  slideInFromTop,
  vibeGlow,
} as const

// Interactive animations collection
export const motionInteractions = {
  scaleTap,
  hoverGlow,
  hoverScale,
  hoverLift,
  buttonTap,
  cardHover,
} as const

// Hardware acceleration CSS class
export const hwAcceleration = {
  willChange: 'transform',
  backfaceVisibility: 'hidden' as const,
  perspective: 1000,
}