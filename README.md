# 🌟 VIBELY - AI-Powered Social Media Platform

> **Next-generation social media platform with real-time sentiment analysis and glassmorphism design**

VIBELY is a modern, production-ready social media platform that combines cutting-edge AI sentiment analysis with premium glassmorphism UI design. Built for scale with FastAPI backend and React frontend.

## ✨ Key Features

### 🧠 AI-Powered Vibe Engine
- **Real-time sentiment analysis** using HuggingFace Transformers
- **Vibe classification** (positive, neutral, negative) for all content
- **Dynamic UI theming** that adapts to content sentiment
- **Background processing** for seamless user experience

### 🎨 Premium Design System
- **Glassmorphism UI** with backdrop blur effects
- **Smooth 60fps animations** powered by Framer Motion
- **Responsive design** optimized for all devices
- **Accessibility-first** approach (WCAG compliant)

### ⚡ High-Performance Architecture
- **Infinite scroll feed** with cursor-based pagination
- **Real-time updates** via WebSocket connections
- **Background job processing** with Celery
- **Redis caching** for optimal performance

### 🔐 Enterprise-Grade Security
- **JWT authentication** with refresh token rotation
- **Rate limiting** and request throttling
- **Input validation** and SQL injection prevention
- **CORS protection** and secure headers

## 🏗️ Architecture Overview

```
VIBELY/
├── backend/          # FastAPI + PostgreSQL + Redis
│   ├── app/
│   │   ├── api/      # REST API endpoints
│   │   ├── core/     # Configuration & security
│   │   ├── models/   # Database models
│   │   ├── services/ # Business logic
│   │   └── workers/  # Background jobs
│   └── main.py       # Application entry point
│
└── frontend/         # React + TypeScript + Tailwind
    ├── src/
    │   ├── components/ # UI component library
    │   ├── features/   # Feature modules
    │   ├── core/       # Hooks, utils, API client
    │   └── app/        # App configuration
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- **Docker & Docker Compose** (recommended)
- **Node.js 18+** and **Python 3.11+** (for manual setup)
- **PostgreSQL 15+** and **Redis 7+**

### Option 1: Docker Setup (Recommended)

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd VIBELY
   ```

2. **Start backend services**:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   docker-compose up -d
   ```

3. **Start frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access the application**:
   - **Frontend**: http://localhost:3001
   - **Backend API**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your database and Redis URLs

# Run database migrations
alembic upgrade head

# Start API server
uvicorn main:app --reload --port 8000

# Start Celery worker (separate terminal)
celery -A app.workers.celery_app worker --loglevel=info
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI 0.104+ with async/await
- **Database**: PostgreSQL with SQLAlchemy (async)
- **Cache**: Redis for sessions and rate limiting
- **Background Jobs**: Celery with Redis broker
- **AI/ML**: HuggingFace Transformers for sentiment analysis
- **Authentication**: JWT with python-jose
- **Validation**: Pydantic schemas
- **Logging**: Structured logging with Loguru

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development
- **Styling**: Tailwind CSS with CSS variables
- **Animations**: Framer Motion + GSAP
- **State Management**: Zustand + React Query
- **Routing**: React Router v7
- **HTTP Client**: Axios with interceptors
- **Virtualization**: React Virtuoso for performance

## 📡 API Endpoints

### Authentication
```
POST /api/v1/auth/register    # Register new user
POST /api/v1/auth/login       # Login user  
POST /api/v1/auth/refresh     # Refresh access token
GET  /api/v1/auth/me          # Get current user
```

### Feed & Posts
```
GET  /api/v1/feed/            # Get paginated feed
POST /api/v1/feed/            # Create new post
GET  /api/v1/feed/{post_id}   # Get specific post
POST /api/v1/feed/{post_id}/like  # Like/unlike post
```

### Vibe Engine
```
POST /api/v1/vibe/analyze     # Analyze text sentiment
POST /api/v1/vibe/analyze/batch   # Batch analysis
GET  /api/v1/vibe/posts/by-sentiment  # Filter by sentiment
```

### Real-Time
```
WS   /ws/connect?token={jwt}  # WebSocket connection
```

## 🧠 Vibe Engine Deep Dive

The AI-powered sentiment analysis system is the core innovation of VIBELY:

### How It Works
1. **Text Analysis**: Uses HuggingFace Transformers for sentiment scoring
2. **Async Processing**: Background workers handle analysis without blocking API
3. **Real-Time Updates**: WebSocket broadcasts sentiment results instantly
4. **UI Adaptation**: Frontend dynamically themes based on sentiment

### Example Usage
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

### Frontend Integration
```tsx
// Dynamic theming based on sentiment
<div className={`vibe-${sentiment}`}>
  <Card variant="glass" glow>
    Content adapts to vibe
  </Card>
