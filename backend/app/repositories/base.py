"""
Base repository class with common database operations
"""

from typing import Generic, TypeVar, Type, Optional, List, Any, Dict
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, func
from sqlalchemy.orm import selectinload

from app.core.database import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """Base repository with common CRUD operations"""
    
    def __init__(self, model: Type[ModelType], db: AsyncSession):
        self.model = model
        self.db = db
    
    async def get(self, id: UUID) -> Optional[ModelType]:
        """Get a single record by ID"""
        result = await self.db.execute(
            select(self.model).where(self.model.id == id)
        )
        return result.scalar_one_or_none()
    
    async def get_multi(
        self, 
        skip: int = 0, 
        limit: int = 100,
        **filters
    ) -> List[ModelType]:
        """Get multiple records with pagination"""
        query = select(self.model)
        
        # Apply filters
        for key, value in filters.items():
            if hasattr(self.model, key) and value is not None:
                query = query.where(getattr(self.model, key) == value)
        
        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def create(self, obj_in: Dict[str, Any]) -> ModelType:
        """Create a new record"""
        db_obj = self.model(**obj_in)
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj
    
    async def update(self, id: UUID, obj_in: Dict[str, Any]) -> Optional[ModelType]:
        """Update an existing record"""
        await self.db.execute(
            update(self.model)
            .where(self.model.id == id)
            .values(**obj_in)
        )
        await self.db.commit()
        return await self.get(id)
    
    async def delete(self, id: UUID) -> bool:
        """Delete a record by ID"""
        result = await self.db.execute(
            delete(self.model).where(self.model.id == id)
        )
        await self.db.commit()
        return result.rowcount > 0
    
    async def count(self, **filters) -> int:
        """Count records with optional filters"""
        query = select(func.count(self.model.id))
        
        # Apply filters
        for key, value in filters.items():
            if hasattr(self.model, key) and value is not None:
                query = query.where(getattr(self.model, key) == value)
        
        result = await self.db.execute(query)
        return result.scalar()
    
    async def exists(self, **filters) -> bool:
        """Check if record exists with given filters"""
        query = select(self.model.id)
        
        # Apply filters
        for key, value in filters.items():
            if hasattr(self.model, key):
                query = query.where(getattr(self.model, key) == value)
        
        query = query.limit(1)
        result = await self.db.execute(query)
        return result.scalar_one_or_none() is not None