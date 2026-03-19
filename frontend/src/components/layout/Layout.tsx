import { type ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Sidebar } from './Sidebar'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </BrowserRouter>
  )
}