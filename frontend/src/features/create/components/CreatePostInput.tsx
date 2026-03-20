/**
 * CreatePostInput Component - Vibely Post Creation
 * Auto-resizing textarea with real-time vibe sync
 */

import React, { useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { usePostComposer } from '../hooks/usePostComposer'
import { hwAcceleration } from '@/core'

interface CreatePostInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxCharacters?: number
  disabled?: boolean
  autoFocus?: boolean
}

export function CreatePostInput({
  value,
  onChange,
  placeholder = "What's your vibe today?",
  maxCharacters = 280,
  disabled = false,
  autoFocus = true,
}: CreatePostInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto'
    
    // Set height based on content, with min and max constraints
    const minHeight = 60 // Minimum height in pixels
    const maxHeight = 200 // Maximum height in pixels
    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight)
    
    textarea.style.height = `${newHeight}px`
  }, [])

  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    
    // Enforce character limit
    if (newValue.length <= maxCharacters) {
      onChange(newValue)
    }
    
    // Adjust height after state update
    requestAnimationFrame(adjustHeight)
  }, [onChange, maxCharacters, adjustHeight])

  // Handle key events
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl + Enter to submit (handled by parent)
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      // Dispatch custom event for parent to handle
      const submitEvent = new CustomEvent('submit-post')
      document.dispatchEvent(submitEvent)
    }
  }, [])

  // Auto-focus and adjust height on mount
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus()
    }
    adjustHeight()
  }, [autoFocus, adjustHeight])

  // Adjust height when value changes externally
  useEffect(() => {
    adjustHeight()
  }, [value, adjustHeight])

  // Character count status
  const characterCount = value.length
  const remaining = maxCharacters - characterCount
  const isNearLimit = characterCount > maxCharacters * 0.8
  const isOverLimit = characterCount > maxCharacters

  return (
    <div className="space-y-3">
      {/* Textarea Container */}
      <div className="relative">
        <motion.textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          style={hwAcceleration}
          className={`
            w-full resize-none border-0 bg-transparent text-lg placeholder-gray-400
            focus:outline-none focus:ring-0 transition-all duration-200
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          rows={1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Focus Ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: textareaRef.current === document.activeElement ? 1 : 0,
            scale: textareaRef.current === document.activeElement ? 1 : 0.95,
          }}
          transition={{ duration: 0.2 }}
          style={{
            boxShadow: '0 0 0 2px var(--vibe-glow, rgba(59, 130, 246, 0.3))',
          }}
        />
      </div>

      {/* Character Counter */}
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center space-x-2">
          {/* Vibe Indicator */}
          <motion.div
            className="flex items-center space-x-1 text-gray-500"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: characterCount > 0 ? 1 : 0, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div 
              className="w-2 h-2 rounded-full transition-colors duration-300"
              style={{
                backgroundColor: 'var(--vibe-glow, #6b7280)',
              }}
            />
            <span className="text-xs">Live vibe sync</span>
          </motion.div>
        </div>

        {/* Character Count */}
        <motion.div
          className={`font-medium transition-colors duration-200 ${
            isOverLimit 
              ? 'text-red-500' 
              : isNearLimit 
              ? 'text-yellow-500' 
              : 'text-gray-400'
          }`}
          animate={{ 
            scale: isOverLimit ? [1, 1.1, 1] : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          {remaining < 20 ? remaining : characterCount}
          {remaining < 20 && (
            <span className="text-gray-400">/{maxCharacters}</span>
          )}
        </motion.div>
      </div>

      {/* Character Limit Progress Bar */}
      {isNearLimit && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          className="h-1 bg-gray-200 rounded-full overflow-hidden"
        >
          <motion.div
            className={`h-full transition-colors duration-300 ${
              isOverLimit ? 'bg-red-500' : 'bg-yellow-500'
            }`}
            initial={{ width: 0 }}
            animate={{ 
              width: `${Math.min((characterCount / maxCharacters) * 100, 100)}%` 
            }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
      )}
    </div>
  )
}

/**
 * Enhanced input with typing indicators
 */
export function CreatePostInputWithIndicators(props: CreatePostInputProps) {
  const { isTyping } = usePostComposer()

  return (
    <div className="space-y-2">
      <CreatePostInput {...props} />
      
      {/* Typing Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ 
          opacity: isTyping ? 1 : 0,
          y: isTyping ? 0 : -5,
        }}
        className="flex items-center space-x-2 text-xs text-gray-500"
      >
        <div className="flex space-x-1">
          <motion.div
            className="w-1 h-1 bg-gray-400 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-1 h-1 bg-gray-400 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-1 h-1 bg-gray-400 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
        </div>
        <span>Analyzing vibe...</span>
      </motion.div>
    </div>
  )
}