import { GlobalProvider } from '@/core'
import { useKeyboardShortcuts } from '@/core/hooks'
import { AppRoutes } from './routes/AppRoutes'
import { Layout } from '@/components/layout/Layout'
import { CreatePostModal } from '@/features/create'
import '@/styles/globals.css'
import '@/styles/themes.css'

function App() {
  // Global keyboard shortcuts
  useKeyboardShortcuts()

  return (
    <GlobalProvider>
      <div className="theme-light">
        <Layout>
          <AppRoutes />
        </Layout>
        {/* Global Modals */}
        <CreatePostModal />
      </div>
    </GlobalProvider>
  )
}

export default App