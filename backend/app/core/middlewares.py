"""
Custom middleware for logging, error handling, and rate limiting
Production-ready middleware stack
"""

import time
import uuid
from typing import Callable
from fastapi import Request, Response, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from loguru import logger
import redis.asyncio as redis

from app.core.config import settings


class LoggingMiddleware(BaseHTTPMiddleware):
    """Request/Response logging middleware"""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Generate request ID
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        
        # Log request
        start_time = time.time()
        logger.info(
            f"Request started",
            extra={
                "request_id": request_id,
                "method": request.method,
                "url": str(request.url),
                "client_ip": request.client.host if request.client else None,
            }
        )
        
        # Process request
        response = await call_next(request)
        
        # Log response
        process_time = time.time() - start_time
        logger.info(
            f"Request completed",
            extra={
                "request_id": request_id,
                "status_code": response.status_code,
                "process_time": f"{process_time:.4f}s",
            }
        )
        
        # Add request ID to response headers
        response.headers["X-Request-ID"] = request_id
        
        return response


class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    """Global error handling middleware"""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        try:
            return await call_next(request)
        except HTTPException:
            # Re-raise HTTP exceptions
            raise
        except Exception as exc:
            # Log unexpected errors
            request_id = getattr(request.state, "request_id", "unknown")
            logger.error(
                f"Unhandled exception",
                extra={
                    "request_id": request_id,
                    "error": str(exc),
                    "error_type": type(exc).__name__,
                }
            )
            
            # Return generic error response
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "error": "Internal server error",
                    "request_id": request_id,
                }
            )


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware using Redis"""
    
    def __init__(self, app, calls_per_minute: int = None):
        super().__init__(app)
        self.calls_per_minute = calls_per_minute or settings.RATE_LIMIT_PER_MINUTE
        self.redis_client = None
    
    async def get_redis_client(self):
        """Get Redis client (lazy initialization)"""
        if not self.redis_client:
            self.redis_client = redis.from_url(settings.REDIS_URL)
        return self.redis_client
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Skip rate limiting for health checks
        if request.url.path == "/health":
            return await call_next(request)
        
        # Get client IP
        client_ip = request.client.host if request.client else "unknown"
        
        try:
            redis_client = await self.get_redis_client()
            
            # Rate limiting key
            key = f"rate_limit:{client_ip}"
            
            # Get current count
            current = await redis_client.get(key)
            
            if current is None:
                # First request in window
                await redis_client.setex(key, 60, 1)
            else:
                current_count = int(current)
                if current_count >= self.calls_per_minute:
                    return JSONResponse(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        content={
                            "error": "Rate limit exceeded",
                            "retry_after": 60
                        }
                    )
                
                # Increment counter
                await redis_client.incr(key)
            
        except Exception as e:
            # If Redis is down, log error but don't block requests
            logger.warning(f"Rate limiting failed: {e}")
        
        return await call_next(request)