import { GlobalProvider } from '@/core'
import { useKeyboardShortcuts } from '@/core/hooks'
import { AppRoutes } from './routes/AppRoutes'
import { Layout } from '@/components/layout/Layout'
import { CreatePostModal } from '@/features/create'
import { ToastContainer } from '@/core/components/Toast'
import { ErrorBoundary } from '@/core/components/ErrorBoundary'
import '@/styles/globals.css'
import '@/styles/themes.css'

function App() {
  // Global keyboard shortcuts
  useKeyboardShortcuts()

  return (
    <ErrorBoundary>
      <GlobalProvider>
        <div className="theme-light">
          <Layout>
            <AppRoutes />
          </Layout>
          {/* Global Modals */}
          <CreatePostModal />
          {/* Global Toast System */}
          <ToastContainer />
        </div>
      </GlobalProvider>
    </ErrorBoundary>
  )
}

export default App