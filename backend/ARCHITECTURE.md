# Vibely Backend Architecture

## 🏗️ Overview

Vibely backend is a high-performance, scalable Python FastAPI application designed for social media interactions with real-time capabilities. Built with modern Python practices, it delivers enterprise-grade reliability and performance.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Core Architecture](#core-architecture)
- [Database Design](#database-design)
- [API Design](#api-design)
- [Authentication & Security](#authentication--security)
- [Real-time Features](#real-time-features)
- [Background Tasks](#background-tasks)
- [Caching Strategy](#caching-strategy)
- [Monitoring & Logging](#monitoring--logging)
- [Deployment](#deployment)

## 🛠️ Tech Stack

### Core Framework
- **FastAPI 0.104+** - Modern, fast web framework
- **Python 3.11+** - Latest Python features and performance
- **Pydantic 2.0+** - Data validation and serialization
- **SQLAlchemy 2.0+** - Modern ORM with async support

### Database & Storage
- **PostgreSQL 15+** - Primary database
- **Redis 7.0+** - Caching and session storage
- **Alembic** - Database migrations
- **asyncpg** - Async PostgreSQL driver

### Authentication & Security
- **JWT (PyJWT)** - Token-based authentication
- **bcrypt** - Password hashing
- **python-multipart** - File upload support
- **CORS middleware** - Cross-origin requests

### Real-time & Background
- **WebSockets** - Real-time communication
- **Celery** - Background task processing
- **Redis** - Message broker for Celery

### Development & Testing
- **pytest** - Testing framework
- **pytest-asyncio** - Async testing support
- **httpx** - Async HTTP client for testing
- **pre-commit** - Code quality hooks
## 📁 Project Structure

```
app/
├── api/                          # API layer
│   ├── deps/                     # Dependencies and middleware
│   │   ├── auth.py              # Authentication dependencies
│   │   └── __init__.py
│   ├── routes/                   # API route handlers
│   │   ├── auth.py              # Authentication endpoints
│   │   ├── posts.py             # Post management
│   │   ├── users.py             # User management
│   │   ├── feed.py              # Social feed
│   │   └── __init__.py
│   └── __init__.py
│
├── core/                         # Core configuration
│   ├── config.py                # Application settings
│   ├── database.py              # Database configuration
│   ├── middlewares.py           # Custom middleware
│   ├── security.py              # Security utilities
│   └── __init__.py
│
├── models/                       # Database models
│   ├── user.py                  # User model
│   ├── post.py                  # Post model
│   ├── comment.py               # Comment model
│   ├── like.py                  # Like model
│   ├── notification.py          # Notification model
│   └── __init__.py
│
├── repositories/                 # Data access layer
│   ├── base.py                  # Base repository
│   ├── user.py                  # User repository
│   ├── post.py                  # Post repository
│   └── __init__.py
│
├── schemas/                      # Pydantic schemas
│   ├── auth.py                  # Authentication schemas
│   ├── user.py                  # User schemas
│   ├── post.py                  # Post schemas
│   ├── comment.py               # Comment schemas
│   └── __init__.py
│
├── services/                     # Business logic
│   ├── auth.py                  # Authentication service
│   ├── vibe_engine.py           # Vibe calculation engine
│   └── __init__.py
│
├── sockets/                      # WebSocket handlers
│   ├── websocket_manager.py     # WebSocket connection manager
│   └── __init__.py
│
├── workers/                      # Background tasks
│   ├── celery_app.py            # Celery configuration
│   ├── tasks.py                 # Background tasks
│   └── __init__.py
│
└── __init__.py

# Root files
├── main.py                       # Application entry point
├── requirements.txt              # Python dependencies
├── alembic.ini                  # Alembic configuration
├── docker-compose.yml           # Docker services
├── Dockerfile                   # Container definition
└── .env.example                 # Environment variables template
```

## 🏛️ Core Architecture

### 1. Layered Architecture

```
┌─────────────────────────────────────┐
│           API Layer                 │  ← FastAPI routes, validation
├─────────────────────────────────────┤
│         Service Layer               │  ← Business logic, orchestration
├─────────────────────────────────────┤
│       Repository Layer              │  ← Data access, queries
├─────────────────────────────────────┤
│         Model Layer                 │  ← SQLAlchemy models
├─────────────────────────────────────┤
│        Database Layer               │  ← PostgreSQL, Redis
└─────────────────────────────────────┘
```

### 2. Dependency Injection Pattern

```python
# Dependency injection for database sessions
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

# Repository injection
def get_user_repository(db: AsyncSession = Depends(get_db)) -> UserRepository:
    return UserRepository(db)

# Service injection
def get_auth_service(
    user_repo: UserRepository = Depends(get_user_repository)
) -> AuthService:
    return AuthService(user_repo)
```

### 3. Repository Pattern

```python
# Base repository with common operations
class BaseRepository(Generic[T]):
    def __init__(self, db: AsyncSession, model: Type[T]):
        self.db = db
        self.model = model
    
    async def create(self, obj_in: dict) -> T:
        db_obj = self.model(**obj_in)
        self.db.add(db_obj)
        await self.db.flush()
        await self.db.refresh(db_obj)
        return db_obj
    
    async def get(self, id: int) -> Optional[T]:
        result = await self.db.execute(
            select(self.model).where(self.model.id == id)
        )
        return result.scalar_one_or_none()
    
    async def get_multi(
        self, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[T]:
        result = await self.db.execute(
            select(self.model).offset(skip).limit(limit)
        )
        return result.scalars().all()

# Specific repository implementation
class UserRepository(BaseRepository[User]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, User)
    
    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()
    
    async def get_by_username(self, username: str) -> Optional[User]:
        result = await self.db.execute(
            select(User).where(User.username == username)
        )
        return result.scalar_one_or_none()
```
## 🗄️ Database Design

### 1. Entity Relationship Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Users    │    │    Posts    │    │  Comments   │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ id (PK)     │◄──┤ author_id   │◄──┤ author_id   │
│ username    │    │ id (PK)     │    │ post_id     │
│ email       │    │ content     │    │ id (PK)     │
│ password    │    │ created_at  │    │ content     │
│ created_at  │    │ updated_at  │    │ created_at  │
│ updated_at  │    │ vibe_score  │    └─────────────┘
│ is_active   │    └─────────────┘           │
└─────────────┘           │                 │
       │                  │                 │
       │    ┌─────────────┐│    ┌─────────────┐
       └───►│    Likes    ││    │Notifications│
            ├─────────────┤│    ├─────────────┤
            │ user_id     ││    │ id (PK)     │
            │ post_id     ││    │ user_id     │
            │ created_at  ││    │ type        │
            └─────────────┘│    │ content     │
                          │    │ read        │
            ┌─────────────┐│    │ created_at  │
            │  Follows    ││    └─────────────┘
            ├─────────────┤│
            │ follower_id ││
            │ following_id││
            │ created_at  ││
            └─────────────┘│
```

### 2. Database Models

```python
# User model with relationships
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    
    # Profile information
    full_name = Column(String(255))
    bio = Column(Text)
    avatar_url = Column(String(500))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Relationships
    posts = relationship("Post", back_populates="author", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="author", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    
    # Following relationships
    following = relationship(
        "Follow",
        foreign_keys="Follow.follower_id",
        back_populates="follower",
        cascade="all, delete-orphan"
    )
    followers = relationship(
        "Follow",
        foreign_keys="Follow.following_id",
        back_populates="following",
        cascade="all, delete-orphan"
    )

# Post model with vibe scoring
class Post(Base):
    __tablename__ = "posts"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Media
    image_url = Column(String(500))
    video_url = Column(String(500))
    
    # Engagement metrics
    vibe_score = Column(Float, default=0.0, index=True)
    likes_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    shares_count = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Status
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    
    # Relationships
    author = relationship("User", back_populates="posts")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="post", cascade="all, delete-orphan")
    
    # Indexes for performance
    __table_args__ = (
        Index('idx_posts_author_created', 'author_id', 'created_at'),
        Index('idx_posts_vibe_created', 'vibe_score', 'created_at'),
    )
```

### 3. Database Optimization

```python
# Connection pooling configuration
DATABASE_CONFIG = {
    "pool_size": 20,
    "max_overflow": 30,
    "pool_pre_ping": True,
    "pool_recycle": 3600,
    "echo": False,  # Set to True for SQL debugging
}

# Async engine setup
engine = create_async_engine(
    DATABASE_URL,
    **DATABASE_CONFIG
)

# Session factory
async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Query optimization with eager loading
async def get_posts_with_author(db: AsyncSession, limit: int = 20):
    result = await db.execute(
        select(Post)
        .options(selectinload(Post.author))  # Eager load author
        .options(selectinload(Post.likes))   # Eager load likes
        .order_by(Post.created_at.desc())
        .limit(limit)
    )
    return result.scalars().all()
```

## 🔌 API Design

### 1. RESTful API Structure

```python
# API router organization
from fastapi import APIRouter

# Main API router
api_router = APIRouter(prefix="/api/v1")

# Feature-based sub-routers
api_router.include_router(auth_router, prefix="/auth", tags=["authentication"])
api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(posts_router, prefix="/posts", tags=["posts"])
api_router.include_router(feed_router, prefix="/feed", tags=["feed"])

# Route definitions with proper HTTP methods
@posts_router.get("/", response_model=List[PostResponse])
async def get_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    post_service: PostService = Depends(get_post_service)
):
    """Get paginated list of posts"""
    return await post_service.get_posts(skip=skip, limit=limit)

@posts_router.post("/", response_model=PostResponse, status_code=201)
async def create_post(
    post_data: PostCreate,
    current_user: User = Depends(get_current_user),
    post_service: PostService = Depends(get_post_service)
):
    """Create a new post"""
    return await post_service.create_post(post_data, current_user.id)

@posts_router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: int = Path(..., gt=0),
    current_user: User = Depends(get_current_user),
    post_service: PostService = Depends(get_post_service)
):
    """Get a specific post by ID"""
    post = await post_service.get_post(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post
```

### 2. Request/Response Schemas

```python
# Pydantic schemas for validation and serialization
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, regex="^[a-zA-Z0-9_]+$")
    email: EmailStr
    full_name: Optional[str] = Field(None, max_length=255)
    bio: Optional[str] = Field(None, max_length=500)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=128)

class UserResponse(UserBase):
    id: int
    avatar_url: Optional[str]
    is_verified: bool
    created_at: datetime
    
    # Computed fields
    followers_count: int = 0
    following_count: int = 0
    posts_count: int = 0
    
    class Config:
        from_attributes = True

class PostBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)
    image_url: Optional[HttpUrl]
    video_url: Optional[HttpUrl]

class PostCreate(PostBase):
    pass

class PostResponse(PostBase):
    id: int
    author: UserResponse
    vibe_score: float
    likes_count: int
    comments_count: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    # User interaction status
    is_liked: bool = False
    is_bookmarked: bool = False
    
    class Config:
        from_attributes = True
```

### 3. Error Handling

```python
# Custom exception classes
class VibelyException(Exception):
    """Base exception for Vibely application"""
    pass

class UserNotFound(VibelyException):
    """User not found exception"""
    pass

class PostNotFound(VibelyException):
    """Post not found exception"""
    pass

class InsufficientPermissions(VibelyException):
    """Insufficient permissions exception"""
    pass

# Global exception handler
@app.exception_handler(VibelyException)
async def vibely_exception_handler(request: Request, exc: VibelyException):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc), "type": exc.__class__.__name__}
    )

@app.exception_handler(UserNotFound)
async def user_not_found_handler(request: Request, exc: UserNotFound):
    return JSONResponse(
        status_code=404,
        content={"detail": "User not found"}
    )

# Validation error handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation error",
            "errors": exc.errors()
        }
    )
