"""
Authentication API routes - Production Ready
Handles JWT authentication with standardized responses
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.auth import AuthService
from app.schemas.auth import UserRegister, UserLogin, TokenResponse, RefreshTokenRequest
from app.schemas.user import UserResponse
from app.schemas.response import APIResponse
from app.api.deps.auth import get_current_user

router = APIRouter()


@router.post("/register", response_model=APIResponse[UserResponse], status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserRegister,
    db: AsyncSession = Depends(get_db)
):
    """Register a new user account"""
    try:
        auth_service = AuthService(db)
        result = await auth_service.register(user_data)
        return APIResponse.success_response(result, "User registered successfully")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/login", response_model=APIResponse[TokenResponse])
async def login(
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    """Authenticate user and return JWT tokens"""
    try:
        auth_service = AuthService(db)
        result = await auth_service.login(credentials)
        return APIResponse.success_response(result, "Login successful")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )


@router.post("/refresh", response_model=APIResponse[dict])
async def refresh_token(
    refresh_data: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    """Refresh access token using refresh token"""
    try:
        auth_service = AuthService(db)
        result = await auth_service.refresh_token(refresh_data.refresh_token)
        return APIResponse.success_response(result, "Token refreshed successfully")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )


@router.get("/me", response_model=APIResponse[UserResponse])
async def get_current_user_info(
    current_user = Depends(get_current_user)
):
    """Get current authenticated user information"""
    return APIResponse.success_response(current_user, "User information retrieved")


@router.post("/logout", response_model=APIResponse[dict])
async def logout():
    """Logout user (client should discard tokens)"""
    return APIResponse.success_response(
        {"logged_out": True}, 
        "Successfully logged out"
    )