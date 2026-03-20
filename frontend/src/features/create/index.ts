/**
 * Create Feature - Vibely Post Creation System
 * Premium post creation with real-time vibe sync
 */

// Components
export { CreatePostModal, CompactCreatePostModal } from './components/CreatePostModal'
export { CreatePostInput, CreatePostInputWithIndicators } from './components/CreatePostInput'
export { MediaPreview } from './components/MediaPreview'
export { PostToolbar, CompactPostToolbar, ExtendedPostToolbar } from './components/PostToolbar'

// Hooks
export { usePostComposer, useTypingIndicator, useAutoSave } from './hooks/usePostComposer'
export { useCreatePost, usePostCreationAnalytics } from './hooks/useCreatePost'

// Types
export type {
  MediaFile,
  PostDraft,
  CreatePostRequest,
  CreatePostResponse,
  CreatePostError,
  CreateModalState,
  PostValidation,
  MediaUploadProgress,
  ComposerState,
  PostCreationAnalytics,
} from './types/create.types'

// Services
export { createPost, mockCreatePostResponse } from './services/create.api'