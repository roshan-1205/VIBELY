"use client"

import { useState } from 'react'
import { SimpleRobotTest } from '@/components/ui/simple-robot-test'
import { CustomizableSplineScene } from '@/components/ui/customizable-spline'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { RobotCustomization, getDefaultCustomization } from '@/lib/robotCustomization'

export default function RobotTestPage() {
  const [customization, setCustomization] = useState<RobotCustomization>(getDefaultCustomization())
  const [testMode, setTestMode] = useState<'simple' | 'full'>('simple')

  const changeColor = (type: 'body' | 'accent' | 'eye') => {
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    
    setCustomization(prev => ({
      ...prev,
      [type === 'body' ? 'bodyColor' : type === 'accent' ? 'accentColor' : 'eyeColor']: randomColor
    }))
  }

  const randomizeAll = () => {
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080']
    
    setCustomization(prev => ({
      ...prev,
      bodyColor: colors[Math.floor(Math.random() * colors.length)],
      accentColor: colors[Math.floor(Math.random() * colors.length)],
      eyeColor: colors[Math.floor(Math.random() * colors.length)],
      metalness: Math.random(),
      roughness: Math.random(),
      emissiveIntensity: Math.random() * 0.5
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-blue-950/20 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Robot Customization Test
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Debug and test robot customization functionality with detailed logging.
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/hero">← Back to Hero</Link>
            </Button>
            <Button 
              onClick={() => setTestMode(testMode === 'simple' ? 'full' : 'simple')}
              variant="secondary"
            >
              Switch to {testMode === 'simple' ? 'Full' : 'Simple'} Test
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Robot Display */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {testMode === 'simple' ? 'Simple Robot Test' : 'Full Customization Test'}
            </h2>
            <div className="aspect-square bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-xl overflow-hidden relative">
              {testMode === 'simple' ? (
                <SimpleRobotTest 
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                  customization={customization}
                />
              ) : (
                <CustomizableSplineScene 
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                  customization={customization}
                  userId="test-user"
                  debug={true}
                />
              )}
            </div>
          </Card>

          {/* Controls */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Test Controls</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Quick Color Tests</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={() => changeColor('body')} variant="outline">
                    Random Body Color
                  </Button>
                  <Button onClick={() => changeColor('accent')} variant="outline">
                    Random Accent Color
                  </Button>
                  <Button onClick={() => changeColor('eye')} variant="outline">
                    Random Eye Color
                  </Button>
                  <Button onClick={randomizeAll} className="bg-gradient-to-r from-purple-600 to-pink-600">
                    Randomize All
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Current Colors</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: customization.bodyColor }}
                    />
                    <span className="font-mono text-sm">Body: {customization.bodyColor}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: customization.accentColor }}
                    />
                    <span className="font-mono text-sm">Accent: {customization.accentColor}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: customization.eyeColor }}
                    />
                    <span className="font-mono text-sm">Eyes: {customization.eyeColor}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Material Properties</h3>
                <div className="space-y-2 text-sm">
                  <div>Metalness: {customization.metalness.toFixed(2)}</div>
                  <div>Roughness: {customization.roughness.toFixed(2)}</div>
                  <div>Emissive: {customization.emissiveIntensity.toFixed(2)}</div>
                  <div>Body Type: {customization.bodyType}</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Manual Color Input</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm w-16">Body:</label>
                    <input
                      type="color"
                      value={customization.bodyColor}
                      onChange={(e) => setCustomization(prev => ({ ...prev, bodyColor: e.target.value }))}
                      className="w-12 h-8 rounded border"
                    />
                    <input
                      type="text"
                      value={customization.bodyColor}
                      onChange={(e) => setCustomization(prev => ({ ...prev, bodyColor: e.target.value }))}
                      className="flex-1 p-1 text-xs border rounded"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm w-16">Accent:</label>
                    <input
                      type="color"
                      value={customization.accentColor}
                      onChange={(e) => setCustomization(prev => ({ ...prev, accentColor: e.target.value }))}
                      className="w-12 h-8 rounded border"
                    />
                    <input
                      type="text"
                      value={customization.accentColor}
                      onChange={(e) => setCustomization(prev => ({ ...prev, accentColor: e.target.value }))}
                      className="flex-1 p-1 text-xs border rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Test Instructions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Simple Test Mode</h3>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Shows detailed logs of Spline object detection</li>
                <li>• Tests basic color application methods</li>
                <li>• Displays available Spline methods and properties</li>
                <li>• Minimal error handling for debugging</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Full Test Mode</h3>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Uses complete customization system</li>
                <li>• Tests all material properties and effects</li>
                <li>• Shows comprehensive debug information</li>
                <li>• Includes error recovery and fallbacks</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Debug Tip:</strong> Watch the debug logs in the top-left corner of the 3D scene. 
              If colors aren't changing, the logs will show what objects were found and what methods were attempted.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}