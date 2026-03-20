/**
 * Auth Feature - Vibely Authentication System
 * Secure authentication with premium UX
 */

// Components
export {
  AuthGuard,
  GuestGuard,
  RoleGuard,
  AdminGuard,
  ModeratorGuard,
  withAuthGuard,
  withGuestGuard,
  usePermissions
} from './components/AuthGuard'

export {
  LoginForm
} from './components/LoginForm'

export {
  SignupForm
} from './components/SignupForm'

export {
  AuthLayout
} from './components/AuthLayout'

// Hooks
export { 
  useAuth, 
  useAuthValidation
} from './hooks/useAuth'

// Re-export core auth hooks for convenience
export {
  useUser as useAuthUser,
  useIsAuthenticated,
  useAuthLoading,
  useAuthError,
  useAuthActions
} from '@/core/store/auth.store'

// Store
export { 
  useAuthStore
} from './store/auth.store'

// Services
export {
  authAPI
} from './services/auth.api'

// Types
export type {
  User,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  AuthError,
  AuthState,
  AuthActions,
  ValidationError,
  FormState,
  ProtectedRouteProps,
  AuthLayoutProps
} from './types/auth.types'