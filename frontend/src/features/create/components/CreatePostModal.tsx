/**
 * CreatePostModal Component - Vibely Post Creation
 * Premium glassmorphism modal with real-time vibe sync
 */

import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/core/store/ui.store'
import { usePostComposer } from '../hooks/usePostComposer'
import { useCreatePost } from '../hooks/useCreatePost'
import { CreatePostInput } from './CreatePostInput'
import { MediaPreview } from './MediaPreview'
import { PostToolbar } from './PostToolbar'
import { hwAcceleration } from '@/core'
import type { MediaFile } from '../types/create.types'

/**
 * Main create post modal with glassmorphism design
 */
export function CreatePostModal() {
  const { isCreateOpen, closeCreate } = useUIStore()
  const [media, setMedia] = useState<MediaFile[]>([])

  // Post composition logic
  const {
    content,
    updateContent,
    reset: resetComposer,
    canSubmit,
    characterLimitStatus,
  } = usePostComposer({
    maxCharacters: 280,
    enableVibeSync: true,
  })

  // Post creation mutation
  const { createPost, isPending: isSubmitting } = useCreatePost({
    onSuccess: () => {
      handleClose()
    },
    onError: (error) => {
      console.error('Failed to create post:', error)
      // Keep modal open on error for retry
    },
  })

  // Handle modal close
  const handleClose = useCallback(() => {
    closeCreate()
    // Reset state after animation completes
    setTimeout(() => {
      resetComposer()
      setMedia([])
    }, 300)
  }, [closeCreate, resetComposer])

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCreateOpen && !isSubmitting) {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isCreateOpen, isSubmitting, handleClose])

  // Handle submit post event
  useEffect(() => {
    const handleSubmitPost = () => {
      if (canSubmit && !isSubmitting) {
        handleSubmit()
      }
    }

    document.addEventListener('submit-post', handleSubmitPost)
    return () => document.removeEventListener('submit-post', handleSubmitPost)
  }, [canSubmit, isSubmitting])

  // Handle media upload
  const handleMediaAdd = useCallback((files: File[]) => {
    const newMedia: MediaFile[] = files.map(file => ({
      id: `${Date.now()}_${Math.random()}`,
      file,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      url: URL.createObjectURL(file),
      size: file.size,
    }))

    setMedia(prev => [...prev, ...newMedia].slice(0, 4)) // Max 4 files
  }, [])

  // Handle media removal
  const handleMediaRemove = useCallback((mediaId: string) => {
    setMedia(prev => {
      const updated = prev.filter(item => item.id !== mediaId)
      // Clean up object URLs
      const removed = prev.find(item => item.id === mediaId)
      if (removed) {
        URL.revokeObjectURL(removed.url)
      }
      return updated
    })
  }, [])

  // Handle post submission
  const handleSubmit = useCallback(() => {
    if (!canSubmit || isSubmitting) return

    createPost({
      content: content.trim(),
      media: media.map(m => ({
        id: m.id,
        type: m.type,
        url: m.url,
      })),
    })
  }, [canSubmit, isSubmitting, createPost, content, media])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isCreateOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isCreateOpen])

  return (
    <AnimatePresence>
      {isCreateOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={hwAcceleration}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-md"
            onClick={!isSubmitting ? handleClose : undefined}
            style={hwAcceleration}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: 'spring',
              damping: 25,
              stiffness: 300,
              duration: 0.3,
            }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden"
            style={hwAcceleration}
          >
            {/* Glassmorphism Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Glow Effect */}
              <div 
                className="absolute inset-0 rounded-3xl opacity-20 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, var(--vibe-glow, rgba(59, 130, 246, 0.1)) 0%, transparent 50%)',
                }}
              />

              {/* Header */}
              <div className="relative px-6 py-4 border-b border-gray-100/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Create Post
                  </h2>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={!isSubmitting ? handleClose : undefined}
                    disabled={isSubmitting}
                    className={`
                      p-2 rounded-xl transition-colors duration-200
                      ${isSubmitting 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                      }
                    `}
                    style={hwAcceleration}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="relative p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                    Y
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">You</p>
                    <p className="text-sm text-gray-500">Posting to your feed</p>
                  </div>
                </div>

                {/* Post Input */}
                <CreatePostInput
                  value={content}
                  onChange={updateContent}
                  placeholder="What's your vibe today?"
                  maxCharacters={280}
                  disabled={isSubmitting}
                  autoFocus={true}
                />

                {/* Media Preview */}
                <MediaPreview
                  media={media}
                  onAdd={handleMediaAdd}
                  onRemove={handleMediaRemove}
                  maxFiles={4}
                  disabled={isSubmitting}
                />

                {/* Vibe Sync Indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: content.length > 0 ? 1 : 0 }}
                  className="flex items-center justify-center p-4 rounded-2xl bg-gradient-to-r from-blue-50/50 to-purple-50/50 border border-blue-100/50"
                >
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: 'var(--vibe-glow, #6b7280)',
                      }}
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                    <span className="text-sm text-gray-600">
                      Vibe sync active - UI responding to your mood
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Footer */}
              <div className="relative px-6 pb-6">
                <PostToolbar
                  onMediaUpload={handleMediaAdd}
                  onSubmit={handleSubmit}
                  canSubmit={canSubmit}
                  isSubmitting={isSubmitting}
                  disabled={isSubmitting}
                  mediaCount={media.length}
                  maxMedia={4}
                />
              </div>

              {/* Loading Overlay */}
              <AnimatePresence>
                {isSubmitting && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center"
                    style={hwAcceleration}
                  >
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        <span className="text-gray-700 font-medium">Creating your post...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Compact version for mobile or smaller spaces
 */
export function CompactCreatePostModal() {
  const { isCreateOpen, closeCreate } = useUIStore()
  const [media, setMedia] = useState<MediaFile[]>([])

  const {
    content,
    updateContent,
    reset: resetComposer,
    canSubmit,
  } = usePostComposer({
    maxCharacters: 280,
    enableVibeSync: true,
  })

  const { createPost, isPending: isSubmitting } = useCreatePost({
    onSuccess: () => {
      closeCreate()
      setTimeout(() => {
        resetComposer()
        setMedia([])
      }, 300)
    },
  })

  const handleSubmit = useCallback(() => {
    if (!canSubmit || isSubmitting) return

    createPost({
      content: content.trim(),
      media: media.map(m => ({
        id: m.id,
        type: m.type,
        url: m.url,
      })),
    })
  }, [canSubmit, isSubmitting, createPost, content, media])

  return (
    <AnimatePresence>
      {isCreateOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl border-t border-gray-200"
          style={hwAcceleration}
        >
          <div className="p-4 space-y-4">
            {/* Handle */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto" />

            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">New Post</h3>
              <button
                onClick={closeCreate}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <CreatePostInput
              value={content}
              onChange={updateContent}
              placeholder="What's your vibe?"
              maxCharacters={280}
              disabled={isSubmitting}
            />

            {/* Actions */}
            <div className="flex justify-end">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                className={`
                  px-6 py-2 rounded-xl font-medium transition-colors
                  ${canSubmit && !isSubmitting
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                  }
                `}
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}