import { useEffect, useRef, useState } from 'react'
import { voiceService, speakProfileWelcome } from '@/lib/voiceService'

interface UseVoiceWelcomeOptions {
  enabled?: boolean
  delay?: number // Delay before speaking (ms)
  autoPlay?: boolean
  customMessage?: string
}

interface VoiceWelcomeState {
  isSupported: boolean
  isSpeaking: boolean
  hasSpoken: boolean
  error: string | null
}

export const useVoiceWelcome = (
  profileOwnerName: string,
  visitorName?: string,
  options: UseVoiceWelcomeOptions = {}
) => {
  const {
    enabled = true,
    delay = 1500, // Default 1.5 second delay
    autoPlay = true,
    customMessage
  } = options

  const [state, setState] = useState<VoiceWelcomeState>({
    isSupported: false,
    isSpeaking: false,
    hasSpoken: false,
    error: null
  })

  const hasTriggeredRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Initialize voice service and check support
  useEffect(() => {
    const checkSupport = async () => {
      const supported = voiceService.isSupported()
      setState(prev => ({ ...prev, isSupported: supported }))

      if (!supported) {
        console.warn('Speech synthesis not supported in this browser')
      }
    }

    checkSupport()
  }, [])

  // Auto-play welcome message when profile loads
  useEffect(() => {
    if (
      enabled &&
      autoPlay &&
      state.isSupported &&
      profileOwnerName &&
      !hasTriggeredRef.current &&
      !state.hasSpoken
    ) {
      hasTriggeredRef.current = true

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Delay the welcome message
      timeoutRef.current = setTimeout(() => {
        playWelcome()
      }, delay)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [enabled, autoPlay, state.isSupported, profileOwnerName, state.hasSpoken, delay])

  // Monitor speaking state
  useEffect(() => {
    const checkSpeakingState = () => {
      const speaking = voiceService.isSpeaking()
      setState(prev => ({ ...prev, isSpeaking: speaking }))
    }

    const interval = setInterval(checkSpeakingState, 100)
    return () => clearInterval(interval)
  }, [])

  const playWelcome = async () => {
    if (!state.isSupported || !profileOwnerName) {
      return
    }

    try {
      setState(prev => ({ ...prev, isSpeaking: true, error: null }))

      await speakProfileWelcome(profileOwnerName, visitorName, customMessage)

      setState(prev => ({ 
        ...prev, 
        hasSpoken: true,
        isSpeaking: false 
      }))
    } catch (error) {
      console.error('Voice welcome error:', error)
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Speech failed',
        isSpeaking: false 
      }))
    }
  }

  const stopWelcome = () => {
    voiceService.stopSpeaking()
    setState(prev => ({ ...prev, isSpeaking: false }))
  }

  const resetWelcome = () => {
    hasTriggeredRef.current = false
    setState(prev => ({ ...prev, hasSpoken: false, error: null }))
  }

  return {
    ...state,
    playWelcome,
    stopWelcome,
    resetWelcome
  }
}