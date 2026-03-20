import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'
export type VibeMode = 'calm' | 'energetic' | 'focused' | 'creative' | 'social'

interface ModalState {
  isOpen: boolean
  type: string | null
  data?: any
}

interface UIState {
  // Theme & Appearance
  theme: Theme
  vibeMode: VibeMode | null
  
  // Modal Management
  modal: ModalState
  
  // Create Post Modal
  isCreateOpen: boolean
  
  // Loading States
  globalLoading: boolean
  
  // Sidebar & Navigation
  sidebarOpen: boolean
  
  // Actions
  setTheme: (theme: Theme) => void
  setVibeMode: (mode: VibeMode | null) => void
  openModal: (type: string, data?: any) => void
  closeModal: () => void
  openCreate: () => void
  closeCreate: () => void
  setGlobalLoading: (loading: boolean) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Initial state
      theme: 'system',
      vibeMode: null,
      modal: {
        isOpen: false,
        type: null,
        data: undefined,
      },
      isCreateOpen: false,
      globalLoading: false,
      sidebarOpen: true,
      
      // Actions
      setTheme: (theme: Theme) => {
        set({ theme })
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme)
      },
      
      setVibeMode: (vibeMode: VibeMode | null) => {
        set({ vibeMode })
        // Apply vibe mode to document for CSS variables
        if (vibeMode) {
          document.documentElement.setAttribute('data-vibe', vibeMode)
        } else {
          document.documentElement.removeAttribute('data-vibe')
        }
      },
      
      openModal: (type: string, data?: any) => {
        set({
          modal: {
            isOpen: true,
            type,
            data,
          },
        })
      },
      
      closeModal: () => {
        set({
          modal: {
            isOpen: false,
            type: null,
            data: undefined,
          },
        })
      },
      
      openCreate: () => {
        set({ isCreateOpen: true })
      },
      
      closeCreate: () => {
        set({ isCreateOpen: false })
      },
      
      setGlobalLoading: (globalLoading: boolean) => {
        set({ globalLoading })
      },
      
      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }))
      },
      
      setSidebarOpen: (sidebarOpen: boolean) => {
        set({ sidebarOpen })
      },
    }),
    {
      name: 'vibely-ui',
      partialize: (state) => ({
        theme: state.theme,
        vibeMode: state.vibeMode,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)

// Selectors
export const useTheme = () => useUIStore((state) => state.theme)
export const useVibeMode = () => useUIStore((state) => state.vibeMode)
export const useModal = () => useUIStore((state) => state.modal)
export const useCreateModal = () => useUIStore((state) => state.isCreateOpen)
export const useGlobalLoading = () => useUIStore((state) => state.globalLoading)
export const useSidebar = () => useUIStore((state) => ({
  isOpen: state.sidebarOpen,
  toggle: state.toggleSidebar,
  setOpen: state.setSidebarOpen,
}))

export const useUIActions = () => useUIStore((state) => ({
  setTheme: state.setTheme,
  setVibeMode: state.setVibeMode,
  openModal: state.openModal,
  closeModal: state.closeModal,
  openCreate: state.openCreate,
  closeCreate: state.closeCreate,
  setGlobalLoading: state.setGlobalLoading,
}))