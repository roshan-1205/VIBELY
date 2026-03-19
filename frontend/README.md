# 🌟 Vibely Design System - World-Class UI Components

A premium SaaS-grade design system built with **Tailwind CSS**, **CSS Variables**, and **Framer Motion** for the Vibely social media platform.

## 🎨 Design Philosophy

Our design system follows **glassmorphism** principles with:
- **Backdrop blur effects** for depth and elegance
- **CSS variables** for consistent theming
- **8px grid system** for perfect spacing
- **Smooth 60fps animations** for premium feel
- **Accessibility-first** approach (WCAG compliant)

## 🚀 Quick Start

```tsx
import { Button, Card, Avatar, Input } from '@/components/ui'

function MyComponent() {
  return (
    <Card variant="glass" hover glow>
      <div className="flex items-center gap-4">
        <Avatar fallback="JD" status="online" />
        <div className="flex-1">
          <Input 
            variant="glass" 
            placeholder="What's your vibe?" 
            glow 
          />
        </div>
        <Button variant="primary">Share</Button>
      </div>
    </Card>
  )
}
```

## 📦 Components

### 🔘 Button
Premium interactive buttons with multiple variants and loading states.

```tsx
<Button variant="primary" size="lg" loading={isLoading}>
  Click me
</Button>

<Button variant="glass" leftIcon={<Icon />} rightIcon={<Arrow />}>
  With Icons
</Button>
```

**Variants:** `primary` | `secondary` | `ghost` | `glass` | `outline` | `danger` | `success`
**Sizes:** `sm` | `md` | `lg` | `xl`

### 🃏 Card
Glassmorphism cards with hover effects and multiple variants.

```tsx
<Card variant="glass" hover glow>
  <CardHeader>
    <CardTitle>Premium Card</CardTitle>
    <CardDescription>With glassmorphism effects</CardDescription>
  </CardHeader>
  <CardContent>
    Your content here
  </CardContent>
</Card>
```

**Variants:** `glass` | `solid` | `elevated` | `outline`
**Features:** Hover animations, vibe glow effects, backdrop blur

### 👤 Avatar
User avatars with fallbacks, status indicators, and grouping.

```tsx
<Avatar 
  src="/user.jpg" 
  fallback="JD" 
  status="online" 
  size="lg" 
  hover 
/>

<AvatarGroup max={5} spacing="normal">
  <Avatar fallback="A1" />
  <Avatar fallback="A2" />
  <Avatar fallback="A3" />
</AvatarGroup>
```

**Sizes:** `xs` | `sm` | `md` | `lg` | `xl` | `2xl` | `3xl`
**Status:** `online` | `offline` | `away` | `busy`

### 📝 Input & Textarea
Premium form controls with focus animations and validation.

```tsx
<Input
  variant="glass"
  label="Username"
  placeholder="Enter username..."
  leftIcon={<UserIcon />}
  error="Username is required"
  glow
/>

<Textarea
  label="Message"
  placeholder="Write your message..."
  rows={4}
  hint="Maximum 500 characters"
/>
```

**Variants:** `default` | `glass` | `outline` | `filled`
**Features:** Focus glow, smooth animations, icon support

### ⏳ Skeleton
Shimmer loading states for better perceived performance.

```tsx
<Skeleton height="20px" width="60%" />
<Skeleton variant="shimmer" height="40px" />
<Skeleton avatar />
<SkeletonCard />
<SkeletonPost />
```

**Variants:** `default` | `glass` | `shimmer`
**Presets:** Avatar, Card, Post layouts

## 🎭 Animation System

Built with **Framer Motion** for smooth, performant animations.

```tsx
import { fadeInUp, scaleTap, hoverGlow } from '@/lib/motion'

<motion.div variants={fadeInUp} {...scaleTap}>
  Animated content
</motion.div>
```

### Available Animations
- **Entry:** `fadeInUp`, `fadeIn`, `scaleIn`, `slideInLeft`, `slideInRight`
- **Interactive:** `scaleTap`, `hoverGlow`, `hoverScale`, `hoverLift`
- **Loading:** `pulse`, `spin`, `shimmer`, `vibeGlow`
- **Layout:** `staggerContainer`, `pageTransition`, `modalContent`

## 🎨 Design Tokens

### Spacing (8px Grid System)
```css
--spacing-1: 4px   /* 0.5 * 8px */
--spacing-2: 8px   /* 1 * 8px */
--spacing-4: 16px  /* 2 * 8px */
--spacing-6: 24px  /* 3 * 8px */
--spacing-8: 32px  /* 4 * 8px */
```

### Border Radius
```css
--radius-xl: 16px
--radius-2xl: 20px
--radius-3xl: 24px
--radius-4xl: 32px
```

### Typography Scale
```css
--text-xs: 12px / 16px
--text-sm: 14px / 20px
--text-base: 16px / 24px
--text-lg: 18px / 28px
--text-xl: 20px / 28px
```

