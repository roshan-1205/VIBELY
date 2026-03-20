"""
Vibely Backend - Production-grade social media platform
Entry point for FastAPI application
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.core.config import settings
from app.core.database import init_db
from app.core.middlewares import (
    LoggingMiddleware,
    ErrorHandlingMiddleware,
    RateLimitMiddleware
)
from app.api.routes import auth, feed, user, vibe, notifications
from app.sockets.websocket_manager import websocket_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    await init_db()
    yield
    # Shutdown
    pass


def create_application() -> FastAPI:
    """Create and configure FastAPI application"""
    
    app = FastAPI(
        title="Vibely API",
        description="Production-grade social media platform backend",
        version="1.0.0",
        docs_url="/docs" if settings.DEBUG else None,
        redoc_url="/redoc" if settings.DEBUG else None,
        lifespan=lifespan
    )

    # Security Middlewares
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])
    
    # CORS Middleware - Enable frontend connection
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"] + settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

    # Custom Middlewares
    app.add_middleware(ErrorHandlingMiddleware)
    app.add_middleware(LoggingMiddleware)
    app.add_middleware(RateLimitMiddleware)

    # API Routes
    app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
    app.include_router(user.router, prefix="/api/v1/user", tags=["Users"])
    app.include_router(feed.router, prefix="/api/v1/feed", tags=["Feed"])
    app.include_router(vibe.router, prefix="/api/v1/vibe", tags=["Vibe Engine"])
    app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["Notifications"])
    
    # WebSocket Routes
    app.include_router(websocket_router, prefix="/ws")

    @app.get("/health")
    async def health_check():
        return {"status": "healthy", "version": "1.0.0"}

    return app


app = create_application()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info"
    )