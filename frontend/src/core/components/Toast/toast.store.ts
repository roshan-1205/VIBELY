/**
 * Toast Store - Zustand
 * Global state management for toast notifications
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number // in milliseconds, 0 means no auto-dismiss
}

interface ToastState {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearAll: () => void
}

export const useToastStore = create<ToastState>()(
  devtools(
    (set) => ({
      toasts: [],

      addToast: (toast) => {
        const id = Math.random().toString(36).substring(2, 9)
        const newToast: Toast = {
          id,
          duration: 5000, // Default 5 seconds
          ...toast,
        }

        set((state) => ({
          toasts: [...state.toasts, newToast],
        }))
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        }))
      },

      clearAll: () => {
        set({ toasts: [] })
      },
    }),
    {
      name: 'toast-store',
    }
  )
)

// Hook for easy toast usage
export const useToast = () => {
  const { addToast, removeToast, clearAll } = useToastStore()

  const showToast = (toast: Omit<Toast, 'id'>) => {
    addToast(toast)
  }

  const success = (message: string, title?: string) => {
    showToast({ type: 'success', message, title })
  }

  const error = (message: string, title?: string) => {
    showToast({ type: 'error', message, title, duration: 0 }) // Don't auto-dismiss errors
  }

  const warning = (message: string, title?: string) => {
    showToast({ type: 'warning', message, title })
  }

  const info = (message: string, title?: string) => {
    showToast({ type: 'info', message, title })
  }

  return {
    showToast,
    success,
    error,
    warning,
    info,
    removeToast,
    clearAll,
  }
}