/**
 * Card Component - Vibely Design System
 * Premium glass card with hover effects and motion animations
 */

import { forwardRef, type HTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { hoverLift, fadeInUp } from '@/lib/motion'
import { cn } from '@/core/utils'

// Define motion props locally to avoid Framer Motion export issues
type MotionProps = {
  initial?: object
  animate?: object
  exit?: object
  whileHover?: object
  whileTap?: object
  transition?: object
  variants?: object
}

// Card variants
const cardVariants = {
  base: 'backdrop-blur-xl border rounded-2xl transition-all duration-300',
  
  variants: {
    glass: 'border-white/20 shadow-glass',
    solid: 'bg-white border-gray-200 shadow-soft',
    elevated: 'bg-white border-gray-200 shadow-soft-lg',
    outline: 'border-2 border-gray-200 bg-transparent',
  },
  
  padding: {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  },
} as const

export interface CardProps 
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
    Omit<MotionProps, 'children'> {
  variant?: keyof typeof cardVariants.variants
  padding?: keyof typeof cardVariants.padding
  hover?: boolean
  glow?: boolean
  children: React.ReactNode
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({
    variant = 'glass',
    padding = 'md',
    hover = false,
    glow = false,
    className,
    children,
    ...props
  }, ref) => {
    // Generate glass styles
    const getGlassStyles = () => {
      if (variant === 'glass') {
        return {
          background: 'linear-gradient(135deg, var(--glass-bg) 0%, var(--glass-bg-strong) 100%)',
          borderColor: 'var(--glass-border)',
          boxShadow: '0 8px 32px 0 var(--glass-shadow)',
        }
      }
      return {}
    }

    // Generate glow styles
    const getGlowStyles = () => {
      if (glow) {
        return {
          boxShadow: '0 0 20px var(--vibe-glow), 0 8px 32px 0 var(--glass-shadow)',
        }
      }
      return {}
    }

    const motionProps = hover ? hoverLift : {}

    return (
      <motion.div
        ref={ref}
        className={cn(
          cardVariants.base,
          cardVariants.variants[variant],
          cardVariants.padding[padding],
          className
        )}
        style={{
          ...getGlassStyles(),
          ...getGlowStyles(),
        }}
        variants={fadeInUp}
        {...motionProps}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

// Card sub-components
export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 pb-6', className)}
      {...props}
    >
      {children}
    </div>
  )
)

CardHeader.displayName = 'CardHeader'

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      style={{ color: 'var(--text-primary)' }}
      {...props}
    >
      {children}
    </h3>
  )
)

CardTitle.displayName = 'CardTitle'

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm', className)}
      style={{ color: 'var(--text-secondary)' }}
      {...props}
    >
      {children}
    </p>
  )
)

CardDescription.displayName = 'CardDescription'

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('pt-0', className)}
      {...props}
    >
      {children}
    </div>
  )
)

CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-6', className)}
      {...props}
    >
      {children}
    </div>
  )
)

CardFooter.displayName = 'CardFooter'