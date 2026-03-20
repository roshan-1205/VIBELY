/**
 * AnimatedList Component - Example Implementation
 * Demonstrates GSAP stagger animations for lists
 */

import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useScrollStaggerReveal } from '@/core'
import { staggerContainer, staggerItem, hwAcceleration } from '@/lib/motion'

interface AnimatedListProps {
  children: React.ReactNode[]
  className?: string
  staggerDelay?: number
  animationType?: 'scroll' | 'immediate'
}

export function AnimatedList({
  children,
  className = '',
  staggerDelay = 0.1,
  animationType = 'scroll',
}: AnimatedListProps) {
  const listRef = useRef<HTMLDivElement>(null)

  // GSAP scroll-triggered stagger animation
  useScrollStaggerReveal(listRef, {
    stagger: staggerDelay,
    duration: 0.6,
    once: true,
  })

  if (animationType === 'immediate') {
    // Use Framer Motion for immediate stagger (no scroll trigger)
    return (
      <motion.div
        ref={listRef}
        className={className}
        style={hwAcceleration}
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {children.map((child, index) => (
          <motion.div
            key={index}
            variants={staggerItem}
            style={hwAcceleration}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    )
  }

  // Use GSAP for scroll-triggered animations
  return (
    <div
      ref={listRef}
      className={className}
      style={hwAcceleration}
    >
      {children.map((child, index) => (
        <div
          key={index}
          style={{
            ...hwAcceleration,
            opacity: 0,
            transform: 'translateY(30px)',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

// Usage example:
// <AnimatedList staggerDelay={0.1} animationType="scroll">
//   {items.map(item => (
//     <AnimatedCard key={item.id}>
//       {item.content}
//     </AnimatedCard>
//   ))}
// </AnimatedList>