"use client"

import { useState } from 'react'
import { apiService } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function TestAuthPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testHealthCheck = async () => {
    setLoading(true)
    try {
      const response = await apiService.healthCheck()
      setResult(`Health Check: ${JSON.stringify(response, null, 2)}`)
    } catch (error: any) {
      setResult(`Health Check Error: ${error.message}`)
    }
    setLoading(false)
  }

  const testRegister = async () => {
    setLoading(true)
    try {
      const response = await apiService.register({
        firstName: 'Test',
        lastName: 'User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      })
      setResult(`Register: ${JSON.stringify(response, null, 2)}`)
    } catch (error: any) {
      setResult(`Register Error: ${error.message}`)
    }
    setLoading(false)
  }

  const testLogin = async () => {
    setLoading(true)
    try {
      const response = await apiService.login({
        email: 'test@example.com',
        password: 'TestPass123'
      })
      setResult(`Login: ${JSON.stringify(response, null, 2)}`)
    } catch (error: any) {
      setResult(`Login Error: ${error.message}`)
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Authentication Test Page</h1>
      
      <div className="space-y-4 mb-6">
        <Button onClick={testHealthCheck} disabled={loading}>
          Test Health Check
        </Button>
        <Button onClick={testRegister} disabled={loading}>
          Test Register
        </Button>
        <Button onClick={testLogin} disabled={loading}>
          Test Login
        </Button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="font-semibold mb-2">Result:</h2>
        <pre className="whitespace-pre-wrap text-sm">
          {loading ? 'Loading...' : result || 'No test run yet'}
        </pre>
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h2 className="font-semibold mb-2">API Configuration:</h2>
        <p>API URL: {process.env.NEXT_PUBLIC_API_URL || 'Not set'}</p>
        <p>Current URL: {typeof window !== 'undefined' ? window.location.origin : 'Server-side'}</p>
      </div>
    </div>
  )
}