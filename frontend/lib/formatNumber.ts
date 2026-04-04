/**
 * Format numbers for display (e.g., 1200 -> 1.2K, 1500000 -> 1.5M)
 */
export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString()
  }
  
  if (num < 1000000) {
    const formatted = (num / 1000).toFixed(1)
    return formatted.endsWith('.0') ? `${Math.floor(num / 1000)}K` : `${formatted}K`
  }
  
  if (num < 1000000000) {
    const formatted = (num / 1000000).toFixed(1)
    return formatted.endsWith('.0') ? `${Math.floor(num / 1000000)}M` : `${formatted}M`
  }
  
  const formatted = (num / 1000000000).toFixed(1)
  return formatted.endsWith('.0') ? `${Math.floor(num / 1000000000)}B` : `${formatted}B`
}

/**
 * Format numbers with locale-specific thousands separators
 */
export function formatNumberWithCommas(num: number): string {
  return num.toLocaleString()
}