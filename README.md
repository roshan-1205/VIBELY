# VIBELY - Modern Social Platform

A comprehensive full-stack social platform built with Next.js, Node.js, and MongoDB featuring real-time media uploads, social interactions, authentication, and a beautiful responsive UI.

## 🚀 Quick Start

**One-Click Setup (Windows):**
```batch
setup.bat
```

This automated script will:
- ✅ Install all dependencies (backend & frontend)
- ✅ Set up real-time media upload system
- ✅ Create necessary directories
- ✅ Start both servers automatically
- ✅ Open the application in your browser

**Manual Setup:**
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (new terminal)
cd frontend && npm install --legacy-peer-deps && npm run dev
```

**Access the Application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🎯 Features

### 🎯 **Core Features**
- ✅ **Real-time Media Upload System** with drag & drop support
- ✅ **Post Management** with create, view, and delete functionality
- ✅ **Multi-Authentication System** (Email/Password + Google OAuth)
- ✅ **Real-time Social Platform** with posts, follows, and activities
- ✅ **Email Services** (Verification, Password Reset, Welcome emails)
- ✅ **Real-time Notifications** with Socket.IO
- ✅ **Voice Welcome System** with Web Speech API
- ✅ **Profile Management** with avatar and bio support
- ✅ **Search & Discovery** of users and content

### 📸 **Media Upload System**
- ✅ **Real-time Upload** with progress tracking
- ✅ **Multiple File Support** (images and videos)
- ✅ **Drag & Drop Interface** for easy file selection
- ✅ **File Validation** (type, size, format checking)
- ✅ **Direct Media Display** in post cards
- ✅ **Click to Enlarge** for images
- ✅ **Video Player** with full controls
- ✅ **Error Handling** with retry functionality
- ✅ **Batch Processing** up to 10 files per upload
- ✅ **Supported Formats**: JPEG, PNG, GIF, WebP, MP4, MPEG, MOV, WebM (max 50MB each)

### 🗑️ **Post Management**
- ✅ **Create Posts** with rich media content
- ✅ **Delete Posts** with confirmation dialogs (author-only)
- ✅ **Real-time Updates** across all connected users
- ✅ **Authorization Controls** ensuring users can only delete their own posts
- ✅ **Dropdown Menus** with intuitive post actions
- ✅ **Confirmation Dialogs** preventing accidental deletions

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
- ✅ **File Upload System** with Multer middleware
- ✅ **Static File Serving** for uploaded media
- ✅ **Media Processing** with thumbnail generation

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

## 🛠️ Installation & Setup

### Option 1: Automated Setup (Recommended - Windows)

**Run the setup script:**
```batch
setup.bat
```

This will automatically:
1. Install all backend and frontend dependencies
2. Set up the media upload system with Multer
3. Create necessary upload directories
4. Verify system configuration
5. Start both servers in separate windows
6. Display helpful information and troubleshooting tips

### Option 2: Manual Setup (All Platforms)

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

# Install media upload dependencies
npm install multer@^1.4.5-lts.1

# Copy environment file
cp .env.example .env

# Create upload directories
mkdir -p uploads/images uploads/videos uploads/thumbnails

# Start the backend server
npm run dev
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
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health
- **Test Media Access**: http://localhost:5000/uploads/images/ (for uploaded images)

## 🎮 Using the Application

### **Creating Posts with Media:**
1. **Navigate to** http://localhost:3000
2. **Sign up or sign in** to your account
3. **Click the "+" button** or image icon to create a post
4. **Add content** and select images/videos
5. **Files upload automatically** with progress indicators
6. **Submit your post** - media displays directly in the feed

### **Managing Posts:**
1. **View your posts** in the feed or profile
2. **Click the three dots** on your posts for options
3. **Delete posts** with confirmation dialog (your posts only)
4. **Real-time updates** across all connected users

### **Media Features:**
- **Drag & Drop**: Drop files directly onto the upload area
- **Multiple Files**: Select up to 10 files at once
- **Progress Tracking**: See upload progress for each file
- **Error Handling**: Retry failed uploads automatically
- **Full Display**: Images and videos show directly in posts
- **Click to Enlarge**: Click images for full-screen view

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
│   │   ├── upload.js         # File upload with Multer
│   │   └── validation.js     # Input validation
│   ├── models/               # MongoDB/Mongoose models
│   │   ├── User.js          # User model with OAuth support
│   │   ├── Post.js          # Post model with media support
│   │   ├── Follow.js        # Follow relationship model
│   │   ├── Activity.js      # Activity tracking model
│   │   ├── Message.js       # Messaging model
│   │   └── Notification.js  # Notification model
│   ├── routes/              # API route handlers
│   │   ├── auth.js         # Authentication routes
│   │   ├── user.js         # User management routes
│   │   ├── posts.js        # Post management + upload routes
│   │   ├── social.js       # Social features routes
│   │   ├── notifications.js # Notification routes
│   │   └── activities.js   # Activity routes
│   ├── services/           # Business logic services
│   │   ├── emailService.js # Email service with templates
│   │   ├── mediaService.js # Media processing service
│   │   └── socketService.js # Socket.IO service
│   ├── uploads/            # Media storage directories
│   │   ├── images/         # Uploaded images
│   │   ├── videos/         # Uploaded videos
│   │   └── thumbnails/     # Generated thumbnails
│   ├── .env               # Environment variables
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── frontend/              # Next.js React Application
│   ├── app/              # Next.js App Router pages
│   │   ├── auth/         # OAuth callback pages
│   │   ├── hero/         # Main dashboard page
│   │   ├── profile/      # User profile pages
│   │   ├── posts-showcase/ # Posts showcase page
│   │   ├── signin/       # Sign-in page
│   │   ├── signup/       # Sign-up page
│   │   ├── forgot-password/ # Password reset page
│   │   ├── reset-password/  # Password reset form
│   │   └── search/       # User search page
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui + custom components
│   │   │   ├── posts-feed.tsx # Main posts feed with media
│   │   │   ├── posts-carousel.tsx # Posts carousel display
│   │   │   ├── create-post-popup.tsx # Post creation with uploads
│   │   │   └── simple-image-display.tsx # Clean image display
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
├── setup.bat           # One-click setup script (Windows)
├── create-test-image.js # Test image generator
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

### **Posts & Media**
- `POST /api/posts` - Create new post
- `GET /api/posts` - Get posts feed
- `GET /api/posts/user/:userId` - Get user's posts
- `DELETE /api/posts/:postId` - Delete post (author only)
- `POST /api/posts/:postId/like` - Like/unlike post
- `POST /api/posts/:postId/comment` - Comment on post
- `POST /api/posts/upload` - Upload media files
- `GET /uploads/images/:filename` - Access uploaded images
- `GET /uploads/videos/:filename` - Access uploaded videos

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
- `DELETE /api/posts/:postId` - Delete post (author only)
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

### **Media Upload Components**
- **Drag & Drop Upload Area** with visual feedback
- **File Selection Interface** with multiple file support
- **Progress Indicators** showing upload status
- **File Validation Messages** for type/size errors
- **Upload Retry Functionality** for failed uploads
- **Real-time Preview** of selected files

### **Post Management Components**
- **Create Post Popup** with rich media support
- **Posts Feed** with infinite scroll and real-time updates
- **Posts Carousel** for profile view
- **Delete Confirmation Dialogs** with proper authorization
- **Dropdown Menus** using Popover components
- **Media Display** with click-to-enlarge functionality

### **Social Components**
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
PORT=5000
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
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🔧 Google OAuth Setup (Optional)

To enable Google OAuth authentication:

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create a new project** or select existing one
3. **Enable Google+ API** in APIs & Services → Library
4. **Create OAuth 2.0 credentials** in APIs & Services → Credentials
5. **Add authorized redirect URI**: `http://localhost:5000/api/auth/google/callback`
6. **Copy Client ID and Secret** to your backend `.env` file
7. **Restart the backend server**

