"""
User management API routes
"""

from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.user import UserRepository
from app.schemas.user import UserResponse, UserUpdate, UserProfile
from app.api.deps.auth import get_current_user

router = APIRouter()


@router.get("/profile/{user_id}", response_model=UserProfile)
async def get_user_profile(
    user_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get public user profile by ID"""
    user_repo = UserRepository(db)
    user = await user_repo.get(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserProfile.model_validate(user)


@router.put("/update", response_model=UserResponse)
async def update_profile(
    user_data: UserUpdate,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update current user's profile"""
    user_repo = UserRepository(db)
    
    # Only update provided fields
    update_data = user_data.model_dump(exclude_unset=True)
    
    if not update_data:
        return current_user
    
    updated_user = await user_repo.update(current_user.id, update_data)
    
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse.model_validate(updated_user)


@router.get("/search", response_model=list[UserProfile])
async def search_users(
    q: str = Query(..., min_length=2, description="Search query"),
    limit: int = Query(20, ge=1, le=50, description="Number of results"),
    db: AsyncSession = Depends(get_db)
):
    """Search users by name or username"""
    user_repo = UserRepository(db)
    users = await user_repo.search_users(q, limit)
    
    return [UserProfile.model_validate(user) for user in users]


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: UUID,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user details (authenticated endpoint)"""
    user_repo = UserRepository(db)
    user = await user_repo.get(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse.model_validate(user)