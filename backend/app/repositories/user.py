"""
User repository for database operations
"""

from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload

from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    """User-specific database operations"""
    
    def __init__(self, db: AsyncSession):
        super().__init__(User, db)
    
    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email address"""
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()
    
    async def get_by_username(self, username: str) -> Optional[User]:
        """Get user by username"""
        result = await self.db.execute(
            select(User).where(User.username == username)
        )
        return result.scalar_one_or_none()
    
    async def update_last_login(self, user_id: str) -> None:
        """Update user's last login timestamp"""
        from datetime import datetime
        from uuid import UUID
        
        await self.db.execute(
            update(User)
            .where(User.id == UUID(user_id))
            .values(last_login=datetime.utcnow())
        )
        await self.db.commit()
    
    async def get_with_stats(self, user_id: str) -> Optional[User]:
        """Get user with related statistics"""
        result = await self.db.execute(
            select(User)
            .options(
                selectinload(User.posts),
                selectinload(User.likes),
                selectinload(User.comments)
            )
            .where(User.id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def search_users(self, query: str, limit: int = 20) -> list[User]:
        """Search users by name or username"""
        search_term = f"%{query}%"
        result = await self.db.execute(
            select(User)
            .where(
                (User.name.ilike(search_term)) |
                (User.username.ilike(search_term))
            )
            .where(User.is_active == True)
            .limit(limit)
        )
        return result.scalars().all()