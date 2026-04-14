"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/AuthContext'
import { useLocation } from '@/hooks/useLocation'
import { locationService } from '@/lib/locationService'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

// Icons for alerts and location
const AlertCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const CheckCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
)

const MapPin = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const Phone = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  phone?: string
  location?: string
  general?: string
}

export default function SignUpPage() {
  const { signup, user, isLoading, error, clearError } = useAuth()
  const { location, loading: locationLoading, error: locationError, requestLocation } = useLocation()
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    location: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [locationRequested, setLocationRequested] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/hero')
    }
  }, [user, router])

  // Update location in form when location is detected
  useEffect(() => {
    if (location && !formData.location) {
      const locationString = locationService.formatLocation(location)
      setFormData(prev => ({
        ...prev,
        location: locationString
      }))
    }
  }, [location, formData.location])

  // Auto-request location on component mount
  useEffect(() => {
    if (!locationRequested) {
      setLocationRequested(true)
      requestLocation().catch(() => {
        // Silently handle location request failure
        console.log('Location request failed or denied')
      })
    }
  }, [locationRequested, requestLocation])

  // Clear errors when component mounts or form data changes
  useEffect(() => {
    clearError()
    setFormErrors({})
    setSuccessMessage('')
  }, [formData, clearError])

  // Client-side validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    // First name validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required'
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters long'
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName.trim())) {
      errors.firstName = 'First name can only contain letters and spaces'
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required'
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters long'
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName.trim())) {
      errors.lastName = 'Last name can only contain letters and spaces'
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password.trim()) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long'
    }

    // Phone validation (optional but if provided, must be valid)
    if (formData.phone.trim()) {
      const phoneRegex = /^\+?[\d\s\-\(\)]+$/
      if (!phoneRegex.test(formData.phone.trim())) {
        errors.phone = 'Please enter a valid phone number'
      } else if (formData.phone.trim().length < 10) {
        errors.phone = 'Phone number must be at least 10 digits'
      }
    }

    // Location validation (optional)
    if (formData.location.trim() && formData.location.trim().length > 100) {
      errors.location = 'Location cannot exceed 100 characters'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Signup form submission started')
    setIsSubmitting(true)
    setSuccessMessage('')

    // Client-side validation
    if (!validateForm()) {
      console.log('Signup form validation failed')
      setIsSubmitting(false)
      return
    }

    try {
      console.log('Form submission started with data:', {
        ...formData,
        password: '[HIDDEN]'
      });
      
      const success = await signup(
        formData.email, 
        formData.password, 
        formData.firstName, 
        formData.lastName,
        formData.phone || undefined,
        formData.location || undefined,
        location ? { latitude: location.latitude, longitude: location.longitude } : undefined
      )
      console.log('Signup function returned:', success)
      
      if (success) {
        setSuccessMessage('Account created successfully! Redirecting...')
        console.log('Signup successful, redirecting to hero page');
        // Immediate redirect without delay for better UX
        router.push('/hero')
      } else {
        console.log('Signup failed, success was false')
      }
      // Error handling is now done in the AuthContext
    } catch (err) {
      console.error('Signup error in component:', err)
      setFormErrors({ general: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear specific field error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <section className="flex min-h-screen bg-zinc-50 px-3 sm:px-4 py-8 sm:py-16 md:py-32 dark:bg-transparent">
      <form
        onSubmit={handleSubmit}
        className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="p-4 sm:p-8 pb-4 sm:pb-6">
          <div>
            <Link
              href="/"
              aria-label="go home"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold text-sm sm:text-base">
                V
              </div>
            </Link>
            <h1 className="text-title mb-1 mt-3 sm:mt-4 text-lg sm:text-xl font-semibold">Create a Vibely Account</h1>
            <p className="text-xs sm:text-sm">Welcome! Create an account to get started</p>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex items-center justify-center gap-2"
              disabled={isSubmitting}
              onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="0.98em"
                height="1em"
                viewBox="0 0 256 262"
              >
                <path
                  fill="#4285f4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                ></path>
                <path
                  fill="#34a853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                ></path>
                <path
                  fill="#fbbc05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                ></path>
                <path
                  fill="#eb4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                ></path>
              </svg>
              <span>Google</span>
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="flex items-center justify-center gap-2"
              disabled={isSubmitting}
              onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/microsoft`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 256 256"
              >
                <path fill="#f1511b" d="M121.666 121.666H0V0h121.666z"></path>
                <path fill="#80cc28" d="M256 121.666H134.335V0H256z"></path>
                <path fill="#00adef" d="M121.663 256.002H0V134.336h121.663z"></path>
                <path fill="#fbbc09" d="M256 256.002H134.335V134.336H256z"></path>
              </svg>
              <span>Microsoft</span>
            </Button>
          </div>
          
          <hr className="my-4 border-dashed" />
          
          {/* Success Message */}
          {successMessage && (
            <Alert variant="success" className="mb-4">
              <CheckCircle />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          
          {/* General Error Message */}
          {(error || formErrors.general) && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle />
              <AlertDescription>
                {error || formErrors.general}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label
                  htmlFor="firstname"
                  className="block text-sm"
                >
                  First Name
                </Label>
                <Input
                  type="text"
                  required
                  name="firstName"
                  id="firstname"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={formErrors.firstName ? 'border-red-500 focus:border-red-500' : ''}
                />
                {formErrors.firstName && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastname"
                  className="block text-sm"
                >
                  Last Name
                </Label>
                <Input
                  type="text"
                  required
                  name="lastName"
                  id="lastname"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={formErrors.lastName ? 'border-red-500 focus:border-red-500' : ''}
                />
                {formErrors.lastName && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.lastName}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="block text-sm"
              >
                Email
              </Label>
              <Input
                type="email"
                required
                name="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className={formErrors.email ? 'border-red-500 focus:border-red-500' : ''}
              />
              {formErrors.email && (
                <p className="text-sm text-red-600 mt-1">{formErrors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label
                htmlFor="pwd"
                className="text-title text-sm"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  name="password"
                  id="pwd"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  minLength={6}
                  className={formErrors.password ? 'border-red-500 focus:border-red-500 pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-sm text-red-600 mt-1">{formErrors.password}</p>
              )}
              {!formErrors.password && (
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="block text-sm"
              >
                Phone Number (Optional)
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <Input
                  type="tel"
                  name="phone"
                  id="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`pl-10 ${formErrors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
                />
              </div>
              {formErrors.phone && (
                <p className="text-sm text-red-600 mt-1">{formErrors.phone}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Optional: Add your phone number for better account security
              </p>
            </div>
            
            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="block text-sm"
              >
                Location (Optional)
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <Input
                  type="text"
                  name="location"
                  id="location"
                  placeholder={locationLoading ? "Detecting location..." : "Enter your location"}
                  value={formData.location}
                  onChange={handleChange}
                  disabled={isSubmitting || locationLoading}
                  className={`pl-10 pr-10 ${formErrors.location ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={requestLocation}
                  disabled={locationLoading || isSubmitting}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  title="Use current location"
                >
                  {locationLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {formErrors.location && (
                <p className="text-sm text-red-600 mt-1">{formErrors.location}</p>
              )}
              {locationError && (
                <p className="text-sm text-orange-600 mt-1">
                  Location access denied. You can enter your location manually.
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Optional: Help others find you by sharing your location
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </div>
        </div>
        
        <div className="bg-muted rounded-[var(--radius)] border p-3">
          <p className="text-accent-foreground text-center text-sm">
            Already have an account?
            <Button
              asChild
              variant="link"
              className="px-2"
            >
              <Link href="/signin">Sign In</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  )
}