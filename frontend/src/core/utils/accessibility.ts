/**
 * Accessibility Utilities - WCAG Compliance Helpers
 * Keyboard navigation, focus management, screen reader support
 */

/**
 * Trap focus within a container (for modals, dropdowns)
 */
export function trapFocus(container: HTMLElement) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  const firstElement = focusableElements[0] as HTMLElement
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus()
        e.preventDefault()
      }
    }
  }

  container.addEventListener('keydown', handleTabKey)
  
  // Focus first element
  firstElement?.focus()

  return () => {
    container.removeEventListener('keydown', handleTabKey)
  }
}

/**
 * Announce content to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Check if element is visible to screen readers
 */
export function isVisibleToScreenReader(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element)
  
  return !(
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    style.opacity === '0' ||
    element.hasAttribute('aria-hidden') ||
    element.getAttribute('aria-hidden') === 'true'
  )
}

/**
 * Generate unique IDs for accessibility
 */
let idCounter = 0
export function generateId(prefix = 'vibely'): string {
  return `${prefix}-${++idCounter}`
}

/**
 * Keyboard navigation helpers
 */
export const keyboardNavigation = {
  // Arrow key navigation for lists
  handleArrowKeys: (
    e: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    onIndexChange: (index: number) => void
  ) => {
    let newIndex = currentIndex

    switch (e.key) {
      case 'ArrowDown':
        newIndex = Math.min(currentIndex + 1, items.length - 1)
        break
      case 'ArrowUp':
        newIndex = Math.max(currentIndex - 1, 0)
        break
      case 'Home':
        newIndex = 0
        break
      case 'End':
        newIndex = items.length - 1
        break
      default:
        return
    }

    e.preventDefault()
    onIndexChange(newIndex)
    items[newIndex]?.focus()
  },

  // Enter/Space activation
  handleActivation: (e: KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      callback()
    }
  },
}

/**
 * Color contrast checker (basic implementation)
 */
export function checkColorContrast(foreground: string, background: string): {
  ratio: number
  wcagAA: boolean
  wcagAAA: boolean
} {
  // This is a simplified implementation
  // In production, use a proper color contrast library
  
  const getLuminance = (color: string): number => {
    // Convert hex to RGB and calculate luminance
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255
    
    const sRGB = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
  }

  const l1 = getLuminance(foreground)
  const l2 = getLuminance(background)
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)

  return {
    ratio,
    wcagAA: ratio >= 4.5,
    wcagAAA: ratio >= 7,
  }
}

/**
 * Focus management utilities
 */
export const focusManagement = {
  // Save and restore focus
  saveFocus: (): (() => void) => {
    const activeElement = document.activeElement as HTMLElement
    return () => {
      if (activeElement && typeof activeElement.focus === 'function') {
        activeElement.focus()
      }
    }
  },

  // Focus first focusable element
  focusFirst: (container: HTMLElement) => {
    const focusable = container.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement
    
    focusable?.focus()
  },

  // Check if element is focusable
  isFocusable: (element: HTMLElement): boolean => {
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ]
    
    return focusableSelectors.some(selector => element.matches(selector))
  },
}

/**
 * Screen reader utilities
 */
export const screenReader = {
  // Hide from screen readers
  hide: (element: HTMLElement) => {
    element.setAttribute('aria-hidden', 'true')
  },

  // Show to screen readers
  show: (element: HTMLElement) => {
    element.removeAttribute('aria-hidden')
  },

  // Set accessible name
  setAccessibleName: (element: HTMLElement, name: string) => {
    element.setAttribute('aria-label', name)
  },

  // Set accessible description
  setAccessibleDescription: (element: HTMLElement, description: string) => {
    const id = generateId('desc')
    const descElement = document.createElement('div')
    descElement.id = id
    descElement.className = 'sr-only'
    descElement.textContent = description
    
    document.body.appendChild(descElement)
    element.setAttribute('aria-describedby', id)
    
    return () => {
      document.body.removeChild(descElement)
      element.removeAttribute('aria-describedby')
    }
  },
}