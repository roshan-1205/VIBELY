"""
Authentication service with JWT token management
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import security
from app.core.config import settings
from app.repositories.user import UserRepository
from app.schemas.auth import UserRegister, UserLogin, TokenResponse
from app.schemas.user import UserResponse


class AuthService:
    """Authentication business logic"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)
    
    async def register(self, user_data: UserRegister) -> UserResponse:
        """Register a new user"""
        # Check if email already exists
        existing_user = await self.user_repo.get_by_email(user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Check if username already exists
        existing_username = await self.user_repo.get_by_username(user_data.username)
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        
        # Hash password and create user
        hashed_password = security.hash_password(user_data.password)
        
        user_dict = user_data.model_dump()
        user_dict["password"] = hashed_password
        
        user = await self.user_repo.create(user_dict)
        return UserResponse.model_validate(user)
    
    async def login(self, credentials: UserLogin) -> TokenResponse:
        """Authenticate user and return tokens"""
        # Get user by email
        user = await self.user_repo.get_by_email(credentials.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Verify password
        if not security.verify_password(credentials.password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Check if user is active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is deactivated"
            )
        
        # Update last login
        await self.user_repo.update_last_login(str(user.id))
        
        # Generate tokens
        token_data = {"sub": str(user.id), "email": user.email}
        
        access_token = security.create_access_token(token_data)
        refresh_token = security.create_refresh_token(token_data)
        
        return TokenResponse(
            user=UserResponse.model_validate(user),
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )
    
    async def refresh_token(self, refresh_token: str) -> TokenResponse:
        """Generate new access token from refresh token"""
        # Verify refresh token
        payload = security.verify_token(refresh_token, "refresh")
        
        # Get user
        user_id = payload.get("sub")
        user = await self.user_repo.get(UUID(user_id))
        
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        # Generate new tokens
        token_data = {"sub": str(user.id), "email": user.email}
        
        access_token = security.create_access_token(token_data)
        new_refresh_token = security.create_refresh_token(token_data)
        
        return TokenResponse(
            user=UserResponse.model_validate(user),
            access_token=access_token,
            refresh_token=new_refresh_token,
            token_type="bearer"
        )
    
    async def get_current_user(self, token: str) -> UserResponse:
        """Get current user from access token"""
        # Verify token
        payload = security.verify_token(token, "access")
        
        # Get user
        user_id = payload.get("sub")
        user = await self.user_repo.get(UUID(user_id))
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is deactivated"
            )
        
        return UserResponse.model_validate(user)