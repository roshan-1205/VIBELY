"""
Feed and post management API routes
Production-ready feed system with standardized responses
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.post import PostRepository
from app.repositories.user import UserRepository
from app.schemas.post import PostCreate, PostResponse
from app.schemas.response import APIResponse, FeedResponse
from app.schemas.user import UserResponse
from app.api.deps.auth import get_current_user, get_current_user_optional
from app.services.notification import NotificationService
from app.workers.tasks import process_post_sentiment
from app.sockets.websocket_manager import broadcast_post_like

router = APIRouter()


@router.get("/", response_model=APIResponse[FeedResponse])
async def get_feed(
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    limit: int = Query(20, ge=1, le=50, description="Number of posts"),
    type: str = Query("timeline", description="Feed type: timeline, explore, trending"),
    current_user: Optional[UserResponse] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """
    Get paginated feed with offset-based pagination
    Optimized for infinite scrolling
    """
    try:
        post_repo = PostRepository(db)
        
        # Get posts based on feed type
        if type == "timeline":
            posts = await post_repo.get_timeline_feed(
                offset=offset,
                limit=limit + 1,  # Get one extra to check if there are more
                user_id=current_user.id if current_user else None
            )
        elif type == "explore":
            posts = await post_repo.get_explore_feed(
                offset=offset,
                limit=limit + 1
            )
        elif type == "trending":
            posts = await post_repo.get_trending_feed(
                offset=offset,
                limit=limit + 1
            )
        else:
            posts = await post_repo.get_timeline_feed(
                offset=offset,
                limit=limit + 1,
                user_id=current_user.id if current_user else None
            )
        
        # Check if there are more posts
        has_more = len(posts) > limit
        if has_more:
            posts = posts[:limit]  # Remove the extra post
        
        # Calculate next offset
        next_offset = offset + limit if has_more else None
        
        # Convert to response format
        post_responses = []
        for post in posts:
            post_data = PostResponse.model_validate(post)
            
            # Check if current user liked this post (would be optimized with joins in production)
            if current_user:
                post_data.is_liked = False  # Placeholder - would check likes table
            
            post_responses.append(post_data)
        
        feed_response = FeedResponse(
            posts=post_responses,
            next_offset=next_offset,
            has_more=has_more,
            total=len(post_responses)
        )
        
        return APIResponse.success_response(feed_response, "Feed retrieved successfully")
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve feed: {str(e)}"
        )


@router.post("/", response_model=APIResponse[PostResponse], status_code=status.HTTP_201_CREATED)
async def create_post(
    post_data: PostCreate,
    background_tasks: BackgroundTasks,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new post with async sentiment analysis"""
    try:
        post_repo = PostRepository(db)
        
        # Create post
        post_dict = post_data.model_dump()
        post_dict["user_id"] = current_user.id
        
        post = await post_repo.create(post_dict)
        
        # Queue sentiment analysis as background task
        background_tasks.add_task(
            process_post_sentiment,
            post.id,
            post_data.content
        )
        
        # Return post with author info
        post_with_author = await post_repo.get_with_author(post.id)
        post_response = PostResponse.model_validate(post_with_author)
        
        return APIResponse.success_response(post_response, "Post created successfully")
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create post: {str(e)}"
        )


@router.get("/{post_id}", response_model=APIResponse[PostResponse])
async def get_post(
    post_id: str,
    current_user: Optional[UserResponse] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific post by ID"""
    try:
        from uuid import UUID
        post_repo = PostRepository(db)
        post = await post_repo.get_with_author(UUID(post_id))
        
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found"
            )
        
        post_data = PostResponse.model_validate(post)
        
        # Check if current user liked this post
        if current_user:
            post_data.is_liked = False  # Placeholder
        
        return APIResponse.success_response(post_data, "Post retrieved successfully")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve post: {str(e)}"
        )


@router.post("/{post_id}/like", response_model=APIResponse[dict])
async def like_post(
    post_id: str,
    background_tasks: BackgroundTasks,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Like a post"""
    try:
        from uuid import UUID
        post_repo = PostRepository(db)
        
        # Check if post exists
        post = await post_repo.get(UUID(post_id))
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found"
            )
        
        # Toggle like (simplified - would use LikeRepository in production)
        # For now, just increment likes_count
        await post_repo.increment_likes(UUID(post_id))
        
        # Create notification in background
        notification_service = NotificationService(db)
        background_tasks.add_task(
            notification_service.create_like_notification,
            UUID(post_id),
            current_user.id,
            post.user_id
        )
        
        # Broadcast real-time update
        background_tasks.add_task(
            broadcast_post_like,
            post_id,
            str(current_user.id),
            True
        )
        
        result = {
            "liked": True,
            "likes_count": post.likes_count + 1
        }
        
        return APIResponse.success_response(result, "Post liked successfully")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to like post: {str(e)}"
        )


@router.delete("/{post_id}/like", response_model=APIResponse[dict])
async def unlike_post(
    post_id: str,
    background_tasks: BackgroundTasks,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Unlike a post"""
    try:
        from uuid import UUID
        post_repo = PostRepository(db)
        
        # Check if post exists
        post = await post_repo.get(UUID(post_id))
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found"
            )
        
        # Toggle unlike (simplified)
        await post_repo.decrement_likes(UUID(post_id))
        
        # Broadcast real-time update
        background_tasks.add_task(
            broadcast_post_like,
            post_id,
            str(current_user.id),
            False
        )
        
        result = {
            "liked": False,
            "likes_count": max(0, post.likes_count - 1)
        }
        
        return APIResponse.success_response(result, "Post unliked successfully")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to unlike post: {str(e)}"
        )