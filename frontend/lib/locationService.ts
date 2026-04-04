"use client"

export interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
  city?: string
  country?: string
  address?: string
}

export interface LocationError {
  code: number
  message: string
}

class LocationService {
  private static instance: LocationService
  private currentLocation: LocationData | null = null

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService()
    }
    return LocationService.instance
  }

  /**
   * Get current device location using GPS
   */
  async getCurrentLocation(options?: PositionOptions): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject({
          code: 0,
          message: 'Geolocation is not supported by this browser'
        } as LocationError)
        return
      }

      const defaultOptions: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
        ...options
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          }

          // Try to get address from coordinates
          try {
            const address = await this.reverseGeocode(
              locationData.latitude,
              locationData.longitude
            )
            locationData.city = address.city
            locationData.country = address.country
            locationData.address = address.formatted
          } catch (error) {
            console.warn('Failed to get address from coordinates:', error)
          }

          this.currentLocation = locationData
          resolve(locationData)
        },
        (error) => {
          let errorMessage = 'Unknown location error'
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable'
              break
            case error.TIMEOUT:
              errorMessage = 'Location request timed out'
              break
          }

          reject({
            code: error.code,
            message: errorMessage
          } as LocationError)
        },
        defaultOptions
      )
    })
  }

  /**
   * Watch location changes
   */
  watchLocation(
    onSuccess: (location: LocationData) => void,
    onError: (error: LocationError) => void,
    options?: PositionOptions
  ): number | null {
    if (!navigator.geolocation) {
      onError({
        code: 0,
        message: 'Geolocation is not supported by this browser'
      })
      return null
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // 1 minute
      ...options
    }

    return navigator.geolocation.watchPosition(
      async (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        }

        // Try to get address from coordinates
        try {
          const address = await this.reverseGeocode(
            locationData.latitude,
            locationData.longitude
          )
          locationData.city = address.city
          locationData.country = address.country
          locationData.address = address.formatted
        } catch (error) {
          console.warn('Failed to get address from coordinates:', error)
        }

        this.currentLocation = locationData
        onSuccess(locationData)
      },
      (error) => {
        let errorMessage = 'Unknown location error'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
        }

        onError({
          code: error.code,
          message: errorMessage
        })
      },
      defaultOptions
    )
  }

  /**
   * Stop watching location
   */
  clearWatch(watchId: number): void {
    if (navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId)
    }
  }

  /**
   * Reverse geocoding - convert coordinates to address
   * Using a free geocoding service (you can replace with your preferred service)
   */
  private async reverseGeocode(lat: number, lng: number): Promise<{
    city?: string
    country?: string
    formatted: string
  }> {
    try {
      // Using OpenStreetMap Nominatim (free service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Vibely-App/1.0'
          }
        }
      )

      if (!response.ok) {
        throw new Error('Geocoding service unavailable')
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      const address = data.address || {}
      const city = address.city || address.town || address.village || address.county
      const country = address.country
      const formatted = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`

      return {
        city,
        country,
        formatted
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error)
      // Return coordinates as fallback
      return {
        formatted: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      }
    }
  }

  /**
   * Get cached location
   */
  getCachedLocation(): LocationData | null {
    return this.currentLocation
  }

  /**
   * Check if geolocation is supported
   */
  isSupported(): boolean {
    return 'geolocation' in navigator
  }

  /**
   * Request location permission
   */
  async requestPermission(): Promise<PermissionState> {
    if (!navigator.permissions) {
      throw new Error('Permissions API not supported')
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' })
      return permission.state
    } catch (error) {
      console.error('Failed to check location permission:', error)
      throw error
    }
  }

  /**
   * Format location for display
   */
  formatLocation(location: LocationData): string {
    if (location.address) {
      return location.address
    }
    
    if (location.city && location.country) {
      return `${location.city}, ${location.country}`
    }
    
    if (location.city) {
      return location.city
    }
    
    return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
  }
}

export const locationService = LocationService.getInstance()
export default locationService