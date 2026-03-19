/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CSS Variables for theming
        primary: "var(--accent)",
        background: "var(--bg-primary)",
        text: "var(--text-primary)",
        
        // Extended color palette
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        
        // Glassmorphism colors
        glass: {
          white: 'rgba(255, 255, 255, 0.1)',
          black: 'rgba(0, 0, 0, 0.1)',
          primary: 'rgba(14, 165, 233, 0.1)',
        },
        
        // Vibe colors
        vibe: {
          positive: '#10b981',
          neutral: '#f59e0b',
          negative: '#ef4444',
          glow: 'var(--vibe-glow)',
        },
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      
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
      
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '32px',
      },
      
      backdropBlur: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
      },
      
      // Gradient presets
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'vibe-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-inset': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -12px rgba(0, 0, 0, 0.25)',
        'vibe': '0 0 20px var(--vibe-glow)',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'vibe-pulse': 'vibePulse 2s ease-in-out infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0,-8px,0)' },
          '70%': { transform: 'translate3d(0,-4px,0)' },
          '90%': { transform: 'translate3d(0,-2px,0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        vibePulse: {
          '0%, 100%': { boxShadow: '0 0 20px var(--vibe-glow)' },
          '50%': { boxShadow: '0 0 40px var(--vibe-glow)' },
        },
      },
      
      // Z-index scale
      zIndex: {
        'hide': '-1',
        'auto': 'auto',
        'base': '0',
        'docked': '10',
        'dropdown': '1000',
        'sticky': '1100',
        'banner': '1200',
        'overlay': '1300',
        'modal': '1400',
        'popover': '1500',
        'skipLink': '1600',
        'toast': '1700',
        'tooltip': '1800',
      },
    },
  },
  plugins: [],
}