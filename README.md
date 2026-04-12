# Vibely - Modern Social Media Platform

A comprehensive full-stack social media platform built with Next.js and Node.js, featuring real-time messaging, media sharing, social interactions, and modern UI/UX design.

## 🌟 Live Demo

- **Frontend (Netlify)**: [https://vibely12.netlify.app](https://vibely12.netlify.app)
- **Repository**: [https://github.com/roshan-1205/VIBELY](https://github.com/roshan-1205/VIBELY)

## 🚀 Key Features

### 🔐 Authentication & Security
- **Multi-Authentication System**: Email/Password + Google OAuth
- **JWT Token Security**: Secure authentication with 7-day expiration
- **Password Security**: bcryptjs hashing with salt rounds
- **Email Verification**: Secure email verification system
- **Password Reset**: Time-limited password reset functionality

### 📱 Social Features
- **Real-time Posts**: Create, view, and delete posts with media
- **Media Upload System**: Drag & drop support for images and videos
- **Social Interactions**: Like, comment, and follow system
- **User Profiles**: Customizable profiles with avatars and bio
- **Activity Feed**: Real-time activity tracking and notifications
- **Search & Discovery**: Find users and content easily

### 💬 Real-time Communication
- **Socket.io Integration**: Real-time messaging and notifications
- **Live Chat**: Private messaging between users
- **Online Status**: See who's online in real-time
- **Typing Indicators**: Live typing status in conversations
- **Message History**: Persistent conversation management

### 📧 Email System
- **Professional Templates**: Welcome, verification, and alert emails
- **SMTP Integration**: Gmail SMTP with secure authentication
- **Login Alerts**: Security notifications with IP and device info
- **Configurable Notifications**: Enable/disable email types

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: shadcn/ui with Radix UI primitives
- **Smooth Animations**: Framer Motion for polished interactions
- **Dark/Light Mode**: Theme support (coming soon)
- **Accessibility**: WCAG compliant components

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Framer Motion** - Animation library
- **Radix UI** - Accessible component primitives
- **Socket.io Client** - Real-time communication
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time bidirectional communication
- **JWT** - JSON Web Token authentication
- **Passport.js** - Authentication middleware
- **Multer** - File upload handling
- **Nodemailer** - Email service integration
- **bcryptjs** - Password hashing

### DevOps & Deployment
- **Netlify** - Frontend hosting and deployment
- **Render** - Backend hosting (ready for deployment)
- **MongoDB Atlas** - Database hosting
- **Git** - Version control
- **GitHub** - Code repository

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Git** - [Download here](https://git-scm.com/)
- **MongoDB Atlas Account** - [Sign up here](https://www.mongodb.com/atlas)
- **Gmail Account** - For SMTP email service

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/roshan-1205/VIBELY.git
cd VIBELY
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Configuration

#### Backend Environment Setup
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your actual values:
```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration (MongoDB Atlas)
MONGODB_URI=your-mongodb-atlas-connection-string

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Session Configuration
SESSION_SECRET=your-session-secret-change-in-production

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Email Configuration (Gmail SMTP)
EMAIL_SERVICE=gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
EMAIL_FROM="Your App Name <your-email@gmail.com>"

# Email Features
SEND_WELCOME_EMAIL=true
SEND_LOGIN_ALERT=true
SEND_VERIFICATION_EMAIL=true

# OAuth Configuration (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### Frontend Environment Setup
```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### 4. Database Setup

#### MongoDB Atlas Setup
1. Create a MongoDB Atlas cluster
2. Create a database user with read/write permissions
3. Whitelist your IP address (or use 0.0.0.0/0 for development)
4. Get the connection string and add it to `MONGODB_URI`

#### Optional: Supabase Setup
If you want to use Supabase instead:
```bash
cd backend
node setup-supabase-db.js
```

## 🚀 Running the Application

### Development Mode

#### Option 1: Manual Start
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### Option 2: Convenience Scripts
```bash
# Windows
start-dev.bat

# Linux/Mac
chmod +x start-dev.sh
./start-dev.sh
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **API Health Check**: http://localhost:5001/api/health

## 📁 Project Structure

```
VIBELY/
├── 📁 backend/                    # Node.js/Express API Server
│   ├── 📁 config/                # Configuration files
│   │   └── passport.js           # OAuth configuration
│   ├── 📁 middleware/            # Custom middleware
│   │   ├── auth.js              # JWT authentication
│   │   └── upload.js            # File upload handling
│   ├── 📁 models/               # MongoDB/Mongoose models
│   │   ├── User.js             # User model with OAuth
│   │   ├── Post.js             # Post model with media
│   │   ├── Follow.js           # Follow relationships
│   │   ├── Message.js          # Messaging system
│   │   └── Notification.js     # Notifications
│   ├── 📁 routes/              # API route handlers
│   │   ├── auth.js            # Authentication routes
│   │   ├── posts.js           # Post management
│   │   ├── social.js          # Social features
│   │   └── messages.js        # Messaging routes
│   ├── 📁 services/           # Business logic services
│   │   ├── emailService.js    # Email templates & sending
│   │   └── socketService.js   # Socket.IO management
│   ├── 📁 uploads/            # Media storage (gitignored)
│   │   ├── images/           # Uploaded images
│   │   └── videos/           # Uploaded videos
│   ├── .env.example          # Environment template
│   ├── package.json          # Backend dependencies
│   └── server.js             # Main server file
├── 📁 frontend/                  # Next.js React Application
│   ├── 📁 app/                  # Next.js App Router
│   │   ├── 📁 auth/            # Authentication pages
│   │   ├── 📁 hero/            # Main dashboard
│   │   ├── 📁 profile/         # User profiles
│   │   ├── 📁 signin/          # Sign-in page
│   │   └── 📁 signup/          # Sign-up page
│   ├── 📁 components/          # React components
│   │   ├── 📁 ui/             # shadcn/ui components
│   │   └── ProtectedRoute.tsx  # Route protection
│   ├── 📁 contexts/           # React Context providers
│   │   ├── AuthContext.tsx    # Authentication state
│   │   └── SocketContext.tsx  # Socket.IO connection
│   ├── 📁 hooks/              # Custom React hooks
│   ├── 📁 lib/                # Utility libraries
│   ├── 📁 services/           # API service layer
│   │   └── api.ts            # API client
│   ├── .env.example          # Environment template
│   ├── package.json          # Frontend dependencies
│   └── next.config.js        # Next.js configuration
├── 📁 supabase/                 # Database migrations (optional)
├── .gitignore                   # Git ignore rules
├── DEPLOYMENT.md                # Deployment guide
├── README.md                    # This file
└── package.json                 # Root dependencies
```

## 🔐 Environment Variables Reference

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5001` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | Database connection | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing key | `your-secret-key` |
| `SESSION_SECRET` | Session secret | `your-session-secret` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `SMTP_EMAIL` | Gmail address | `your-email@gmail.com` |
| `SMTP_PASSWORD` | Gmail app password | `your-app-password` |
| `GOOGLE_CLIENT_ID` | Google OAuth ID | `your-google-client-id` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | `your-google-secret` |

### Frontend (.env.local)
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5001/api` |

## 🚀 Deployment

### Frontend Deployment (Netlify) ✅ **COMPLETED**

The frontend is already deployed on Netlify:
- **Live URL**: https://vibely12.netlify.app
- **Build Status**: ✅ Successful
- **Deployment**: Automatic from GitHub

### Backend Deployment (Coming Soon)

#### Render Deployment
1. **Connect Repository**: Link your GitHub repository to Render
2. **Environment Variables**: Set all backend environment variables
3. **Build Settings**:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `backend`

#### Railway Deployment
1. **Connect Repository**: Link to Railway
2. **Environment Variables**: Configure in Railway dashboard
3. **Auto-deploy**: Enabled from main branch

#### Heroku Deployment
1. **Create App**: `heroku create your-app-name`
2. **Set Environment Variables**: `heroku config:set VAR=value`
3. **Deploy**: `git push heroku main`

## 📧 Email Service Setup

### Gmail SMTP Configuration
1. **Enable 2FA**: Enable 2-factor authentication on Gmail
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Update Environment**: Use app password in `SMTP_PASSWORD`

### Email Templates
The application includes professional email templates for:
- **Welcome Email**: Sent after successful registration
- **Email Verification**: Secure email verification links
- **Login Alerts**: Security notifications with IP/device info
- **Password Reset**: Time-limited password reset links

## 🔒 Security Features

### Authentication Security
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Session Management**: Secure session handling
- **OAuth Integration**: Google OAuth 2.0 support

### API Security
- **CORS Protection**: Configured for specific origins
- **Rate Limiting**: Prevent API abuse (configurable)
- **Helmet.js**: Security headers middleware
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: MongoDB injection prevention

### Data Security
- **Environment Variables**: Sensitive data in .env files
- **File Upload Security**: Type and size validation
- **HTTPS Ready**: SSL/TLS support for production
- **Database Security**: MongoDB Atlas security features

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and email verification
- [ ] Login with email/password and Google OAuth
- [ ] Create posts with text, images, and videos
- [ ] Real-time messaging and notifications
- [ ] File upload functionality
- [ ] Password reset flow
- [ ] Responsive design on mobile devices

### API Testing
Use tools like Postman, Insomnia, or curl to test API endpoints:

```bash
# Health check
curl http://localhost:5001/api/health

# Register user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"SecurePass123"}'

# Login user
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123"}'
```

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```bash
# Check connection string format
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Verify IP whitelist in MongoDB Atlas
# Check network connectivity
```

#### CORS Errors
```bash
# Ensure FRONTEND_URL matches your frontend URL
FRONTEND_URL=http://localhost:3000

# For production, update to your deployed frontend URL
FRONTEND_URL=https://your-app.netlify.app
```

#### Email Service Issues
```bash
# Verify Gmail app password (not regular password)
# Check SMTP settings
# Ensure 2FA is enabled on Gmail account
```

#### File Upload Problems
```bash
# Check upload directory permissions
# Verify file size limits (default: 50MB)
# Ensure supported file types (images: jpg, png, gif; videos: mp4, mov)
```

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=vibely:*
```

## 📊 Performance Optimization

### Frontend Optimization
- **Static Generation**: Next.js static optimization
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Bundle Analysis**: Use `npm run analyze`

### Backend Optimization
- **Database Indexing**: MongoDB indexes for queries
- **Caching**: Redis caching (coming soon)
- **Compression**: Gzip compression enabled
- **Rate Limiting**: Prevent API abuse

## 🔄 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | User logout |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/auth/google` | Google OAuth login |

### Posts Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get posts feed |
| POST | `/api/posts` | Create new post |
| DELETE | `/api/posts/:id` | Delete post |
| POST | `/api/posts/:id/like` | Like/unlike post |
| POST | `/api/posts/:id/comment` | Add comment |

### Social Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/social/follow/:userId` | Follow/unfollow user |
| GET | `/api/social/followers/:userId` | Get followers |
| GET | `/api/social/following/:userId` | Get following |
| GET | `/api/social/search` | Search users |

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
   ```bash
   git fork https://github.com/roshan-1205/VIBELY.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit Changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```

4. **Push to Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open Pull Request**
   - Describe your changes
   - Include screenshots if UI changes
   - Reference any related issues

### Development Guidelines
- Follow existing code style and conventions
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation if needed
- Ensure no sensitive data is committed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Community

- **GitHub Issues**: [Report bugs or request features](https://github.com/roshan-1205/VIBELY/issues)
- **Discussions**: [Join community discussions](https://github.com/roshan-1205/VIBELY/discussions)
- **Email**: For private inquiries, contact the maintainers

## 🙏 Acknowledgments

Special thanks to:
- **Next.js Team** - For the incredible React framework
- **Vercel** - For Next.js and deployment platform
- **MongoDB** - For the flexible NoSQL database
- **Netlify** - For seamless frontend deployment
- **shadcn/ui** - For the beautiful component library
- **Tailwind CSS** - For the utility-first CSS framework
- **Socket.IO** - For real-time communication capabilities
- **Open Source Community** - For the amazing tools and libraries

## 🚀 What's Next?

### Upcoming Features
- [ ] **Dark Mode**: Theme switching capability
- [ ] **Mobile App**: React Native mobile application
- [ ] **Advanced Search**: Enhanced search with filters
- [ ] **Stories Feature**: Instagram-like stories
- [ ] **Video Calls**: WebRTC video calling
- [ ] **Push Notifications**: Browser push notifications
- [ ] **Content Moderation**: AI-powered content filtering
- [ ] **Analytics Dashboard**: User engagement analytics

### Performance Improvements
- [ ] **Redis Caching**: Implement caching layer
- [ ] **CDN Integration**: CloudFront/CloudFlare integration
- [ ] **Database Optimization**: Query optimization and indexing
- [ ] **Image Processing**: Automatic image compression and resizing

---

**Built with ❤️ by [Roshan Kumar Singh](https://github.com/roshan-1205)**

**⭐ Star this repository if you found it helpful!**