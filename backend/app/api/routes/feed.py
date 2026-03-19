"""
Feed and post management API routes
Instagram-level feed system with cursor pagination
"""

from typing import Optional
from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.post import PostRepository
from app.repositories.user import UserRepository
from app.services.vibe_engine import vibe_engine
from app.schemas.post import PostCreate, PostResponse, PostFeed, VibeAnalysis
from app.schemas.user import UserResponse
from app.api.deps.auth import get_current_user, get_current_user_optional
from app.workers.tasks import process_post_sentiment

router = APIRouter()


@router.get("/", response_model=PostFeed)
async def get_feed(
    cursor: Optional[str] = Query(None, description="Cursor for pagination"),
    limit: int = Query(20, ge=1, le=50, description="Number of posts"),
    current_user: Optional[UserResponse] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """
    Get paginated feed with cursor-based pagination
    Optimized for infinite scrolling
    """
    post_repo = PostRepository(db)
    
    # Parse cursor
    cursor_date = None
    if cursor:
        try:
            cursor_date = datetime.fromisoformat(cursor)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid cursor format"
            )
    
    # Get posts
    posts, next_cursor = await post_repo.get_feed(
        cursor=cursor_date,
        limit=limit,
        user_id=current_user.id if current_user else None
    )
    
    # Convert to response format
    post_responses = []
    for post in posts:
        post_data = PostResponse.model_validate(post)
        
        # Check if current user liked this post
        if current_user:
            # This would require a join or separate query in production
            post_data.is_liked = False  # Placeholder
        
        post_responses.append(post_data)
    
    return PostFeed(
        posts=post_responses,
        next_cursor=next_cursor,
        has_more=next_cursor is not None
    )


@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_data: PostCreate,
    background_tasks: BackgroundTasks,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new post with async sentiment analysis"""
    post_repo = PostRepository(db)
    
    # Create post
    post_dict = post_data.model_dump()
    post_dict["user_id"] = current_user.id
    
    post = await post_repo.create(post_dict)
    
    # Queue sentiment analysis as background task
    background_tasks.add_task(
        process_post_sentiment,
        str(post.id),
        post_data.content
    )
    
    # Return post with author info
    post_with_author = await post_repo.get_with_author(post.id)
    return PostResponse.model_validate(post_with_author)


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: UUID,
    current_user: Optional[UserResponse] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific post by ID"""
    post_repo = PostRepository(db)
    post = await post_repo.get_with_author(post_id)
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    post_data = PostResponse.model_validate(post)
    
    # Check if current user liked this post
    if current_user:
        post_data.is_liked = False  # Placeholder
    
    return post_data


@router.delete("/{post_id}")
async def delete_post(
    post_id: UUID,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a post (only by author)"""
    post_repo = PostRepository(db)
    post = await post_repo.get(post_id)
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check ownership
    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this post"
        )
    
    await post_repo.delete(post_id)
    return {"message": "Post deleted successfully"}


@router.post("/{post_id}/like")
async def like_post(
    post_id: UUID,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Like or unlike a post"""
    # This would require a LikeRepository in production
    # For now, return success
    return {"message": "Post liked successfully"}


@router.get("/user/{user_id}", response_model=PostFeed)
async def get_user_posts(
    user_id: UUID,
    cursor: Optional[str] = Query(None, description="Cursor for pagination"),
    limit: int = Query(20, ge=1, le=50, description="Number of posts"),
    db: AsyncSession = Depends(get_db)
):
    """Get posts by a specific user"""
    post_repo = PostRepository(db)
    user_repo = UserRepository(db)
    
    # Verify user exists
    user = await user_repo.get(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Parse cursor
    cursor_date = None
    if cursor:
        try:
            cursor_date = datetime.fromisoformat(cursor)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid cursor format"
            )
    
    # Get user posts
    posts, next_cursor = await post_repo.get_user_posts(
        user_id=user_id,
        cursor=cursor_date,
        limit=limit
    )
    
    post_responses = [PostResponse.model_validate(post) for post in posts]
    
    return PostFeed(
        posts=post_responses,
        next_cursor=next_cursor,
        has_more=next_cursor is not None
    )


@router.get("/trending", response_model=list[PostResponse])
async def get_trending_posts(
    hours: int = Query(24, ge=1, le=168, description="Hours to look back"),
    limit: int = Query(20, ge=1, le=50, description="Number of posts"),
    db: AsyncSession = Depends(get_db)
):
    """Get trending posts based on engagement"""
    post_repo = PostRepository(db)
    posts = await post_repo.get_trending_posts(hours=hours, limit=limit)
    
    return [PostResponse.model_validate(post) for post in posts]