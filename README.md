# VIBELY - Modern Social Platform

A comprehensive full-stack social platform built with Next.js, Node.js, and MongoDB featuring real-time authentication, social interactions, Google OAuth, email services, and a beautiful responsive UI.

## 🚀 Features

### 🎯 **Core Features**
- ✅ **Real-time Social Platform** with posts, follows, and activities
- ✅ **Multi-Authentication System** (Email/Password + Google OAuth)
- ✅ **Email Services** (Verification, Password Reset, Welcome emails)
- ✅ **Real-time Notifications** with Socket.IO
- ✅ **Voice Welcome System** with Web Speech API
- ✅ **Profile Management** with avatar and bio support
- ✅ **Search & Discovery** of users and content

### 🎨 **Frontend (Next.js 14)**
- ✅ **Next.js 14** with App Router and TypeScript
- ✅ **shadcn/ui** component library with Tailwind CSS
- ✅ **Framer Motion** animations and transitions
- ✅ **Real-time Authentication** with JWT tokens
- ✅ **Protected Routes** with automatic redirects
- ✅ **Form Validation** with comprehensive error handling
- ✅ **Responsive Design** optimized for all devices
- ✅ **Socket.IO Client** for real-time features
- ✅ **Voice Integration** for user welcome messages

### 🔧 **Backend (Node.js/Express)**
- ✅ **RESTful API** with Express.js
- ✅ **MongoDB** with Mongoose ODM and optimized indexes
- ✅ **JWT Authentication** with secure token handling
- ✅ **Google OAuth 2.0** integration with Passport.js
- ✅ **Email Services** with Nodemailer and professional templates
- ✅ **Socket.IO Server** for real-time communications
- ✅ **Password Security** with bcryptjs hashing
- ✅ **Input Validation** and sanitization
- ✅ **Rate Limiting** and security headers
- ✅ **CORS** configuration for cross-origin requests

