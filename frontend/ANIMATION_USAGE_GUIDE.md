# 🎬 Animation System - Quick Usage Guide

## 🚀 **Quick Start**

### **1. Import Animations**
```typescript
import { 
  useScrollFadeInUp,
  scaleTap,
  hoverGlow,
  hwAcceleration 
} from '@/core'
```

### **2. Basic Scroll Animation**
```typescript
function MyComponent() {
  const ref = useRef(null)
  useScrollFadeInUp(ref)
  
  return <div ref={ref}>Content animates on scroll</div>
}
```

### **3. Button with Tap Animation**
```typescript
<motion.button {...scaleTap}>
  Click me
</motion.button>
```

### **4. Card with Hover Effect**
```typescript
<motion.div {...hoverGlow} style={hwAcceleration}>
  Hover for glow effect
</motion.div>
```

---

## 📋 **Common Patterns**

### **Feed Item Animation**
```typescript
function FeedItem({ post, index }) {
  const ref = useRef(null)
  
  useScrollFadeInUp(ref, {
    delay: index * 0.1, // Stagger delay
    duration: 0.6
  })
  
  return (
    <motion.div 
      ref={ref}
      {...cardHover}
      style={hwAcceleration}
    >
      {post.content}
    </motion.div>
  )
}
```

### **Button Component**
```typescript
function Button({ children, onClick, variant = 'primary' }) {
  return (
    <motion.button
      className={`btn-${variant}`}
      style={hwAcceleration}
      {...buttonTap}
      onClick={onClick}
    >
      {children}
    </motion.button>
  )
}
```

### **List with Stagger**
```typescript
function PostList({ posts }) {
  const listRef = useRef(null)
  
  useScrollStaggerReveal(listRef, {
    stagger: 0.1,
    duration: 0.6
  })
  
  return (
    <div ref={listRef}>
      {posts.map((post, index) => (
        <div key={post.id} style={{ opacity: 0, transform: 'translateY(30px)' }}>
          <PostCard post={post} />
        </div>
      ))}
    </div>
  )
}
```

### **Modal Animation**
```typescript
function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={modalBackdrop}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            variants={modalContent}
            initial="initial"
            animate="animate"
            exit="exit"
            style={hwAcceleration}
            className="fixed inset-0 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

---

## ⚡ **Performance Tips**

### **1. Always Use Hardware Acceleration**
```typescript
// ✅ Good
<motion.div style={hwAcceleration} {...hoverGlow}>
  Content
</motion.div>

// ❌ Bad - no hardware acceleration
<motion.div {...hoverGlow}>
  Content
</motion.div>
```

### **2. Animate Only Transform & Opacity**
```typescript
// ✅ Good - animates transform
useScrollAnim(ref, { y: 50, opacity: 0 })

// ❌ Bad - animates layout properties
useScrollAnim(ref, { height: 100, width: 200 })
```

### **3. Use Appropriate Timing**
```typescript
// ✅ Good - fast interactions
const buttonTap = { whileTap: { scale: 0.96, transition: { duration: 0.1 } } }

// ✅ Good - smooth entrances
useScrollFadeInUp(ref, { duration: 0.6 })

// ❌ Bad - too slow for interactions
const buttonTap = { whileTap: { scale: 0.96, transition: { duration: 0.5 } } }
```

---

## 🎯 **Integration Rules**

| Use Case | Library | Hook/Component | Timing |
|----------|---------|----------------|---------|
| **Scroll Reveal** | GSAP | `useScrollFadeInUp` | 0.6s |
| **Button Tap** | Framer Motion | `scaleTap` | 0.1s |
| **Card Hover** | Framer Motion | `hoverGlow` | 0.15s |
| **List Stagger** | GSAP | `useScrollStaggerReveal` | 0.1s stagger |
| **Modal** | Framer Motion | `modalContent` | 0.3s |
| **Page Transition** | Framer Motion | `pageTransition` | 0.3s |

---

## 🔧 **Troubleshooting**

### **Animation Not Working?**
1. Check if element has `ref` attached
2. Ensure hardware acceleration is applied
3. Verify import paths are correct
4. Check console for GSAP/Motion errors

### **Performance Issues?**
1. Avoid animating layout properties
2. Use `hwAcceleration` style object
3. Reduce stagger timing for large lists
4. Check if too many animations are running simultaneously

### **Accessibility**
The system automatically respects `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  /* All animations are disabled */
}
```

---

## 📚 **Complete Example Component**

```typescript
import React, { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  useScrollFadeInUp, 
  buttonTap, 
  cardHover, 
  hwAcceleration,
  modalContent,
  modalBackdrop 
} from '@/core'

function ExampleComponent() {
  const cardRef = useRef(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Scroll animation for card
  useScrollFadeInUp(cardRef, {
    duration: 0.6,
    delay: 0.2
  })
  
  return (
    <>
      {/* Animated Card */}
      <motion.div
        ref={cardRef}
        style={hwAcceleration}
        {...cardHover}
        className="bg-white rounded-lg p-6 shadow-lg"
      >
        <h3>Animated Card</h3>
        <p>This card animates on scroll and has hover effects</p>
        
        {/* Animated Button */}
        <motion.button
          style={hwAcceleration}
          {...buttonTap}
          onClick={() => setIsModalOpen(true)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Open Modal
        </motion.button>
      </motion.div>
      
      {/* Animated Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              variants={modalBackdrop}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              variants={modalContent}
              initial="initial"
              animate="animate"
              exit="exit"
              style={hwAcceleration}
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
            >
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3>Animated Modal</h3>
                <p>This modal has smooth entrance and exit animations</p>
                <motion.button
                  {...buttonTap}
                  onClick={() => setIsModalOpen(false)}
                  className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
```

---

## 🎉 **You're Ready!**

The animation system is now fully implemented and ready to use. Start by importing from `@/core` and follow the patterns above for smooth, performant animations! 🚀