import { useState, useEffect } from 'react'
import { useEventListener } from './useEventListener'

/**
 * Custom hook to track online/offline status
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof navigator !== 'undefined') {
      return navigator.onLine
    }
    return true
  })

  useEventListener('online', () => setIsOnline(true))
  useEventListener('offline', () => setIsOnline(false))

  return isOnline
}