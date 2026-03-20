// UI Components - Vibely Design System
// Centralized exports for all UI components

export { Avatar, AvatarGroup } from './Avatar'
export type { AvatarProps, AvatarGroupProps } from './Avatar'

export { Button } from './Button'
export type { ButtonProps } from './Button'

export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from './Card'
export type { CardProps } from './Card'

export { Input } from './Input'
export type { InputProps } from './Input'

export { Textarea } from './Textarea'
export type { TextareaProps } from './Textarea'

export { Skeleton, PageSkeleton, FeedCardSkeleton } from './Skeleton'

// Re-export skeleton components with different names for compatibility
export { PageSkeleton as SkeletonCard, FeedCardSkeleton as SkeletonPost } from './Skeleton'