/**
 * Auth Types - Vibely Authentication System
 * Secure authentication with premium UX
 */

export interface User {
  id: string
  name: string
  email: string
  username?: string
  avatar?: string
  role: 'user' | 'admin' | 'moderator'
  isVerified: boolean
  createdAt: string
  updatedAt: string
  preferences?: {
    theme: 'light' | 'dark' | 'system'
    notifications: boolean
    privacy: 'public' | 'private'
  }
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignupRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export interface AuthResponse {
  success: boolean
  user: User
  tokens: AuthTokens
  message?: string
}

export interface AuthError {
  code: string
  message: string
  field?: string
  details?: any
}

// Auth state interface
export interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  error: AuthError | null
}

// Auth store actions
export interface AuthActions {
  setAuth: (user: User, tokens: AuthTokens) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
  setError: (error: AuthError | null) => void
  updateUser: (updates: Partial<User>) => void
  refreshTokens: (tokens: AuthTokens) => void
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

// Password reset types
export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

// OAuth types
export interface OAuthProvider {
  id: 'google' | 'github' | 'apple'
  name: string
  icon: string
  color: string
}

export interface OAuthResponse {
  success: boolean
  user: User
  tokens: AuthTokens
  isNewUser: boolean
}

// Session management
export interface SessionInfo {
  id: string
  deviceName: string
  browser: string
  os: string
  location: string
  lastActive: string
  isCurrent: boolean
}

// Security types
export interface SecuritySettings {
  twoFactorEnabled: boolean
  backupCodes: string[]
  trustedDevices: string[]
  loginNotifications: boolean
}

// Auth context types
export interface AuthContextValue extends AuthState, AuthActions {
  login: (credentials: LoginRequest) => Promise<void>
  signup: (data: SignupRequest) => Promise<void>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
}

// Route protection types
export interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireRole?: User['role'][]
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