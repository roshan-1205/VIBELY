"use client"

import { useState, useEffect } from 'react'
import { CustomizableSplineScene } from '@/components/ui/customizable-spline'
import { RobotCustomizer } from '@/components/ui/robot-customizer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { RobotCustomization, getDefaultCustomization, loadCustomization } from '@/lib/robotCustomization'

export default function RobotCustomizerPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [customization, setCustomization] = useState<RobotCustomization>(getDefaultCustomization())
  const [showInstructions, setShowInstructions] = useState(true)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin')
    }
  }, [user, isLoading, router])

  // Load user's customization
  useEffect(() => {
    if (user?._id) {
      const loaded = loadCustomization(user._id)
      setCustomization(loaded)
    }
  }, [user])

  const handleCustomizationChange = (newCustomization: RobotCustomization) => {
    setCustomization(newCustomization)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-blue-950/20">
      {/* Header */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <Link href="/hero" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold">
            V
          </div>
          <span className="font-semibold text-lg">Vibely</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            Customizing robot for {user.firstName}
          </span>
          <Button variant="outline" asChild>
            <Link href="/hero">← Back to Hero</Link>
          </Button>
        </div>
      </nav>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome to Robot Customizer! 🤖
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Create your perfect robot companion! You can customize every aspect of your robot's appearance and behavior.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🎨 Colors</h3>
                  <p className="text-sm">Choose from presets or create custom color schemes for body, accents, and eyes.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🏗️ Body Structure</h3>
                  <p className="text-sm">Adjust proportions, body type, and size to create your ideal robot build.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">✨ Materials</h3>
                  <p className="text-sm">Control metalness, roughness, and glow effects for realistic or futuristic looks.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🛡️ Accessories</h3>
                  <p className="text-sm">Add helmets, visors, armor, and capes to personalize your robot's style.</p>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 <strong>Tip:</strong> Click the customizer button (⚙️) in the bottom-right corner to start customizing. 
                  Your changes are automatically saved and will appear in your profile!
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowInstructions(false)}>
                Got it, let's customize! 🚀
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Robot Customizer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Design your perfect robot companion. Customize colors, body structure, materials, and more to create a unique 3D avatar.
          </p>
        </div>

        {/* 3D Robot Display */}
        <div className="relative">
          <Card className="aspect-video bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
            <CustomizableSplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
              customization={customization}
              userId={user._id}
              debug={true}
            />
          </Card>

          {/* Quick Stats */}
          <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg">
            <div className="text-xs opacity-75">Current Configuration</div>
            <div className="text-sm font-medium">
              {customization.bodyType.charAt(0).toUpperCase() + customization.bodyType.slice(1)} • 
              {customization.glowEffect ? ' Glowing' : ''} • 
              {customization.helmet || customization.visor || customization.armor || customization.cape ? ' Equipped' : ' Basic'}
            </div>
          </div>

          {/* Color Preview */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <div 
              className="w-6 h-6 rounded-full border-2 border-white/50" 
              style={{ backgroundColor: customization.bodyColor }}
              title="Body Color"
            />
            <div 
              className="w-6 h-6 rounded-full border-2 border-white/50" 
              style={{ backgroundColor: customization.accentColor }}
              title="Accent Color"
            />
            <div 
              className="w-6 h-6 rounded-full border-2 border-white/50" 
              style={{ backgroundColor: customization.eyeColor }}
              title="Eye Color"
            />
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Real-time Preview</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              See your changes instantly in the 3D scene as you customize.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Auto-Save</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your customizations are automatically saved to your profile.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Export & Import</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Save your designs as files and share them with friends.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Advanced Effects</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add glow effects, transparency, wireframes, and more.
            </p>
          </Card>
        </div>
      </div>

      {/* Robot Customizer Panel */}
      <RobotCustomizer 
        userId={user._id}
        onCustomizationChange={handleCustomizationChange}
      />
    </div>
  )
}