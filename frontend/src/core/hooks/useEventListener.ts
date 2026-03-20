import { useEffect, useRef } from 'react'

/**
 * Custom hook for adding event listeners
 * Automatically handles cleanup and prevents memory leaks
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined,
  options?: boolean | AddEventListenerOptions
): void

export function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: HTMLElement | null,
  options?: boolean | AddEventListenerOptions
): void

export function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: Document,
  options?: boolean | AddEventListenerOptions
): void

export function useEventListener(
  eventName: string,
  handler: (event: Event) => void,
  element?: HTMLElement | Document | Window | null,
  options?: boolean | AddEventListenerOptions
): void {
  // Create a ref that stores handler
  const savedHandler = useRef<(event: Event) => void>()

  useEffect(() => {
    // Define the listening target
    const targetElement: HTMLElement | Document | Window | null =
      element ?? (typeof window !== 'undefined' ? window : null)

    if (!(targetElement && targetElement.addEventListener)) return

    // Update saved handler if necessary
    if (savedHandler.current !== handler) {
      savedHandler.current = handler
    }

    // Create event listener that calls handler function stored in ref
    const eventListener = (event: Event) => {
      if (savedHandler.current) {
        savedHandler.current(event)
      }
    }

    targetElement.addEventListener(eventName, eventListener, options)

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, eventListener, options)
    }
  }, [eventName, element, options])
}

/**
 * Hook for keyboard shortcuts
 */
export function useKeyboardShortcut(
  keys: string[],
  callback: (event: KeyboardEvent) => void,
  options?: {
    preventDefault?: boolean
    stopPropagation?: boolean
  }
) {
  const { preventDefault = true, stopPropagation = true } = options || {}

  useEventListener('keydown', (event: KeyboardEvent) => {
    const pressedKeys = []
    
    if (event.ctrlKey) pressedKeys.push('ctrl')
    if (event.metaKey) pressedKeys.push('meta')
    if (event.shiftKey) pressedKeys.push('shift')
    if (event.altKey) pressedKeys.push('alt')
    
    pressedKeys.push(event.key.toLowerCase())
    
    const shortcut = keys.map(key => key.toLowerCase())
    const isMatch = shortcut.every(key => pressedKeys.includes(key)) && 
                   shortcut.length === pressedKeys.length

    if (isMatch) {
      if (preventDefault) event.preventDefault()
      if (stopPropagation) event.stopPropagation()
      callback(event)
    }
  })
}