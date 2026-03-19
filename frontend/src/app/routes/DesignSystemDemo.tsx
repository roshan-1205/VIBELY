/**
 * Design System Demo - Vibely UI Components Showcase
 * Premium component gallery demonstrating the design system
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  Avatar,
  AvatarGroup,
  Input,
  Textarea,
  Skeleton,
  SkeletonCard,
  SkeletonPost
} from '@/components/ui'
import { staggerContainer, staggerItem } from '@/lib/motion'

export function DesignSystemDemo() {
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')

  const handleLoadingDemo = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <motion.div
      className="max-w-6xl mx-auto p-8 space-y-12"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="text-center space-y-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Vibely Design System
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Premium glassmorphism UI components with smooth animations and perfect accessibility
        </p>
      </motion.div>

      {/* Buttons Section */}
      <motion.section variants={staggerItem} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>
              Interactive buttons with multiple variants and loading states
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primary Buttons */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Primary Variants</h4>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" size="sm">Small Primary</Button>
                <Button variant="primary" size="md">Medium Primary</Button>
                <Button variant="primary" size="lg">Large Primary</Button>
                <Button variant="primary" loading={loading} onClick={handleLoadingDemo}>
                  {loading ? 'Loading...' : 'Click to Load'}
                </Button>
              </div>
            </div>

            {/* Secondary Buttons */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Other Variants</h4>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="glass">Glass</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="success">Success</Button>
              </div>
            </div>

            {/* Buttons with Icons */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">With Icons</h4>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="primary" 
                  leftIcon={<span>🚀</span>}
                >
                  Launch
                </Button>
                <Button 
                  variant="glass" 
                  rightIcon={<span>→</span>}
                >
                  Continue
                </Button>
                <Button 
                  variant="outline" 
                  leftIcon={<span>💾</span>}
                  rightIcon={<span>✓</span>}
                >
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Cards Section */}
      <motion.section variants={staggerItem} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Cards</CardTitle>
            <CardDescription>
              Glassmorphism cards with hover effects and multiple variants
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="glass" hover glow>
              <CardHeader>
                <CardTitle className="text-lg">Glass Card</CardTitle>
                <CardDescription>
                  Premium glassmorphism effect with backdrop blur
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  This card demonstrates the glass variant with hover effects and vibe glow.
                </p>
              </CardContent>
            </Card>

            <Card variant="solid" hover>
              <CardHeader>
                <CardTitle className="text-lg">Solid Card</CardTitle>
                <CardDescription>
                  Clean solid background with soft shadows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Perfect for content that needs high contrast and readability.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated" hover>
              <CardHeader>
                <CardTitle className="text-lg">Elevated Card</CardTitle>
                <CardDescription>
                  Enhanced shadow for important content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Use for highlighting key information or call-to-action sections.
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </motion.section>

      {/* Avatars Section */}
      <motion.section variants={staggerItem} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Avatars</CardTitle>
            <CardDescription>
              User avatars with fallbacks, status indicators, and grouping
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Single Avatars */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Sizes & Variants</h4>
              <div className="flex items-center gap-4">
                <Avatar size="xs" fallback="XS" />
                <Avatar size="sm" fallback="SM" variant="primary" />
                <Avatar size="md" fallback="MD" variant="success" />
                <Avatar size="lg" fallback="LG" variant="warning" />
                <Avatar size="xl" fallback="XL" variant="danger" />
                <Avatar size="2xl" fallback="2XL" variant="vibe" />
              </div>
            </div>

            {/* Status Indicators */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Status Indicators</h4>
              <div className="flex items-center gap-4">
                <Avatar fallback="ON" status="online" hover />
                <Avatar fallback="AW" status="away" hover />
                <Avatar fallback="BS" status="busy" hover />
                <Avatar fallback="OF" status="offline" hover />
              </div>
            </div>

            {/* Avatar Groups */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Avatar Groups</h4>
              <AvatarGroup max={4} spacing="normal">
                <Avatar fallback="A1" variant="primary" />
                <Avatar fallback="A2" variant="success" />
                <Avatar fallback="A3" variant="warning" />
                <Avatar fallback="A4" variant="danger" />
                <Avatar fallback="A5" variant="vibe" />
                <Avatar fallback="A6" variant="default" />
              </AvatarGroup>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Inputs Section */}
      <motion.section variants={staggerItem} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Form Inputs</CardTitle>
            <CardDescription>
              Premium form controls with focus animations and validation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input Variants */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Default Input"
                placeholder="Enter your text..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                hint="This is a helpful hint"
              />
              
              <Input
                variant="glass"
                label="Glass Input"
                placeholder="Glassmorphism style..."
                leftIcon={<span>🔍</span>}
                glow
              />
              
              <Input
                variant="filled"
                label="Filled Input"
                placeholder="Filled background..."
                rightIcon={<span>✓</span>}
              />
              
              <Input
                variant="outline"
                label="Outline Input"
                placeholder="Outlined border..."
                error="This field has an error"
              />
            </div>

            {/* Textarea */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Textarea</h4>
              <Textarea
                label="Message"
                placeholder="Write your message here..."
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                rows={4}
                hint="Maximum 500 characters"
                glow
              />
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Skeletons Section */}
      <motion.section variants={staggerItem} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading Skeletons</CardTitle>
            <CardDescription>
              Shimmer loading states for better perceived performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Skeletons */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Basic Shapes</h4>
              <div className="space-y-3">
                <Skeleton height="20px" width="60%" />
                <Skeleton height="16px" width="40%" />
                <Skeleton height="40px" width="40px" shape="circle" />
                <Skeleton variant="shimmer" height="24px" width="80%" />
              </div>
            </div>

            {/* Complex Skeletons */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Complex Layouts</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card variant="glass">
                  <SkeletonCard />
                </Card>
                <Card variant="glass">
                  <SkeletonPost />
                </Card>
              </div>
            </div>

            {/* Avatar Skeleton */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Avatar Skeleton</h4>
              <Skeleton avatar />
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Theme Demo */}
      <motion.section variants={staggerItem} className="space-y-6">
        <Card glow>
          <CardHeader>
            <CardTitle>🎨 Design System Features</CardTitle>
            <CardDescription>
              Premium glassmorphism design with CSS variables and motion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="text-2xl mb-2">✨</div>
                <h4 className="font-semibold">Glassmorphism</h4>
                <p className="text-sm text-gray-600">Backdrop blur effects</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
                <div className="text-2xl mb-2">🎭</div>
                <h4 className="font-semibold">Smooth Animations</h4>
                <p className="text-sm text-gray-600">Framer Motion powered</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="font-semibold">Accessible</h4>
                <p className="text-sm text-gray-600">WCAG compliant</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </motion.div>
  )
}