```
## 🔐 Authentication & Security

### 1. JWT Authentication

```python
# JWT configuration
JWT_CONFIG = {
    "algorithm": "HS256",
    "access_token_expire_minutes": 30,
    "refresh_token_expire_days": 7,
}

# Token generation
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=JWT_CONFIG["access_token_expire_minutes"])
    
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=JWT_CONFIG["algorithm"])
    return encoded_jwt

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=JWT_CONFIG["refresh_token_expire_days"])
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=JWT_CONFIG["algorithm"])
    return encoded_jwt

# Token verification
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_CONFIG["algorithm"]])
        user_id: int = payload.get("sub")
        token_type: str = payload.get("type")
        
        if user_id is None or token_type != "access":
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception
    
    user = await get_user_by_id(db, user_id=user_id)
    if user is None:
        raise credentials_exception
    
    return user
```

### 2. Password Security

```python
# Password hashing with bcrypt
class PasswordManager:
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password using bcrypt"""
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    @staticmethod
    def verify_password(password: str, hashed: str) -> bool:
        """Verify a password against its hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    @staticmethod
    def validate_password_strength(password: str) -> bool:
        """Validate password meets security requirements"""
        if len(password) < 8:
            return False
        
        has_upper = any(c.isupper() for c in password)
        has_lower = any(c.islower() for c in password)
        has_digit = any(c.isdigit() for c in password)
        has_special = any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password)
        
        return all([has_upper, has_lower, has_digit, has_special])

