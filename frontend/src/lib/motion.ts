/**
 * Motion System - Vibely Design System
 * Premium animation variants and presets for Framer Motion
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

// Easing functions
export const easings = {
  easeInOut: [0.4, 0, 0.2, 1] as number[],
  easeOut: [0, 0, 0.2, 1] as number[],
  easeIn: [0.4, 0, 1, 1] as number[],
  bounce: [0.68, -0.55, 0.265, 1.55] as number[],
  elastic: [0.175, 0.885, 0.32, 1.275] as number[],
} as const

// Duration presets
export const durations = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.75,
} as const

// Common transitions
export const transitions = {
  fast: { duration: durations.fast, ease: easings.easeOut },
  normal: { duration: durations.normal, ease: easings.easeInOut },
  slow: { duration: durations.slow, ease: easings.easeInOut },
  bounce: { duration: durations.normal, ease: easings.bounce },
  elastic: { duration: durations.slow, ease: easings.elastic },
} as const

// Animation variants
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: transitions.fast,
  },
}

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

export const slideInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: transitions.fast,
  },
}

export const slideInRight: Variants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: transitions.fast,
  },
}

// Stagger animations
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

// Interactive animations
export const scaleTap = {
  whileTap: { scale: 0.95 },
  transition: transitions.fast,
}

export const hoverGlow = {
  whileHover: {
    boxShadow: '0 0 20px var(--vibe-glow)',
    transition: transitions.normal,
  },
}

export const hoverScale = {
  whileHover: { scale: 1.02 },
  transition: transitions.fast,
}

export const hoverLift = {
  whileHover: {
    y: -2,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  transition: transitions.normal,
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

export const shimmer: Variants = {
  animate: {
    x: ['0%', '100%'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

// Page transitions
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
    y: -20,
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

export const slideInFromRight: Variants = {
  initial: {
    opacity: 0,
    x: 100,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: transitions.bounce,
  },
  exit: {
    opacity: 0,
    x: 100,
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

export const vibePulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: easings.easeInOut,
    },
  },
}

// Utility functions
export const createStagger = (staggerDelay = 0.1, delayChildren = 0) => ({
  animate: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
})

export const createSpring = (stiffness = 300, damping = 30): Transition => ({
  type: 'spring',
  stiffness,
  damping,
})

export const createDelay = (delay: number): Transition => ({
  delay,
  ...transitions.normal,
})

// Export all variants as a collection
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
  shimmer,
  pageTransition,
  modalBackdrop,
  modalContent,
  slideInFromTop,
  slideInFromRight,
  vibeGlow,
  vibePulse,
} as const

// Export interactive animations
export const motionInteractions = {
  scaleTap,
  hoverGlow,
  hoverScale,
  hoverLift,
} as const