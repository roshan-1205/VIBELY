"use client"

import { useState } from 'react'
import { AdaptiveSplineScene } from '@/components/ui/adaptive-spline'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function RobotDemoPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [demoUserId] = useState('demo-user-123')

  // Sample profile images for demo
  const sampleImages = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616c9c0e8d3?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  ]

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl)
  }

  const resetRobot = () => {
    setSelectedImage(null)
    localStorage.removeItem(`vibely_robot_theme_${demoUserId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-blue-950/20 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Adaptive Robot Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Watch how our AI robot adapts its appearance based on profile images. 
            Select different profile images below to see the robot change colors and style in real-time.
          </p>
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link href="/hero">← Back to Hero Page</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Robot Display */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Adaptive 3D Robot</h2>
            <div className="aspect-square bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-xl overflow-hidden relative">
              <AdaptiveSplineScene 
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
                profileImage={selectedImage}
                userId={demoUserId}
                debug={false}
              />
            </div>
            <div className="mt-4 flex justify-center">
              <Button onClick={resetRobot} variant="outline">
                Reset to Default
              </Button>
            </div>
          </Card>

          {/* Profile Image Selection */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Select Profile Image</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Click on any profile image to see how the robot adapts its colors and appearance.
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              {sampleImages.map((imageUrl, index) => (
                <button
                  key={index}
                  onClick={() => handleImageSelect(imageUrl)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                    selectedImage === imageUrl 
                      ? 'border-purple-500 ring-2 ring-purple-200' 
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <img 
                    src={imageUrl} 
                    alt={`Profile ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Current Selection */}
            {selectedImage && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Current Selection:</h3>
                <div className="flex items-center gap-3">
                  <img 
                    src={selectedImage} 
                    alt="Selected profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Robot is adapting to match this image's color palette
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">How it works:</h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Robot analyzes your profile image colors</li>
                <li>• Adapts its appearance to match your unique style</li>
                <li>• Creates a personalized 3D avatar just for you</li>
                <li>• Remembers your preferences across sessions</li>
              </ul>
            </div>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Color Analysis</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Smart technology analyzes your profile image to create a personalized robot appearance.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-time Adaptation</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Robot appearance updates instantly when you change your profile image, creating a unique experience.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Persistent Memory</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your robot's appearance is saved and remembered across sessions, maintaining your personal touch.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}