# Authentication service
class AuthService:
    def __init__(self, user_repository: UserRepository):
        self.user_repo = user_repository
        self.password_manager = PasswordManager()
    
    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password"""
        user = await self.user_repo.get_by_email(email)
        if not user:
            return None
        
        if not self.password_manager.verify_password(password, user.hashed_password):
            return None
        
        return user
    
    async def register_user(self, user_data: UserCreate) -> User:
        """Register a new user"""
        # Check if user already exists
        existing_user = await self.user_repo.get_by_email(user_data.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        existing_username = await self.user_repo.get_by_username(user_data.username)
        if existing_username:
            raise HTTPException(status_code=400, detail="Username already taken")
        
        # Validate password strength
        if not self.password_manager.validate_password_strength(user_data.password):
            raise HTTPException(
                status_code=400, 
                detail="Password must contain uppercase, lowercase, digit, and special character"
            )
        
        # Hash password and create user
        hashed_password = self.password_manager.hash_password(user_data.password)
        user_dict = user_data.dict(exclude={"password"})
        user_dict["hashed_password"] = hashed_password
        
        return await self.user_repo.create(user_dict)
```

### 3. Security Middleware

```python
# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://vibely.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiting middleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Apply rate limits to endpoints
@app.post("/api/v1/auth/login")
@limiter.limit("5/minute")
async def login(request: Request, user_credentials: UserLogin):
    # Login logic
    pass

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response
```

## 🔄 Real-time Features

### 1. WebSocket Management

```python
# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, WebSocket] = {}
        self.user_rooms: Dict[int, Set[str]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: int):
        """Accept WebSocket connection and store user mapping"""
        await websocket.accept()
        self.active_connections[user_id] = websocket
        self.user_rooms[user_id] = set()
        
        # Send connection confirmation
        await self.send_personal_message({
            "type": "connection_established",
            "message": "Connected to Vibely real-time service"
        }, user_id)
    
    def disconnect(self, user_id: int):
        """Remove user connection"""
        if user_id in self.active_connections:
            del self.active_connections[user_id]
        if user_id in self.user_rooms:
            del self.user_rooms[user_id]
    
    async def send_personal_message(self, message: dict, user_id: int):
        """Send message to specific user"""
        if user_id in self.active_connections:
            try:
                await self.active_connections[user_id].send_json(message)
            except ConnectionClosed:
                self.disconnect(user_id)
    
    async def join_room(self, user_id: int, room: str):
        """Add user to a room (e.g., post comments, live feed)"""
        if user_id in self.user_rooms:
            self.user_rooms[user_id].add(room)
    
    async def leave_room(self, user_id: int, room: str):
        """Remove user from a room"""
        if user_id in self.user_rooms:
            self.user_rooms[user_id].discard(room)
    
    async def broadcast_to_room(self, message: dict, room: str):
        """Send message to all users in a room"""
        for user_id, rooms in self.user_rooms.items():
            if room in rooms:
                await self.send_personal_message(message, user_id)
    
    async def broadcast_to_followers(self, message: dict, user_id: int, db: AsyncSession):
        """Send message to all followers of a user"""
        followers = await get_user_followers(db, user_id)
        for follower in followers:
            await self.send_personal_message(message, follower.id)

manager = ConnectionManager()

# WebSocket endpoint
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(
    websocket: WebSocket, 
    user_id: int,
    token: str = Query(...),
    db: AsyncSession = Depends(get_db)
):
    # Verify JWT token
    try:
        user = await verify_websocket_token(token, db)
        if user.id != user_id:
            await websocket.close(code=1008, reason="Unauthorized")
            return
    except Exception:
        await websocket.close(code=1008, reason="Invalid token")
        return
    
    await manager.connect(websocket, user_id)
    
    try:
        while True:
            data = await websocket.receive_json()
            await handle_websocket_message(data, user_id, db)
    except WebSocketDisconnect:
        manager.disconnect(user_id)

# WebSocket message handler
async def handle_websocket_message(data: dict, user_id: int, db: AsyncSession):
    message_type = data.get("type")
    
    if message_type == "join_room":
        room = data.get("room")
        await manager.join_room(user_id, room)
    
    elif message_type == "leave_room":
        room = data.get("room")
        await manager.leave_room(user_id, room)
    
    elif message_type == "typing":
        # Handle typing indicators
        room = data.get("room")
        await manager.broadcast_to_room({
            "type": "user_typing",
            "user_id": user_id,
            "room": room
        }, room)
```

### 2. Real-time Notifications

```python
# Notification service
class NotificationService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_notification(
        self, 
        user_id: int, 
        notification_type: str, 
        content: str,
        related_id: Optional[int] = None
    ):
        """Create and send real-time notification"""
        notification = Notification(
            user_id=user_id,
            type=notification_type,
            content=content,
            related_id=related_id,
            created_at=datetime.utcnow()
        )
        
        self.db.add(notification)
        await self.db.flush()
        
        # Send real-time notification
        await manager.send_personal_message({
            "type": "notification",
            "id": notification.id,
            "notification_type": notification_type,
            "content": content,
            "created_at": notification.created_at.isoformat()
        }, user_id)
        
        return notification
    
    async def notify_post_liked(self, post: Post, liker: User):
        """Notify user when their post is liked"""
        if post.author_id != liker.id:  # Don't notify self-likes
            await self.create_notification(
                user_id=post.author_id,
                notification_type="post_liked",
                content=f"{liker.username} liked your post",
                related_id=post.id
            )
    
    async def notify_new_follower(self, followed_user_id: int, follower: User):
        """Notify user when they get a new follower"""
        await self.create_notification(
            user_id=followed_user_id,
            notification_type="new_follower",
            content=f"{follower.username} started following you",
            related_id=follower.id
        )
    
    async def notify_post_comment(self, post: Post, commenter: User, comment: str):
        """Notify user when someone comments on their post"""
        if post.author_id != commenter.id:  # Don't notify self-comments
            await self.create_notification(
                user_id=post.author_id,
                notification_type="post_commented",
                content=f"{commenter.username} commented on your post: {comment[:50]}...",
                related_id=post.id
            )
```

## ⚙️ Background Tasks

### 1. Celery Configuration

```python
# Celery app configuration
from celery import Celery

celery_app = Celery(
    "vibely",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0",
    include=["app.workers.tasks"]
)

# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)

# Task routing
celery_app.conf.task_routes = {
    "app.workers.tasks.calculate_vibe_score": {"queue": "vibe_calculation"},
    "app.workers.tasks.send_notification_email": {"queue": "notifications"},
    "app.workers.tasks.process_image_upload": {"queue": "media_processing"},
}
```

### 2. Background Tasks

```python
# Vibe score calculation task
@celery_app.task(bind=True, max_retries=3)
def calculate_vibe_score(self, post_id: int):
    """Calculate vibe score for a post using ML algorithms"""
    try:
        # Get post data
        with get_sync_db() as db:
            post = db.query(Post).filter(Post.id == post_id).first()
            if not post:
                return {"error": "Post not found"}
        
        # Calculate vibe score based on various factors
        vibe_score = VibeEngine.calculate_score(
            content=post.content,
            likes_count=post.likes_count,
            comments_count=post.comments_count,
            author_reputation=post.author.reputation_score,
            time_factor=calculate_time_decay(post.created_at)
        )
        
        # Update post with new vibe score
        with get_sync_db() as db:
            db.query(Post).filter(Post.id == post_id).update({
                "vibe_score": vibe_score
            })
            db.commit()
        
        return {"post_id": post_id, "vibe_score": vibe_score}
        
    except Exception as exc:
        # Retry with exponential backoff
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))

# Email notification task
@celery_app.task(bind=True, max_retries=3)
def send_notification_email(self, user_id: int, notification_type: str, context: dict):
    """Send email notification to user"""
    try:
        with get_sync_db() as db:
            user = db.query(User).filter(User.id == user_id).first()
            if not user or not user.email_notifications_enabled:
                return {"skipped": "User not found or notifications disabled"}
        
        # Get email template
        template = get_email_template(notification_type)
        
        # Send email
        send_email(
            to_email=user.email,
            subject=template.subject.format(**context),
            html_content=template.html.format(**context),
            text_content=template.text.format(**context)
        )
        
        return {"user_id": user_id, "notification_type": notification_type, "sent": True}
        
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))

# Image processing task
@celery_app.task(bind=True, max_retries=3)
def process_image_upload(self, image_path: str, user_id: int):
    """Process uploaded image (resize, optimize, generate thumbnails)"""
    try:
        # Process image
        processed_images = ImageProcessor.process_upload(
            image_path=image_path,
            sizes=[(150, 150), (300, 300), (800, 600)],  # thumbnail, medium, large
            quality=85,
            format="WEBP"
        )
        
        # Upload to cloud storage
        urls = {}
        for size_name, processed_path in processed_images.items():
            url = upload_to_cloud_storage(processed_path, f"images/{user_id}/{size_name}")
            urls[size_name] = url
        
        # Clean up local files
        cleanup_temp_files([image_path] + list(processed_images.values()))
        
        return {"user_id": user_id, "urls": urls}
        
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))
```
## 🚀 Caching Strategy

### 1. Redis Caching

```python
# Redis configuration
import redis.asyncio as redis
from typing import Optional, Any
import json
import pickle

class CacheManager:
    def __init__(self):
        self.redis_client = redis.Redis(
            host="localhost",
            port=6379,
            db=1,  # Use different DB for caching
            decode_responses=False  # Handle binary data
        )
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        try:
            value = await self.redis_client.get(key)
            if value:
                return pickle.loads(value)
            return None
        except Exception as e:
            logger.error(f"Cache get error: {e}")
            return None
    
    async def set(self, key: str, value: Any, expire: int = 3600):
        """Set value in cache with expiration"""
        try:
            serialized_value = pickle.dumps(value)
            await self.redis_client.setex(key, expire, serialized_value)
        except Exception as e:
            logger.error(f"Cache set error: {e}")
    
    async def delete(self, key: str):
        """Delete key from cache"""
        try:
            await self.redis_client.delete(key)
        except Exception as e:
            logger.error(f"Cache delete error: {e}")
    
    async def invalidate_pattern(self, pattern: str):
        """Invalidate all keys matching pattern"""
        try:
            keys = await self.redis_client.keys(pattern)
            if keys:
                await self.redis_client.delete(*keys)
        except Exception as e:
            logger.error(f"Cache invalidate error: {e}")

cache = CacheManager()

# Caching decorator
def cache_result(expire: int = 3600, key_prefix: str = ""):
    def decorator(func):
        async def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = f"{key_prefix}:{func.__name__}:{hash(str(args) + str(kwargs))}"
            
            # Try to get from cache
            cached_result = await cache.get(cache_key)
            if cached_result is not None:
                return cached_result
            
            # Execute function and cache result
            result = await func(*args, **kwargs)
            await cache.set(cache_key, result, expire)
            return result
        
        return wrapper
    return decorator
```

### 2. Application-Level Caching

```python
# Service layer with caching
class PostService:
    def __init__(self, post_repository: PostRepository):
        self.post_repo = post_repository
    
    @cache_result(expire=300, key_prefix="posts")  # 5 minutes
    async def get_trending_posts(self, limit: int = 20) -> List[Post]:
        """Get trending posts with caching"""
        return await self.post_repo.get_trending_posts(limit)
    
    @cache_result(expire=600, key_prefix="user_feed")  # 10 minutes
    async def get_user_feed(self, user_id: int, skip: int = 0, limit: int = 20) -> List[Post]:
        """Get personalized user feed with caching"""
        return await self.post_repo.get_user_feed(user_id, skip, limit)
    
    async def create_post(self, post_data: PostCreate, author_id: int) -> Post:
        """Create post and invalidate related caches"""
        post = await self.post_repo.create_post(post_data, author_id)
        
        # Invalidate caches
        await cache.invalidate_pattern(f"user_feed:*")
        await cache.invalidate_pattern(f"posts:get_trending_posts:*")
        
        return post
    
    async def like_post(self, post_id: int, user_id: int):
        """Like post and update cached data"""
        await self.post_repo.like_post(post_id, user_id)
        
        # Update cached post data
        cache_key = f"posts:get_post:{post_id}"
        cached_post = await cache.get(cache_key)
        if cached_post:
            cached_post.likes_count += 1
            await cache.set(cache_key, cached_post, 300)
        
        # Invalidate user feed caches
        await cache.invalidate_pattern(f"user_feed:*")

# Database query caching
class PostRepository(BaseRepository[Post]):
    @cache_result(expire=1800, key_prefix="posts")  # 30 minutes
    async def get_post_with_stats(self, post_id: int) -> Optional[Post]:
        """Get post with engagement statistics"""
        result = await self.db.execute(
            select(Post)
            .options(selectinload(Post.author))
            .options(selectinload(Post.likes))
            .options(selectinload(Post.comments))
            .where(Post.id == post_id)
        )
        return result.scalar_one_or_none()
```

### 3. Session Management

```python
# Redis-based session storage
class SessionManager:
    def __init__(self):
        self.redis_client = redis.Redis(
            host="localhost",
            port=6379,
            db=2,  # Separate DB for sessions
            decode_responses=True
        )
    
    async def create_session(self, user_id: int, session_data: dict) -> str:
        """Create new user session"""
        session_id = str(uuid.uuid4())
        session_key = f"session:{session_id}"
        
        session_data.update({
            "user_id": user_id,
            "created_at": datetime.utcnow().isoformat(),
            "last_activity": datetime.utcnow().isoformat()
        })
        
        await self.redis_client.hset(session_key, mapping=session_data)
        await self.redis_client.expire(session_key, 86400 * 7)  # 7 days
        
        return session_id
    
    async def get_session(self, session_id: str) -> Optional[dict]:
        """Get session data"""
        session_key = f"session:{session_id}"
        session_data = await self.redis_client.hgetall(session_key)
        
        if session_data:
            # Update last activity
            await self.redis_client.hset(
                session_key, 
                "last_activity", 
                datetime.utcnow().isoformat()
            )
            return session_data
        
        return None
    
    async def delete_session(self, session_id: str):
        """Delete session"""
        session_key = f"session:{session_id}"
        await self.redis_client.delete(session_key)
    
    async def cleanup_expired_sessions(self):
        """Clean up expired sessions (run as background task)"""
        pattern = "session:*"
        async for key in self.redis_client.scan_iter(match=pattern):
            ttl = await self.redis_client.ttl(key)
            if ttl == -1:  # No expiration set
                await self.redis_client.expire(key, 86400)  # Set 1 day expiration

session_manager = SessionManager()
```

## 📊 Monitoring & Logging

### 1. Structured Logging

```python
import structlog
from pythonjsonlogger import jsonlogger

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Custom logging middleware
@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    start_time = time.time()
    
    # Log request
    logger.info(
        "request_started",
        method=request.method,
        url=str(request.url),
        user_agent=request.headers.get("user-agent"),
        ip_address=request.client.host
    )
    
    response = await call_next(request)
    
    # Log response
    process_time = time.time() - start_time
    logger.info(
        "request_completed",
        method=request.method,
        url=str(request.url),
        status_code=response.status_code,
        process_time=process_time
    )
    
    return response

# Application-specific logging
class VibelyLogger:
    def __init__(self):
        self.logger = structlog.get_logger()
    
    def log_user_action(self, user_id: int, action: str, **kwargs):
        """Log user actions for analytics"""
        self.logger.info(
            "user_action",
            user_id=user_id,
            action=action,
            **kwargs
        )
    
    def log_api_error(self, error: Exception, request: Request, **kwargs):
        """Log API errors with context"""
        self.logger.error(
            "api_error",
            error_type=type(error).__name__,
            error_message=str(error),
            method=request.method,
            url=str(request.url),
            **kwargs
        )
    
    def log_performance_metric(self, metric_name: str, value: float, **kwargs):
        """Log performance metrics"""
        self.logger.info(
            "performance_metric",
            metric_name=metric_name,
            value=value,
            **kwargs
        )

vibely_logger = VibelyLogger()
```

### 2. Health Checks

```python
# Health check endpoints
@app.get("/health")
async def health_check():
    """Basic health check"""
    return {"status": "healthy", "timestamp": datetime.utcnow()}

@app.get("/health/detailed")
async def detailed_health_check(db: AsyncSession = Depends(get_db)):
    """Detailed health check with dependency status"""
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "services": {}
    }
    
    # Check database
    try:
        await db.execute(text("SELECT 1"))
        health_status["services"]["database"] = {"status": "healthy"}
    except Exception as e:
        health_status["services"]["database"] = {"status": "unhealthy", "error": str(e)}
        health_status["status"] = "unhealthy"
    
    # Check Redis
    try:
        await cache.redis_client.ping()
        health_status["services"]["redis"] = {"status": "healthy"}
    except Exception as e:
        health_status["services"]["redis"] = {"status": "unhealthy", "error": str(e)}
        health_status["status"] = "unhealthy"
    
    # Check Celery
    try:
        celery_inspect = celery_app.control.inspect()
        active_workers = celery_inspect.active()
        if active_workers:
            health_status["services"]["celery"] = {"status": "healthy", "workers": len(active_workers)}
        else:
            health_status["services"]["celery"] = {"status": "unhealthy", "error": "No active workers"}
            health_status["status"] = "degraded"
    except Exception as e:
        health_status["services"]["celery"] = {"status": "unhealthy", "error": str(e)}
        health_status["status"] = "unhealthy"
    
    return health_status

# Metrics endpoint for monitoring
@app.get("/metrics")
async def get_metrics(db: AsyncSession = Depends(get_db)):
    """Application metrics for monitoring"""
    metrics = {}
    
    # Database metrics
    try:
        # Active connections
        result = await db.execute(text("SELECT count(*) FROM pg_stat_activity"))
        metrics["database_connections"] = result.scalar()
        
        # Table sizes
        result = await db.execute(text("""
            SELECT schemaname, tablename, pg_total_relation_size(schemaname||'.'||tablename) as size
            FROM pg_tables WHERE schemaname = 'public'
        """))
        metrics["table_sizes"] = {row[1]: row[2] for row in result.fetchall()}
        
    except Exception as e:
        metrics["database_error"] = str(e)
    
    # Application metrics
    metrics.update({
        "uptime": time.time() - app_start_time,
        "memory_usage": psutil.Process().memory_info().rss,
        "cpu_percent": psutil.Process().cpu_percent(),
    })
    
    return metrics
```

## 🐳 Deployment

### 1. Docker Configuration

```dockerfile
# Dockerfile
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        build-essential \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser
RUN chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql+asyncpg://vibely:password@db:5432/vibely
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
    volumes:
      - ./app:/app/app
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=vibely
      - POSTGRES_USER=vibely
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  celery:
    build: .
    command: celery -A app.workers.celery_app worker --loglevel=info
    environment:
      - DATABASE_URL=postgresql+asyncpg://vibely:password@db:5432/vibely
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
    volumes:
      - ./app:/app/app

  celery-beat:
    build: .
    command: celery -A app.workers.celery_app beat --loglevel=info
    environment:
      - DATABASE_URL=postgresql+asyncpg://vibely:password@db:5432/vibely
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
    volumes:
      - ./app:/app/app

volumes:
  postgres_data:
  redis_data:
```

### 3. Production Configuration

```python
# Production settings
class ProductionConfig(BaseConfig):
    # Database
    DATABASE_URL = os.getenv("DATABASE_URL")
    DATABASE_POOL_SIZE = 20
    DATABASE_MAX_OVERFLOW = 30
    
    # Redis
    REDIS_URL = os.getenv("REDIS_URL")
    REDIS_MAX_CONNECTIONS = 50
    
    # Security
    SECRET_KEY = os.getenv("SECRET_KEY")
    ACCESS_TOKEN_EXPIRE_MINUTES = 15  # Shorter in production
    
    # CORS
    ALLOWED_ORIGINS = [
        "https://vibely.app",
        "https://www.vibely.app"
    ]
    
    # Logging
    LOG_LEVEL = "INFO"
    LOG_FORMAT = "json"
    
    # Monitoring
    SENTRY_DSN = os.getenv("SENTRY_DSN")
    ENABLE_METRICS = True
    
    # Rate limiting
    RATE_LIMIT_ENABLED = True
    RATE_LIMIT_STORAGE = "redis"
    
    # File uploads
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"]
    
    # Background tasks
    CELERY_BROKER_URL = os.getenv("REDIS_URL")
    CELERY_RESULT_BACKEND = os.getenv("REDIS_URL")
```

## 🔮 Future Enhancements

### Planned Features
1. **Microservices Architecture** - Split into domain-specific services
2. **GraphQL API** - Alternative to REST for flexible queries
3. **Event Sourcing** - Audit trail and event replay capabilities
4. **Advanced Analytics** - ML-powered insights and recommendations
5. **Multi-tenancy** - Support for multiple organizations
6. **Advanced Search** - Elasticsearch integration for full-text search
7. **Content Moderation** - AI-powered content filtering
8. **API Versioning** - Backward compatibility for API evolution

### Performance Optimizations
- Database read replicas for scaling reads
- CDN integration for static assets
- Advanced caching strategies (Redis Cluster)
- Database partitioning for large datasets
- Connection pooling optimization
- Query optimization and indexing

### Security Enhancements
- OAuth2 integration (Google, GitHub, etc.)
- Two-factor authentication (2FA)
- API key management for third-party integrations
- Advanced rate limiting with user-based quotas
- Security audit logging
- Vulnerability scanning automation

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainers**: Vibely Development Team