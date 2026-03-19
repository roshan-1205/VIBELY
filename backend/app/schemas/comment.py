"""
Comment schemas for post discussions
"""

import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

from app.schemas.user import UserProfile


class CommentCreate(BaseModel):
    """Comment creation schema"""
    content: str = Field(..., min_length=1, max_length=1000, description="Comment content")


class CommentUpdate(BaseModel):
    """Comment update schema"""
    content: str = Field(..., min_length=1, max_length=1000, description="Updated comment content")


class CommentResponse(BaseModel):
    """Comment response schema"""
    id: uuid.UUID
    content: str
    created_at: datetime
    updated_at: datetime
    author: UserProfile
    
    class Config:
        from_attributes = True


class CommentList(BaseModel):
    """Comments list response schema"""
    comments: List[CommentResponse]
    total: int
    page: int
    size: int
    has_more: bool