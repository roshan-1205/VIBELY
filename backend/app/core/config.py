"""
Application configuration using Pydantic Settings
Production-ready environment management
"""

from typing import List, Optional
from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # Database
    DATABASE_URL: str = Field(..., description="Async PostgreSQL connection string")
    DATABASE_URL_SYNC: str = Field(..., description="Sync PostgreSQL connection string")
    
    # Redis
    REDIS_URL: str = Field(default="redis://localhost:6379/0")
    
    # JWT Security
    SECRET_KEY: str = Field(..., min_length=32, description="JWT secret key")
    ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30)
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(default=7)
    
    # Environment
    ENVIRONMENT: str = Field(default="development")
    DEBUG: bool = Field(default=False)
    
    # CORS
    ALLOWED_ORIGINS: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:8080"]
    )
    
    # Celery
    CELERY_BROKER_URL: str = Field(default="redis://localhost:6379/1")
    CELERY_RESULT_BACKEND: str = Field(default="redis://localhost:6379/2")
    
    # AI/ML
    HUGGINGFACE_MODEL: str = Field(
        default="cardiffnlp/twitter-roberta-base-sentiment-latest"
    )
    OPENAI_API_KEY: Optional[str] = Field(default=None)
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = Field(default=60)
    
    # Pagination
    DEFAULT_PAGE_SIZE: int = Field(default=20)
    MAX_PAGE_SIZE: int = Field(default=100)
    
    # File Upload
    MAX_FILE_SIZE: int = Field(default=10 * 1024 * 1024)  # 10MB
    ALLOWED_FILE_TYPES: List[str] = Field(
        default=["image/jpeg", "image/png", "image/webp"]
    )

    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()