### Z-Index Layers
```css
--z-dropdown: 1000
--z-sticky: 1100
--z-modal: 1400
--z-toast: 1700
--z-tooltip: 1800
```

## 🌈 Theme System

### CSS Variables
Our theme system uses CSS variables for consistent theming across light/dark modes.

```css
:root {
  /* Background Colors */
  --bg-primary: #fafbfc;
  --bg-secondary: #f1f5f9;
  
  /* Accent Colors */
  --accent: #0ea5e9;
  --accent-hover: #0284c7;
  
  /* Glass System */
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
  
  /* Vibe Colors */
  --vibe-glow: rgba(14, 165, 233, 0.5);
  --vibe-positive: #10b981;
  --vibe-neutral: #f59e0b;
  --vibe-negative: #ef4444;
}
```

### Theme Switching
```tsx
// Apply theme classes to body or root element
<div className="theme-light">  {/* or theme-dark */}
  <App />
</div>
```

### Vibe Themes
Dynamic theming based on sentiment analysis:
```tsx
<div className="vibe-positive">  {/* Green glow */}
<div className="vibe-neutral">   {/* Yellow glow */}
<div className="vibe-negative">  {/* Red glow */}
```

## 🔧 Utility Classes

### Glassmorphism
```css
.glass              /* Basic glass effect */
.glass-strong       /* Enhanced glass effect */
.glass-card         /* Glass card with padding */
.glass-button       /* Glass button style */
```

### Interactive States
```css
.btn-primary        /* Primary button */
.btn-glass          /* Glass button */
.btn-ghost          /* Ghost button */
.vibe-glow          /* Vibe glow effect */
```

### Layout
```css
.sidebar            /* Fixed sidebar */
.main-content       /* Main content area */
.transition-smooth  /* Smooth transitions */
.focus-ring         /* Focus ring styles */
```

## 📱 Responsive Design

All components are mobile-first and responsive:

```tsx
<Button 
  size={{ base: 'sm', md: 'md', lg: 'lg' }}
  fullWidth={{ base: true, md: false }}
>
  Responsive Button
</Button>
```

### Breakpoints
- **sm:** 640px
- **md:** 768px  
- **lg:** 1024px
- **xl:** 1280px
- **2xl:** 1536px

## ♿ Accessibility

### ARIA Support
All components include proper ARIA attributes:
```tsx
<Button aria-label="Save document" disabled={saving}>
  {saving ? 'Saving...' : 'Save'}
</Button>
```

### Keyboard Navigation
- **Tab:** Navigate between interactive elements
- **Enter/Space:** Activate buttons and controls
- **Escape:** Close modals and dropdowns

### Focus Management
```css
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-accent-500/20;
}
```

## 🎯 Best Practices

### Component Usage
```tsx
// ✅ Good - Clean, semantic usage
<Card variant="glass" hover>
  <CardHeader>
    <CardTitle>User Profile</CardTitle>
  </CardHeader>
  <CardContent>
    <Avatar fallback="JD" status="online" />
  </CardContent>
</Card>

// ❌ Avoid - Overriding core styles
<Card className="!bg-red-500 !border-none">
  Don't override core styles
</Card>
```

### Animation Performance
```tsx
// ✅ Good - Use provided motion presets
<motion.div variants={fadeInUp} {...scaleTap}>

// ❌ Avoid - Custom animations without optimization
<motion.div animate={{ x: [0, 100, 0] }} transition={{ repeat: Infinity }}>
```

### Theme Consistency
```tsx
// ✅ Good - Use CSS variables
style={{ color: 'var(--text-primary)' }}

// ❌ Avoid - Hardcoded colors
style={{ color: '#1e293b' }}
```

## 🚀 Performance

### Bundle Size Optimization
- **Tree shaking:** Import only what you need
- **Code splitting:** Components load on demand
- **CSS purging:** Unused styles removed in production

### Animation Performance
- **Hardware acceleration:** `transform` and `opacity` only
- **60fps target:** Smooth animations on all devices
- **Reduced motion:** Respects user preferences

### Loading States
```tsx
// Show skeletons while loading
{loading ? <SkeletonCard /> : <ActualCard />}
```

## 🎨 Design System Demo

Visit `/design-system` in the app to see all components in action with:
- **Interactive examples** of every component
- **Code snippets** for easy copy-paste
- **Variant showcases** with all options
- **Animation demonstrations** 
- **Responsive behavior** testing

## 🔄 Updates & Versioning

The design system follows semantic versioning:
- **Major:** Breaking changes to component APIs
- **Minor:** New components or non-breaking features  
- **Patch:** Bug fixes and small improvements

---

**🎯 This design system provides everything needed to build premium, accessible, and performant user interfaces that scale to millions of users while maintaining consistency and developer experience.**

## 🌐 Live Demo

**Frontend:** http://localhost:3001/design-system
**Components:** All components available with live examples and code snippets