/**
 * Feed Feature - Vibely Social Media Feed
 * Production-ready feed system exports
 */

// Components
export { FeedList, FeedListWithHeader, CompactFeedList } from './components/FeedList'
export { FeedCard } from './components/FeedCard'
export { FeedSkeleton, InlineSkeleton, AvatarSkeleton, MediaSkeleton } from './components/FeedSkeleton'
export { 
  FeedError, 
  InlineError, 
  NetworkError, 
  EmptyFeed 
} from './components/FeedError'

// Hooks
export { useFeed, useFeedRefresh, useFeedPreload, feedQueryKeys } from './hooks/useFeed'
export { useFeedActions } from './hooks/useFeedActions'

// Services
export { 
  fetchFeed, 
  togglePostLike, 
  addComment, 
  sharePost, 
  trackPostView,
  mockFeedData 
} from './services/feed.api'

// Types
export type {
  Post,
  User,
  PostMedia,
  PostStats,
  FeedResponse,
  FeedParams,
  LikeResponse,
  CommentResponse,
  OptimisticLike,
  OptimisticComment,
  FeedState,
  FeedError as FeedErrorType,
  PostInteraction,
} from './types/feed.types'