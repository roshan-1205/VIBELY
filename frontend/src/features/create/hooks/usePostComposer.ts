/**
 * usePostComposer Hook - Vibely Post Creation
 * Real-time post composition with vibe sync integration
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { useVibeSync } from '@/core/hooks/useVibeSync'
import { calculateSentimentScore, calculateVibeIntensity } from '../services/create.api'
import type { ComposerState, PostValidation } from '../types/create.types'
import { logger } from '@/core'

interface UsePostComposerOptions {
  maxCharacters?: number
  enableVibeSync?: boolean
  debounceMs?: number
}

/**
 * Hook for managing post composition state and real-time vibe sync
 */
export function usePostComposer(options: UsePostComposerOptions = {}) {
  const {
    maxCharacters = 280,
    enableVibeSync = true,
    debounceMs = 300,
  } = options

  // Composer state
  const [state, setState] = useState<ComposerState>({
    content: '',
    characterCount: 0,
    maxCharacters,
    sentimentScore: 0,
    vibeIntensity: 0,
    isTyping: false,
    lastTypingTime: 0,
  })

  // Refs for debouncing
  const debounceRef = useRef<NodeJS.Timeout>()
  const vibeUpdateRef = useRef<NodeJS.Timeout>()

  // Vibe sync integration - NO React state updates
  useVibeSync(state.sentimentScore, {
    enableTransitions: true,
    transitionDuration: 600,
    enableGlow: true,
    intensity: state.vibeIntensity,
  })

  // Update content with real-time vibe calculation
  const updateContent = useCallback((newContent: string) => {
    const characterCount = newContent.length
    const now = Date.now()

    // Immediate state update for responsive typing
    setState(prev => ({
      ...prev,
      content: newContent,
      characterCount,
      isTyping: true,
      lastTypingTime: now,
    }))

    // Debounce vibe calculations for performance
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      const sentimentScore = calculateSentimentScore(newContent)
      const vibeIntensity = calculateVibeIntensity(newContent, sentimentScore)

      setState(prev => ({
        ...prev,
        sentimentScore,
        vibeIntensity,
        isTyping: false,
      }))

      logger.debug('Vibe sync update', {
        content: newContent.substring(0, 50) + '...',
        sentimentScore,
        vibeIntensity,
        characterCount,
      })
    }, debounceMs)
  }, [debounceMs])

  // Validation logic
  const validation: PostValidation = {
    isValid: state.content.trim().length > 0 && state.characterCount <= maxCharacters,
    errors: {
      content: state.content.trim().length === 0 ? 'Post cannot be empty' : undefined,
    },
    warnings: {
      characterLimit: state.characterCount > maxCharacters * 0.9 
        ? `${maxCharacters - state.characterCount} characters remaining`
        : undefined,
    },
  }

  // Character limit status
  const characterLimitStatus = {
    count: state.characterCount,
    max: maxCharacters,
    remaining: maxCharacters - state.characterCount,
    percentage: (state.characterCount / maxCharacters) * 100,
    isNearLimit: state.characterCount > maxCharacters * 0.8,
    isOverLimit: state.characterCount > maxCharacters,
  }

  // Reset composer
  const reset = useCallback(() => {
    setState({
      content: '',
      characterCount: 0,
      maxCharacters,
      sentimentScore: 0,
      vibeIntensity: 0,
      isTyping: false,
      lastTypingTime: 0,
    })

    // Clear any pending debounced updates
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    if (vibeUpdateRef.current) {
      clearTimeout(vibeUpdateRef.current)
    }
  }, [maxCharacters])

  // Set content programmatically (for drafts, etc.)
  const setContent = useCallback((content: string) => {
    updateContent(content)
  }, [updateContent])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      if (vibeUpdateRef.current) {
        clearTimeout(vibeUpdateRef.current)
      }
    }
  }, [])

  return {
    // State
    content: state.content,
    characterCount: state.characterCount,
    sentimentScore: state.sentimentScore,
    vibeIntensity: state.vibeIntensity,
    isTyping: state.isTyping,
    
    // Validation
    validation,
    characterLimitStatus,
    
    // Actions
    updateContent,
    setContent,
    reset,
    
    // Computed values
    isEmpty: state.content.trim().length === 0,
    isValid: validation.isValid,
    canSubmit: validation.isValid && !state.isTyping,
  }
}

/**
 * Hook for managing typing indicators and real-time feedback
 */
export function useTypingIndicator(isTyping: boolean, delay: number = 1000) {
  const [showTyping, setShowTyping] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (isTyping) {
      setShowTyping(true)
      
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      // Set new timeout to hide typing indicator
      timeoutRef.current = setTimeout(() => {
        setShowTyping(false)
      }, delay)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isTyping, delay])

  return showTyping
}

/**
 * Hook for auto-saving drafts
 */
export function useAutoSave(content: string, delay: number = 2000) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const saveDraft = useCallback(async (content: string) => {
    if (!content.trim()) return

    setIsSaving(true)
    
    try {
      // Save to localStorage as fallback
      localStorage.setItem('vibely_post_draft', JSON.stringify({
        content,
        timestamp: Date.now(),
      }))
      
      // In production, save to backend
      // await api.post('/drafts', { content })
      
      setLastSaved(new Date())
      logger.debug('Draft saved', { contentLength: content.length })
    } catch (error) {
      logger.error('Failed to save draft', error)
    } finally {
      setIsSaving(false)
    }
  }, [])

  useEffect(() => {
    if (!content.trim()) return

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout to save draft
    timeoutRef.current = setTimeout(() => {
      saveDraft(content)
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [content, delay, saveDraft])

  // Load draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vibely_post_draft')
      if (saved) {
        const draft = JSON.parse(saved)
        // Return draft content for initial load
        return draft.content
      }
    } catch (error) {
      logger.error('Failed to load draft', error)
    }
  }, [])

  const clearDraft = useCallback(() => {
    localStorage.removeItem('vibely_post_draft')
    setLastSaved(null)
  }, [])

  return {
    lastSaved,
    isSaving,
    clearDraft,
  }
}