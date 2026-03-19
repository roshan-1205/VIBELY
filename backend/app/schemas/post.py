"""
Post schemas for social media content
"""

import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

from app.schemas.user import UserProfile


class PostCreate(BaseModel):
    """Post creation schema"""
    content: str = Field(..., min_length=1, max_length=2000, description="Post content")
    image_url: Optional[str] = Field(None, description="Optional image URL")


class PostUpdate(BaseModel):
    """Post update schema"""
    content: Optional[str] = Field(None, min_length=1, max_length=2000)


class PostResponse(BaseModel):
    """Post response schema"""
    id: uuid.UUID
    content: str
    image_url: Optional[str] = None
    sentiment_score: Optional[float] = None
    sentiment_label: Optional[str] = None
    likes_count: int = 0
    comments_count: int = 0
    created_at: datetime
    updated_at: datetime
    author: UserProfile
    is_liked: bool = False  # Whether current user liked this post
    
    class Config:
        from_attributes = True


class PostFeed(BaseModel):
    """Feed response schema with cursor pagination"""
    posts: List[PostResponse]
    next_cursor: Optional[str] = None
    has_more: bool = False


class PostStats(BaseModel):
    """Post statistics schema"""
    total_posts: int = 0
    total_likes: int = 0
    total_comments: int = 0
    avg_sentiment: Optional[float] = None


class VibeAnalysis(BaseModel):
    """Vibe analysis result schema"""
    sentiment_score: float = Field(..., ge=0.0, le=1.0, description="Sentiment score 0-1")
    sentiment_label: str = Field(..., description="Sentiment label")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score")
    processing_time: float = Field(..., description="Processing time in seconds")