import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { DebugInfo } from '@/components/DebugInfo'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vibely - Connect and Share',
  description: 'A modern social platform for connecting with friends and sharing moments',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <DebugInfo />
        </AuthProvider>
      </body>
    </html>
  )
}