"""
Notification Schemas
Pydantic models for notification API
"""

from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field


class NotificationBase(BaseModel):
    """Base notification schema"""
    type: str = Field(..., description="Notification type (like, comment, follow)")
    title: str = Field(..., max_length=200, description="Notification title")
    message: str = Field(..., description="Notification message")
    extra_data: Optional[Dict[str, Any]] = Field(None, description="Additional metadata")


class NotificationCreate(NotificationBase):
    """Schema for creating notifications"""
    user_id: UUID = Field(..., description="Target user ID")


class NotificationResponse(NotificationBase):
    """Schema for notification responses"""
    id: UUID = Field(..., description="Notification ID")
    user_id: UUID = Field(..., description="User ID")
    is_read: bool = Field(..., description="Read status")
    created_at: datetime = Field(..., description="Creation timestamp")
    read_at: Optional[datetime] = Field(None, description="Read timestamp")
    
    class Config:
        from_attributes = True


class NotificationUpdate(BaseModel):
    """Schema for updating notifications"""
    is_read: Optional[bool] = None
    read_at: Optional[datetime] = None


# WebSocket notification event
class NotificationEvent(BaseModel):
    """Schema for real-time notification events"""
    type: str = "notification"
    notification: NotificationResponse
    timestamp: datetime = Field(default_factory=datetime.utcnow)