"""
Vibe Engine API routes for sentiment analysis
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.vibe_engine import vibe_engine
from app.repositories.post import PostRepository
from app.schemas.post import VibeAnalysis, PostResponse
from app.schemas.user import UserResponse
from app.api.deps.auth import get_current_user

router = APIRouter()


class TextAnalysisRequest(BaseModel):
    """Request schema for text analysis"""
    text: str = Field(..., min_length=1, max_length=2000, description="Text to analyze")


class BatchAnalysisRequest(BaseModel):
    """Request schema for batch text analysis"""
    texts: List[str] = Field(..., min_items=1, max_items=50, description="Texts to analyze")


@router.post("/analyze", response_model=VibeAnalysis)
async def analyze_text(
    request: TextAnalysisRequest,
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Analyze sentiment of text content
    Returns sentiment score, label, and confidence
    """
    try:
        analysis = await vibe_engine.analyze_sentiment(request.text)
        return analysis
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Sentiment analysis failed: {str(e)}"
        )


@router.post("/analyze/batch", response_model=List[VibeAnalysis])
async def analyze_batch(
    request: BatchAnalysisRequest,
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Analyze sentiment of multiple texts in batch
    More efficient for processing multiple texts
    """
    try:
        analyses = await vibe_engine.batch_analyze(request.texts)
        return analyses
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Batch sentiment analysis failed: {str(e)}"
        )


@router.get("/posts/by-sentiment", response_model=List[PostResponse])
async def get_posts_by_sentiment(
    sentiment: str = Query(..., regex="^(positive|negative|neutral)$", description="Sentiment filter"),
    limit: int = Query(20, ge=1, le=50, description="Number of posts"),
    db: AsyncSession = Depends(get_db)
):
    """
    Get posts filtered by sentiment category
    Enables vibe-based content discovery
    """
    post_repo = PostRepository(db)
    
    # Map sentiment to score ranges
    sentiment_ranges = {
        "positive": (0.6, 1.0),
        "neutral": (0.4, 0.6),
        "negative": (0.0, 0.4)
    }
    
    sentiment_range = sentiment_ranges[sentiment]
    posts = await post_repo.get_posts_by_sentiment(sentiment_range, limit)
    
    return [PostResponse.model_validate(post) for post in posts]


@router.get("/stats/sentiment")
async def get_sentiment_stats(
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get sentiment statistics for the platform
    Provides insights into overall vibe trends
    """
    # This would require aggregation queries in production
    # Placeholder implementation
    return {
        "total_posts_analyzed": 0,
        "sentiment_distribution": {
            "positive": 0.4,
            "neutral": 0.35,
            "negative": 0.25
        },
        "average_sentiment_score": 0.52,
        "trending_sentiment": "positive"
    }


@router.get("/health")
async def vibe_engine_health():
    """Check if the vibe engine is ready and operational"""
    try:
        # Test with a simple text
        test_analysis = await vibe_engine.analyze_sentiment("This is a test message")
        
        return {
            "status": "healthy",
            "model_loaded": vibe_engine._model_loaded,
            "test_analysis": {
                "sentiment_score": test_analysis.sentiment_score,
                "sentiment_label": test_analysis.sentiment_label,
                "processing_time": test_analysis.processing_time
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Vibe engine not ready: {str(e)}"
        )