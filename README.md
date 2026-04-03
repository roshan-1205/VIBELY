# Vibely - Social Platform

A modern full-stack social platform built with Next.js, Node.js, and MongoDB featuring real-time authentication, animated components, and a beautiful UI.

## 🚀 Features

### Frontend
- ✅ **Next.js 14** with App Router and TypeScript
- ✅ **shadcn/ui** component library with Tailwind CSS
- ✅ **Framer Motion** animations (ShuffleHero component)
- ✅ **Real-time Authentication** with JWT tokens
- ✅ **Protected Routes** and automatic redirects
- ✅ **Form Validation** with error handling
- ✅ **Responsive Design** for all devices
- ✅ **Dark Mode** support

### Backend
- ✅ **Node.js/Express** REST API
- ✅ **MongoDB** with Mongoose ODM
- ✅ **JWT Authentication** with secure token handling
- ✅ **Password Hashing** with bcryptjs
- ✅ **Input Validation** with express-validator
- ✅ **Rate Limiting** and security headers
- ✅ **CORS** configuration
- ✅ **Error Handling** and logging

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

# Edit .env with your configuration (optional for development)
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

## 📱 User Flow

### New User Registration
1. Visit http://localhost:3000
2. Click "Get Started"
3. Fill out the registration form:
   - First Name (2+ characters, letters only)
   - Last Name (2+ characters, letters only)
   - Email (valid email format)
   - Password (6+ characters with uppercase, lowercase, and number)
4. Automatically redirected to dashboard after successful registration

### Existing User Login
1. Visit http://localhost:3000
2. Click "Sign In"
3. Enter your email and password
4. Automatically redirected to dashboard after successful login

### Protected Dashboard
- Access the hero dashboard at `/hero` (requires authentication)
- View animated ShuffleHero component
- See personalized user information
- Access profile management features

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify-token` - Verify JWT token

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/password` - Update password
- `GET /api/user/stats` - Get user statistics
- `DELETE /api/user/account` - Deactivate account

## 🗂️ Project Structure

```
VIBELY/
├── backend/                 # Node.js/Express API
│   ├── middleware/         # Auth & validation middleware
│   ├── models/            # MongoDB/Mongoose models
│   ├── routes/            # API route handlers
│   ├── .env               # Environment variables
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── frontend/               # Next.js React app
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   ├── contexts/          # React Context providers
│   ├── services/          # API service layer
│   ├── .env.local         # Frontend environment variables
│   └── package.json       # Frontend dependencies
├── start-dev.sh           # Development startup script (Unix)
├── start-dev.bat          # Development startup script (Windows)
└── README.md              # This file
```

## 🔐 Authentication System

### Security Features
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcryptjs with 12 salt rounds
- **Token Verification**: Automatic token validation
- **Protected Routes**: Client-side route protection
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Comprehensive server-side validation
- **CORS Protection**: Configured for frontend domain

### Password Requirements
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Token Management
- Tokens expire in 7 days (configurable)
- Stored securely in localStorage
- Automatic cleanup on logout
- Server-side token verification

## 🎨 UI Components

### ShuffleHero Component
- Animated 4x4 image grid
- Images shuffle every 3 seconds
- Smooth spring animations with Framer Motion
- Responsive design
- High-quality Unsplash stock images

### Authentication Forms
- Real-time validation
- Loading states with spinners
- Error handling with user-friendly messages
- Responsive design
- Social login UI (Google/Microsoft)

## 🛠️ Development

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

**Backend (.env):**
```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/vibely
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🧪 Testing the API

You can test the API endpoints using tools like:

- **Postman** - GUI testing
- **curl** - Command line testing
- **Thunder Client** - VS Code extension

### Example API Calls

**Register User:**
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

**Login User:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

## 🚀 Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure MongoDB Atlas or production database
4. Set up proper CORS origins
5. Use PM2 or similar for process management
6. Configure SSL/HTTPS
7. Set up proper logging and monitoring

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or similar platform
3. Set production environment variables
4. Configure custom domain (optional)

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running: `brew services start mongodb-community`
   - Check connection string in backend `.env`
   - Verify network connectivity

2. **CORS Errors**
   - Verify `FRONTEND_URL` in backend `.env`
   - Check frontend is running on http://localhost:3000

3. **JWT Token Issues**
   - Check `JWT_SECRET` is set in backend `.env`
   - Verify token format in API requests
   - Clear localStorage if tokens are corrupted

4. **Port Already in Use**
   - Backend: Change `PORT` in `.env` or kill process on port 5000
   - Frontend: Next.js will automatically use next available port

5. **Dependencies Issues**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again
   - Ensure Node.js version is 16+

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Unsplash](https://unsplash.com/) for the high-quality stock images
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- The open-source community for the amazing tools and libraries