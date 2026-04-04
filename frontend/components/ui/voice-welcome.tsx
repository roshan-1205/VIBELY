'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Play, Square } from 'lucide-react'
import { useVoiceWelcome } from '@/hooks/useVoiceWelcome'
import { Button } from './button'
import { Card } from './card'

interface VoiceWelcomeProps {
  profileOwnerName: string
  visitorName?: string
  enabled?: boolean
  autoPlay?: boolean
  showControls?: boolean
  customMessage?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const VoiceWelcome = ({
  profileOwnerName,
  visitorName,
  enabled = true,
  autoPlay = true,
  showControls = true,
  customMessage,
  className = '',
  size = 'md'
}: VoiceWelcomeProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const {
    isSupported,
    isSpeaking,
    hasSpoken,
    error,
    playWelcome,
    stopWelcome,
    resetWelcome
  } = useVoiceWelcome(profileOwnerName, visitorName, {
    enabled,
    autoPlay,
    customMessage
  })

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  }

  if (!isSupported) {
    return null // Don't render if speech synthesis isn't supported
  }

  const handleTogglePlay = () => {
    if (isSpeaking) {
      stopWelcome()
    } else {
      playWelcome()
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Voice Button */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={handleTogglePlay}
          disabled={!enabled}
          className={`
            ${sizeClasses[size]} 
            rounded-full 
            border-2 
            transition-all 
            duration-300
            ${isSpeaking 
              ? 'border-green-400 bg-green-50 text-green-600 shadow-lg shadow-green-200' 
              : hasSpoken 
                ? 'border-blue-400 bg-blue-50 text-blue-600' 
                : 'border-purple-400 bg-purple-50 text-purple-600 hover:bg-purple-100'
            }
            ${!enabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          `}
          title={
            isSpeaking 
              ? 'Stop robot voice' 
              : hasSpoken 
                ? 'Play welcome again' 
                : 'Play robot welcome'
          }
        >
          <AnimatePresence mode="wait">
            {isSpeaking ? (
              <motion.div
                key="speaking"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <VolumeX size={iconSizes[size]} />
              </motion.div>
            ) : (
              <motion.div
                key="not-speaking"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Volume2 size={iconSizes[size]} />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        {/* Speaking Animation */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -inset-2 rounded-full border-2 border-green-400 opacity-60"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-full h-full rounded-full border-2 border-green-400"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Extended Controls */}
      {showControls && (
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-50"
            >
              <Card className="p-3 bg-white/95 backdrop-blur-sm border shadow-lg min-w-[200px]">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">
                    Robot Voice
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTogglePlay}
                      disabled={!enabled}
                      className="flex-1"
                    >
                      {isSpeaking ? (
                        <>
                          <Square size={14} className="mr-1" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play size={14} className="mr-1" />
                          Play
                        </>
                      )}
                    </Button>
                  </div>

                  {error && (
                    <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                      {error}
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    {hasSpoken ? 'Welcome played' : 'Ready to welcome'}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      )}


    </div>
  )
}

// Compact version for minimal UI
export const VoiceWelcomeCompact = ({
  profileOwnerName,
  visitorName,
  customMessage,
  className = ''
}: Pick<VoiceWelcomeProps, 'profileOwnerName' | 'visitorName' | 'customMessage' | 'className'>) => {
  return (
    <VoiceWelcome
      profileOwnerName={profileOwnerName}
      visitorName={visitorName}
      customMessage={customMessage}
      size="sm"
      showControls={false}
      className={className}
    />
  )
}