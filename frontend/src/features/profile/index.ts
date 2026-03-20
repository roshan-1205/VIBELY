/**
 * Profile Feature - Vibely Profile System
 * Premium social media profile with Instagram/Threads/Linear quality
 */

// Main Components
export { ProfilePage, CompactProfile } from './components/ProfilePage'
export { ProfileHeader } from './components/ProfileHeader'
export { ProfileStats, CompactProfileStats, AnimatedStatCounter, ProfileStatsWithGrowth } from './components/ProfileStats'
export { ProfileTabs, CompactProfileTabs, VerticalProfileTabs, TabContent } from './components/ProfileTabs'
export { ProfilePosts } from './components/ProfilePosts'

// Loading & Error States
export { 
  ProfileSkeleton, 
  ProfileHeaderSkeleton, 
  ProfileStatsSkeleton, 
  ProfileTabsSkeleton, 
  ProfilePostsSkeleton,
  ShimmerEffect,
  SkeletonBox,
  AvatarSkeleton,
  CardSkeleton
} from './components/ProfileSkeleton'

export { 
  ProfileError, 
  CompactProfileError, 
  InlineProfileError, 
  NetworkError 
} from './components/ProfileError'

// Hooks
export { 
  useProfile, 
  useProfileAnalytics, 
  useProfileState, 
  useProfileInteractions,
  profileQueryKeys 
} from './hooks/useProfile'

export { 
  useProfilePosts, 
  useProfilePostInteractions, 
  useProfilePostsFilter 
} from './hooks/useProfilePosts'

// Types
export type {
  User,
  ProfileStats,
  ProfileData,
  ProfilePost,
  ProfilePostsResponse,
  ProfileTab,
  ProfileError as ProfileErrorType,
  ProfileViewMode,
  ProfileTabType,
  FollowAction,
  ProfileAnalytics,
  ProfileSettings,
  ProfileEditData,
  VirtualizedPostItem,
  ProfileState,
} from './types/profile.types'

// Services
export {
  fetchProfile,
  fetchProfilePosts,
  toggleFollow,
  updateProfile,
  fetchProfileAnalytics,
  calculateAverageVibeScore,
  mockProfileData,
  mockProfilePosts,
  fetchProfileDev,
  fetchProfilePostsDev,
} from './services/profile.api'