"use client"

import { useState, useEffect, useCallback } from 'react'
import { locationService, type LocationData, type LocationError } from '@/lib/locationService'

interface UseLocationReturn {
  location: LocationData | null
  loading: boolean
  error: LocationError | null
  requestLocation: () => Promise<void>
  clearError: () => void
  isSupported: boolean
}

export function useLocation(autoRequest = false): UseLocationReturn {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<LocationError | null>(null)

  const requestLocation = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const locationData = await locationService.getCurrentLocation()
      setLocation(locationData)
    } catch (err) {
      setError(err as LocationError)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Auto-request location on mount if enabled
  useEffect(() => {
    if (autoRequest) {
      requestLocation()
    }
  }, [autoRequest, requestLocation])

  // Check for cached location on mount
  useEffect(() => {
    const cached = locationService.getCachedLocation()
    if (cached) {
      setLocation(cached)
    }
  }, [])

  return {
    location,
    loading,
    error,
    requestLocation,
    clearError,
    isSupported: locationService.isSupported()
  }
}