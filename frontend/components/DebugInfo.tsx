"use client"

import { useAuth } from '@/contexts/AuthContext'

export function DebugInfo() {
  const { user, error, isLoading } = useAuth()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm">
      <h4 className="font-bold mb-2">Debug Info</h4>
      <div className="space-y-1">
        <p>API URL: {process.env.NEXT_PUBLIC_API_URL || 'Not set'}</p>
        <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p>User: {user ? `${user.firstName} ${user.lastName}` : 'None'}</p>
        <p>Error: {error || 'None'}</p>
        <p>Token: {typeof window !== 'undefined' && localStorage.getItem('vibely_token') ? 'Present' : 'None'}</p>
      </div>
    </div>
  )
}