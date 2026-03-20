/**
 * Performance Monitoring Hooks
 * Track Web Vitals and performance metrics
 */

import { useEffect, useRef, useState } from 'react'

// Web Vitals types
interface WebVital {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
}

interface PerformanceMetrics {
  fcp?: number // First Contentful Paint
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  ttfb?: number // Time to First Byte
}

/**
 * Track Web Vitals performance metrics
 */
export function useWebVitals() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({})
  const [vitals, setVitals] = useState<WebVital[]>([])

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return

    const handleVital = (vital: WebVital) => {
      setVitals(prev => [...prev, vital])
      setMetrics(prev => ({
        ...prev,
        [vital.name.toLowerCase()]: vital.value,
      }))

      // Log in development
      if (import.meta.env.DEV) {
        console.log(`📊 ${vital.name}:`, vital.value, `(${vital.rating})`)
      }
    }

    // Import web-vitals dynamically to avoid SSR issues
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(handleVital)
      getFID(handleVital)
      getFCP(handleVital)
      getLCP(handleVital)
      getTTFB(handleVital)
    }).catch(() => {
      // Fallback if web-vitals is not available
      console.warn('Web Vitals library not available')
    })
  }, [])

  return { metrics, vitals }
}

/**
 * Track component render performance
 */
export function useRenderPerformance(componentName: string) {
  const renderCount = useRef(0)
  const lastRenderTime = useRef(performance.now())

  useEffect(() => {
    renderCount.current += 1
    const now = performance.now()
    const timeSinceLastRender = now - lastRenderTime.current
    lastRenderTime.current = now

    if (import.meta.env.DEV && renderCount.current > 1) {
      console.log(`🔄 ${componentName} render #${renderCount.current} (+${timeSinceLastRender.toFixed(2)}ms)`)
    }
  })

  return {
    renderCount: renderCount.current,
    getRenderCount: () => renderCount.current,
  }
}

/**
 * Measure function execution time
 */
export function usePerformanceMeasure() {
  const measure = (name: string, fn: () => void | Promise<void>) => {
    const start = performance.now()
    
    const result = fn()
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const end = performance.now()
        const duration = end - start
        
        if (import.meta.env.DEV) {
          console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`)
        }
        
        // Mark performance entry
        performance.mark(`${name}-start`)
        performance.mark(`${name}-end`)
        performance.measure(name, `${name}-start`, `${name}-end`)
      })
    } else {
      const end = performance.now()
      const duration = end - start
      
      if (import.meta.env.DEV) {
        console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`)
      }
      
      return result
    }
  }

  return { measure }
}

/**
 * Monitor memory usage (Chrome only)
 */
export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateMemoryInfo = () => {
      // @ts-ignore - Chrome specific API
      if (performance.memory) {
        // @ts-ignore
        setMemoryInfo({
          // @ts-ignore
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          // @ts-ignore
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          // @ts-ignore
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        })
      }
    }

    updateMemoryInfo()
    const interval = setInterval(updateMemoryInfo, 5000) // Update every 5s

    return () => clearInterval(interval)
  }, [])

  return memoryInfo
}