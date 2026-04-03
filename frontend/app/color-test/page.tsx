"use client"

import { useState } from 'react'
import { extractColorsFromImage, generateRobotTheme } from '@/lib/colorAnalysis'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function ColorTestPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [colorPalette, setColorPalette] = useState<any>(null)
  const [robotTheme, setRobotTheme] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Sample profile images for testing
  const testImages = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616c9c0e8d3?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face'
  ]

  const analyzeImage = async (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setIsAnalyzing(true)
    setError(null)
    setColorPalette(null)
    setRobotTheme(null)

    try {
      console.log('Starting color analysis for:', imageUrl)
      const palette = await extractColorsFromImage(imageUrl)
      console.log('Extracted palette:', palette)
      
      setColorPalette(palette)
      
      const theme = generateRobotTheme(palette)
      console.log('Generated robot theme:', theme)
      
      setRobotTheme(theme)
    } catch (err) {
      console.error('Color analysis error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-blue-950/20 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Color Analysis Test (Development)
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Development tool to test the color extraction and robot theme generation system.
          </p>
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link href="/hero">← Back to Hero Page</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Selection */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Test Images</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {testImages.map((imageUrl, index) => (
                <button
                  key={index}
                  onClick={() => analyzeImage(imageUrl)}
                  disabled={isAnalyzing}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 ${
                    selectedImage === imageUrl 
                      ? 'border-purple-500 ring-2 ring-purple-200' 
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <img 
                    src={imageUrl} 
                    alt={`Test image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {isAnalyzing && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Analyzing colors...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                <strong>Error:</strong> {error}
              </div>
            )}
          </Card>

          {/* Results */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Analysis Results</h2>
            
            {selectedImage && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Selected Image:</h3>
                <img 
                  src={selectedImage} 
                  alt="Selected"
                  className="w-24 h-24 rounded-lg object-cover"
                />
              </div>
            )}

            {colorPalette && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Color Palette:</h3>
                <div className="space-y-2">
                  {Object.entries(colorPalette).map(([key, color]) => (
                    <div key={key} className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded border border-gray-300"
                        style={{ backgroundColor: color as string }}
                      />
                      <span className="font-mono text-sm">{key}: {color as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {robotTheme && (
              <div>
                <h3 className="font-semibold mb-3">Robot Theme:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: robotTheme.bodyColor }}
                    />
                    <span className="font-mono text-sm">Body: {robotTheme.bodyColor}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: robotTheme.accentColor }}
                    />
                    <span className="font-mono text-sm">Accent: {robotTheme.accentColor}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: robotTheme.eyeColor }}
                    />
                    <span className="font-mono text-sm">Eyes: {robotTheme.eyeColor}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: robotTheme.lightingColor }}
                    />
                    <span className="font-mono text-sm">Lighting: {robotTheme.lightingColor}</span>
                  </div>
                  
                  {robotTheme.skinVariations && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Skin Variations:</h4>
                      {Object.entries(robotTheme.skinVariations).map(([key, color]) => (
                        <div key={key} className="flex items-center gap-3 ml-4">
                          <div 
                            className="w-6 h-6 rounded border border-gray-300"
                            style={{ backgroundColor: color as string }}
                          />
                          <span className="font-mono text-xs">{key}: {color as string}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {!selectedImage && (
              <p className="text-gray-500 text-center py-8">
                Select an image above to see the color analysis results
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}