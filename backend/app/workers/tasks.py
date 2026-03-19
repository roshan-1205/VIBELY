"""
Background tasks for async processing
Sentiment analysis, notifications, metrics updates
"""

import asyncio
from typing import Dict, Any
from celery import current_task
from loguru import logger
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.workers.celery_app import celery_app
from app.core.config import settings
from app.services.vibe_engine import vibe_engine
from app.sockets.websocket_manager import broadcast_vibe_update, send_notification

# Sync database session for Celery tasks
sync_engine = create_engine(settings.DATABASE_URL_SYNC)
SyncSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=sync_engine)


@celery_app.task(bind=True, name="process_post_sentiment")
def process_post_sentiment(self, post_id: str, content: str):
    """
    Process sentiment analysis for a post
    Updates post with sentiment data and broadcasts via WebSocket
    """
    try:
        logger.info(f"Processing sentiment for post {post_id}")
        
        # Update task state
        self.update_state(
            state="PROGRESS",
            meta={"current": 0, "total": 100, "status": "Analyzing sentiment..."}
        )
        
        # Run sentiment analysis
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            analysis = loop.run_until_complete(vibe_engine.analyze_sentiment(content))
        finally:
            loop.close()
        
        # Update database
        with SyncSessionLocal() as db:
            from app.models.post import Post
            
            post = db.query(Post).filter(Post.id == post_id).first()
            if post:
                post.sentiment_score = analysis.sentiment_score
                post.sentiment_label = analysis.sentiment_label
                db.commit()
                
                logger.info(
                    f"Updated post {post_id} with sentiment: "
                    f"{analysis.sentiment_label} ({analysis.sentiment_score})"
                )
        
        # Broadcast update via WebSocket
        sentiment_data = {
            "score": analysis.sentiment_score,
            "label": analysis.sentiment_label,
            "confidence": analysis.confidence
        }
        
        # This would need to be called from an async context in production
        # For now, we'll log the broadcast
        logger.info(f"Broadcasting vibe update for post {post_id}: {sentiment_data}")
        
        return {
            "post_id": post_id,
            "sentiment_score": analysis.sentiment_score,
            "sentiment_label": analysis.sentiment_label,
            "processing_time": analysis.processing_time
        }
        
    except Exception as e:
        logger.error(f"Sentiment processing failed for post {post_id}: {e}")
        self.update_state(
            state="FAILURE",
            meta={"error": str(e)}
        )
        raise


@celery_app.task(name="send_notification")
def send_notification_task(user_id: str, notification_data: Dict[str, Any]):
    """
    Send real-time notification to user
    Stores in database and broadcasts via WebSocket
    """
    try:
        logger.info(f"Sending notification to user {user_id}")
        
        # Store notification in database
        with SyncSessionLocal() as db:
            from app.models.notification import Notification
            
            notification = Notification(
                user_id=user_id,
                type=notification_data.get("type", "general"),
                title=notification_data.get("title", ""),
                message=notification_data.get("message", ""),
                metadata=notification_data.get("metadata")
            )
            
            db.add(notification)
            db.commit()
            db.refresh(notification)
            
            logger.info(f"Stored notification {notification.id} for user {user_id}")
        
        # Broadcast via WebSocket (would need async context in production)
        logger.info(f"Broadcasting notification to user {user_id}: {notification_data}")
        
        return {
            "user_id": user_id,
            "notification_id": str(notification.id),
            "status": "sent"
        }
        
    except Exception as e:
        logger.error(f"Notification sending failed for user {user_id}: {e}")
        raise


@celery_app.task(name="update_engagement_metrics")
def update_engagement_metrics(post_id: str):
    """
    Update engagement metrics for a post
    Recalculates likes and comments counts
    """
    try:
        logger.info(f"Updating engagement metrics for post {post_id}")
        
        with SyncSessionLocal() as db:
            from app.models.post import Post
            from app.models.like import Like
            from app.models.comment import Comment
            
            # Get current counts
            likes_count = db.query(Like).filter(Like.post_id == post_id).count()
            comments_count = db.query(Comment).filter(Comment.post_id == post_id).count()
            
            # Update post
            post = db.query(Post).filter(Post.id == post_id).first()
            if post:
                post.likes_count = likes_count
                post.comments_count = comments_count
                db.commit()
                
                logger.info(
                    f"Updated post {post_id} metrics: "
                    f"{likes_count} likes, {comments_count} comments"
                )
        
        return {
            "post_id": post_id,
            "likes_count": likes_count,
            "comments_count": comments_count
        }
        
    except Exception as e:
        logger.error(f"Metrics update failed for post {post_id}: {e}")
        raise


@celery_app.task(name="batch_sentiment_analysis")
def batch_sentiment_analysis(post_ids: list[str]):
    """
    Process sentiment analysis for multiple posts in batch
    More efficient for bulk operations
    """
    try:
        logger.info(f"Processing batch sentiment analysis for {len(post_ids)} posts")
        
        results = []
        
        with SyncSessionLocal() as db:
            from app.models.post import Post
            
            # Get posts
            posts = db.query(Post).filter(Post.id.in_(post_ids)).all()
            
            # Extract content
            texts = [post.content for post in posts]
            
            # Run batch analysis
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            try:
                analyses = loop.run_until_complete(vibe_engine.batch_analyze(texts))
            finally:
                loop.close()
            
            # Update posts
            for post, analysis in zip(posts, analyses):
                post.sentiment_score = analysis.sentiment_score
                post.sentiment_label = analysis.sentiment_label
                
                results.append({
                    "post_id": str(post.id),
                    "sentiment_score": analysis.sentiment_score,
                    "sentiment_label": analysis.sentiment_label
                })
            
            db.commit()
            
            logger.info(f"Completed batch sentiment analysis for {len(results)} posts")
        
        return {
            "processed_count": len(results),
            "results": results
        }
        
    except Exception as e:
        logger.error(f"Batch sentiment analysis failed: {e}")
        raise


@celery_app.task(name="cleanup_old_notifications")
def cleanup_old_notifications(days: int = 30):
    """
    Clean up old notifications to maintain database performance
    """
    try:
        from datetime import datetime, timedelta
        
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        with SyncSessionLocal() as db:
            from app.models.notification import Notification
            
            # Delete old notifications
            deleted_count = db.query(Notification).filter(
                Notification.created_at < cutoff_date
            ).delete()
            
            db.commit()
            
            logger.info(f"Cleaned up {deleted_count} old notifications")
        
        return {
            "deleted_count": deleted_count,
            "cutoff_date": cutoff_date.isoformat()
        }
        
    except Exception as e:
        logger.error(f"Notification cleanup failed: {e}")
        raise