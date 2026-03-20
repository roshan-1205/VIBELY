"""
Notification Service
Business logic for notification management and real-time delivery
"""

import json
from typing import Optional, Dict, Any
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.notification import NotificationRepository
from app.repositories.user import UserRepository
from app.repositories.post import PostRepository
from app.schemas.notification import NotificationResponse
from app.sockets.websocket_manager import send_notification


class NotificationService:
    """Service for managing notifications"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.notification_repo = NotificationRepository(db)
        self.user_repo = UserRepository(db)
        self.post_repo = PostRepository(db)
    
    async def create_like_notification(
        self,
        post_id: int,
        liker_user_id: UUID,
        post_author_id: UUID
    ) -> Optional[NotificationResponse]:
        """Create notification for post like"""
        # Don't notify if user likes their own post
        if liker_user_id == post_author_id:
            return None
        
        try:
            # Get liker and post info
            liker = await self.user_repo.get(liker_user_id)
            post = await self.post_repo.get(post_id)
            
            if not liker or not post:
                return None
            
            # Create notification
            notification = await self.notification_repo.create_notification(
                user_id=post_author_id,
                notification_type="like",
                title="New Like",
                message=f"{liker.username} liked your post",
                metadata={
                    "post_id": post_id,
                    "liker_id": str(liker_user_id),
                    "liker_username": liker.username,
                    "post_content": post.content[:100] + "..." if len(post.content) > 100 else post.content
                }
            )
            
            # Convert to response format
            notification_response = NotificationResponse.model_validate(notification)
            
            # Send real-time notification
            await send_notification(str(post_author_id), {
                "id": str(notification.id),
                "type": notification.type,
                "title": notification.title,
                "message": notification.message,
                "metadata": json.loads(notification.extra_data) if notification.extra_data else None,
                "is_read": notification.is_read,
                "created_at": notification.created_at.isoformat()
            })
            
            return notification_response
            
        except Exception as e:
            # Log error but don't fail the main operation
            print(f"Failed to create like notification: {e}")
            return None
    
    async def create_comment_notification(
        self,
        post_id: int,
        commenter_user_id: UUID,
        post_author_id: UUID,
        comment_content: str
    ) -> Optional[NotificationResponse]:
        """Create notification for new comment"""
        # Don't notify if user comments on their own post
        if commenter_user_id == post_author_id:
            return None
        
        try:
            # Get commenter and post info
            commenter = await self.user_repo.get(commenter_user_id)
            post = await self.post_repo.get(post_id)
            
            if not commenter or not post:
                return None
            
            # Create notification
            notification = await self.notification_repo.create_notification(
                user_id=post_author_id,
                notification_type="comment",
                title="New Comment",
                message=f"{commenter.username} commented on your post",
                metadata={
                    "post_id": post_id,
                    "commenter_id": str(commenter_user_id),
                    "commenter_username": commenter.username,
                    "comment_content": comment_content[:100] + "..." if len(comment_content) > 100 else comment_content,
                    "post_content": post.content[:100] + "..." if len(post.content) > 100 else post.content
                }
            )
            
            # Convert to response format
            notification_response = NotificationResponse.model_validate(notification)
            
            # Send real-time notification
            await send_notification(str(post_author_id), {
                "id": str(notification.id),
                "type": notification.type,
                "title": notification.title,
                "message": notification.message,
                "metadata": json.loads(notification.extra_data) if notification.extra_data else None,
                "is_read": notification.is_read,
                "created_at": notification.created_at.isoformat()
            })
            
            return notification_response
            
        except Exception as e:
            print(f"Failed to create comment notification: {e}")
            return None
    
    async def create_follow_notification(
        self,
        follower_user_id: UUID,
        followed_user_id: UUID
    ) -> Optional[NotificationResponse]:
        """Create notification for new follower"""
        try:
            # Get follower info
            follower = await self.user_repo.get(follower_user_id)
            
            if not follower:
                return None
            
            # Create notification
            notification = await self.notification_repo.create_notification(
                user_id=followed_user_id,
                notification_type="follow",
                title="New Follower",
                message=f"{follower.username} started following you",
                metadata={
                    "follower_id": str(follower_user_id),
                    "follower_username": follower.username
                }
            )
            
            # Convert to response format
            notification_response = NotificationResponse.model_validate(notification)
            
            # Send real-time notification
            await send_notification(str(followed_user_id), {
                "id": str(notification.id),
                "type": notification.type,
                "title": notification.title,
                "message": notification.message,
                "metadata": json.loads(notification.extra_data) if notification.extra_data else None,
                "is_read": notification.is_read,
                "created_at": notification.created_at.isoformat()
            })
            
            return notification_response
            
        except Exception as e:
            print(f"Failed to create follow notification: {e}")
            return None
    
    async def get_user_notifications(
        self,
        user_id: UUID,
        offset: int = 0,
        limit: int = 20,
        unread_only: bool = False
    ) -> list[NotificationResponse]:
        """Get user notifications with pagination"""
        notifications = await self.notification_repo.get_user_notifications(
            user_id=user_id,
            offset=offset,
            limit=limit,
            unread_only=unread_only
        )
        
        return [
            NotificationResponse.model_validate(notification)
            for notification in notifications
        ]
    
    async def mark_as_read(self, notification_id: str, user_id: UUID) -> bool:
        """Mark notification as read"""
        # Verify notification belongs to user
        notification = await self.notification_repo.get_by_id_and_user(
            notification_id, user_id
        )
        
        if not notification:
            return False
        
        return await self.notification_repo.mark_as_read(notification_id)
    
    async def get_unread_count(self, user_id: UUID) -> int:
        """Get count of unread notifications"""
        return await self.notification_repo.get_unread_count(user_id)