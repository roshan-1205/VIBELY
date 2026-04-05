"use client"

import { useState, useEffect } from 'react'
import { PostsCarousel } from '@/components/ui/posts-carousel'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { apiService, type Post } from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function PostsShowcasePage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Sample posts for demo if no real posts exist
  const samplePosts: Post[] = [
    {
      _id: 'sample-1',
      author: {
        _id: 'user-1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah@example.com',
        avatar: '',
        isEmailVerified: true,
        isActive: true,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      content: 'Just captured this amazing sunset! The colors were absolutely breathtaking. Nature never fails to amaze me. 🌅✨',
      postType: 'image',
      images: [{
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=60',
        alt: 'Beautiful sunset over mountains',
        thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop&q=60'
      }],
      location: 'Rocky Mountains, Colorado',
      tags: ['sunset', 'nature', 'photography'],
      visibility: 'public',
      isScheduled: false,
      isPublished: true,
      likes: [],
      comments: [
        {
          _id: 'comment-1',
          user: {
            _id: 'user-2',
            firstName: 'Mike',
            lastName: 'Chen',
            email: 'mike@example.com',
            avatar: '',
            isEmailVerified: true,
            isActive: true,
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z'
          },
          content: 'Absolutely stunning! 😍',
          createdAt: '2024-01-15T11:00:00Z'
        }
      ],
      shares: [],
      views: 245,
      likeCount: 18,
      commentCount: 3,
      shareCount: 2,
      engagementCount: 23,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: 'sample-2',
      author: {
        _id: 'user-3',
        firstName: 'Alex',
        lastName: 'Rivera',
        email: 'alex@example.com',
        avatar: '',
        isEmailVerified: true,
        isActive: true,
        createdAt: '2024-01-14T15:20:00Z',
        updatedAt: '2024-01-14T15:20:00Z'
      },
      content: 'The only way to do great work is to love what you do.',
      postType: 'quote',
      quoteAuthor: 'Steve Jobs',
      visibility: 'public',
      isScheduled: false,
      isPublished: true,
      likes: [],
      comments: [],
      shares: [],
      views: 156,
      likeCount: 24,
      commentCount: 5,
      shareCount: 8,
      engagementCount: 37,
      createdAt: '2024-01-14T15:20:00Z',
      updatedAt: '2024-01-14T15:20:00Z'
    },
    {
      _id: 'sample-3',
      author: {
        _id: 'user-4',
        firstName: 'Emma',
        lastName: 'Thompson',
        email: 'emma@example.com',
        avatar: '',
        isEmailVerified: true,
        isActive: true,
        createdAt: '2024-01-13T09:45:00Z',
        updatedAt: '2024-01-13T09:45:00Z'
      },
      content: 'Working on my latest art project! This piece represents the journey of self-discovery and growth. Art has always been my way of expressing emotions that words cannot capture.',
      postType: 'image',
      images: [{
        url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&auto=format&fit=crop&q=60',
        alt: 'Abstract art painting',
        thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&auto=format&fit=crop&q=60'
      }],
      location: 'Art Studio, Brooklyn',
      tags: ['art', 'painting', 'creativity', 'selfdiscovery'],
      visibility: 'public',
      isScheduled: false,
      isPublished: true,
      likes: [],
      comments: [
        {
          _id: 'comment-2',
          user: {
            _id: 'user-5',
            firstName: 'David',
            lastName: 'Kim',
            email: 'david@example.com',
            avatar: '',
            isEmailVerified: true,
            isActive: true,
            createdAt: '2024-01-13T10:00:00Z',
            updatedAt: '2024-01-13T10:00:00Z'
          },
          content: 'This is incredible! The colors are so vibrant.',
          createdAt: '2024-01-13T10:15:00Z'
        },
        {
          _id: 'comment-3',
          user: {
            _id: 'user-6',
            firstName: 'Lisa',
            lastName: 'Wang',
            email: 'lisa@example.com',
            avatar: '',
            isEmailVerified: true,
            isActive: true,
            createdAt: '2024-01-13T10:30:00Z',
            updatedAt: '2024-01-13T10:30:00Z'
          },
          content: 'Love the emotion in this piece! 🎨',
          createdAt: '2024-01-13T10:45:00Z'
        }
      ],
      shares: [],
      views: 189,
      likeCount: 31,
      commentCount: 7,
      shareCount: 4,
      engagementCount: 42,
      createdAt: '2024-01-13T09:45:00Z',
      updatedAt: '2024-01-13T09:45:00Z'
    }
  ];

  const loadPosts = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getPosts(1, 10);
      if (response.success && response.data?.posts) {
        // Use real posts if available, otherwise use sample posts
        setPosts(response.data.posts.length > 0 ? response.data.posts : samplePosts);
      } else {
        setPosts(samplePosts);
      }
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Failed to load posts');
      // Use sample posts as fallback
      setPosts(samplePosts);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [user]);

  const handleLike = async (postId: string) => {
    try {
      await apiService.likePost(postId);
      // Update local state optimistically
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId 
            ? { 
                ...post, 
                isLikedBy: !post.isLikedBy,
                likeCount: post.isLikedBy ? post.likeCount - 1 : post.likeCount + 1
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = (postId: string) => {
    // For demo purposes, just log the action
    console.log('Comment on post:', postId);
    // In a real app, this would open a comment modal or navigate to post detail
  };

  const handleShare = async (postId: string) => {
    try {
      await apiService.sharePost(postId);
      // Update local state optimistically
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId 
            ? { 
                ...post, 
                shareCount: (post.shareCount || 0) + 1
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      const response = await apiService.deletePost(postId);
      
      if (response.success) {
        // Remove the post from the local state
        setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      } else {
        console.error('Failed to delete post:', response.message);
        alert('Failed to delete post. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view the posts showcase.</p>
          <Link href="/signin">
            <Button>Sign In</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-blue-950/20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/hero">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Feed
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Posts Showcase</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Immersive post viewing experience</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={loadPosts} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Posts</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadPosts}>Try Again</Button>
          </Card>
        </div>
      ) : (
        <PostsCarousel
          posts={posts}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          onDelete={handleDelete}
          title={
            <>
              Discover Amazing{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                Posts
              </span>
            </>
          }
          subtitle="Swipe through posts in an immersive, distraction-free experience"
        />
      )}

      {/* Features Info */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Focused Viewing</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">One post at a time for distraction-free browsing</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Rich Content</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Support for images, videos, quotes, and text posts</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Interactive</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Like, comment, and share with smooth animations</p>
          </Card>
        </div>
      </div>
    </div>
  )
}