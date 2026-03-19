/**
 * Design Tokens - Vibely Design System
 * Premium SaaS-grade design tokens following 8px grid system
 */

export const tokens = {
  // Spacing scale (8px system)
  spacing: {
    0: '0px',
    1: '4px',    // 0.5 * 8px
    2: '8px',    // 1 * 8px
    3: '12px',   // 1.5 * 8px
    4: '16px',   // 2 * 8px
    5: '20px',   // 2.5 * 8px
    6: '24px',   // 3 * 8px
    8: '32px',   // 4 * 8px
    10: '40px',  // 5 * 8px
    12: '48px',  // 6 * 8px
    16: '64px',  // 8 * 8px
    20: '80px',  // 10 * 8px
    24: '96px',  // 12 * 8px
    32: '128px', // 16 * 8px
    40: '160px', // 20 * 8px
    48: '192px', // 24 * 8px
    56: '224px', // 28 * 8px
    64: '256px', // 32 * 8px
  },

  // Border radius scale
  radius: {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '24px',
    '4xl': '32px',
    full: '9999px',
  },

  // Typography scale
  fontSize: {
    xs: ['12px', { lineHeight: '16px', letterSpacing: '0.025em' }],
    sm: ['14px', { lineHeight: '20px', letterSpacing: '0.025em' }],
    base: ['16px', { lineHeight: '24px', letterSpacing: '0em' }],
    lg: ['18px', { lineHeight: '28px', letterSpacing: '-0.025em' }],
    xl: ['20px', { lineHeight: '28px', letterSpacing: '-0.025em' }],
    '2xl': ['24px', { lineHeight: '32px', letterSpacing: '-0.025em' }],
    '3xl': ['30px', { lineHeight: '36px', letterSpacing: '-0.025em' }],
    '4xl': ['36px', { lineHeight: '40px', letterSpacing: '-0.05em' }],
    '5xl': ['48px', { lineHeight: '1', letterSpacing: '-0.05em' }],
    '6xl': ['60px', { lineHeight: '1', letterSpacing: '-0.05em' }],
    '7xl': ['72px', { lineHeight: '1', letterSpacing: '-0.05em' }],
  },

  // Font weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Z-index layers
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },

  // Animation durations
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '750ms',
    slowest: '1000ms',
  },

  // Animation easings
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  // Shadows
  shadow: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    glow: '0 0 20px var(--vibe-glow)',
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const

// Type exports for TypeScript
export type SpacingToken = keyof typeof tokens.spacing
export type RadiusToken = keyof typeof tokens.radius
export type FontSizeToken = keyof typeof tokens.fontSize
export type ZIndexToken = keyof typeof tokens.zIndex
export type DurationToken = keyof typeof tokens.duration
export type EasingToken = keyof typeof tokens.easing