"""
Notification API routes
Real-time notification system with WebSocket integration
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.notification import NotificationRepository
from app.schemas.notification import NotificationResponse, NotificationCreate
from app.schemas.response import APIResponse
from app.schemas.user import UserResponse
from app.api.deps.auth import get_current_user
from app.sockets.websocket_manager import send_notification

router = APIRouter()


@router.get("/", response_model=APIResponse[List[NotificationResponse]])
async def get_notifications(
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    limit: int = Query(20, ge=1, le=50, description="Number of notifications"),
    unread_only: bool = Query(False, description="Get only unread notifications"),
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user notifications with pagination"""
    try:
        notification_repo = NotificationRepository(db)
        
        notifications = await notification_repo.get_user_notifications(
            user_id=current_user.id,
            offset=offset,
            limit=limit,
            unread_only=unread_only
        )
        
        notification_responses = [
            NotificationResponse.model_validate(notification)
            for notification in notifications
        ]
        
        return APIResponse.success_response(
            notification_responses,
            "Notifications retrieved successfully"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve notifications: {str(e)}"
        )


@router.get("/unread-count", response_model=APIResponse[dict])
async def get_unread_count(
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get count of unread notifications"""
    try:
        notification_repo = NotificationRepository(db)
        
        count = await notification_repo.get_unread_count(current_user.id)
        
        return APIResponse.success_response(
            {"unread_count": count},
            "Unread count retrieved successfully"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get unread count: {str(e)}"
        )


@router.post("/{notification_id}/read", response_model=APIResponse[dict])
async def mark_as_read(
    notification_id: str,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Mark notification as read"""
    try:
        notification_repo = NotificationRepository(db)
        
        notification = await notification_repo.get_by_id_and_user(
            notification_id, current_user.id
        )
        
        if not notification:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification not found"
            )
        
        await notification_repo.mark_as_read(notification_id)
        
        return APIResponse.success_response(
            {"marked_read": True},
            "Notification marked as read"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to mark notification as read: {str(e)}"
        )


@router.post("/mark-all-read", response_model=APIResponse[dict])
async def mark_all_as_read(
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Mark all notifications as read"""
    try:
        notification_repo = NotificationRepository(db)
        
        count = await notification_repo.mark_all_as_read(current_user.id)
        
        return APIResponse.success_response(
            {"marked_count": count},
            f"Marked {count} notifications as read"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to mark all notifications as read: {str(e)}"
        )


@router.delete("/{notification_id}", response_model=APIResponse[dict])
async def delete_notification(
    notification_id: str,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a notification"""
    try:
        notification_repo = NotificationRepository(db)
        
        notification = await notification_repo.get_by_id_and_user(
            notification_id, current_user.id
        )
        
        if not notification:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification not found"
            )
        
        await notification_repo.delete(notification_id)
        
        return APIResponse.success_response(
            {"deleted": True},
            "Notification deleted successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete notification: {str(e)}"
        )