import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'
import { AppRoutes } from './routes/AppRoutes'
import { Layout } from '@/components/layout/Layout'
import '@/styles/globals.css'
import '@/styles/themes.css'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="theme-light">
        <Layout>
          <AppRoutes />
        </Layout>
      </div>
    </QueryClientProvider>
  )
}

export default App