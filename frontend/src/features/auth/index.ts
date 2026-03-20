/**
 * Auth Feature - Vibely Authentication System
 * Secure authentication with premium UX
 */

// Components
export { LoginForm } from './components/LoginForm'
export { SignupForm } from './components/SignupForm'
export { 
  AuthLayout, 
  CompactAuthLayout, 
  AuthError, 
  AuthSuccess, 
  AuthSpinner 
} from './components/AuthLayout'
export { 
  AuthGuard, 
  GuestGuard, 
  RoleGuard, 
  AdminGuard, 
  ModeratorGuard,
  withAuthGuard,
  withGuestGuard
} from './components/AuthGuard'

// Hooks
export { 
  useAuth, 
  useAuthValidation, 
  useTokenManager, 
  useAuthPersistence 
} from './hooks/useAuth'
export { usePermissions } from './components/AuthGuard'

// Store
export { 
  useAuthStore,
  useAuthUser,
  useAuthTokens,
  useIsAuthenticated,
  useAuthLoading,
  useAuthError,
  useAuthActions,
  useUserRole,
  useIsAdmin,
  useUserPreferences,
  getAuthToken,
  isTokenExpired,
  getTokenExpiryTime,
  getCurrentUser,
  checkAuthState,
  debugAuthState
} from './store/auth.store'

// Services
export {
  loginUser,
  signupUser,
  logoutUser,
  refreshTokens,
  getCurrentUser as fetchCurrentUser,
  forgotPassword,
  resetPassword,
  oauthLogin,
  getUserSessions,
  revokeSession,
  mockAuthResponse,
  loginUserDev,
  signupUserDev,
  logoutUserDev,
  handleAuthError
} from './services/auth.api'

// Types
export type {
  User,
  AuthTokens,
  LoginRequest,
  SignupRequest,
  AuthResponse,
  AuthError as AuthErrorType,
  AuthState,
  AuthActions,
  ValidationError,
  FormState,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  OAuthProvider,
  OAuthResponse,
  SessionInfo,
  SecuritySettings,
  AuthContextValue,
  ProtectedRouteProps,
  AuthLayoutProps
} from './types/auth.types'