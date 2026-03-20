/**
 * PostToolbar Component - Vibely Post Creation
 * Action buttons for media upload, emoji, and submit
 */

import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { buttonTap, hwAcceleration } from '@/core'

interface PostToolbarProps {
  onMediaUpload: (files: File[]) => void
  onSubmit: () => void
  canSubmit: boolean
  isSubmitting: boolean
  disabled?: boolean
  mediaCount?: number
  maxMedia?: number
}

export function PostToolbar({
  onMediaUpload,
  onSubmit,
  canSubmit,
  isSubmitting,
  disabled = false,
  mediaCount = 0,
  maxMedia = 4,
}: PostToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleMediaClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onMediaUpload(files)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const canAddMedia = mediaCount < maxMedia && !disabled

  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
      {/* Left Actions */}
      <div className="flex items-center space-x-3">
        {/* Media Upload Button */}
        <motion.button
          {...buttonTap}
          style={hwAcceleration}
          onClick={handleMediaClick}
          disabled={!canAddMedia}
          className={`
            p-2 rounded-xl transition-all duration-200
            ${canAddMedia
              ? 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
              : 'text-gray-300 cursor-not-allowed'
            }
          `}
          whileHover={canAddMedia ? { scale: 1.05 } : {}}
          title={canAddMedia ? 'Add photos or videos' : `Maximum ${maxMedia} files`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </motion.button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={!canAddMedia}
        />

        {/* Emoji Button (Optional) */}
        <motion.button
          {...buttonTap}
          style={hwAcceleration}
          disabled={disabled}
          className={`
            p-2 rounded-xl transition-all duration-200
            ${disabled
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }
          `}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          title="Add emoji"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </motion.button>

        {/* Media Counter */}
        {mediaCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-1 text-xs text-gray-500"
          >
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            <span>{mediaCount} file{mediaCount !== 1 ? 's' : ''}</span>
          </motion.div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-3">
        {/* Character Count Indicator (if needed) */}
        
        {/* Submit Button */}
        <motion.button
          {...buttonTap}
          style={hwAcceleration}
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting}
          className={`
            px-6 py-2.5 rounded-xl font-medium transition-all duration-200
            ${canSubmit && !isSubmitting
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
          whileHover={canSubmit && !isSubmitting ? { scale: 1.02 } : {}}
          animate={isSubmitting ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.5, repeat: isSubmitting ? Infinity : 0 }}
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <span>Posting...</span>
            </div>
          ) : (
            'Post'
          )}
        </motion.button>
      </div>
    </div>
  )
}

/**
 * Compact toolbar for smaller spaces
 */
export function CompactPostToolbar({
  onSubmit,
  canSubmit,
  isSubmitting,
  disabled = false,
}: Pick<PostToolbarProps, 'onSubmit' | 'canSubmit' | 'isSubmitting' | 'disabled'>) {
  return (
    <div className="flex justify-end pt-3">
      <motion.button
        {...buttonTap}
        style={hwAcceleration}
        onClick={onSubmit}
        disabled={!canSubmit || isSubmitting}
        className={`
          px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${canSubmit && !isSubmitting
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }
        `}
        whileHover={canSubmit && !isSubmitting ? { scale: 1.02 } : {}}
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-1">
            <motion.div
              className="w-3 h-3 border border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <span>Posting</span>
          </div>
        ) : (
          'Post'
        )}
      </motion.button>
    </div>
  )
}

/**
 * Toolbar with additional options
 */
export function ExtendedPostToolbar({
  onMediaUpload,
  onSubmit,
  canSubmit,
  isSubmitting,
  disabled = false,
  mediaCount = 0,
  maxMedia = 4,
  onSchedule,
  onSaveDraft,
}: PostToolbarProps & {
  onSchedule?: () => void
  onSaveDraft?: () => void
}) {
  return (
    <div className="space-y-3">
      {/* Main Toolbar */}
      <PostToolbar
        onMediaUpload={onMediaUpload}
        onSubmit={onSubmit}
        canSubmit={canSubmit}
        isSubmitting={isSubmitting}
        disabled={disabled}
        mediaCount={mediaCount}
        maxMedia={maxMedia}
      />

      {/* Extended Options */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          {/* Schedule Option */}
          {onSchedule && (
            <motion.button
              {...buttonTap}
              style={hwAcceleration}
              onClick={onSchedule}
              disabled={disabled}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              📅 Schedule
            </motion.button>
          )}

          {/* Save Draft Option */}
          {onSaveDraft && (
            <motion.button
              {...buttonTap}
              style={hwAcceleration}
              onClick={onSaveDraft}
              disabled={disabled}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              💾 Save Draft
            </motion.button>
          )}
        </div>

        {/* Keyboard Shortcut Hint */}
        <div className="text-gray-400 text-xs">
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">⌘</kbd>
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs ml-1">↵</kbd>
          <span className="ml-1">to post</span>
        </div>
      </div>
    </div>
  )
}