## 🧪 Testing the Application

### **Manual Testing:**
1. **Visit** http://localhost:3000
2. **Create Account** using email/password or Google OAuth
3. **Test Authentication** flows (login, logout, password reset)
4. **Create Posts** with images and videos
5. **Test Media Upload** (drag & drop, file selection, progress tracking)
6. **Test Post Management** (create, view, delete your own posts)
7. **Explore Social Features** (posts, follows, notifications)
8. **Test Real-time Features** (notifications, online status)
9. **Try Voice Features** when visiting user profiles

### **Media Upload Testing:**
1. **Test File Types**: Try JPEG, PNG, GIF, WebP images and MP4, MOV videos
2. **Test File Sizes**: Try files up to 50MB each
3. **Test Batch Upload**: Select multiple files at once (up to 10)
4. **Test Drag & Drop**: Drag files directly onto upload area
5. **Test Error Handling**: Try unsupported formats or oversized files
6. **Test Display**: Verify images and videos display directly in posts
7. **Test Direct Access**: Visit http://localhost:5000/uploads/images/ to see uploaded files

### **API Testing:**
Use Postman, curl, or Thunder Client to test API endpoints.

**Example - Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Example - Upload Media:**
```bash
curl -X POST http://localhost:5000/api/posts/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "media=@/path/to/your/image.jpg"
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
8. Configure cloud storage for media files (AWS S3, Cloudinary)

### **Frontend Deployment:**
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or similar platform
3. Set production environment variables
4. Update OAuth redirect URLs for production domain
5. Configure CDN for faster media delivery

### **Media Storage Considerations:**
- **Development**: Local file storage in `backend/uploads/`
- **Production**: Recommend cloud storage (AWS S3, Cloudinary, etc.)
- **CDN**: Use CDN for faster global media delivery
- **Backup**: Implement regular backup strategy for uploaded media

## 🎯 Project Status

### **✅ Completed Features**
- ✅ **Real-time media upload system** with progress tracking
- ✅ **Post management** with create, view, and delete functionality
- ✅ **Professional UI** with clean, production-ready interface
- ✅ **One-click setup** via automated `setup.bat` script
- ✅ **File validation** and error handling
- ✅ **Authorization controls** for post management
- ✅ **Static file serving** for uploaded media
- ✅ **Real-time updates** across all connected users
- ✅ **Comprehensive documentation** and troubleshooting guides

### **🎯 Production Ready**
The VIBELY application is now **production-ready** with:
- Professional, clean interface without diagnostic clutter
- Robust error handling and user feedback
- Secure file upload and validation system
- Proper authorization and authentication
- Real-time features working seamlessly
- Comprehensive setup and deployment documentation
- Scalable architecture ready for cloud deployment

## 🐛 Troubleshooting

### **Common Issues:**

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **Media Upload Issues**
   - **Files not uploading**: Check file size (max 50MB) and format
   - **Images not displaying**: Verify backend server is running on port 5000
   - **Upload directory errors**: Run `setup.bat` to recreate directories
   - **CORS errors**: Check FRONTEND_URL in backend `.env`

3. **Static File Access Issues**
   - **Test direct access**: Visit http://localhost:5000/uploads/images/
   - **Check server logs**: Look for file serving errors in backend console
   - **Verify file paths**: Ensure uploaded files exist in backend/uploads/

4. **OAuth Not Working**
   - Check Google OAuth credentials in `.env`
   - Verify redirect URIs in Google Console
   - Ensure backend server is restarted after config changes

5. **Real-time Features Not Working**
   - Check Socket.IO connection in browser console
   - Verify JWT token is valid
   - Ensure both frontend and backend are running

6. **Email Services Not Working**
   - Check email configuration in `.env`
   - Verify SMTP settings for production
   - Check spam folder for test emails

### **Quick Fixes:**
```bash
# Restart everything
setup.bat

