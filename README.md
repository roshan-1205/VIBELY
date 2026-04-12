# Vibely - Social Media Platform

A modern full-stack social media platform built with Next.js and Node.js, featuring real-time messaging, media sharing, and social interactions.

## 🚀 Features

- **User Authentication**: Secure login/signup with JWT tokens
- **Social OAuth**: Google and Microsoft authentication
- **Real-time Messaging**: Socket.io powered chat system
- **Media Sharing**: Image and video upload capabilities
- **Social Features**: Posts, likes, comments, follows
- **Email Notifications**: SMTP-based email system
- **Responsive Design**: Mobile-first responsive UI
- **Real-time Updates**: Live notifications and activity feeds

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible component primitives
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Socket.io** - Real-time bidirectional communication
- **JWT** - JSON Web Token authentication
- **Multer** - File upload handling
- **Nodemailer** - Email service integration

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Gmail account (for SMTP email service)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VIBELY
   ```

2. **Install dependencies**
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

3. **Environment Setup**
   
   **Backend Configuration:**
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Edit `backend/.env` with your actual values:
   - MongoDB connection string
   - JWT secrets
   - SMTP email credentials
   - OAuth client IDs and secrets
   
   **Frontend Configuration:**
   ```bash
   cd frontend
   cp .env.example .env.local
   ```
   
   Edit `frontend/.env.local` with your backend URL.

4. **Database Setup**
   
   If using Supabase (optional):
   ```bash
   cd backend
   node setup-supabase-db.js
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:5001`

2. **Start the frontend development server:**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

### Using Convenience Scripts

From the root directory:
```bash
# Windows
start-dev.bat

# Linux/Mac
./start-dev.sh
```

## 📁 Project Structure

```
VIBELY/
├── backend/                 # Node.js/Express backend
│   ├── config/             # Database and app configuration
│   ├── middleware/         # Express middleware
│   ├── models/            # MongoDB/Mongoose models
│   ├── routes/            # API route handlers
│   ├── services/          # Business logic services
│   ├── uploads/           # File upload directory
│   └── server.js          # Main server file
├── frontend/              # Next.js frontend
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable React components
│   ├── contexts/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   ├── services/        # API service functions
│   └── utils/           # Helper utilities
├── supabase/            # Database migrations (optional)
└── README.md
```

## 🔐 Environment Variables

### Backend (.env)
```env
# Server
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=your-mongodb-connection-string

# Authentication
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret

# Email (SMTP)
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## 🚀 Deployment

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy using the provided `render.yaml` configuration

### Frontend (Firebase Hosting)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Build and deploy:
   ```bash
   cd frontend
   npm run build
   firebase deploy
   ```

## 📧 Email Configuration

The application uses Gmail SMTP for sending emails. To set up:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in your `SMTP_PASSWORD` environment variable

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Helmet.js security headers
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the flexible database solution
- All open-source contributors who made this project possible