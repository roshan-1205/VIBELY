'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageSquare, Share2, MoreHorizontal } from 'lucide-react'
import { apiService, type Post } from '@/services/api'
import { useSocket } from '@/contexts/SocketContext'
import { ProfileAvatar } from './profile-avatar'
import { Button } from './button'
import { Card } from './card'
import { Input } from './input'
import Link from 'next/link'

interface PostsFeedProps {
  userId?: string // If provided, shows posts from specific user
  className?: string
}

export const PostsFeed = ({ userId, className = '' }: PostsFeedProps) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newPostContent, setNewPostContent] = useState('')
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const { onNewPost, onPostUpdate, isConnected } = useSocket()

  useEffect(() => {
    loadPosts()
  }, [userId])

  // Set up real-time event listeners
  useEffect(() => {
    if (!userId) { // Only listen for new posts on main feed, not user-specific feeds
      const unsubscribeNewPost = onNewPost((newPost: Post) => {
        setPosts(prevPosts => [newPost, ...prevPosts])
      })

      const unsubscribePostUpdate = onPostUpdate((data: { postId: string; update: any }) => {
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === data.postId 
              ? { ...post, ...data.update }
              : post
          )
        )
      })

      return () => {
        unsubscribeNewPost?.()
        unsubscribePostUpdate?.()
      }
    }
  }, [userId, onNewPost, onPostUpdate])

  const loadPosts = async () => {
    try {
      setIsLoading(true)
      const response = userId 
        ? await apiService.getUserPosts(userId)
        : await apiService.getPosts()
      
      if (response.success && response.data) {
        setPosts(response.data.posts)
      }
    } catch (error) {
      console.error('Error loading posts:', error)
      // Show demo posts if API fails
      setPosts([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return

    try {
      setIsCreatingPost(true)
      const response = await apiService.createPost({
        content: newPostContent.trim()
      })

      if (response.success && response.data) {
        setPosts([response.data.post, ...posts])
        setNewPostContent('')
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsCreatingPost(false)
    }
  }

  const handleLikePost = async (postId: string) => {
    try {
      const response = await apiService.likePost(postId)
      if (response.success && response.data) {
        setPosts(posts.map(post => 
          post._id === postId 
            ? { ...response.data.post, isLikedBy: response.data.isLiked }
            : post
        ))
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const postDate = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Connection Status */}
      {!userId && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Live updates active' : 'Connecting...'}
            </span>
          </div>
        </div>
      )}

      {/* Create Post (only show if not viewing specific user) */}
      {!userId && (
        <Card className="p-6">
          <div className="space-y-4">
            <Input
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="border-0 bg-gray-50 text-lg"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleCreatePost}
                disabled={!newPostContent.trim() || isCreatingPost}
              >
                {isCreatingPost ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Posts */}
      {posts.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <MessageSquare className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-500">
            {userId ? 'This user hasn\'t posted anything yet.' : 'Be the first to share something!'}
          </p>
        </Card>
      ) : (
        posts.map((post, index) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-md transition-shadow">
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <ProfileAvatar
                    userId={post.author._id}
                    firstName={post.author.firstName}
                    lastName={post.author.lastName}
                    size="md"
                    linkToProfile={true}
                  />
                  <div>
                    <Link href={`/profile/${post.author._id}`}>
                      <h4 className="font-semibold text-gray-900 hover:text-purple-600 transition-colors">
                        {post.author.firstName} {post.author.lastName}
                      </h4>
                    </Link>
                    <p className="text-sm text-gray-500">
                      {formatTimeAgo(post.createdAt)}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-gray-800 leading-relaxed">{post.content}</p>
                
                {/* Images */}
                {post.images && post.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 gap-2">
                    {post.images.map((image, idx) => (
                      <img
                        key={idx}
                        src={image.url}
                        alt={image.alt || 'Post image'}
                        className="rounded-lg max-h-96 w-full object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLikePost(post._id)}
                    className={post.isLikedBy ? 'text-red-500' : ''}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${post.isLikedBy ? 'fill-current' : ''}`} />
                    {post.likeCount}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {post.commentCount}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Comments Preview */}
              {post.comments && post.comments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="space-y-3">
                    {post.comments.slice(0, 2).map((comment) => (
                      <div key={comment._id} className="flex items-start gap-3">
                        <ProfileAvatar
                          userId={comment.user._id}
                          firstName={comment.user.firstName}
                          lastName={comment.user.lastName}
                          size="sm"
                        />
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <Link href={`/profile/${comment.user._id}`}>
                              <span className="font-medium text-sm text-gray-900 hover:text-purple-600">
                                {comment.user.firstName} {comment.user.lastName}
                              </span>
                            </Link>
                            <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTimeAgo(comment.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {post.comments.length > 2 && (
                      <Button variant="ghost" size="sm" className="text-purple-600">
                        View all {post.commentCount} comments
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        ))
      )}
    </div>
  )
}