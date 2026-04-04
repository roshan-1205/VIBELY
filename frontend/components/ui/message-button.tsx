'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { Button } from './button'
import { MessagingPopup } from './messaging-popup-fixed'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

interface MessageButtonProps {
  userId?: string
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showLabel?: boolean
}

export function MessageButton({ 
  userId, 
  variant = 'ghost', 
  size = 'sm', 
  className,
  showLabel = false 
}: MessageButtonProps) {
  const { user: currentUser, isLoading } = useAuth()
  const [showMessagingPopup, setShowMessagingPopup] = useState(false)

  // Don't render if user is not authenticated or is the same user
  if (!currentUser || isLoading || userId === currentUser._id) {
    return null
  }

  const handleClick = () => {
    setShowMessagingPopup(true)
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        className={cn(className)}
        title="Send message"
      >
        <MessageCircle className="w-4 h-4" />
        {showLabel && <span className="ml-2">Message</span>}
      </Button>

      <MessagingPopup 
        isOpen={showMessagingPopup}
        onClose={() => setShowMessagingPopup(false)}
        initialUserId={userId}
      />
    </>
  )
}