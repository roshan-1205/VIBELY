import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthGuard } from '@/features/auth'
import { PageSkeleton } from '@/components/ui/Skeleton'
import { ErrorBoundary } from '@/core/components/ErrorBoundary'

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })))
const SignupPage = lazy(() => import('@/pages/SignupPage').then(m => ({ default: m.SignupPage })))
const DesignSystemDemo = lazy(() => import('./DesignSystemDemo').then(m => ({ default: m.DesignSystemDemo })))
const VibeSyncDemo = lazy(() => import('@/components/shared/VibeSyncDemo').then(m => ({ default: m.VibeSyncDemo })))
const CreatePostDemo = lazy(() => import('@/components/shared/CreatePostDemo').then(m => ({ default: m.CreatePostDemo })))
const ProfileDemo = lazy(() => import('@/components/shared/ProfileDemo').then(m => ({ default: m.ProfileDemo })))
const AuthDemo = lazy(() => import('@/components/shared/AuthDemo').then(m => ({ default: m.AuthDemo })))

// Protected components - require authentication
const HomePage = () => (
  <AuthGuard>
    <div className="glass-card">
      <h1 className="text-3xl font-bold text-gradient bg-gradient-to-r from-accent-600 to-purple-600 bg-clip-text text-transparent">
        Welcome to Vibely
      </h1>
      <p className="text-slate-600 mt-4">
        Your premium social media experience with AI-powered vibe analysis.
      </p>
    </div>
  </AuthGuard>
)

// Simple feed page fallback
const FeedPage = () => (
  <AuthGuard>
    <div className="glass-card">
      <h2 className="text-2xl font-semibold mb-4">Feed</h2>
      <p className="text-slate-600">Infinite scroll feed coming soon...</p>
    </div>
  </AuthGuard>
)

const ProfilePage = () => (
  <AuthGuard>
    <Suspense fallback={<PageSkeleton />}>
      <ProfileDemo />
    </Suspense>
  </AuthGuard>
)

const CreatePage = () => (
  <AuthGuard>
    <Suspense fallback={<PageSkeleton />}>
      <CreatePostDemo />
    </Suspense>
  </AuthGuard>
)

export function AppRoutes() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <Suspense fallback={<PageSkeleton />}>
            <LoginPage />
          </Suspense>
        } />
        <Route path="/signup" element={
          <Suspense fallback={<PageSkeleton />}>
            <SignupPage />
          </Suspense>
        } />
        
        {/* Protected Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/create" element={<CreatePage />} />
        
        {/* Demo Routes (public for now) */}
        <Route path="/auth-demo" element={
          <Suspense fallback={<PageSkeleton />}>
            <AuthDemo />
          </Suspense>
        } />
        <Route path="/design-system" element={
          <Suspense fallback={<PageSkeleton />}>
            <DesignSystemDemo />
          </Suspense>
        } />
        <Route path="/vibe-sync" element={
          <Suspense fallback={<PageSkeleton />}>
            <VibeSyncDemo />
          </Suspense>
        } />
      </Routes>
    </ErrorBoundary>
  )
}