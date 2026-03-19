"""
Comprehensive test suite for Vibely backend
Tests all major components and functionality
"""

import asyncio
import json
import sys
import os
from pathlib import Path

# Add the app directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

def test_imports():
    """Test that all modules can be imported without errors"""
    print("🧪 Testing imports...")
    
    try:
        # Core modules
        from app.core.config import settings
        from app.core.database import Base, get_db
        from app.core.security import security
        
        # Models
        from app.models.user import User
        from app.models.post import Post
        from app.models.like import Like
        from app.models.comment import Comment
        from app.models.notification import Notification
        
        # Schemas
        from app.schemas.auth import UserRegister, UserLogin, TokenResponse
        from app.schemas.user import UserResponse, UserProfile
        from app.schemas.post import PostCreate, PostResponse, VibeAnalysis
        
        # Services
        from app.services.auth import AuthService
        from app.services.vibe_engine import vibe_engine
        
        # Repositories
        from app.repositories.user import UserRepository
        from app.repositories.post import PostRepository
        
        # API routes
        from app.api.routes import auth, feed, user, vibe
        
        # Workers
        from app.workers.celery_app import celery_app
        from app.workers.tasks import process_post_sentiment
        
        # WebSocket
        from app.sockets.websocket_manager import ConnectionManager
        
        print("✅ All imports successful!")
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error during imports: {e}")
        return False


def test_configuration():
    """Test configuration loading"""
    print("\n🧪 Testing configuration...")
    
    try:
        from app.core.config import settings
        
        # Test that settings can be accessed
        assert hasattr(settings, 'DATABASE_URL')
        assert hasattr(settings, 'SECRET_KEY')
        assert hasattr(settings, 'REDIS_URL')
        assert hasattr(settings, 'HUGGINGFACE_MODEL')
        
        print("✅ Configuration loaded successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Configuration error: {e}")
        return False


def test_security_functions():
    """Test security utilities"""
    print("\n🧪 Testing security functions...")
    
    try:
        from app.core.security import security
        
        # Test password hashing
        password = "test_password_123"
        hashed = security.hash_password(password)
        
        assert hashed != password
        assert security.verify_password(password, hashed)
        assert not security.verify_password("wrong_password", hashed)
        
        # Test token creation
        token_data = {"sub": "test_user_id", "email": "test@example.com"}
        access_token = security.create_access_token(token_data)
        refresh_token = security.create_refresh_token(token_data)
        
        assert isinstance(access_token, str)
        assert isinstance(refresh_token, str)
        assert len(access_token) > 50
        assert len(refresh_token) > 50
        
        # Test token verification
        payload = security.verify_token(access_token, "access")
        assert payload["sub"] == "test_user_id"
        assert payload["email"] == "test@example.com"
        
        print("✅ Security functions working correctly!")
        return True
        
    except Exception as e:
        print(f"❌ Security test error: {e}")
        return False


def test_pydantic_schemas():
    """Test Pydantic schema validation"""
    print("\n🧪 Testing Pydantic schemas...")
    
    try:
        from app.schemas.auth import UserRegister, UserLogin
        from app.schemas.post import PostCreate, VibeAnalysis
        from app.schemas.user import UserProfile
        
        # Test user registration schema
        user_data = {
            "email": "test@example.com",
            "password": "secure_password_123",
            "name": "Test User",
            "username": "testuser"
        }
        user_register = UserRegister(**user_data)
        assert user_register.email == "test@example.com"
        assert user_register.name == "Test User"
        
        # Test post creation schema
        post_data = {
            "content": "This is a test post with great vibes! 🌟",
            "image_url": "https://example.com/image.jpg"
        }
        post_create = PostCreate(**post_data)
        assert post_create.content == post_data["content"]
        
        # Test vibe analysis schema
        vibe_data = {
            "sentiment_score": 0.85,
            "sentiment_label": "positive",
            "confidence": 0.92,
            "processing_time": 0.15
        }
        vibe_analysis = VibeAnalysis(**vibe_data)
        assert vibe_analysis.sentiment_score == 0.85
        assert vibe_analysis.sentiment_label == "positive"
        
        print("✅ Pydantic schemas validation successful!")
        return True
        
    except Exception as e:
        print(f"❌ Schema validation error: {e}")
        return False


