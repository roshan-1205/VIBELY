'use client'

import { useState } from 'react'

interface SimpleImageDisplayProps {
  images?: Array<{
    url: string
    alt?: string
  }>
}

export const SimpleImageDisplay = ({ images }: SimpleImageDisplayProps) => {
  const [loadErrors, setLoadErrors] = useState<Set<string>>(new Set())

  if (!images || images.length === 0) {
    return null
  }

  const handleImageError = (url: string) => {
    console.error('❌ Image failed to load:', url)
    setLoadErrors(prev => {
      const newSet = new Set(prev)
      newSet.add(url)
      return newSet
    })
  }

  const handleImageLoad = (url: string) => {
    console.log('✅ Image loaded successfully:', url)
  }

  return (
    <div className="mt-4 space-y-2">
      {images.map((image, idx) => {
        const hasError = loadErrors.has(image.url)
        
        return (
          <div key={idx} className="rounded-lg overflow-hidden">
            {hasError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <div className="text-red-600 font-medium">❌ Image Failed to Load</div>
                <div className="text-red-500 text-sm mt-1">
                  Unable to display image
                </div>
                <button 
                  onClick={() => {
                    setLoadErrors(prev => {
                      const newSet = new Set(prev)
                      newSet.delete(image.url)
                      return newSet
                    })
                  }}
                  className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                >
                  Retry
                </button>
              </div>
            ) : (
              <img
                src={image.url}
                alt={image.alt || 'Post image'}
                className="w-full h-auto rounded-lg max-h-96 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                onError={() => handleImageError(image.url)}
                onLoad={() => handleImageLoad(image.url)}
                onClick={() => {
                  // Open image in full screen
                  window.open(image.url, '_blank')
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}