"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiService } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function DebugPage() {
  const { user, login, signup, logout, error, isLoading } = useAuth()
  const [testResult, setTestResult] = useState<string>('')
  const [testLoading, setTestLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: 'Test',
    lastName: 'User',
    email: `test${Date.now()}@example.com`,
    password: 'password123'
  })

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setTestLoading(true)
    try {
      console.log(`Running test: ${testName}`)
      const result = await testFn()
      setTestResult(`✅ ${testName} SUCCESS:\n${JSON.stringify(result, null, 2)}`)
      console.log(`Test ${testName} successful:`, result)
    } catch (error: any) {
      setTestResult(`❌ ${testName} FAILED:\n${error.message}`)
      console.error(`Test ${testName} failed:`, error)
    }
    setTestLoading(false)
  }

  const testHealthCheck = () => runTest('Health Check', () => apiService.healthCheck())
  
  const testDirectRegister = () => runTest('Direct API Register', () => 
    apiService.register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password
    })
  )

  const testAuthRegister = () => runTest('Auth Context Register', () =>
    signup(formData.email, formData.password, formData.firstName, formData.lastName)
  )

  const testLogin = () => runTest('Login', () =>
    login(formData.email, formData.password)
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">🔧 Authentication Debug Center</h1>
      
      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">🔍 Current Status</h2>
          <div className="space-y-2 text-sm">
            <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Not set'}</p>
            <p><strong>Loading:</strong> {isLoading ? '⏳ Yes' : '✅ No'}</p>
            <p><strong>User:</strong> {user ? `✅ ${user.firstName} ${user.lastName}` : '❌ None'}</p>
            <p><strong>Error:</strong> {error || '✅ None'}</p>
            <p><strong>Token:</strong> {typeof window !== 'undefined' && localStorage.getItem('vibely_token') ? '✅ Present' : '❌ None'}</p>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📝 Test Data</h2>
          <div className="space-y-3">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="bg-white p-6 rounded-lg border mb-6">
        <h2 className="text-xl font-semibold mb-4">🧪 Run Tests</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button onClick={testHealthCheck} disabled={testLoading} variant="outline">
            🏥 Health Check
          </Button>
          <Button onClick={testDirectRegister} disabled={testLoading} variant="outline">
            📝 Direct Register
          </Button>
          <Button onClick={testAuthRegister} disabled={testLoading} variant="outline">
            🔐 Auth Register
          </Button>
          <Button onClick={testLogin} disabled={testLoading} variant="outline">
            🔑 Login
          </Button>
        </div>
      </div>

      {/* User Actions */}
      {user && (
        <div className="bg-yellow-50 p-6 rounded-lg border mb-6">
          <h2 className="text-xl font-semibold mb-4">👤 User Actions</h2>
          <div className="flex gap-4">
            <Button onClick={logout} variant="destructive">
              🚪 Logout
            </Button>
            <Button asChild>
              <a href="/hero">🏠 Go to Hero Page</a>
            </Button>
          </div>
        </div>
      )}

      {/* Test Results */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">📊 Test Results</h2>
        <pre className="whitespace-pre-wrap text-sm bg-white p-4 rounded border overflow-auto max-h-96">
          {testLoading ? '⏳ Running test...' : testResult || '🔄 No tests run yet. Click a test button above.'}
        </pre>
      </div>

      {/* Quick Links */}
      <div className="mt-8 flex flex-wrap gap-4">
        <Button asChild variant="outline">
          <a href="/">🏠 Home</a>
        </Button>
        <Button asChild variant="outline">
          <a href="/signup">📝 Sign Up</a>
        </Button>
        <Button asChild variant="outline">
          <a href="/signin">🔑 Sign In</a>
        </Button>
        <Button asChild variant="outline">
          <a href="/test-auth">🧪 Test Auth</a>
        </Button>
      </div>
    </div>
  )
}