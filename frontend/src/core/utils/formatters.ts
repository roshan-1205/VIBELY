/**
 * Formatting Utilities - Consistent Data Display
 * Numbers, dates, text formatting with internationalization support
 */

/**
 * Format numbers with appropriate suffixes (1K, 1M, etc.)
 */
export function formatNumber(num: number): string {
  if (num < 1000) return num.toString()
  
  const units = ['', 'K', 'M', 'B', 'T']
  const unitIndex = Math.floor(Math.log10(Math.abs(num)) / 3)
  const scaledNum = num / Math.pow(1000, unitIndex)
  
  // Format with appropriate decimal places
  const formatted = scaledNum < 10 && unitIndex > 0 
    ? scaledNum.toFixed(1) 
    : Math.round(scaledNum).toString()
  
  return formatted + units[unitIndex]
}

/**
 * Format relative time (e.g., "2 hours ago", "just now")
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const target = new Date(date)
  const diffMs = now.getTime() - target.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffSeconds < 30) return 'just now'
  if (diffSeconds < 60) return `${diffSeconds}s ago`
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffWeeks < 4) return `${diffWeeks}w ago`
  if (diffMonths < 12) return `${diffMonths}mo ago`
  return `${diffYears}y ago`
}

/**
 * Format file sizes (bytes to human readable)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const unitIndex = Math.floor(Math.log2(bytes) / 10)
  const size = bytes / Math.pow(1024, unitIndex)
  
  return `${size.toFixed(unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`
}

/**
 * Format currency with proper locale support
 */
export function formatCurrency(
  amount: number, 
  currency = 'USD', 
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format percentage with proper rounding
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

/**
 * Format phone numbers (US format)
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  
  return phone // Return original if can't format
}

/**
 * Capitalize first letter of each word
 */
export function titleCase(text: string): string {
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

/**
 * Convert camelCase to readable text
 */
export function camelToReadable(text: string): string {
  return text
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

/**
 * Format duration in milliseconds to human readable
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  return `${seconds}s`
}

/**
 * Format date with relative fallback
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const target = new Date(date)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - target.getTime()) / (1000 * 60 * 60 * 24))

  // Use relative time for recent dates
  if (diffDays < 7) {
    return formatRelativeTime(date)
  }

  // Use formatted date for older dates
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }

  return target.toLocaleDateString('en-US', defaultOptions)
}

/**
 * Format social media handles (remove @ if present, add if needed)
 */
export function formatHandle(handle: string, addAt = true): string {
  const cleaned = handle.replace(/^@/, '')
  return addAt ? `@${cleaned}` : cleaned
}

/**
 * Format URL for display (remove protocol, truncate if needed)
 */
export function formatUrl(url: string, maxLength = 50): string {
  try {
    const urlObj = new URL(url)
    const display = urlObj.hostname + urlObj.pathname
    return truncateText(display, maxLength)
  } catch {
    return truncateText(url, maxLength)
  }
}