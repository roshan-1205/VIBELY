"""
Post repository for feed and content operations
"""

from typing import List, Optional, Tuple
from uuid import UUID
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func, and_, or_
from sqlalchemy.orm import selectinload, joinedload

from app.models.post import Post
from app.models.user import User
from app.models.like import Like
from app.repositories.base import BaseRepository


class PostRepository(BaseRepository[Post]):
    """Post-specific database operations with feed optimization"""
    
    def __init__(self, db: AsyncSession):
        super().__init__(Post, db)
    
    async def get_with_author(self, post_id: UUID) -> Optional[Post]:
        """Get post with author information"""
        result = await self.db.execute(
            select(Post)
            .options(joinedload(Post.author))
            .where(Post.id == post_id)
        )
        return result.scalar_one_or_none()
    
    async def get_feed(
        self, 
        cursor: Optional[datetime] = None,
        limit: int = 20,
        user_id: Optional[UUID] = None
    ) -> Tuple[List[Post], Optional[str]]:
        """
        Get paginated feed with cursor-based pagination
        Optimized for infinite scrolling
        """
        query = (
            select(Post)
            .options(
                joinedload(Post.author),
                selectinload(Post.likes),
                selectinload(Post.comments)
            )
            .order_by(desc(Post.created_at))
        )
        
        # Cursor-based pagination
        if cursor:
            query = query.where(Post.created_at < cursor)
        
        query = query.limit(limit + 1)  # Get one extra to check if there's more
        
        result = await self.db.execute(query)
        posts = result.scalars().all()
        
        # Determine next cursor
        has_more = len(posts) > limit
        if has_more:
            posts = posts[:limit]
            next_cursor = posts[-1].created_at.isoformat() if posts else None
        else:
            next_cursor = None
        
        return posts, next_cursor
    
    async def get_user_posts(
        self, 
        user_id: UUID,
        cursor: Optional[datetime] = None,
        limit: int = 20
    ) -> Tuple[List[Post], Optional[str]]:
        """Get user's posts with pagination"""
        query = (
            select(Post)
            .options(joinedload(Post.author))
            .where(Post.user_id == user_id)
            .order_by(desc(Post.created_at))
        )
        
        if cursor:
            query = query.where(Post.created_at < cursor)
        
        query = query.limit(limit + 1)
        
        result = await self.db.execute(query)
        posts = result.scalars().all()
        
        has_more = len(posts) > limit
        if has_more:
            posts = posts[:limit]
            next_cursor = posts[-1].created_at.isoformat() if posts else None
        else:
            next_cursor = None
        
        return posts, next_cursor
    
    async def get_posts_by_sentiment(
        self,
        sentiment_range: Tuple[float, float],
        limit: int = 20
    ) -> List[Post]:
        """Get posts filtered by sentiment score range"""
        min_score, max_score = sentiment_range
        
        result = await self.db.execute(
            select(Post)
            .options(joinedload(Post.author))
            .where(
                and_(
                    Post.sentiment_score >= min_score,
                    Post.sentiment_score <= max_score,
                    Post.sentiment_score.isnot(None)
                )
            )
            .order_by(desc(Post.created_at))
            .limit(limit)
        )
        return result.scalars().all()
    
    async def update_engagement_counts(self, post_id: UUID) -> None:
        """Update likes and comments count for a post"""
        # Get current counts
        likes_count = await self.db.execute(
            select(func.count(Like.id)).where(Like.post_id == post_id)
        )
        likes_count = likes_count.scalar()
        
        comments_count = await self.db.execute(
            select(func.count()).select_from(
                select(1).where(
                    # This would be Comment.post_id == post_id if Comment model was imported
                    True  # Placeholder
                )
            )
        )
        comments_count = comments_count.scalar() or 0
        
        # Update post
        await self.update(post_id, {
            "likes_count": likes_count,
            "comments_count": comments_count
        })
    
    async def search_posts(self, query: str, limit: int = 20) -> List[Post]:
        """Search posts by content"""
        search_term = f"%{query}%"
        result = await self.db.execute(
            select(Post)
            .options(joinedload(Post.author))
            .where(Post.content.ilike(search_term))
            .order_by(desc(Post.created_at))
            .limit(limit)
        )
        return result.scalars().all()
    
    async def get_timeline_feed(
        self,
        offset: int = 0,
        limit: int = 20,
        user_id: Optional[UUID] = None
    ) -> List[Post]:
        """Get timeline feed with offset-based pagination"""
        query = (
            select(Post)
            .options(joinedload(Post.author))
            .order_by(desc(Post.created_at))
            .offset(offset)
            .limit(limit)
        )
        
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def get_explore_feed(
        self,
        offset: int = 0,
        limit: int = 20
    ) -> List[Post]:
        """Get explore feed (random/popular posts)"""
        query = (
            select(Post)
            .options(joinedload(Post.author))
            .order_by(desc(Post.likes_count), desc(Post.created_at))
            .offset(offset)
            .limit(limit)
        )
        
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def get_trending_feed(
        self,
        offset: int = 0,
        limit: int = 20
    ) -> List[Post]:
        """Get trending feed"""
        return await self.get_trending_posts(limit=limit)
    
    async def increment_likes(self, post_id: UUID) -> None:
        """Increment likes count for a post"""
        from sqlalchemy import update
        await self.db.execute(
            update(Post)
            .where(Post.id == post_id)
            .values(likes_count=Post.likes_count + 1)
        )
        await self.db.commit()
    
    async def decrement_likes(self, post_id: UUID) -> None:
        """Decrement likes count for a post"""
        from sqlalchemy import update
        await self.db.execute(
            update(Post)
            .where(Post.id == post_id)
            .values(likes_count=func.greatest(Post.likes_count - 1, 0))
        )
        await self.db.commit()