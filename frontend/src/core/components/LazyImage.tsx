/**
 * LazyImage Component - Optimized Image Loading
 * Features: lazy loading, blur-up effect, responsive images, error handling
 */

import React, { useState, useRef, useEffect, memo } from 'react'
import { motion } from 'framer-motion'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
  blurDataURL?: string
  width?: number
  height?: number
  aspectRatio?: string
  sizes?: string
  priority?: boolean
  onLoad?: () => void
  onError?: () => void
}

export const LazyImage = memo(function LazyImage({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+',
  blurDataURL,
  width,
  height,
  aspectRatio = '1/1',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  onLoad,
  onError,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [priority, isInView])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  // Generate responsive srcSet for better performance
  const generateSrcSet = (baseSrc: string) => {
    if (!baseSrc.includes('http')) return undefined
    
    // For external images, assume CDN with resize capabilities
    const sizes = [400, 800, 1200, 1600]
    return sizes
      .map(size => `${baseSrc}?w=${size}&q=75 ${size}w`)
      .join(', ')
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio }}
    >
      {/* Placeholder/Blur background */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse">
          {blurDataURL && (
            <img
              src={blurDataURL}
              alt=""
              className="w-full h-full object-cover filter blur-sm scale-110"
              aria-hidden="true"
            />
          )}
        </div>
      )}

      {/* Main image */}
      {isInView && !hasError && (
        <motion.img
          ref={imgRef}
          src={src}
          srcSet={generateSrcSet(src)}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            willChange: 'opacity',
          }}
        />
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-400">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs">Image unavailable</p>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isInView && !isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
})