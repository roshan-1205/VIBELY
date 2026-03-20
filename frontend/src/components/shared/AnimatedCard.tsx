/**
 * AnimatedCard Component - Example Implementation
 * Demonstrates proper animation integration following Vibely animation rules
 */

import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { useScrollFadeInUp } from '@/core'
import { cardHover, hwAcceleration } from '@/lib/motion'

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
  enableScrollAnimation?: boolean
  enableHoverAnimation?: boolean
}

export function AnimatedCard({ 
  children, 
  className = '', 
  delay = 0,
  enableScrollAnimation = true,
  enableHoverAnimation = true,
}: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  
  // GSAP scroll animation (when card enters viewport)
  useScrollFadeInUp(cardRef, {
    delay,
    duration: 0.6,
    once: true,
  })

  return (
    <motion.div
      ref={cardRef}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
      style={hwAcceleration}
      // Framer Motion hover animation (for interactions)
      {...(enableHoverAnimation ? cardHover : {})}
      initial={enableScrollAnimation ? { opacity: 0, y: 50 } : false}
    >
      {children}
    </motion.div>
  )
}

// Usage example:
// <AnimatedCard delay={0.2} className="mb-4">
//   <h3>Card Title</h3>
//   <p>Card content...</p>
// </AnimatedCard>