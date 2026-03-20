import { type ReactNode } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useIsAuthenticated } from '@/core/store/auth.store'

interface LayoutProps {
  children: ReactNode
}

function LayoutContent({ children }: LayoutProps) {
  const isAuthenticated = useIsAuthenticated()
  const location = useLocation()
  
  // Don't show sidebar on auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'
  
  if (isAuthPage || !isAuthenticated) {
    return (
      <div className="min-h-screen">
        <main className="w-full">
          {children}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export function Layout({ children }: LayoutProps) {
  return (
    <BrowserRouter>
      <LayoutContent>
        {children}
      </LayoutContent>
    </BrowserRouter>
  )
}