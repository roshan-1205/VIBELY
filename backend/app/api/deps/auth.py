"""
Authentication dependencies for API routes
"""

from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.auth import AuthService
from app.schemas.user import UserResponse

# Security scheme
security_scheme = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
) -> UserResponse:
    """
    Dependency to get current authenticated user
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    auth_service = AuthService(db)
    return await auth_service.get_current_user(credentials.credentials)


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
) -> Optional[UserResponse]:
    """
    Dependency to get current user (optional authentication)
    Returns None if no valid token provided
    """
    if not credentials:
        return None
    
    try:
        auth_service = AuthService(db)
        return await auth_service.get_current_user(credentials.credentials)
    except HTTPException:
        return None