</div>
```

## 🎨 Design System

VIBELY features a world-class design system with glassmorphism effects:

### Core Components
- **Button**: Multiple variants with loading states
- **Card**: Glassmorphism cards with hover effects  
- **Avatar**: User avatars with status indicators
- **Input**: Premium form controls with focus animations
- **Skeleton**: Shimmer loading states

### Usage Example
```tsx
import { Button, Card, Avatar, Input } from '@/components/ui'

function PostCard() {
  return (
    <Card variant="glass" hover glow>
      <div className="flex items-center gap-4">
        <Avatar fallback="JD" status="online" />
        <Input 
          variant="glass" 
          placeholder="What's your vibe?" 
          glow 
        />
        <Button variant="primary">Share</Button>
      </div>
    </Card>
  )
}
```

## 🔄 Real-Time Features

WebSocket integration provides live updates for:
- **Post interactions** (likes, comments)
- **Sentiment analysis results**
- **User notifications**
- **Online status indicators**

### WebSocket Events
```javascript
// Subscribe to post updates
{
  "type": "subscribe_post",
  "post_id": "uuid-here"
}

// Receive live updates
{
  "type": "post_like",
  "post_id": "uuid-here", 
  "user_id": "uuid-here",
  "liked": true
}
```

## 📊 Performance Optimizations

### Backend
- **Cursor-based pagination** for infinite scroll
- **Database indexing** for optimized queries
- **Redis caching** for session management
- **Async operations** throughout the stack
- **Background processing** for heavy operations

### Frontend  
- **Code splitting** with React.lazy
- **Virtual scrolling** for large lists
- **Image optimization** with lazy loading
- **Bundle optimization** with Vite
- **Animation performance** using transform/opacity only

## 🐳 Production Deployment

### Docker Compose (Recommended)
```bash
# Production deployment
docker-compose -f backend/docker-compose.prod.yml up -d

# Frontend build
cd frontend
npm run build
# Serve with nginx or your preferred static host
```

### Environment Configuration
```env
# Backend (.env)
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=your-super-secure-secret-key
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/db
REDIS_URL=redis://host:6379/0

# Frontend
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com/ws
```

## 🧪 Testing & Quality

### Backend Testing
```bash
cd backend
pytest                    # Run all tests
pytest --cov=app         # With coverage
pytest tests/test_auth.py # Specific tests
```

### Frontend Testing  
```bash
cd frontend
npm run lint              # ESLint
npm run type-check        # TypeScript
npm run build             # Production build test
```

### Code Quality
```bash
# Backend formatting
black .
isort .
flake8 app/

# Frontend formatting  
npm run lint --fix
```

## 📈 Monitoring & Observability

- **Structured logging** with request IDs
- **Health check endpoints** for monitoring
- **Error tracking** with global exception handlers
- **Performance metrics** ready for Prometheus
- **Database query optimization** with SQLAlchemy logging

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines
- Follow existing code style and patterns
- Add tests for new features
- Update documentation as needed
- Ensure all checks pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **API Documentation**: http://localhost:8000/docs
- **Design System**: http://localhost:3001/design-system
- **Backend README**: [backend/README.md](backend/README.md)
- **Frontend README**: [frontend/README.md](frontend/README.md)

---

**Built with ❤️ for the next generation of social media platforms.**

*VIBELY combines cutting-edge AI technology with premium design to create social experiences that adapt to human emotions in real-time.*