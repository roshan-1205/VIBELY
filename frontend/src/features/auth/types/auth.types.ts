/**
 * Auth Types - Vibely Authentication System
 * Secure authentication with premium UX
 */

export interface User {
  id: string
  username: string
  email: string
  name: string
  avatar?: string
  bio?: string
  is_verified: boolean
  is_active: boolean
  created_at: string
  last_login?: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  name?: string
}

export interface AuthResponse {
  user: User
  access_token: string
  refresh_token: string
  token_type: string
}

export interface AuthError {
  code?: string
  message: string
  field?: string
  details?: any
}

// Auth state interface
export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Auth store actions
export interface AuthActions {
  login: (user: User, accessToken: string, refreshToken: string) => void
  logout: () => void
  refreshToken: () => Promise<void>
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

// Form validation types
export interface ValidationError {
  field: string
  message: string
}

export interface FormState {
  isValid: boolean
  errors: ValidationError[]
  touched: Record<string, boolean>
}

// Route protection types
export interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireRole?: string[]
  fallback?: React.ReactNode
}

// Auth layout types
export interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  showBackButton?: boolean
  onBack?: () => void
}