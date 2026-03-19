"""
Like model for post engagement
"""

import uuid
from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Like(Base):
    """Like model with composite unique constraint"""
    
    __tablename__ = "likes"
    
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
    post_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("posts.id", ondelete="CASCADE"),
        index=True
    )
    
    # Timestamp
    created_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow,
        index=True
    )
    
    # Relationships
    user = relationship("User", back_populates="likes")
    post = relationship("Post", back_populates="likes")
    
    # Constraints
    __table_args__ = (
        UniqueConstraint("user_id", "post_id", name="uq_user_post_like"),
    )
    
    def __repr__(self) -> str:
        return f"<Like(id={self.id}, user_id={self.user_id}, post_id={self.post_id})>"