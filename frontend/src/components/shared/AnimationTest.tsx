/**
 * Animation Test Component
 * Quick test to verify all animations are working
 */

import { useRef } from 'react'
import { motion } from 'framer-motion'
import {
  useScrollFadeInUp,
  fadeInUp,
  buttonTap,
  cardHover,
  hwAcceleration,
  staggerContainer,
  staggerItem,
} from '@/core'

export function AnimationTest() {
  const scrollRef = useRef(null)
  
  // Test scroll animation
  useScrollFadeInUp(scrollRef, { duration: 0.6 })

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold">Animation System Test</h2>
      
      {/* Test scroll animation */}
      <motion.div
        ref={scrollRef}
        style={hwAcceleration}
        className="p-6 bg-blue-100 rounded-lg"
      >
        <h3>Scroll Animation Test</h3>
        <p>This should animate when scrolling into view</p>
      </motion.div>
      
      {/* Test button tap */}
      <motion.button
        {...buttonTap}
        style={hwAcceleration}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg"
      >
        Test Button Tap
      </motion.button>
      
      {/* Test card hover */}
      <motion.div
        {...cardHover}
        style={hwAcceleration}
        className="p-6 bg-white border rounded-lg shadow-sm"
      >
        <h3>Hover Test Card</h3>
        <p>Hover over this card to see the animation</p>
      </motion.div>
      
      {/* Test stagger animation */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-4"
      >
        <h3>Stagger Animation Test</h3>
        {[1, 2, 3].map((item) => (
          <motion.div
            key={item}
            variants={staggerItem}
            style={hwAcceleration}
            className="p-4 bg-green-100 rounded-lg"
          >
            Stagger Item {item}
          </motion.div>
        ))}
      </motion.div>
      
      {/* Test fade in up */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        style={hwAcceleration}
        className="p-6 bg-purple-100 rounded-lg"
      >
        <h3>Fade In Up Test</h3>
        <p>This should fade in from bottom</p>
      </motion.div>
    </div>
  )
}