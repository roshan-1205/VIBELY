"use client"

import * as React from "react"
import { Bell, X } from "lucide-react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { apiService, type NotificationItem } from "@/services/api"
import { useSocket } from "@/contexts/SocketContext"

interface NotificationsProps {
  items?: NotificationItem[]
}

export default function AvatarNotifications({ items }: NotificationsProps) {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [unreadCount, setUnreadCount] = React.useState(0)
  const { onNewNotification, isConnected } = useSocket()

  // Set up real-time notification listener
  React.useEffect(() => {
    const unsubscribe = onNewNotification((newNotification: NotificationItem) => {
      setNotifications(prev => [newNotification, ...prev])
      setUnreadCount(prev => prev + 1)
    })

    return () => {
      unsubscribe?.()
    }
  }, [onNewNotification])

  // Load notifications from API
  const loadNotifications = React.useCallback(async () => {
    if (items) {
      setNotifications(items)
      return
    }

    try {
      setIsLoading(true)
      const [notificationsResponse, unreadResponse] = await Promise.all([
        apiService.getNotifications(1, 10),
        apiService.getUnreadNotificationCount()
      ])

      if (notificationsResponse.success && notificationsResponse.data) {
        setNotifications(notificationsResponse.data.notifications)
      }

      if (unreadResponse.success && unreadResponse.data) {
        setUnreadCount(unreadResponse.data.count)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
      // Fallback to demo data if API fails
      setNotifications([
        {
          _id: "1",
          recipient: "current-user",
          sender: {
            _id: "1",
            firstName: "Alice",
            lastName: "Johnson",
            email: "alice@example.com",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
            isEmailVerified: true,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          type: "follow",
          message: "Alice Johnson started following you",
          isRead: false,
          timeAgo: "2m ago",
          createdAt: new Date().toISOString()
        }
      ])
      setUnreadCount(1)
    } finally {
      setIsLoading(false)
    }
  }, [items])

  React.useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  const clearAll = async () => {
    try {
      if (!items) {
        await apiService.markNotificationsAsRead()
      }
      setNotifications([])
      setUnreadCount(0)
    } catch (error) {
      console.error('Error clearing notifications:', error)
    }
  }

  const hasNotifications = notifications.length > 0
  const displayCount = unreadCount > 0 ? unreadCount : (hasNotifications ? notifications.length : 0)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative inline-flex items-center justify-center rounded-full p-2 hover:bg-muted focus:outline-none border rounded">
          <Bell className="h-5 w-5" />
          {/* Notification badge */}
          {displayCount > 0 && (
            <span
              className={cn(
                "absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full border-2 border-background text-xs font-medium text-white flex items-center justify-center",
                unreadCount > 0 ? "bg-red-500 animate-pulse" : "bg-blue-500"
              )}
            >
              {displayCount > 9 ? '9+' : displayCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" side="bottom" align="center">
        <div className="max-h-80 overflow-y-auto">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <h2 className="text-sm font-medium">Notifications</h2>
            {hasNotifications && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearAll}
                className="h-6 w-6 rounded-full"
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {isLoading ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No notifications
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {notifications.map((item) => (
                <li
                  key={item._id}
                  className={cn(
                    "flex items-center gap-3 p-4 hover:bg-muted/50 transition",
                    !item.isRead && "bg-blue-50/50"
                  )}
                >
                  <Avatar className="h-8 w-8">
                    {item.sender.avatar ? (
                      <AvatarImage src={item.sender.avatar} alt={`${item.sender.firstName} ${item.sender.lastName}`} />
                    ) : (
                      <AvatarFallback>
                        {item.sender.firstName[0]}{item.sender.lastName[0]}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-col text-sm flex-1">
                    <span className="font-medium">
                      {item.sender.firstName} {item.sender.lastName}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {item.message}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground">
                      {item.timeAgo}
                    </span>
                    {!item.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}