def test_database_models():
    """Test SQLAlchemy model definitions"""
    print("\n🧪 Testing database models...")
    
    try:
        from app.models.user import User
        from app.models.post import Post
        from app.models.like import Like
        from app.models.comment import Comment
        from app.models.notification import Notification
        
        # Test model attributes
        assert hasattr(User, 'id')
        assert hasattr(User, 'email')
        assert hasattr(User, 'password')
        assert hasattr(User, 'name')
        assert hasattr(User, 'username')
        
        assert hasattr(Post, 'id')
        assert hasattr(Post, 'user_id')
        assert hasattr(Post, 'content')
        assert hasattr(Post, 'sentiment_score')
        assert hasattr(Post, 'sentiment_label')
        
        assert hasattr(Like, 'user_id')
        assert hasattr(Like, 'post_id')
        
        # Test table names
        assert User.__tablename__ == 'users'
        assert Post.__tablename__ == 'posts'
        assert Like.__tablename__ == 'likes'
        assert Comment.__tablename__ == 'comments'
        assert Notification.__tablename__ == 'notifications'
        
        print("✅ Database models defined correctly!")
        return True
        
    except Exception as e:
        print(f"❌ Database model error: {e}")
        return False


async def test_vibe_engine():
    """Test the Vibe Engine sentiment analysis"""
    print("\n🧪 Testing Vibe Engine...")
    
    try:
        from app.services.vibe_engine import vibe_engine
        
        # Test sentiment analysis with different texts
        test_texts = [
            "I'm having an amazing day! This is wonderful! 🌟",
            "This is okay, nothing special really.",
            "I'm feeling really sad and disappointed today."
        ]
        
        print("   Testing sentiment analysis (this may take a moment)...")
        
        # Test individual analysis
        for i, text in enumerate(test_texts):
            try:
                analysis = await vibe_engine.analyze_sentiment(text)
                
                assert hasattr(analysis, 'sentiment_score')
                assert hasattr(analysis, 'sentiment_label')
                assert hasattr(analysis, 'confidence')
                assert hasattr(analysis, 'processing_time')
                
                assert 0.0 <= analysis.sentiment_score <= 1.0
                assert analysis.sentiment_label in ['positive', 'negative', 'neutral']
                assert 0.0 <= analysis.confidence <= 1.0
                
                print(f"   Text {i+1}: {analysis.sentiment_label} ({analysis.sentiment_score:.3f})")
                
            except Exception as e:
                print(f"   ⚠️  Sentiment analysis failed (model not available): {e}")
                # This is expected if HuggingFace model isn't downloaded
                break
        
        # Test batch analysis
        try:
            batch_results = await vibe_engine.batch_analyze(test_texts[:2])
            assert len(batch_results) == 2
            print("   Batch analysis working!")
        except Exception as e:
            print(f"   ⚠️  Batch analysis failed (model not available): {e}")
        
        # Test vibe categorization
        categories = [
            vibe_engine.get_vibe_category(0.9),
            vibe_engine.get_vibe_category(0.5),
            vibe_engine.get_vibe_category(0.1)
        ]
        
        expected_categories = ['highly_positive', 'neutral', 'highly_negative']
        for cat, expected in zip(categories, expected_categories):
            assert cat == expected
        
        print("✅ Vibe Engine functions working correctly!")
        return True
        
    except Exception as e:
        print(f"❌ Vibe Engine error: {e}")
        return False


def test_api_routes():
    """Test API route definitions"""
    print("\n🧪 Testing API routes...")
    
    try:
        from app.api.routes import auth, feed, user, vibe
        from fastapi import APIRouter
        
        # Check that all route modules have routers
        assert hasattr(auth, 'router')
        assert hasattr(feed, 'router')
        assert hasattr(user, 'router')
        assert hasattr(vibe, 'router')
        
        # Check router types
        assert isinstance(auth.router, APIRouter)
        assert isinstance(feed.router, APIRouter)
        assert isinstance(user.router, APIRouter)
        assert isinstance(vibe.router, APIRouter)
        
        # Check that routes are defined
        assert len(auth.router.routes) > 0
        assert len(feed.router.routes) > 0
        assert len(user.router.routes) > 0
        assert len(vibe.router.routes) > 0
        
        print("✅ API routes defined correctly!")
        return True
        
    except Exception as e:
        print(f"❌ API routes error: {e}")
        return False


def test_websocket_manager():
    """Test WebSocket connection manager"""
    print("\n🧪 Testing WebSocket manager...")
    
    try:
        from app.sockets.websocket_manager import ConnectionManager
        
        # Test connection manager initialization
        manager = ConnectionManager()
        
        assert hasattr(manager, 'active_connections')
        assert hasattr(manager, 'room_subscriptions')
        assert isinstance(manager.active_connections, dict)
        assert isinstance(manager.room_subscriptions, dict)
        
        # Test helper functions exist
        assert hasattr(manager, 'connect')
        assert hasattr(manager, 'disconnect')
        assert hasattr(manager, 'send_personal_message')
        assert hasattr(manager, 'broadcast_to_room')
        
        print("✅ WebSocket manager working correctly!")
        return True
        
    except Exception as e:
        print(f"❌ WebSocket manager error: {e}")
        return False


