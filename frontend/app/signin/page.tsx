"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

// Icons for alerts
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

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

export default function SignInPage() {
  const { login, user, isLoading, error, clearError } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/hero')
    }
  }, [user, router])

  // Clear errors when component mounts or form data changes
  useEffect(() => {
    clearError()
    setFormErrors({})
    setSuccessMessage('')
  }, [formData, clearError])

  // Client-side validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {}

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

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submission started')
    setIsSubmitting(true)
    setSuccessMessage('')

    // Client-side validation
    if (!validateForm()) {
      console.log('Form validation failed')
      setIsSubmitting(false)
      return
    }

    try {
      console.log('Login form submission started with data:', {
        ...formData,
        password: '[HIDDEN]'
      });
      
      const success = await login(formData.email, formData.password)
      console.log('Login function returned:', success)
      
      if (success) {
        setSuccessMessage('Login successful! Redirecting...')
        console.log('Login successful, redirecting to hero page');
        // Immediate redirect without delay for better UX
        router.push('/hero')
      } else {
        console.log('Login failed, success was false')
      }
      // Error handling is now done in the AuthContext
    } catch (err) {
      console.error('Login error in component:', err)
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
            <h1 className="text-title mb-1 mt-3 sm:mt-4 text-lg sm:text-xl font-semibold">Sign In to Vibely</h1>
            <p className="text-xs sm:text-sm">Welcome back! Please sign in to your account</p>
          </div>
          
          <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-3"
              disabled={isSubmitting}
              onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="0.98em"
                height="1em"
                viewBox="0 0 256 262"
                className="w-3 h-3 sm:w-4 sm:h-4"
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
              className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-3"
              disabled={isSubmitting}
              onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/microsoft`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 256 256"
                className="w-3 h-3 sm:w-4 sm:h-4"
              >
                <path fill="#f1511b" d="M121.666 121.666H0V0h121.666z"></path>
                <path fill="#80cc28" d="M256 121.666H134.335V0H256z"></path>
                <path fill="#00adef" d="M121.663 256.002H0V134.336h121.663z"></path>
                <path fill="#fbbc09" d="M256 256.002H134.335V134.336H256z"></path>
              </svg>
              <span>Microsoft</span>
            </Button>
          </div>
          
          <hr className="my-3 sm:my-4 border-dashed" />
          
          {/* Success Message */}
          {successMessage && (
            <Alert variant="success" className="mb-3 sm:mb-4">
              <CheckCircle />
              <AlertDescription className="text-xs sm:text-sm">{successMessage}</AlertDescription>
            </Alert>
          )}
          
          {/* General Error Message */}
          {(error || formErrors.general) && (
            <Alert variant="destructive" className="mb-3 sm:mb-4">
              <AlertCircle />
              <AlertDescription className="text-xs sm:text-sm">
                {error || formErrors.general}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-3 sm:space-y-5">
            <div className="space-y-1 sm:space-y-2">
              <Label
                htmlFor="email"
                className="block text-xs sm:text-sm"
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
                className={`text-sm ${formErrors.email ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {formErrors.email && (
                <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>
              )}
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <Label
                htmlFor="password"
                className="text-title text-xs sm:text-sm"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  minLength={6}
                  className={`text-sm ${formErrors.password ? 'border-red-500 focus:border-red-500 pr-10' : 'pr-10'}`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="sm:w-4 sm:h-4"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="sm:w-4 sm:h-4"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-xs text-red-600 mt-1">{formErrors.password}</p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded border-gray-300 w-3 h-3 sm:w-4 sm:h-4"
                />
                <Label htmlFor="remember" className="text-xs sm:text-sm">
                  Remember me
                </Label>
              </div>
              <Link href="/forgot-password" className="text-xs sm:text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            
            <Button 
              type="submit" 
              className="w-full text-sm" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </div>
        </div>
        
        <div className="bg-muted rounded-[var(--radius)] border p-2 sm:p-3">
          <p className="text-accent-foreground text-center text-xs sm:text-sm">
            Don't have an account?
            <Button
              asChild
              variant="link"
              className="px-1 sm:px-2 text-xs sm:text-sm"
            >
              <Link href="/signup">Sign Up</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  )
}