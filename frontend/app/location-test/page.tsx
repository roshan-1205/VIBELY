"use client"

import { useState } from 'react'
import { useLocation } from '@/hooks/useLocation'
import { locationService } from '@/lib/locationService'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LocationTestPage() {
  const { location, loading, error, requestLocation, clearError } = useLocation()
  const [permissionState, setPermissionState] = useState<string>('')

  const checkPermission = async () => {
    try {
      const permission = await locationService.requestPermission()
      setPermissionState(permission)
    } catch (err) {
      console.error('Permission check failed:', err)
      setPermissionState('unsupported')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Location Test</h1>
          <p className="text-gray-600">Test the location detection functionality</p>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Location Detection</h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={requestLocation} 
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
                {loading ? 'Getting Location...' : 'Get Current Location'}
              </Button>
              
              <Button 
                onClick={checkPermission} 
                variant="outline"
              >
                Check Permission
              </Button>
              
              {error && (
                <Button 
                  onClick={clearError} 
                  variant="outline"
                  className="text-red-600"
                >
                  Clear Error
                </Button>
              )}
            </div>

            {permissionState && (
              <Alert>
                <AlertDescription>
                  Permission State: <strong>{permissionState}</strong>
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  <strong>Error {error.code}:</strong> {error.message}
                </AlertDescription>
              </Alert>
            )}

            {location && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Location Detected!</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Coordinates:</strong> {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</div>
                  <div><strong>Accuracy:</strong> {location.accuracy.toFixed(0)} meters</div>
                  {location.city && <div><strong>City:</strong> {location.city}</div>}
                  {location.country && <div><strong>Country:</strong> {location.country}</div>}
                  {location.address && <div><strong>Address:</strong> {location.address}</div>}
                  <div><strong>Formatted:</strong> {locationService.formatLocation(location)}</div>
                </div>
              </div>
            )}

            <div className="text-sm text-gray-600">
              <p><strong>Geolocation Support:</strong> {locationService.isSupported() ? '✅ Supported' : '❌ Not Supported'}</p>
              <p className="mt-2">
                This test page demonstrates the location detection functionality that will be used in the signup form.
                The location service can detect your current position using GPS and convert it to a readable address.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Phone Number Validation</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Phone Number Validation
              </label>
              <input
                type="tel"
                placeholder="Enter a phone number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  const value = e.target.value
                  const isValid = /^\+?[\d\s\-\(\)]+$/.test(value) && value.length >= 10
                  e.target.style.borderColor = value ? (isValid ? 'green' : 'red') : '#d1d5db'
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Valid formats: +1234567890, (123) 456-7890, 123-456-7890
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}