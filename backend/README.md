# Vibely Backend

Production-grade, scalable backend system for a social media platform built with Python, FastAPI, PostgreSQL, and Redis.

## 🚀 Features

- **High-Performance API**: FastAPI with async/await support
- **Infinite Feed System**: Cursor-based pagination for optimal performance
- **AI-Powered Vibe Engine**: Sentiment analysis using HuggingFace Transformers
- **Real-Time Updates**: WebSocket support for live likes, comments, and notifications
- **Secure Authentication**: JWT with access/refresh token pattern
- **Background Processing**: Celery for async sentiment analysis and notifications
- **Production-Ready**: Docker, Redis caching, comprehensive logging

## 🏗️ Architecture

```
/app
├── /api              # API routes (versioned: v1)
├── /core             # Global systems (config, database, security)
├── /models           # SQLAlchemy ORM models
├── /schemas          # Pydantic request/response models
├── /services         # Business logic layer
├── /repositories     # Data access layer
├── /workers          # Background jobs (Celery)
├── /sockets          # WebSocket handlers
└── main.py           # FastAPI entry point
```

## 🛠️ Tech Stack

- **Framework**: FastAPI 0.104+
- **Database**: PostgreSQL with SQLAlchemy (async)
- **Cache**: Redis
- **Background Jobs**: Celery
- **AI/ML**: HuggingFace Transformers
- **Authentication**: JWT (python-jose)
- **Validation**: Pydantic
- **Logging**: Loguru

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone and setup**:
   ```bash
   cd VIBELY/backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Start services**:
   ```bash
   docker-compose up -d
   ```

3. **Access API**:
   - API: http://localhost:8000
   - Docs: http://localhost:8000/docs
   - Health: http://localhost:8000/health

### Manual Setup

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Setup PostgreSQL and Redis**:
   ```bash
   # PostgreSQL
   createdb vibely_db
   
   # Redis (using Docker)
   docker run -d -p 6379:6379 redis:7-alpine
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your database and Redis URLs
   ```

4. **Run migrations**:
   ```bash
   alembic upgrade head
   ```

5. **Start services**:
   ```bash
   # API Server
   uvicorn main:app --reload
   
   # Celery Worker (separate terminal)
   celery -A app.workers.celery_app worker --loglevel=info
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user

### Feed & Posts
- `GET /api/v1/feed/` - Get paginated feed (cursor-based)
- `POST /api/v1/feed/` - Create new post
- `GET /api/v1/feed/{post_id}` - Get specific post
- `POST /api/v1/feed/{post_id}/like` - Like/unlike post
- `GET /api/v1/feed/user/{user_id}` - Get user's posts

### Vibe Engine
- `POST /api/v1/vibe/analyze` - Analyze text sentiment
- `POST /api/v1/vibe/analyze/batch` - Batch sentiment analysis
- `GET /api/v1/vibe/posts/by-sentiment` - Filter posts by sentiment

### Users
- `GET /api/v1/user/profile/{user_id}` - Get user profile
- `PUT /api/v1/user/update` - Update profile
- `GET /api/v1/user/search` - Search users

### WebSocket
- `WS /ws/connect?token={jwt_token}` - Real-time connection

## 🧠 Vibe Engine

The core innovation of Vibely is the AI-powered sentiment analysis system:

1. **Text Analysis**: Uses HuggingFace Transformers for sentiment scoring
2. **Async Processing**: Background workers handle analysis without blocking API
3. **Real-Time Updates**: WebSocket broadcasts sentiment results
4. **Vibe Categories**: Classifies content into positive, neutral, negative vibes

### Usage Example:
```python
# Analyze sentiment
POST /api/v1/vibe/analyze
{
  "text": "Having an amazing day! 🌟"
}

# Response
{
  "sentiment_score": 0.89,
  "sentiment_label": "positive",
  "confidence": 0.95,
  "processing_time": 0.12
}
```

## 🔄 Real-Time Features

WebSocket connection provides live updates for:
- Post likes/unlikes
- New comments
- Sentiment analysis results
- User notifications

### WebSocket Message Types:
```javascript
// Subscribe to post updates
{
  "type": "subscribe_post",
  "post_id": "uuid-here"
}

// Receive live like update
{
  "type": "post_like",
  "post_id": "uuid-here",
  "user_id": "uuid-here",
  "liked": true
}
```

## 🔐 Security Features

- **JWT Authentication**: Access + refresh token pattern
- **Password Hashing**: bcrypt with salt
- **Rate Limiting**: Redis-based request throttling
- **CORS Protection**: Configurable origins
- **Input Validation**: Pydantic schemas
- **SQL Injection Prevention**: SQLAlchemy ORM

## 📊 Performance Optimizations

- **Cursor Pagination**: Efficient infinite scrolling
- **Database Indexing**: Optimized queries for feed performance
- **Redis Caching**: Session storage and rate limiting
- **Async Operations**: Non-blocking I/O throughout
- **Background Processing**: Celery for heavy operations
- **Connection Pooling**: SQLAlchemy async engine

## 🐳 Production Deployment

### Docker Compose (Recommended)
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables
Key production settings:
```env
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=your-super-secure-secret-key
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/db
REDIS_URL=redis://host:6379/0
```

### Scaling Considerations
- **Horizontal Scaling**: Stateless design supports multiple instances
- **Database**: PostgreSQL with read replicas
- **Cache**: Redis Cluster for high availability
- **Background Jobs**: Multiple Celery workers
- **Load Balancing**: Nginx or cloud load balancer

## 🧪 Testing

```bash
# Run tests
pytest

# With coverage
pytest --cov=app

# Specific test file
pytest tests/test_auth.py
```

## 📝 Development

### Code Quality
```bash
# Format code
black .
isort .

# Lint
flake8 app/
```

### Database Migrations
```bash
# Create migration
alembic revision --autogenerate -m "Add new table"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## 🔧 Monitoring & Logging

- **Structured Logging**: Loguru with JSON format
- **Request Tracking**: Unique request IDs
- **Error Handling**: Global exception middleware
- **Health Checks**: `/health` endpoint
- **Metrics**: Ready for Prometheus integration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ for the next generation of social media platforms.