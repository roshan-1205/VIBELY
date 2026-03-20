/**
 * useKeyboardShortcuts Hook - Global keyboard shortcuts
 * Handle app-wide keyboard shortcuts
 */

import { useEffect } from 'react'
import { useUIStore } from '@/core/store/ui.store'

/**
 * Global keyboard shortcuts
 */
export function useKeyboardShortcuts() {
  const { openCreate, closeCreate, isCreateOpen } = useUIStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K - Open create modal
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (!isCreateOpen) {
          openCreate()
        }
      }

      // Cmd/Ctrl + Shift + N - New post (alternative)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'N') {
        e.preventDefault()
        if (!isCreateOpen) {
          openCreate()
        }
      }

      // ESC - Close any open modal
      if (e.key === 'Escape') {
        if (isCreateOpen) {
          closeCreate()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [openCreate, closeCreate, isCreateOpen])
}

/**
 * Hook for specific component keyboard shortcuts
 */
export function useComponentShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = `${e.metaKey ? 'cmd+' : ''}${e.ctrlKey ? 'ctrl+' : ''}${e.shiftKey ? 'shift+' : ''}${e.altKey ? 'alt+' : ''}${e.key.toLowerCase()}`
      
      const handler = shortcuts[key]
      if (handler) {
        e.preventDefault()
        handler()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

/**
 * Common keyboard shortcut patterns
 */
export const shortcuts = {
  // Create shortcuts
  CREATE_POST: 'cmd+k',
  NEW_POST: 'cmd+shift+n',
  
  // Navigation shortcuts
  HOME: 'cmd+1',
  FEED: 'cmd+2',
  PROFILE: 'cmd+3',
  
  // Action shortcuts
  SEARCH: 'cmd+/',
  HELP: '?',
  
  // Modal shortcuts
  CLOSE: 'escape',
  SUBMIT: 'cmd+enter',
} as const