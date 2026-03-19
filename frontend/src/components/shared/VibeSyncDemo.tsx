/**
 * Vibe Sync Demo - Example Integration
 * Demonstrates zero re-render global UI system
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useVibeSync, globalVibeSync } from '@/core/hooks/useVibeSync'
import { preloadVibeCSS } from '@/core/utils/applyVibe'
import { preloadVibeThemes } from '@/core/utils/sentimentToVibe'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

export function VibeSyncDemo() {
  const [sentimentScore, setSentimentScore] = useState(0)
  const [inputText, setInputText] = useState('')
  const [isAutoMode, setIsAutoMode] = useState(false)

  // Initialize vibe sync with current sentiment
  const { currentVibe } = useVibeSync(sentimentScore, {
    enableTransitions: true,
    transitionDuration: 800,
    enableGlow: true,
    intensity: Math.abs(sentimentScore),
  })

  // Preload resources on mount
  useEffect(() => {
    preloadVibeCSS()
    preloadVibeThemes()
  }, [])

  // Auto mode - simulate real-time sentiment changes
  useEffect(() => {
    if (!isAutoMode) return

    const interval = setInterval(() => {
      // Simulate sentiment fluctuation
      const newScore = (Math.sin(Date.now() / 2000) + Math.random() * 0.4 - 0.2)
      setSentimentScore(Math.max(-1, Math.min(1, newScore)))
    }, 100) // 10fps updates

    return () => clearInterval(interval)
  }, [isAutoMode])

  // Simulate text sentiment analysis
  const analyzeText = (text: string) => {
    const positiveWords = ['happy', 'joy', 'love', 'amazing', 'great', 'wonderful', 'fantastic']
    const negativeWords = ['sad', 'angry', 'hate', 'terrible', 'awful', 'horrible', 'bad']
    
    let score = 0
    const words = text.toLowerCase().split(' ')
    
    words.forEach(word => {
      if (positiveWords.includes(word)) score += 0.3
      if (negativeWords.includes(word)) score -= 0.3
    })
    
    return Math.max(-1, Math.min(1, score))
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    setInputText(text)
    
    if (text.length > 3) {
      const score = analyzeText(text)
      setSentimentScore(score)
    }
  }

  const setPresetVibe = (score: number) => {
    setSentimentScore(score)
    setIsAutoMode(false)
  }

  const toggleAutoMode = () => {
    setIsAutoMode(!isAutoMode)
  }

  const resetVibe = () => {
    setSentimentScore(0)
    setIsAutoMode(false)
    globalVibeSync.reset()
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Vibe Sync System
        </h1>
        <p className="text-lg text-gray-600">
          Zero re-render global UI theming based on sentiment analysis
        </p>
      </motion.div>

      {/* Current Status */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Current Vibe Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="text-2xl font-bold text-blue-600">
                {sentimentScore.toFixed(3)}
              </div>
              <div className="text-sm text-blue-500">Sentiment Score</div>
            </div>
            
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="text-2xl font-bold text-purple-600 capitalize">
                {currentVibe}
              </div>
              <div className="text-sm text-purple-500">Current Vibe</div>
            </div>
            
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
              <div className="text-2xl font-bold text-green-600">
                {Math.abs(sentimentScore * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-green-500">Intensity</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Text Analysis */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Real-time Text Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Type something to analyze sentiment... (try 'happy', 'sad', 'amazing')"
            value={inputText}
            onChange={handleTextChange}
            className="text-lg"
          />
          <p className="text-sm text-gray-500">
            The UI theme will automatically adapt based on the sentiment of your text
          </p>
        </CardContent>
      </Card>

      {/* Manual Controls */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Manual Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Preset Vibes */}
          <div className="space-y-3">
            <h4 className="font-semibold">Preset Vibes</h4>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="glass"
                onClick={() => setPresetVibe(-0.8)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700"
              >
                🧘 Calm (-0.8)
              </Button>
              <Button
                variant="glass"
                onClick={() => setPresetVibe(0)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                😐 Neutral (0.0)
              </Button>
              <Button
                variant="glass"
                onClick={() => setPresetVibe(0.8)}
                className="bg-pink-100 hover:bg-pink-200 text-pink-700"
              >
                🚀 Vibrant (0.8)
              </Button>
            </div>
          </div>

          {/* Auto Mode */}
          <div className="space-y-3">
            <h4 className="font-semibold">Auto Mode</h4>
            <div className="flex gap-3">
              <Button
                variant={isAutoMode ? "primary" : "ghost"}
                onClick={toggleAutoMode}
              >
                {isAutoMode ? '⏸️ Stop Auto' : '▶️ Start Auto'}
              </Button>
              <Button variant="outline" onClick={resetVibe}>
                🔄 Reset
              </Button>
            </div>
            {isAutoMode && (
              <p className="text-sm text-gray-500">
                Auto mode simulates real-time sentiment changes at 10fps
              </p>
            )}
          </div>

          {/* Manual Slider */}
          <div className="space-y-3">
            <h4 className="font-semibold">Manual Adjustment</h4>
            <div className="space-y-2">
              <input
                type="range"
                min="-1"
                max="1"
                step="0.01"
                value={sentimentScore}
                onChange={(e) => {
                  setSentimentScore(parseFloat(e.target.value))
                  setIsAutoMode(false)
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Calm (-1.0)</span>
                <span>Neutral (0.0)</span>
                <span>Vibrant (1.0)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Info */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Performance Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="font-semibold text-green-600">✅ Zero Re-renders</h5>
              <p className="text-sm text-gray-600">
                Direct CSS variable manipulation without React state updates
              </p>
            </div>
            
            <div className="space-y-2">
              <h5 className="font-semibold text-green-600">✅ GPU Acceleration</h5>
              <p className="text-sm text-gray-600">
                Hardware-accelerated gradients and animations
              </p>
            </div>
            
            <div className="space-y-2">
              <h5 className="font-semibold text-green-600">✅ Batched Updates</h5>
              <p className="text-sm text-gray-600">
                RequestAnimationFrame for smooth 60fps performance
              </p>
            </div>
            
            <div className="space-y-2">
              <h5 className="font-semibold text-green-600">✅ Smart Caching</h5>
              <p className="text-sm text-gray-600">
                Cached sentiment calculations and theme preloading
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Example */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Usage Example</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// Simple usage
import { useVibeSync } from '@/core/hooks/useVibeSync'

function MyComponent({ sentimentScore }) {
  // Zero re-renders - only CSS updates
  const { currentVibe } = useVibeSync(sentimentScore)
  
  return <div>Current vibe: {currentVibe}</div>
}

// Global usage
import { globalVibeSync } from '@/core/hooks/useVibeSync'

// Update globally without re-renders
globalVibeSync.setScore(0.8)`}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}