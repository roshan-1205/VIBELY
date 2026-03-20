"""
Standardized API Response Schemas
"""

from typing import Any, Optional, Generic, TypeVar
from pydantic import BaseModel

T = TypeVar('T')

class APIResponse(BaseModel, Generic[T]):
    """Standardized API response format"""
    success: bool
    data: Optional[T] = None
    message: Optional[str] = None
    
    @classmethod
    def success_response(cls, data: T, message: Optional[str] = None):
        """Create success response"""
        return cls(success=True, data=data, message=message)
    
    @classmethod
    def error_response(cls, message: str, data: Optional[T] = None):
        """Create error response"""
        return cls(success=False, data=data, message=message)

class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated response format"""
    items: list[T]
    total: int
    page: int
    size: int
    has_next: bool
    next_offset: Optional[int] = None

class FeedResponse(BaseModel):
    """Feed-specific response format"""
    posts: list[Any]
    next_offset: Optional[int] = None
    has_more: bool = False
    total: int = 0