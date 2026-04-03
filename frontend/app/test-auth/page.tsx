"use client"

import { useState } from 'react'
import { apiService } from '@/services/api'

export default function TestAuthPage() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const addResult = (test: string, result: any) => {
    setResults(prev => [...prev, { test, result, timestamp: new Date().toISOString() }])
  }

  const testNetworkConnectivity = async () => {
    setLoading(true)
    try {
      // Test basic fetch to backend
      const response = await fetch('http://localhost:5000/api/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json()
      addResult('Network Connectivity', { 
        success: true, 
        status: response.status,
        data 
      })
    } catch (error: any) {
      addResult('Network Connectivity', { 
        success: false, 
        error: error.message,
        stack: error.stack 
      })
    }
    setLoading(false)
  }

  const testHealthCheck = async () => {
    setLoading(true)
    try {
      const result = await apiService.healthCheck()
      addResult('Health Check', { success: true, data: result })
    } catch (error: any) {
      addResult('Health Check', { success: false, error: error.message, stack: error.stack })
    }
    setLoading(false)
  }

  const testRegistration = async () => {
    setLoading(true)
    try {
      const result = await apiService.register({
        firstName: 'Test',
        lastName: 'User',
        email: `test${Date.now()}@example.com`, // Use unique email
        password: 'TestPass123'
      })
      addResult('Registration', { success: true, data: result })
    } catch (error: any) {
      addResult('Registration', { success: false, error: error.message, stack: error.stack })
    }
    setLoading(false)
  }

  const testLogin = async () => {
    setLoading(true)
    try {
      const result = await apiService.login({
        email: 'testuser@example.com',
        password: 'TestPass123'
      })
      addResult('Login', { success: true, data: result })
    } catch (error: any) {
      addResult('Login', { success: false, error: error.message, stack: error.stack })
    }
    setLoading(false)
  }

  const testCORS = async () => {
    setLoading(true)
    try {
      // Test CORS preflight
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      })
      addResult('CORS Preflight', { 
        success: response.ok, 
        status: response.status,
        headers: Object.fromEntries(response.headers.entries())
      })
    } catch (error: any) {
      addResult('CORS Preflight', { success: false, error: error.message })
    }
    setLoading(false)
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={testNetworkConnectivity}
              disabled={loading}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
            >
              Test Network
            </button>
            <button
              onClick={testCORS}
              disabled={loading}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
            >
              Test CORS
            </button>
            <button
              onClick={testHealthCheck}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Test Health Check
            </button>
            <button
              onClick={testRegistration}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              Test Registration
            </button>
            <button
              onClick={testLogin}
              disabled={loading}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
            >
              Test Login
            </button>
            <button
              onClick={clearResults}
              disabled={loading}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Clear Results
            </button>
          </div>
          {loading && (
            <div className="mt-4 text-blue-600">
              <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
              Running test...
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          {results.length === 0 ? (
            <p className="text-gray-500">No tests run yet. Click a test button above to start.</p>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="border rounded p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{result.test}</h3>
                    <span className="text-sm text-gray-500">{result.timestamp}</span>
                  </div>
                  <div className={`p-3 rounded text-sm ${
                    result.result.success 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    <div className="font-medium mb-1">
                      {result.result.success ? '✅ Success' : '❌ Error'}
                    </div>
                    <pre className="whitespace-pre-wrap text-xs">
                      {JSON.stringify(result.result, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Info</h2>
          <div className="text-sm space-y-2">
            <div><strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}</div>
            <div><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</div>
            <div><strong>Local Storage Token:</strong> {typeof window !== 'undefined' ? (localStorage.getItem('vibely_token') ? 'Present' : 'Not found') : 'Server-side'}</div>
            <div><strong>User Agent:</strong> {typeof window !== 'undefined' ? navigator.userAgent : 'Server-side'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}