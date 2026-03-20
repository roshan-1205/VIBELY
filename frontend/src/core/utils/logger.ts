/**
 * Logger utility for consistent logging across the application
 * Handles different log levels and environments
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  data?: any
  stack?: string
}

class Logger {
  private isDevelopment = import.meta.env.DEV
  private logLevel: LogLevel = this.isDevelopment ? 'debug' : 'error'
  private logs: LogEntry[] = []
  private maxLogs = 1000

  constructor() {
    // Set log level from environment
    const envLogLevel = import.meta.env.VITE_LOG_LEVEL as LogLevel
    if (envLogLevel) {
      this.logLevel = envLogLevel
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    }
    
    return levels[level] >= levels[this.logLevel]
  }

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      stack: level === 'error' ? new Error().stack : undefined,
    }
  }

  private addToHistory(entry: LogEntry) {
    this.logs.push(entry)
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toLocaleTimeString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`
    
    if (data) {
      return `${prefix} ${message}`
    }
    
    return `${prefix} ${message}`
  }

  debug(message: string, data?: any) {
    if (!this.shouldLog('debug')) return
    
    const entry = this.createLogEntry('debug', message, data)
    this.addToHistory(entry)
    
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message), data || '')
    }
  }

  info(message: string, data?: any) {
    if (!this.shouldLog('info')) return
    
    const entry = this.createLogEntry('info', message, data)
    this.addToHistory(entry)
    
    if (this.isDevelopment) {
      console.info(this.formatMessage('info', message), data || '')
    }
  }

  warn(message: string, data?: any) {
    if (!this.shouldLog('warn')) return
    
    const entry = this.createLogEntry('warn', message, data)
    this.addToHistory(entry)
    
    if (this.isDevelopment) {
      console.warn(this.formatMessage('warn', message), data || '')
    } else {
      // In production, you might want to send warnings to an external service
      this.sendToExternalService(entry)
    }
  }

  error(message: string, error?: Error | any) {
    if (!this.shouldLog('error')) return
    
    const entry = this.createLogEntry('error', message, error)
    this.addToHistory(entry)
    
    if (this.isDevelopment) {
      console.error(this.formatMessage('error', message), error || '')
    } else {
      // In production, always send errors to external service
      this.sendToExternalService(entry)
    }
  }

  private async sendToExternalService(entry: LogEntry) {
    // Implement external logging service integration here
    // Examples: Sentry, LogRocket, DataDog, etc.
    
    try {
      // Example implementation:
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry)
      // })
    } catch (error) {
      // Silently fail - don't log errors about logging
      console.error('Failed to send log to external service:', error)
    }
  }

  // Get recent logs for debugging
  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level)
    }
    return [...this.logs]
  }

  // Clear log history
  clearLogs() {
    this.logs = []
  }

  // Set log level dynamically
  setLogLevel(level: LogLevel) {
    this.logLevel = level
  }

  // Performance logging
  time(label: string) {
    if (this.isDevelopment) {
      console.time(label)
    }
  }

  timeEnd(label: string) {
    if (this.isDevelopment) {
      console.timeEnd(label)
    }
  }

  // Group logging
  group(label: string) {
    if (this.isDevelopment) {
      console.group(label)
    }
  }

  groupEnd() {
    if (this.isDevelopment) {
      console.groupEnd()
    }
  }
}

// Create singleton instance
export const logger = new Logger()

// Export for convenience
export default logger