/**
 * MediaPreview Component - Vibely Post Creation
 * Image/video preview with drag & drop support
 */

import React, { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { buttonTap, hwAcceleration } from '@/core'
import type { MediaFile } from '../types/create.types'

interface MediaPreviewProps {
  media: MediaFile[]
  onRemove: (mediaId: string) => void
  onAdd: (files: File[]) => void
  maxFiles?: number
  disabled?: boolean
}

export function MediaPreview({
  media,
  onRemove,
  onAdd,
  maxFiles = 4,
  disabled = false,
}: MediaPreviewProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file selection
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onAdd(files)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onAdd])

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (disabled) return

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    )
    
    if (files.length > 0) {
      onAdd(files)
    }
  }, [onAdd, disabled])

  // Open file picker
  const openFilePicker = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [disabled])

  const canAddMore = media.length < maxFiles && !disabled

  return (
    <div className="space-y-4">
      {/* Media Grid */}
      <AnimatePresence>
        {media.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 gap-3"
          >
            {media.map((item, index) => (
              <MediaPreviewItem
                key={item.id}
                media={item}
                index={index}
                onRemove={onRemove}
                disabled={disabled}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Area */}
      {canAddMore && (
        <motion.div
          className={`
            relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200
            ${isDragOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFilePicker}
          whileHover={!disabled ? { scale: 1.02 } : {}}
          whileTap={!disabled ? { scale: 0.98 } : {}}
          style={hwAcceleration}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled}
          />

          <div className="space-y-3">
            {/* Upload Icon */}
            <motion.div
              className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"
              animate={{ 
                scale: isDragOver ? 1.1 : 1,
                backgroundColor: isDragOver ? '#dbeafe' : '#f3f4f6',
              }}
            >
              <svg
                className={`w-6 h-6 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </motion.div>

            {/* Upload Text */}
            <div>
              <p className="text-sm font-medium text-gray-700">
                {isDragOver ? 'Drop files here' : 'Add photos or videos'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Drag and drop or click to browse
              </p>
            </div>

            {/* File Count */}
            <p className="text-xs text-gray-400">
              {media.length}/{maxFiles} files
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

/**
 * Individual media preview item
 */
function MediaPreviewItem({
  media,
  index,
  onRemove,
  disabled,
}: {
  media: MediaFile
  index: number
  onRemove: (mediaId: string) => void
  disabled: boolean
}) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ delay: index * 0.1 }}
      className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100"
      style={hwAcceleration}
    >
      {/* Media Content */}
      {media.type === 'image' ? (
        <img
          src={media.url}
          alt="Preview"
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
        />
      ) : (
        <video
          src={media.url}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoadedData={() => setIsLoaded(true)}
          muted
          playsInline
        />
      )}

      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Remove Button */}
      <motion.button
        {...buttonTap}
        style={hwAcceleration}
        onClick={() => onRemove(media.id)}
        disabled={disabled}
        className={`
          absolute top-2 right-2 w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full
          flex items-center justify-center text-white opacity-0 group-hover:opacity-100
          transition-opacity duration-200 hover:bg-black/70
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
      >
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </motion.button>

      {/* Media Type Indicator */}
      {media.type === 'video' && (
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs text-white">
          <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
          Video
        </div>
      )}

      {/* File Size */}
      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {formatFileSize(media.size)}
      </div>
    </motion.div>
  )
}

/**
 * Format file size for display
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}