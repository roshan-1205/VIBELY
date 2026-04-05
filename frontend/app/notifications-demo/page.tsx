'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import AvatarNotifications from '@/components/ui/avatar-notifications'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, Users, MessageSquare, Heart, Plus } from 'lucide-react'
import Link from 'next/link'
import { NotificationItem } from '@/services/api'

export default function NotificationsDemoPage() {
  const [customNotifications, setCustomNotifications] = useState<NotificationItem[]>([
    {
      _id: "1",
      recipient: "current-user",
      sender: {
        _id: "user1",
        firstName: "Emma",
        lastName: "Wilson",
        email: "emma@example.com",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
        bio: "",
        isEmailVerified: true,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      type: "follow",
      message: "Started following you.",
      isRead: false,
      timeAgo: "5m ago",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "2",
      recipient: "current-user",
      sender: {
        _id: "user2",
        firstName: "James",
        lastName: "Rodriguez",
        email: "james@example.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        bio: "",
        isEmailVerified: true,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      type: "like",
      message: "Liked your robot customization.",
      isRead: false,
      timeAgo: "15m ago",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "3",
      recipient: "current-user",
      sender: {
        _id: "user3",
        firstName: "Sarah",
        lastName: "Chen",
        email: "sarah@example.com",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
        bio: "",
        isEmailVerified: true,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      type: "comment",
      message: "Commented: 'Amazing robot design!'",
      isRead: false,
      timeAgo: "1h ago",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "4",
      recipient: "current-user",
      sender: {
        _id: "user4",
        firstName: "Michael",
        lastName: "Brown",
        email: "michael@example.com",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        bio: "",
        isEmailVerified: true,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      type: "mention",
      message: "Shared your profile.",
      isRead: false,
      timeAgo: "2h ago",
      createdAt: new Date().toISOString(),
    },
  ])

  const addNotification = () => {
    const newNotification: NotificationItem = {
      _id: Date.now().toString(),
      recipient: "current-user",
      sender: {
        _id: "new-user",
        firstName: "New",
        lastName: "User",
        email: "newuser@example.com",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face",
        bio: "",
        isEmailVerified: true,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      type: "welcome",
      message: "Just joined Vibely!",
      isRead: false,
      timeAgo: "now",
      createdAt: new Date().toISOString(),
    }
    setCustomNotifications(prev => [newNotification, ...prev])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/hero" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-md flex items-center justify-center text-white font-bold">
                  V
                </div>
                <span className="font-semibold text-lg">Vibely</span>
              </Link>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <Bell className="w-3 h-3 mr-1" />
                Notifications Demo
              </Badge>
            </div>
            <Link href="/hero">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            🔔 Avatar Notifications Demo
          </motion.h1>
          <motion.p 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Experience the interactive notification system with avatar previews, real-time updates, 
            and smooth animations. Click the bell icon to see notifications!
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Demo Controls */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Controls
              </h3>
              
              <div className="space-y-4">
                <Button onClick={addNotification} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Notification
                </Button>
                
                <div className="text-sm text-gray-600">
                  <p className="mb-2">Current notifications: <strong>{customNotifications.length}</strong></p>
                  <p>Click the bell icon above to view all notifications in the popover.</p>
                </div>
              </div>
            </Card>

            {/* Features List */}
            <Card className="p-6 mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-4">✨ Features</h3>
              <div className="space-y-3 text-sm text-blue-700">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <span>Real-time notification badge with animation</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <span>Avatar images with fallback initials</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <span>Smooth popover animations</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <span>Clear all notifications functionality</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <span>Responsive design with scroll support</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Demo Area */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              {/* Demo Header with Notifications */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Interactive Demo</h2>
                  <p className="text-gray-600">Click the notification bell to see the component in action</p>
                </div>
                
                {/* Main Notification Component */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">Notifications:</span>
                  <AvatarNotifications items={customNotifications} />
                </div>
              </div>

              {/* Demo Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Usage Examples */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Usage Examples</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Navigation Bar</span>
                        <AvatarNotifications items={[
                          {
                            _id: "nav1",
                            recipient: "current-user",
                            sender: {
                              _id: "alice-user",
                              firstName: "Alice",
                              lastName: "Smith",
                              email: "alice@example.com",
                              avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
                              bio: "",
                              isEmailVerified: true,
                              isActive: true,
                              createdAt: new Date().toISOString(),
                              updatedAt: new Date().toISOString()
                            },
                            type: "mention",
                            message: "Sent you a message",
                            isRead: false,
                            timeAgo: "2m ago",
                            createdAt: new Date().toISOString(),
                          }
                        ]} />
                      </div>
                      <p className="text-xs text-gray-500">Perfect for top navigation bars</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Sidebar</span>
                        <AvatarNotifications items={[]} />
                      </div>
                      <p className="text-xs text-gray-500">Clean state with no notifications</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Profile Header</span>
                        <AvatarNotifications items={customNotifications.slice(0, 2)} />
                      </div>
                      <p className="text-xs text-gray-500">Limited notifications for specific contexts</p>
                    </div>
                  </div>
                </div>

                {/* Component Stats */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Component Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Active Users</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">1,234</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Messages</span>
                      </div>
                      <span className="text-lg font-bold text-blue-600">567</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-pink-600" />
                        <span className="text-sm font-medium text-pink-800">Likes</span>
                      </div>
                      <span className="text-lg font-bold text-pink-600">2,890</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Integration Code */}
              <div className="mt-8 p-4 bg-gray-900 rounded-lg">
                <h4 className="text-white font-medium mb-2">Quick Integration</h4>
                <pre className="text-green-400 text-sm overflow-x-auto">
{`import AvatarNotifications from '@/components/ui/avatar-notifications'

// Basic usage
<AvatarNotifications />

// With custom notifications
<AvatarNotifications items={notifications} />`}
                </pre>
              </div>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-4">🎯 How to Use Notifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 font-bold">1</span>
              </div>
              <div className="font-medium text-purple-800">Click Bell Icon</div>
              <div className="text-purple-600">Click any notification bell to open</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 font-bold">2</span>
              </div>
              <div className="font-medium text-purple-800">View Notifications</div>
              <div className="text-purple-600">See all notifications with avatars</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <div className="font-medium text-purple-800">Add New</div>
              <div className="text-purple-600">Use the "Add New" button to test</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 font-bold">4</span>
              </div>
              <div className="font-medium text-purple-800">Clear All</div>
              <div className="text-purple-600">Use X button to clear notifications</div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}