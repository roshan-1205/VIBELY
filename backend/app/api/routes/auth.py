"""
Authentication API routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.auth import AuthService
from app.schemas.auth import UserRegister, UserLogin, TokenResponse, RefreshTokenRequest
from app.schemas.user import UserResponse
from app.api.deps.auth import get_current_user

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserRegister,
    db: AsyncSession = Depends(get_db)
):
    """Register a new user account"""
    auth_service = AuthService(db)
    return await auth_service.register(user_data)


@router.post("/login", response_model=TokenResponse)
async def login(
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    """Authenticate user and return JWT tokens"""
    auth_service = AuthService(db)
    return await auth_service.login(credentials)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    refresh_data: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    """Refresh access token using refresh token"""
    auth_service = AuthService(db)
    return await auth_service.refresh_token(refresh_data.refresh_token)


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: UserResponse = Depends(get_current_user)
):
    """Get current authenticated user information"""
    return current_user


@router.post("/logout")
async def logout():
    """Logout user (client should discard tokens)"""
    return {"message": "Successfully logged out"}