'use client'

import React from 'react';
import { ChevronLeft, ChevronRight, Heart, MessageSquare, Share2, MoreHorizontal, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProfileAvatar } from '@/components/ui/profile-avatar';
import { cn } from '@/lib/utils';
import { type Post } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES ---
interface PostsCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  posts: Post[];
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  title?: React.ReactNode;
  subtitle?: string;
}

// --- POSTS CAROUSEL COMPONENT ---
export const PostsCarousel = React.forwardRef<HTMLDivElement, PostsCarouselProps>(
  ({ posts, onLike, onComment, onShare, title, subtitle, className, ...props }, ref) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isPlaying, setIsPlaying] = React.useState<{ [key: string]: boolean }>({});

    const handleNext = React.useCallback(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
    }, [posts.length]);

    const handlePrev = () => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length);
    };

    const toggleVideoPlay = (postId: string, videoElement: HTMLVideoElement) => {
      if (isPlaying[postId]) {
        videoElement.pause();
        setIsPlaying(prev => ({ ...prev, [postId]: false }));
      } else {
        videoElement.play();
        setIsPlaying(prev => ({ ...prev, [postId]: true }));
      }
    };

    const formatTimeAgo = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
      return date.toLocaleDateString();
    };

    const renderPostContent = (post: Post) => {
      const hasMedia = (post.images && post.images.length > 0) || (post.videos && post.videos.length > 0);
      
      return (
        <Card className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 shadow-2xl border-0 overflow-hidden">
          {/* Post Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ProfileAvatar
                  userId={post.author._id}
                  firstName={post.author.firstName}
                  lastName={post.author.lastName}
                  size="sm"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {post.author.firstName} {post.author.lastName}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimeAgo(post.createdAt)}
                    {post.location && (
                      <span className="ml-2">📍 {post.location}</span>
                    )}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Post Content */}
          <div className="relative">
            {/* Text Content */}
            {post.content && (
              <div className="p-4">
                {post.postType === 'quote' ? (
                  <blockquote className="border-l-4 border-primary pl-4 italic text-gray-700 dark:text-gray-300">
                    "{post.content}"
                    {post.quoteAuthor && (
                      <footer className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        — {post.quoteAuthor}
                      </footer>
                    )}
                  </blockquote>
                ) : (
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                    {post.content}
                  </p>
                )}
                
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Media Content */}
            {hasMedia && (
              <div className="relative">
                {/* Images */}
                {post.images && post.images.length > 0 && (
                  <div className="aspect-square relative">
                    <img
                      src={post.images[0].url}
                      alt={post.images[0].alt || 'Post image'}
                      className="w-full h-full object-cover"
                    />
                    {post.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                        +{post.images.length - 1}
                      </div>
                    )}
                  </div>
                )}

                {/* Videos */}
                {post.videos && post.videos.length > 0 && (
                  <div className="aspect-square relative">
                    <video
                      className="w-full h-full object-cover"
                      poster={post.videos[0].thumbnail}
                      onPlay={() => setIsPlaying(prev => ({ ...prev, [post._id]: true }))}
                      onPause={() => setIsPlaying(prev => ({ ...prev, [post._id]: false }))}
                    >
                      <source src={post.videos[0].url} type="video/mp4" />
                    </video>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute inset-0 w-full h-full bg-black/20 hover:bg-black/30 text-white"
                      onClick={(e) => {
                        const video = e.currentTarget.previousElementSibling as HTMLVideoElement;
                        toggleVideoPlay(post._id, video);
                      }}
                    >
                      {isPlaying[post._id] ? (
                        <Pause className="w-8 h-8" />
                      ) : (
                        <Play className="w-8 h-8" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Post Actions */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLike?.(post._id)}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500"
                >
                  <Heart className={cn("w-4 h-4", post.isLikedBy && "fill-red-500 text-red-500")} />
                  <span className="text-sm">{post.likeCount}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onComment?.(post._id)}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">{post.commentCount}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onShare?.(post._id)}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-500"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">{post.shareCount || 0}</span>
                </Button>
              </div>
              
              {post.views > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {post.views} views
                </span>
              )}
            </div>

            {/* Recent Comments Preview */}
            {post.comments && post.comments.length > 0 && (
              <div className="space-y-2">
                {post.comments.slice(0, 2).map((comment) => (
                  <div key={comment._id} className="flex items-start gap-2">
                    <ProfileAvatar
                      userId={comment.user._id}
                      firstName={comment.user.firstName}
                      lastName={comment.user.lastName}
                      size="xs"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {comment.user.firstName}
                        </span>{' '}
                        <span className="text-gray-700 dark:text-gray-300">
                          {comment.content}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
                {post.commentCount > 2 && (
                  <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                    View all {post.commentCount} comments
                  </button>
                )}
              </div>
            )}
          </div>
        </Card>
      );
    };

    if (!posts || posts.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-[400px] text-gray-500 dark:text-gray-400">
          <p>No posts to display</p>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative w-full min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4',
          className
        )}
        {...props}
      >
        {/* Header Section */}
        {(title || subtitle) && (
          <div className="z-10 text-center space-y-4 mb-8">
            {title && (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter max-w-4xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="max-w-2xl mx-auto text-muted-foreground md:text-lg">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Posts Carousel */}
        <div className="relative w-full max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full"
            >
              {renderPostContent(posts[currentIndex])}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          {posts.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 z-20 bg-background/80 backdrop-blur-sm shadow-lg"
                onClick={handlePrev}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 z-20 bg-background/80 backdrop-blur-sm shadow-lg"
                onClick={handleNext}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Post Indicators */}
          {posts.length > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {posts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-200",
                    index === currentIndex
                      ? "bg-primary w-6"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Post Counter */}
        {posts.length > 1 && (
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {currentIndex + 1} of {posts.length} posts
          </div>
        )}
      </div>
    );
  }
);

PostsCarousel.displayName = 'PostsCarousel';