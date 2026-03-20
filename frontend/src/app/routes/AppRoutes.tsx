import { Routes, Route } from 'react-router-dom'
import { DesignSystemDemo } from './DesignSystemDemo'
import { VibeSyncDemo } from '@/components/shared/VibeSyncDemo'
import { CreatePostDemo } from '@/components/shared/CreatePostDemo'
import { ProfileDemo } from '@/components/shared/ProfileDemo'

// Placeholder components - will be implemented in features
const HomePage = () => (
  <div className="glass-card">
    <h1 className="text-3xl font-bold text-gradient bg-gradient-to-r from-accent-600 to-purple-600 bg-clip-text text-transparent">
      Welcome to Vibely
    </h1>
    <p className="text-slate-600 mt-4">
      Your premium social media experience with AI-powered vibe analysis.
    </p>
  </div>
)

const FeedPage = () => (
  <div className="glass-card">
    <h2 className="text-2xl font-semibold mb-4">Feed</h2>
    <p className="text-slate-600">Infinite scroll feed coming soon...</p>
  </div>
)

const ProfilePage = () => <ProfileDemo />

const CreatePage = () => <CreatePostDemo />

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/feed" element={<FeedPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/create" element={<CreatePage />} />
      <Route path="/design-system" element={<DesignSystemDemo />} />
      <Route path="/vibe-sync" element={<VibeSyncDemo />} />
    </Routes>
  )
}