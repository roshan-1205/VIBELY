"""
Post model for social media content
"""

import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Text, Float, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Post(Base):
    """Post model with sentiment analysis support"""
    
    __tablename__ = "posts"
    
    # Primary key
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    
    # Foreign keys
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True
    )
    
    # Content fields
    content: Mapped[str] = mapped_column(Text)
    image_url: Mapped[str] = mapped_column(String(500), nullable=True)
    
    # Vibe Engine fields
    sentiment_score: Mapped[float] = mapped_column(Float, nullable=True, index=True)
    sentiment_label: Mapped[str] = mapped_column(String(20), nullable=True)  # positive, negative, neutral
    
    # Engagement metrics
    likes_count: Mapped[int] = mapped_column(Integer, default=0, index=True)
    comments_count: Mapped[int] = mapped_column(Integer, default=0)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow,
        index=True  # Critical for feed performance
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
    
    # Relationships
    author = relationship("User", back_populates="posts")
    likes = relationship("Like", back_populates="post", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<Post(id={self.id}, user_id={self.user_id}, sentiment={self.sentiment_score})>"