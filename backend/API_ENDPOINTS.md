# 📡 Vibely API Endpoints Documentation

## Base URL
```
http://localhost:8000
```

## Authentication Required
Most endpoints require JWT authentication via `Authorization: Bearer <token>` header.

---

## 🔐 Authentication Endpoints
**Base Path**: `/api/v1/auth`

### POST `/api/v1/auth/register`
Register a new user account
```json
{
  "email": "user@example.com",
  "password": "secure_password_123",
  "name": "John Doe",
  "username": "johndoe"
}
```

### POST `/api/v1/auth/login`
Authenticate user and return JWT tokens
```json
{
  "email": "user@example.com",
  "password": "secure_password_123"
}
```

### POST `/api/v1/auth/refresh`
Refresh access token using refresh token
```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### GET `/api/v1/auth/me`
Get current authenticated user information
- **Auth Required**: Yes

### POST `/api/v1/auth/logout`
Logout user (client should discard tokens)
- **Auth Required**: Yes

---

## 👤 User Endpoints
**Base Path**: `/api/v1/user`

### GET `/api/v1/user/profile/{user_id}`
Get public user profile by ID
- **Auth Required**: No

### PUT `/api/v1/user/update`
Update current user's profile
- **Auth Required**: Yes
```json
{
  "name": "Updated Name",
  "bio": "Updated bio text",
  "avatar": "https://example.com/avatar.jpg"
}
```

### GET `/api/v1/user/search?q={query}&limit={limit}`
Search users by name or username
- **Auth Required**: No
- **Query Params**:
  - `q`: Search query (min 2 characters)
  - `limit`: Number of results (1-50, default 20)

### GET `/api/v1/user/{user_id}`
Get user details (authenticated endpoint)
- **Auth Required**: Yes

---

## 📱 Feed & Posts Endpoints
**Base Path**: `/api/v1/feed`

### GET `/api/v1/feed/?cursor={cursor}&limit={limit}`
Get paginated feed with cursor-based pagination
- **Auth Required**: Optional (affects personalization)
- **Query Params**:
  - `cursor`: Cursor for pagination (ISO datetime string)
  - `limit`: Number of posts (1-50, default 20)

### POST `/api/v1/feed/`
Create a new post with async sentiment analysis
- **Auth Required**: Yes
```json
{
  "content": "Having an amazing day! 🌟",
  "image_url": "https://example.com/image.jpg"
}
```

### GET `/api/v1/feed/{post_id}`
Get a specific post by ID
- **Auth Required**: Optional

### DELETE `/api/v1/feed/{post_id}`
Delete a post (only by author)
- **Auth Required**: Yes

### POST `/api/v1/feed/{post_id}/like`
Like or unlike a post
- **Auth Required**: Yes

### GET `/api/v1/feed/user/{user_id}?cursor={cursor}&limit={limit}`
Get posts by a specific user
- **Auth Required**: No

### GET `/api/v1/feed/trending?hours={hours}&limit={limit}`
Get trending posts based on engagement
- **Auth Required**: No
- **Query Params**:
  - `hours`: Hours to look back (1-168, default 24)
  - `limit`: Number of posts (1-50, default 20)

---

## 🧠 Vibe Engine Endpoints
**Base Path**: `/api/v1/vibe`

### POST `/api/v1/vibe/analyze`
Analyze sentiment of text content
- **Auth Required**: Yes
```json
{
  "text": "Having an amazing day! 🌟"
}
```

**Response**:
```json
{
  "sentiment_score": 0.89,
  "sentiment_label": "positive",
  "confidence": 0.95,
  "processing_time": 0.12
}
```

### POST `/api/v1/vibe/analyze/batch`
Analyze sentiment of multiple texts in batch
- **Auth Required**: Yes
```json
{
  "texts": [
    "Great day today!",
    "Feeling okay",
    "Not so good"
  ]
}
```

### GET `/api/v1/vibe/posts/by-sentiment?sentiment={sentiment}&limit={limit}`
Get posts filtered by sentiment category
- **Auth Required**: No
- **Query Params**:
  - `sentiment`: Filter by sentiment (positive|negative|neutral)
  - `limit`: Number of posts (1-50, default 20)

### GET `/api/v1/vibe/stats/sentiment`
Get sentiment statistics for the platform
- **Auth Required**: Yes

### GET `/api/v1/vibe/health`
Check if the vibe engine is ready and operational
- **Auth Required**: No

---

## 🔄 WebSocket Endpoints
**Base Path**: `/ws`

### WS `/ws/connect?token={jwt_token}`
Real-time WebSocket connection
- **Auth Required**: Yes (via query parameter)

**Message Types**:
```json
// Subscribe to post updates
{
  "type": "subscribe_post",
  "post_id": "uuid-here"
}

// Unsubscribe from post updates  
{
  "type": "unsubscribe_post",
  "post_id": "uuid-here"
}

// Heartbeat
{
  "type": "ping",
  "timestamp": "2026-03-20T10:30:00Z"
}
```

**Received Events**:
```json
// Post like event
{
  "type": "post_like",
  "post_id": "uuid-here",
  "user_id": "uuid-here", 
  "liked": true,
  "timestamp": "2026-03-20T10:30:00Z"
}

// New comment
{
  "type": "new_comment",
  "post_id": "uuid-here",
  "comment": {...},
  "timestamp": "2026-03-20T10:30:00Z"
}

// Vibe analysis result
{
  "type": "vibe_update",
  "post_id": "uuid-here",
  "sentiment": {
    "score": 0.85,
    "label": "positive",
    "confidence": 0.92
  },
  "timestamp": "2026-03-20T10:30:00Z"
}

// Real-time notification
{
  "type": "notification",
  "notification": {...},
  "timestamp": "2026-03-20T10:30:00Z"
}
```

---

## 🏥 Health & Monitoring

### GET `/health`
Application health check
- **Auth Required**: No

**Response**:
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

---

## 📊 Response Formats

### Standard Success Response
```json
{
  "data": {...},
  "message": "Success"
}
```

### Error Response
```json
{
  "error": "Error message",
  "detail": "Detailed error information",
  "request_id": "uuid-here"
}
```

### Pagination Response (Feed)
```json
{
  "posts": [...],
  "next_cursor": "2026-03-20T10:30:00Z",
  "has_more": true
}
```

---

## 🔑 Authentication Flow

1. **Register**: `POST /api/v1/auth/register`
2. **Login**: `POST /api/v1/auth/login` → Get tokens
3. **Use API**: Include `Authorization: Bearer <access_token>` header
4. **Refresh**: `POST /api/v1/auth/refresh` when access token expires
5. **Logout**: `POST /api/v1/auth/logout`

---

## 🚀 Rate Limits

- **Default**: 60 requests per minute per IP
- **Burst**: Configurable via environment variables
- **Headers**: Rate limit info included in response headers

---

## 📱 Example Usage

### Create Post with Sentiment Analysis
```bash
curl -X POST "http://localhost:8000/api/v1/feed/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Having the best day ever! 🌟✨",
    "image_url": "https://example.com/happy.jpg"
  }'
```

### Get Feed with Pagination
```bash
curl "http://localhost:8000/api/v1/feed/?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Analyze Sentiment
```bash
curl -X POST "http://localhost:8000/api/v1/vibe/analyze" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This is an amazing product! Love it!"
  }'
```

---

**🎯 All endpoints support JSON request/response format and follow RESTful conventions.**