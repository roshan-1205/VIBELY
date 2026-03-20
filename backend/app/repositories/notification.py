"""
Notification Repository
Database operations for notifications
"""

import json
from datetime import datetime, timedelta
from typing import List, Optional
from uuid import UUID
from sqlalchemy import select, update, delete, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification import Notification
from app.repositories.base import BaseRepository


class NotificationRepository(BaseRepository[Notification]):
    """Repository for notification operations"""
    
    def __init__(self, db: AsyncSession):
        super().__init__(Notification, db)
    
    async def get_user_notifications(
        self,
        user_id: UUID,
        offset: int = 0,
        limit: int = 20,
        unread_only: bool = False
    ) -> List[Notification]:
        """Get notifications for a user with pagination"""
        query = select(Notification).where(Notification.user_id == user_id)
        
        if unread_only:
            query = query.where(Notification.is_read == False)
        
        query = query.order_by(Notification.created_at.desc())
        query = query.offset(offset).limit(limit)
        
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def get_unread_count(self, user_id: UUID) -> int:
        """Get count of unread notifications for a user"""
        query = select(func.count(Notification.id)).where(
            Notification.user_id == user_id,
            Notification.is_read == False
        )
        
        result = await self.db.execute(query)
        return result.scalar() or 0
    
    async def get_by_id_and_user(self, notification_id: str, user_id: UUID) -> Optional[Notification]:
        """Get notification by ID and user ID"""
        query = select(Notification).where(
            Notification.id == UUID(notification_id),
            Notification.user_id == user_id
        )
        
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def mark_as_read(self, notification_id: str) -> bool:
        """Mark notification as read"""
        query = update(Notification).where(
            Notification.id == UUID(notification_id)
        ).values(
            is_read=True,
            read_at=datetime.utcnow()
        )
        
        result = await self.db.execute(query)
        await self.db.commit()
        
        return result.rowcount > 0
    
    async def mark_all_as_read(self, user_id: UUID) -> int:
        """Mark all notifications as read for a user"""
        query = update(Notification).where(
            Notification.user_id == user_id,
            Notification.is_read == False
        ).values(
            is_read=True,
            read_at=datetime.utcnow()
        )
        
        result = await self.db.execute(query)
        await self.db.commit()
        
        return result.rowcount
    
    async def create_notification(
        self,
        user_id: UUID,
        notification_type: str,
        title: str,
        message: str,
        metadata: Optional[dict] = None
    ) -> Notification:
        """Create a new notification"""
        notification_data = {
            "user_id": user_id,
            "type": notification_type,
            "title": title,
            "message": message,
            "extra_data": json.dumps(metadata) if metadata else None
        }
        
        return await self.create(notification_data)
    
    async def delete_old_notifications(self, days: int = 30) -> int:
        """Delete notifications older than specified days"""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        query = delete(Notification).where(
            Notification.created_at < cutoff_date
        )
        
        result = await self.db.execute(query)
        await self.db.commit()
        
        return result.rowcount