# Vibely Backend API

A robust Node.js/Express backend with JWT authentication, MongoDB integration, and comprehensive user management.

## Features

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Password Hashing** - bcryptjs with salt rounds
- ✅ **Input Validation** - express-validator with custom rules
- ✅ **Rate Limiting** - Protection against brute force attacks
- ✅ **CORS Support** - Cross-origin resource sharing
- ✅ **Security Headers** - Helmet.js for security
- ✅ **MongoDB Integration** - Mongoose ODM with schemas
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Environment Configuration** - dotenv support

## Quick Start

### Prerequisites

- Node.js 16+ installed
- MongoDB running locally or MongoDB Atlas account

### Installation

1. **Navigate to backend directory:**
```bash
cd VIBELY/backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB** (if running locally):
```bash
# macOS with Homebrew
brew services start mongodb-community

# Windows
net start MongoDB

# Linux
sudo systemctl start mongod
```

5. **Start the server:**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| GET | `/me` | Get current user | Private |
| POST | `/logout` | User logout | Private |
| POST | `/verify-token` | Verify JWT token | Private |

### User Routes (`/api/user`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/profile` | Get user profile | Private |
| PUT | `/profile` | Update user profile | Private |
| PUT | `/password` | Update password | Private |
| DELETE | `/account` | Deactivate account | Private |
| GET | `/stats` | Get user statistics | Private |

### Health Check

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/health` | Server health check | Public |

## Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Protected Route Example
```bash
GET /api/user/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Validation Rules

### Registration
- **firstName**: 2-50 characters, letters and spaces only
- **lastName**: 2-50 characters, letters and spaces only
- **email**: Valid email format, unique
- **password**: Minimum 6 characters, must contain uppercase, lowercase, and number

### Login
- **email**: Valid email format
- **password**: Required

## Security Features

### Password Security
- Passwords hashed with bcryptjs (12 salt rounds)
- Passwords never returned in API responses
- Current password verification for updates

### JWT Security
- Tokens expire in 7 days (configurable)
- Secure token verification middleware
- Token required for protected routes

### Rate Limiting
- 100 requests per 15 minutes per IP
- Prevents brute force attacks

### Input Validation
- Comprehensive validation with express-validator
- Sanitization and normalization
- Custom error messages

## Database Schema

### User Model
```javascript
{
  firstName: String (required, 2-50 chars)
  lastName: String (required, 2-50 chars)
  email: String (required, unique, valid email)
  password: String (required, min 6 chars, hashed)
  avatar: String (optional)
  isEmailVerified: Boolean (default: false)
  lastLogin: Date
  isActive: Boolean (default: true)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

## Environment Variables

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/vibely

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Project Structure
```
backend/
├── middleware/
│   ├── auth.js          # JWT authentication middleware
│   └── validation.js    # Input validation rules
├── models/
│   └── User.js          # User database model
├── routes/
│   ├── auth.js          # Authentication routes
│   └── user.js          # User management routes
├── .env                 # Environment variables
├── .env.example         # Environment template
├── package.json         # Dependencies and scripts
├── server.js            # Main server file
└── README.md           # This file
```

## Testing

Test the API endpoints using tools like:
- **Postman** - GUI testing
- **curl** - Command line testing
- **Thunder Client** - VS Code extension

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure MongoDB Atlas or production database
4. Set up proper CORS origins
5. Use PM2 or similar for process management
6. Set up SSL/HTTPS
7. Configure proper logging

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **JWT Token Issues**
   - Check `JWT_SECRET` is set
   - Verify token format in Authorization header
   - Ensure token hasn't expired

3. **CORS Errors**
   - Verify `FRONTEND_URL` in `.env`
   - Check frontend is running on correct port

4. **Validation Errors**
   - Check request body format
   - Verify all required fields are provided
   - Ensure data meets validation rules