### 📱 **Social Features**
- ✅ **User Profiles** with customizable information
- ✅ **Posts & Content** creation and sharing
- ✅ **Follow System** to connect with other users
- ✅ **Activity Feed** tracking user interactions
- ✅ **Real-time Notifications** for social events
- ✅ **Online Status** tracking and display
- ✅ **Search Functionality** for users and content
- ✅ **Real-time Messaging** with popup interface
- ✅ **Private Conversations** between mutual followers
- ✅ **Typing Indicators** and read receipts
- ✅ **Message History** with conversation management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 16+** - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** - [Download here](https://git-scm.com/)

## 🛠️ Quick Start

### Option 1: Automated Setup (Recommended)

**For macOS/Linux:**
```bash
# Make the script executable
chmod +x start-dev.sh

# Run the development environment
./start-dev.sh
```

**For Windows:**
```batch
# Run the batch file
start-dev.bat
```

### Option 2: Manual Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd VIBELY
```

2. **Set up the Backend:**
```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# Start the backend server
npm start
```

3. **Set up the Frontend (in a new terminal):**
```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start the frontend server
npm run dev
```

4. **Start MongoDB:**
```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

## 🌐 Access the Application

Once both servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **API Health Check**: http://localhost:5001/api/health

## 🔐 Authentication System

### **Multiple Sign-in Options:**
1. **Email/Password Registration & Login**
2. **Google OAuth** (One-click sign-in)
3. **Password Reset** via email
4. **Email Verification** for new accounts

### **User Flow:**
1. **Sign Up** → Account created → Email verification sent → Redirect to hero page
2. **Sign In** → Authentication → Redirect to hero page
3. **Google OAuth** → One-click authentication → Redirect to hero page
4. **Forgot Password** → Email sent → Reset password → Auto-login

### **Security Features:**
- **JWT Tokens** with 7-day expiration
- **Password Hashing** with bcryptjs (12 salt rounds)
- **Token Verification** and automatic refresh
- **Protected Routes** with authentication guards
- **Rate Limiting** (100 requests per 15 minutes)
- **Input Validation** and sanitization
- **CORS Protection** for secure cross-origin requests

## 📧 Email System

### **Professional Email Templates:**
- ✅ **Welcome Email** after registration
- ✅ **Email Verification** with secure tokens
- ✅ **Password Reset** with time-limited links
- ✅ **Account Notifications** for important events

### **Email Configuration:**
- **Development**: Uses Ethereal Email (fake SMTP for testing)
- **Production**: Configurable with Gmail, SendGrid, AWS SES, etc.

## 🔄 Real-time Features

### **Socket.IO Integration:**
- ✅ **Real-time Notifications** for social interactions
- ✅ **Online Status** tracking and updates
- ✅ **Live Activity Feed** with instant updates
- ✅ **User Presence** indicators
- ✅ **Authenticated Connections** with JWT tokens

### **Voice Features:**
- ✅ **Voice Welcome** system using Web Speech API
- ✅ **Profile Name Pronunciation** when visiting user profiles
- ✅ **Customizable Voice Settings** for users

## 🗂️ Project Structure

```
VIBELY/
├── backend/                    # Node.js/Express API Server
│   ├── config/                # Configuration files
│   │   └── passport.js        # OAuth configuration
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js           # JWT authentication
│   │   └── validation.js     # Input validation
│   ├── models/               # MongoDB/Mongoose models
│   │   ├── User.js          # User model with OAuth support
│   │   ├── Post.js          # Post model
│   │   ├── Follow.js        # Follow relationship model
│   │   ├── Activity.js      # Activity tracking model
│   │   └── Notification.js  # Notification model
│   ├── routes/              # API route handlers
│   │   ├── auth.js         # Authentication routes
│   │   ├── user.js         # User management routes
│   │   ├── posts.js        # Post management routes
│   │   ├── social.js       # Social features routes
│   │   ├── notifications.js # Notification routes
│   │   └── activities.js   # Activity routes
│   ├── services/           # Business logic services
│   │   ├── emailService.js # Email service with templates
│   │   └── socketService.js # Socket.IO service
│   ├── .env               # Environment variables
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── frontend/              # Next.js React Application
│   ├── app/              # Next.js App Router pages
│   │   ├── auth/         # OAuth callback pages
│   │   ├── hero/         # Main dashboard page
│   │   ├── profile/      # User profile pages
│   │   ├── signin/       # Sign-in page
│   │   ├── signup/       # Sign-up page
│   │   ├── forgot-password/ # Password reset page
│   │   ├── reset-password/  # Password reset form
│   │   └── search/       # User search page
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   └── ProtectedRoute.tsx # Route protection
│   ├── contexts/        # React Context providers
│   │   ├── AuthContext.tsx   # Authentication state
│   │   └── SocketContext.tsx # Socket.IO connection
│   ├── hooks/           # Custom React hooks
│   │   ├── useProfileImage.ts # Profile image handling
│   │   └── useVoiceWelcome.ts # Voice welcome system
│   ├── lib/             # Utility libraries
│   │   └── voiceService.ts   # Voice synthesis service
│   ├── services/        # API service layer
│   │   └── api.ts       # API client with all endpoints
│   ├── .env.local       # Frontend environment variables
│   └── package.json     # Frontend dependencies
├── start-dev.sh         # Development startup script (Unix)
├── start-dev.bat        # Development startup script (Windows)
├── setup.bat           # Windows setup script
└── README.md           # This documentation
```

## 🔧 API Endpoints

### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify-token` - Verify JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/verify-email` - Verify email address
- `GET /api/auth/google` - Start Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback

### **User Management**
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/profile/:userId` - Get specific user profile
- `PUT /api/user/password` - Update password
- `GET /api/user/stats` - Get user statistics
- `DELETE /api/user/account` - Deactivate account

### **Social Features**
- `POST /api/posts` - Create new post
- `GET /api/posts` - Get posts feed
- `GET /api/posts/user/:userId` - Get user's posts
- `POST /api/posts/:postId/like` - Like/unlike post
- `POST /api/posts/:postId/comment` - Comment on post
- `POST /api/social/follow/:userId` - Follow/unfollow user
- `GET /api/social/followers/:userId` - Get user followers
- `GET /api/social/following/:userId` - Get user following
- `GET /api/social/search` - Search users
- `GET /api/social/discover` - Discover new users
- `GET /api/social/online` - Get online users

### **Notifications & Activities**
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/mark-read` - Mark notifications as read
- `GET /api/activities/feed` - Get activity feed
- `GET /api/activities/user/:userId` - Get user activities

### **Messaging System**
- `GET /api/messages/conversations` - Get user's conversations
- `GET /api/messages/conversation/:userId` - Get conversation with specific user
- `POST /api/messages/send` - Send a message
- `PUT /api/messages/mark-read/:userId` - Mark messages as read
- `DELETE /api/messages/:messageId` - Delete a message
- `GET /api/messages/unread-count` - Get unread message count
- `GET /api/messages/messageable-users` - Get users you can message (mutual followers)

## 🎨 UI Components & Features

### **Authentication Components**
- **Sign-up/Sign-in Forms** with real-time validation
- **OAuth Buttons** for Google authentication
- **Password Reset Flow** with email integration
- **Loading States** with smooth animations
- **Error Handling** with user-friendly messages

### **Social Components**
- **Posts Feed** with real-time updates
- **User Profiles** with avatar and bio
- **Follow System** with instant updates
- **Activity Feed** showing user interactions
- **Notification System** with real-time alerts
- **Search Interface** for discovering users
- **Messaging Popup** with real-time chat interface
- **Conversation Management** with message history
- **Typing Indicators** and read receipts
- **Message Buttons** throughout the platform

### **Voice Features**
- **Voice Welcome** when visiting profiles
- **Customizable Voice Settings** for users
- **Speech Synthesis** with multiple voice options

## 🛠️ Development

### **Available Scripts**

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### **Environment Variables**

**Backend (.env):**
```bash
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/vibely

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-2024
JWT_EXPIRE=7d

# Session Configuration
SESSION_SECRET=your-session-secret

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Email Configuration
EMAIL_FROM="Vibely <noreply@vibely.com>"

# OAuth Configuration (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Frontend (.env.local):**
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## 🔧 Google OAuth Setup (Optional)

To enable Google OAuth authentication:

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create a new project** or select existing one
3. **Enable Google+ API** in APIs & Services → Library
4. **Create OAuth 2.0 credentials** in APIs & Services → Credentials
5. **Add authorized redirect URI**: `http://localhost:5001/api/auth/google/callback`
6. **Copy Client ID and Secret** to your backend `.env` file
7. **Restart the backend server**

## 🧪 Testing the Application

### **Manual Testing:**
1. **Visit** http://localhost:3000
2. **Create Account** using email/password or Google OAuth
3. **Test Authentication** flows (login, logout, password reset)
4. **Explore Social Features** (posts, follows, notifications)
5. **Test Real-time Features** (notifications, online status)
6. **Try Voice Features** when visiting user profiles

### **API Testing:**
Use Postman, curl, or Thunder Client to test API endpoints.

**Example - Register User:**
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

## 🚀 Production Deployment

### **Backend Deployment:**
1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET` and `SESSION_SECRET`
3. Configure MongoDB Atlas or production database
4. Set up real email service (Gmail, SendGrid, AWS SES)
5. Configure Google OAuth with production URLs
6. Use PM2 or similar for process management
7. Set up SSL/HTTPS and proper logging

### **Frontend Deployment:**
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or similar platform
3. Set production environment variables
4. Update OAuth redirect URLs for production domain

## 🐛 Troubleshooting

### **Common Issues:**

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **OAuth Not Working**
   - Check Google OAuth credentials in `.env`
   - Verify redirect URIs in Google Console
   - Ensure backend server is restarted after config changes

3. **Real-time Features Not Working**
   - Check Socket.IO connection in browser console
   - Verify JWT token is valid
   - Ensure both frontend and backend are running

4. **Email Services Not Working**
   - Check email configuration in `.env`
   - Verify SMTP settings for production
   - Check spam folder for test emails

## 📚 Technologies Used

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, Socket.IO
- **Authentication**: JWT, Passport.js, Google OAuth 2.0
- **Email**: Nodemailer with HTML templates
- **Real-time**: Socket.IO for live features
- **Voice**: Web Speech API for voice synthesis
- **Development**: ESLint, Prettier, nodemon

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Socket.IO](https://socket.io/) for real-time communication
- [MongoDB](https://www.mongodb.com/) for the flexible database
- The open-source community for the incredible tools and libraries