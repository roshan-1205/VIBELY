"""
Authentication schemas for request/response validation
"""

from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    """User registration request schema"""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=8, description="User password")
    name: str = Field(..., min_length=1, max_length=100, description="User full name")
    username: str = Field(..., min_length=3, max_length=50, description="Unique username")


class UserLogin(BaseModel):
    """User login request schema"""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., description="User password")


class TokenResponse(BaseModel):
    """Token response schema"""
    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="JWT refresh token")
    token_type: str = Field(default="bearer", description="Token type")
    expires_in: int = Field(..., description="Token expiration in seconds")


class RefreshTokenRequest(BaseModel):
    """Refresh token request schema"""
    refresh_token: str = Field(..., description="JWT refresh token")


class TokenPayload(BaseModel):
    """Token payload schema for internal use"""
    sub: str = Field(..., description="Subject (user ID)")
    exp: int = Field(..., description="Expiration timestamp")
    type: str = Field(..., description="Token type")


class PasswordReset(BaseModel):
    """Password reset request schema"""
    email: EmailStr = Field(..., description="User email address")


class PasswordResetConfirm(BaseModel):
    """Password reset confirmation schema"""
    token: str = Field(..., description="Reset token")
    new_password: str = Field(..., min_length=8, description="New password")