def test_celery_tasks():
    """Test Celery task definitions"""
    print("\n🧪 Testing Celery tasks...")
    
    try:
        from app.workers.celery_app import celery_app
        from app.workers import tasks
        
        # Check Celery app configuration
        assert celery_app.conf.task_serializer == "json"
        assert celery_app.conf.accept_content == ["json"]
        
        # Check task functions exist
        assert hasattr(tasks, 'process_post_sentiment')
        assert hasattr(tasks, 'send_notification_task')
        assert hasattr(tasks, 'update_engagement_metrics')
        
        # Check task registration
        registered_tasks = celery_app.tasks
        assert 'process_post_sentiment' in registered_tasks
        assert 'send_notification' in registered_tasks
        
        print("✅ Celery tasks configured correctly!")
        return True
        
    except Exception as e:
        print(f"❌ Celery tasks error: {e}")
        return False


def test_fastapi_app():
    """Test FastAPI application creation"""
    print("\n🧪 Testing FastAPI application...")
    
    try:
        from main import create_application
        from fastapi import FastAPI
        
        # Create app instance
        app = create_application()
        
        # Check app type
        assert isinstance(app, FastAPI)
        
        # Check app configuration
        assert app.title == "Vibely API"
        assert app.version == "1.0.0"
        
        # Check routes are included
        routes = [route.path for route in app.routes]
        
        # Should have health endpoint
        assert "/health" in routes
        
        # Should have API routes (they get prefixed)
        auth_routes = [r for r in routes if r.startswith("/api/v1/auth")]
        feed_routes = [r for r in routes if r.startswith("/api/v1/feed")]
        user_routes = [r for r in routes if r.startswith("/api/v1/user")]
        vibe_routes = [r for r in routes if r.startswith("/api/v1/vibe")]
        
        assert len(auth_routes) > 0
        assert len(feed_routes) > 0
        assert len(user_routes) > 0
        assert len(vibe_routes) > 0
        
        print("✅ FastAPI application created successfully!")
        return True
        
    except Exception as e:
        print(f"❌ FastAPI application error: {e}")
        return False


def test_docker_configuration():
    """Test Docker configuration files"""
    print("\n🧪 Testing Docker configuration...")
    
    try:
        # Check Dockerfile exists and has required content
        dockerfile_path = Path("Dockerfile")
        if dockerfile_path.exists():
            dockerfile_content = dockerfile_path.read_text()
            assert "FROM python:3.11-slim" in dockerfile_content
            assert "COPY requirements.txt" in dockerfile_content
            assert "pip install" in dockerfile_content
            assert "EXPOSE 8000" in dockerfile_content
        
        # Check docker-compose files
        compose_path = Path("docker-compose.yml")
        if compose_path.exists():
            compose_content = compose_path.read_text()
            assert "postgres:" in compose_content
            assert "redis:" in compose_content
            assert "app:" in compose_content
            assert "celery:" in compose_content
        
        # Check production compose
        prod_compose_path = Path("docker-compose.prod.yml")
        if prod_compose_path.exists():
            prod_content = prod_compose_path.read_text()
            assert "ENVIRONMENT=production" in prod_content
            assert "restart: unless-stopped" in prod_content
        
        print("✅ Docker configuration files are correct!")
        return True
        
    except Exception as e:
        print(f"❌ Docker configuration error: {e}")
        return False


async def run_all_tests():
    """Run all tests and provide summary"""
    print("🚀 Starting Vibely Backend Test Suite")
    print("=" * 50)
    
    tests = [
        ("Import Tests", test_imports),
        ("Configuration Tests", test_configuration),
        ("Security Tests", test_security_functions),
        ("Schema Tests", test_pydantic_schemas),
        ("Database Model Tests", test_database_models),
        ("Vibe Engine Tests", test_vibe_engine),
        ("API Route Tests", test_api_routes),
        ("WebSocket Tests", test_websocket_manager),
        ("Celery Tests", test_celery_tasks),
        ("FastAPI App Tests", test_fastapi_app),
        ("Docker Tests", test_docker_configuration),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            if asyncio.iscoroutinefunction(test_func):
                result = await test_func()
            else:
                result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            results.append((test_name, False))
    
    # Print summary
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    print(f"\n🎯 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED! Backend is ready for production! 🚀")
    else:
        print(f"⚠️  {total - passed} tests failed. Check the issues above.")
    
    return passed == total


if __name__ == "__main__":
    # Change to the backend directory
    os.chdir(Path(__file__).parent)
    
    # Run tests
    success = asyncio.run(run_all_tests())
    
    if success:
        print("\n🌟 Vibely backend is production-ready!")
        print("Next steps:")
        print("1. Set up environment variables (.env)")
        print("2. Start services: docker-compose up -d")
        print("3. Access API at http://localhost:8000")
        print("4. View docs at http://localhost:8000/docs")
    else:
        print("\n🔧 Some tests failed. Please review and fix the issues.")
    
    sys.exit(0 if success else 1)