"""
User model for authentication and profile management
"""

import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class User(Base):
    """User model with authentication and profile data"""
    
    __tablename__ = "users"
    
    # Primary key
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    
    # Authentication fields
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password: Mapped[str] = mapped_column(String(255))
    
    # Profile fields
    name: Mapped[str] = mapped_column(String(100))
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    bio: Mapped[str] = mapped_column(Text, nullable=True)
    avatar: Mapped[str] = mapped_column(String(500), nullable=True)
    
    # Status fields
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow,
        index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
    last_login: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    
    # Relationships
    posts = relationship("Post", back_populates="author", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="user", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="author", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email}, username={self.username})>"