# Manual restart
cd backend && npm run dev
cd frontend && npm run dev

# Clear browser cache
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)

# Check if ports are in use
netstat -an | findstr :3000
netstat -an | findstr :5000
```

## 🎯 Key Features Implemented

### **Real-Time Media Upload System**
- **Multer Integration**: Professional file upload handling with validation
- **Progress Tracking**: Real-time upload progress indicators
- **Multiple File Support**: Handle up to 10 files per upload
- **File Validation**: Type, size, and format checking
- **Error Recovery**: Automatic retry for failed uploads
- **Direct Display**: Images and videos show directly in post cards

### **Post Management System**
- **Create Posts**: Rich content creation with media support
- **Delete Posts**: Author-only deletion with confirmation dialogs
- **Real-Time Updates**: Instant updates across all connected users
- **Authorization**: Secure post management with proper permissions
- **Dropdown Menus**: Intuitive post action interfaces

### **Professional UI/UX**
- **Clean Interface**: Removed diagnostic clutter for production-ready look
- **Responsive Design**: Works seamlessly across all device sizes
- **Smooth Animations**: Framer Motion for polished interactions
- **Error Handling**: User-friendly error messages and recovery options
- **Loading States**: Professional loading indicators throughout

### **One-Click Setup**
- **Automated Installation**: Single `setup.bat` file handles everything
- **Dependency Management**: Automatic installation of all required packages
- **Directory Creation**: Automatic setup of upload directories
- **Server Management**: Starts both servers in separate windows
- **Configuration Verification**: Checks system setup and provides feedback

## 📚 Technologies Used

### **Frontend Stack**
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with hooks and context
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Framer Motion** - Animation library
- **Socket.IO Client** - Real-time communication
- **Lucide React** - Icon library

### **Backend Stack**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time bidirectional communication
- **Multer** - File upload middleware
- **JWT** - JSON Web Tokens for authentication
- **Passport.js** - Authentication middleware
- **bcryptjs** - Password hashing
- **Nodemailer** - Email sending

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **nodemon** - Development server auto-restart
- **Autoprefixer** - CSS vendor prefixing
- **PostCSS** - CSS processing

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
