"""
User schemas for profile management
"""

import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    """Base user schema"""
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=100)
    username: str = Field(..., min_length=3, max_length=50)
    bio: Optional[str] = Field(None, max_length=500)
    avatar: Optional[str] = None


class UserCreate(UserBase):
    """User creation schema"""
    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    """User update schema"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    bio: Optional[str] = Field(None, max_length=500)
    avatar: Optional[str] = None


class UserResponse(UserBase):
    """User response schema"""
    id: uuid.UUID
    is_active: bool
    is_verified: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class UserProfile(BaseModel):
    """Public user profile schema"""
    id: uuid.UUID
    username: str
    name: str
    bio: Optional[str] = None
    avatar: Optional[str] = None
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserStats(BaseModel):
    """User statistics schema"""
    posts_count: int = 0
    followers_count: int = 0
    following_count: int = 0