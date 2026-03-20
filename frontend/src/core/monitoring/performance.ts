/**
 * Performance Monitoring System - Production Ready
 * Track Web Vitals, bundle size, and user experience metrics
 */

import React from 'react'

interface PerformanceConfig {
  enableWebVitals: boolean
  enableBundleAnalysis: boolean
  enableUserTiming: boolean
  reportingEndpoint?: string
  sampleRate: number // 0-1, percentage of users to monitor
}

interface PerformanceReport {
  timestamp: number
  url: string
  userAgent: string
  connectionType?: string
  metrics: {
    // Web Vitals
    fcp?: number // First Contentful Paint
    lcp?: number // Largest Contentful Paint
    fid?: number // First Input Delay
    cls?: number // Cumulative Layout Shift
    ttfb?: number // Time to First Byte
    
    // Custom metrics
    timeToInteractive?: number
    bundleSize?: number
    renderTime?: number
    apiResponseTime?: number
  }
  errors?: Array<{
    message: string
    stack?: string
    timestamp: number
  }>
}

class PerformanceMonitor {
  private config: PerformanceConfig
  private report: PerformanceReport
  private observers: Map<string, PerformanceObserver> = new Map()

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = {
      enableWebVitals: true,
      enableBundleAnalysis: import.meta.env.DEV,
      enableUserTiming: true,
      sampleRate: import.meta.env.PROD ? 0.1 : 1, // 10% in prod, 100% in dev
      ...config,
    }

    this.report = {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connectionType: this.getConnectionType(),
      metrics: {},
      errors: [],
    }

    this.init()
  }

  private init() {
    // Only monitor a percentage of users
    if (Math.random() > this.config.sampleRate) return

    if (this.config.enableWebVitals) {
      this.initWebVitals()
    }

    if (this.config.enableUserTiming) {
      this.initUserTiming()
    }

    if (this.config.enableBundleAnalysis) {
      this.initBundleAnalysis()
    }

    // Report on page unload
    window.addEventListener('beforeunload', () => {
      this.sendReport()
    })

    // Report periodically for long sessions
    setInterval(() => {
      this.sendReport()
    }, 30000) // Every 30 seconds
  }

  private initWebVitals() {
    // Import web-vitals dynamically
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS((metric) => {
        this.report.metrics.cls = metric.value
        this.logMetric('CLS', metric.value, metric.rating)
      })

      getFID((metric) => {
        this.report.metrics.fid = metric.value
        this.logMetric('FID', metric.value, metric.rating)
      })

      getFCP((metric) => {
        this.report.metrics.fcp = metric.value
        this.logMetric('FCP', metric.value, metric.rating)
      })

      getLCP((metric) => {
        this.report.metrics.lcp = metric.value
        this.logMetric('LCP', metric.value, metric.rating)
      })

      getTTFB((metric) => {
        this.report.metrics.ttfb = metric.value
        this.logMetric('TTFB', metric.value, metric.rating)
      })
    }).catch(() => {
      console.warn('Web Vitals not available')
    })
  }

  private initUserTiming() {
    // Observe user timing marks and measures
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure') {
            this.logCustomMetric(entry.name, entry.duration)
          }
        }
      })

      observer.observe({ entryTypes: ['measure'] })
      this.observers.set('userTiming', observer)
    }
  }

  private initBundleAnalysis() {
    // Analyze bundle size and loading performance
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        let totalSize = 0
        
        for (const entry of list.getEntries()) {
          if (entry.name.includes('.js') || entry.name.includes('.css')) {
            totalSize += (entry as any).transferSize || 0
          }
        }
        
        if (totalSize > 0) {
          this.report.metrics.bundleSize = totalSize
          this.logMetric('Bundle Size', totalSize, totalSize > 500000 ? 'poor' : 'good')
        }
      })

      observer.observe({ entryTypes: ['resource'] })
      this.observers.set('resource', observer)
    }
  }

  private getConnectionType(): string | undefined {
    // @ts-ignore - Navigator connection API
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    return connection?.effectiveType
  }

  private logMetric(name: string, value: number, rating?: string) {
    if (import.meta.env.DEV) {
      const emoji = rating === 'good' ? '✅' : rating === 'poor' ? '❌' : '⚠️'
      console.log(`${emoji} ${name}: ${value.toFixed(2)}ms (${rating || 'unknown'})`)
    }
  }

  private logCustomMetric(name: string, value: number) {
    if (import.meta.env.DEV) {
      console.log(`📊 ${name}: ${value.toFixed(2)}ms`)
    }
  }

  // Public API for custom metrics
  public markStart(name: string) {
    performance.mark(`${name}-start`)
  }

  public markEnd(name: string) {
    performance.mark(`${name}-end`)
    performance.measure(name, `${name}-start`, `${name}-end`)
  }

  public recordError(error: Error) {
    this.report.errors?.push({
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
    })
  }

  public recordCustomMetric(name: string, value: number) {
    // @ts-ignore - Dynamic metrics
    this.report.metrics[name] = value
    this.logCustomMetric(name, value)
  }

  private async sendReport() {
    if (!this.config.reportingEndpoint) {
      // Log to console in development
      if (import.meta.env.DEV) {
        console.table(this.report.metrics)
      }
      return
    }

    try {
      await fetch(this.config.reportingEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.report),
      })
    } catch (error) {
      console.warn('Failed to send performance report:', error)
    }
  }

  public destroy() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers.clear()
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor({
  enableWebVitals: true,
  enableBundleAnalysis: import.meta.env.DEV,
  enableUserTiming: true,
  sampleRate: import.meta.env.PROD ? 0.1 : 1,
})

// Convenience functions
export const perf = {
  start: (name: string) => performanceMonitor.markStart(name),
  end: (name: string) => performanceMonitor.markEnd(name),
  record: (name: string, value: number) => performanceMonitor.recordCustomMetric(name, value),
  error: (error: Error) => performanceMonitor.recordError(error),
}

// React hook for component performance
export function useComponentPerformance(componentName: string) {
  React.useEffect(() => {
    perf.start(`${componentName}-render`)
    return () => perf.end(`${componentName}-render`)
  })
}

// Development helpers
if (import.meta.env.DEV) {
  // @ts-ignore
  window.vibelyPerf = perf
  console.log('🚀 Performance monitoring enabled')
}