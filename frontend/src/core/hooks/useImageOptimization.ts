/**
 * Image Optimization Hook - Next-gen Image Loading
 * WebP conversion, responsive images, blur-up effect
 */

import { useState, useEffect, useCallback } from 'react'

interface ImageOptimizationOptions {
  src: string
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'auto'
  blur?: boolean
  responsive?: boolean
}

interface OptimizedImage {
  src: string
  srcSet?: string
  placeholder?: string
  isLoaded: boolean
  hasError: boolean
}

export function useImageOptimization({
  src,
  width,
  height,
  quality = 75,
  format = 'auto',
  blur = true,
  responsive = true,
}: ImageOptimizationOptions): OptimizedImage {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Generate optimized URLs (would integrate with CDN in production)
  const generateOptimizedUrl = useCallback((
    baseSrc: string,
    w?: number,
    q?: number,
    f?: string
  ) => {
    if (!baseSrc.startsWith('http')) return baseSrc
    
    const url = new URL(baseSrc)
    const params = new URLSearchParams()
    
    if (w) params.set('w', w.toString())
    if (q) params.set('q', q.toString())
    if (f && f !== 'auto') params.set('f', f)
    
    return `${url.origin}${url.pathname}?${params.toString()}`
  }, [])

  // Generate responsive srcSet
  const generateSrcSet = useCallback(() => {
    if (!responsive || !src.startsWith('http')) return undefined
    
    const sizes = [400, 800, 1200, 1600, 2000]
    const format_priority = ['avif', 'webp', 'auto']
    
    // Check browser support
    const supportsAvif = typeof window !== 'undefined' && 
      document.createElement('canvas').toDataURL('image/avif').indexOf('data:image/avif') === 0
    const supportsWebp = typeof window !== 'undefined' && 
      document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0
    
    let selectedFormat = 'auto'
    if (format === 'auto') {
      if (supportsAvif) selectedFormat = 'avif'
      else if (supportsWebp) selectedFormat = 'webp'
    } else {
      selectedFormat = format
    }
    
    return sizes
      .map(size => `${generateOptimizedUrl(src, size, quality, selectedFormat)} ${size}w`)
      .join(', ')
  }, [src, responsive, quality, format, generateOptimizedUrl])

  // Generate blur placeholder
  const generatePlaceholder = useCallback(() => {
    if (!blur) return undefined
    
    // Generate a tiny blurred version (would be base64 in production)
    return generateOptimizedUrl(src, 40, 20, 'webp')
  }, [src, blur, generateOptimizedUrl])

  // Preload image
  useEffect(() => {
    if (!src) return

    const img = new Image()
    
    img.onload = () => setIsLoaded(true)
    img.onerror = () => setHasError(true)
    
    // Use optimized source
    img.src = generateOptimizedUrl(src, width, quality, format === 'auto' ? 'webp' : format)
    
    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src, width, quality, format, generateOptimizedUrl])

  return {
    src: generateOptimizedUrl(src, width, quality, format === 'auto' ? 'webp' : format),
    srcSet: generateSrcSet(),
    placeholder: generatePlaceholder(),
    isLoaded,
    hasError,
  }
}

/**
 * Image preloader hook - preload images for better UX
 */
export function useImagePreloader(urls: string[]) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  useEffect(() => {
    const preloadPromises = urls.map(url => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image()
        
        img.onload = () => {
          setLoadedImages(prev => new Set(prev).add(url))
          resolve(url)
        }
        
        img.onerror = () => {
          setFailedImages(prev => new Set(prev).add(url))
          reject(url)
        }
        
        img.src = url
      })
    })

    Promise.allSettled(preloadPromises)
  }, [urls])

  return {
    loadedImages,
    failedImages,
    isLoaded: (url: string) => loadedImages.has(url),
    hasFailed: (url: string) => failedImages.has(url),
    progress: loadedImages.size / urls.length,
  }
}

/**
 * Intersection-based image loading
 */
export function useIntersectionImage(
  threshold = 0.1,
  rootMargin = '50px'
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [element, setElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [element, threshold, rootMargin])

  return {
    ref: setElement,
    isIntersecting,
  }
}