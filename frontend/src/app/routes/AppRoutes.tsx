import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthGuard } from '@/features/auth'
import { PageSkeleton } from '@/components/ui/Skeleton'
import { ErrorBoundary } from '@/core/components/ErrorBoundary'

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })))
const SignupPage = lazy(() => import('@/pages/SignupPage').then(m => ({ default: m.SignupPage })))
const HomePageComponent = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })))
const FeedPage = lazy(() => import('@/pages/FeedPage').then(m => ({ default: m.FeedPage })))
const DesignSystemDemo = lazy(() => import('./DesignSystemDemo').then(m => ({ default: m.DesignSystemDemo })))
const VibeSyncDemo = lazy(() => import('@/components/shared/VibeSyncDemo').then(m => ({ default: m.VibeSyncDemo })))
const CreatePostDemo = lazy(() => import('@/components/shared/CreatePostDemo').then(m => ({ default: m.CreatePostDemo })))
const ProfileDemo = lazy(() => import('@/components/shared/ProfileDemo').then(m => ({ default: m.ProfileDemo })))
const AuthDemo = lazy(() => import('@/components/shared/AuthDemo').then(m => ({ default: m.AuthDemo })))

// Protected components - require authentication
const HomePage = () => (
  <AuthGuard>
    <Suspense fallback={<PageSkeleton />}>
      <HomePageComponent />
    </Suspense>
  </AuthGuard>
)

// Simple feed page fallback
const FeedPageComponent = () => (
  <AuthGuard>
    <Suspense fallback={<PageSkeleton />}>
      <FeedPage />
    </Suspense>
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
        <Route path="/feed" element={<FeedPageComponent />} />
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