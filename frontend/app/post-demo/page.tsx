"use client"

import { useState } from 'react'
import { CreatePostPopup } from '@/components/ui/create-post-popup'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PlusCircle, Quote, Image as ImageIcon, Video, Hash } from 'lucide-react'

export default function PostDemoPage() {
  const [showCreatePost, setShowCreatePost] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Creation Demo</h1>
          <p className="text-lg text-gray-600 mb-8">
            Experience the comprehensive post creation system with support for multiple content types
          </p>
        </div>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Hash className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Text Posts</h3>
            <p className="text-sm text-gray-600">Share thoughts, updates, and ideas with rich text formatting</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Image Posts</h3>
            <p className="text-sm text-gray-600">Upload and share photos with automatic thumbnail generation</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Video Posts</h3>
            <p className="text-sm text-gray-600">Share videos with playback controls and thumbnails</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Quote className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quote Posts</h3>
            <p className="text-sm text-gray-600">Share inspiring quotes with proper attribution</p>
          </Card>
        </div>

        {/* Features List */}
        <Card className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Advanced Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Media Upload</h4>
                  <p className="text-sm text-gray-600">Support for images and videos up to 50MB</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Location Tagging</h4>
                  <p className="text-sm text-gray-600">Add location information to your posts</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Hashtags & Mentions</h4>
                  <p className="text-sm text-gray-600">Tag topics and mention other users</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Emoji Support</h4>
                  <p className="text-sm text-gray-600">Quick emoji picker for expressive posts</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Privacy Controls</h4>
                  <p className="text-sm text-gray-600">Public, followers-only, or private visibility</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Post Scheduling</h4>
                  <p className="text-sm text-gray-600">Schedule posts for future publication</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Real-time Updates</h4>
                  <p className="text-sm text-gray-600">Instant broadcasting to all connected users</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Rich Interactions</h4>
                  <p className="text-sm text-gray-600">Likes, comments, shares, and views tracking</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Demo Button */}
        <div className="text-center">
          <Button
            onClick={() => setShowCreatePost(true)}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <PlusCircle className="w-6 h-6 mr-2" />
            Try Creating a Post
          </Button>
        </div>

        {/* Technical Details */}
        <Card className="p-8 bg-gradient-to-br from-gray-50 to-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Technical Implementation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Frontend</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• React with TypeScript</li>
                <li>• Framer Motion animations</li>
                <li>• Real-time Socket.IO integration</li>
                <li>• File upload with preview</li>
                <li>• Form validation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Backend</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Enhanced MongoDB schema</li>
                <li>• RESTful API endpoints</li>
                <li>• WebSocket broadcasting</li>
                <li>• Post scheduling system</li>
                <li>• Privacy controls</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Multiple post types</li>
                <li>• Media upload support</li>
                <li>• Real-time updates</li>
                <li>• Engagement tracking</li>
                <li>• Advanced filtering</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Create Post Popup */}
      <CreatePostPopup 
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
      />
    </div>
  )
}