const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const http = require('http');
require('dotenv').config(); // Load environment variables FIRST

const socketService = require('./services/socketService');
const passport = require('./config/passport');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/posts');
const socialRoutes = require('./routes/social');
const notificationRoutes = require('./routes/notifications');
const activityRoutes = require('./routes/activities');
const messageRoutes = require('./routes/messages');

const app = express();
const server = http.createServer(app);

// Security middleware
app.use(helmet());

// Rate limiting (disabled for testing)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.'
// });
// app.use(limiter);

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://vibely-1205.web.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory with absolute path
const path = require('path');
const uploadsPath = path.join(__dirname, 'uploads');
console.log(`📂 Serving static files from: ${uploadsPath}`);
app.use('/uploads', express.static(uploadsPath));

// Add CORS headers for static files
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve test HTML file
app.use(express.static('.', { 
  index: false,
  dotfiles: 'ignore',
  extensions: ['html']
}));

// Session configuration for OAuth (temporarily disabled)
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'vibely-session-secret-change-in-production',
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({
//     mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/vibely'
//   }),
//   cookie: {
//     secure: process.env.NODE_ENV === 'production',
//     maxAge: 24 * 60 * 60 * 1000 // 24 hours
//   }
// }));

// Simple session for OAuth (fallback)
app.use(session({
  secret: process.env.SESSION_SECRET || 'vibely-session-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Database connection
const DATABASE_TYPE = process.env.DATABASE_TYPE || 'supabase'; // 'mongodb' or 'supabase'

if (DATABASE_TYPE === 'supabase') {
  // Supabase PostgreSQL connection
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres.xmziootltbhwxmigvqhv:Rs%409826348254@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
    ssl: { 
      rejectUnauthorized: false,
      require: true
    },
    // Force IPv4 to avoid IPv6 issues
    host: 'aws-0-ap-south-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.xmziootltbhwxmigvqhv',
    password: 'Rs@9826348254'
  });
  
  pool.connect()
    .then(() => {
      console.log('✅ Connected to Supabase PostgreSQL');
      // Initialize Socket.IO after database connection
      socketService.initialize(server);
    })
    .catch((err) => console.error('❌ Supabase connection error:', err));
    
  // Make pool available to routes
  app.use((req, res, next) => {
    req.db = pool;
    req.dbType = 'supabase';
    next();
  });
} else {
  // MongoDB connection (original)
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vibely')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    // Initialize Socket.IO after database connection
    socketService.initialize(server);
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
  
  // Make mongoose available to routes
  app.use((req, res, next) => {
    req.dbType = 'mongodb';
    next();
  });
}

// Make socketService available to routes
app.use((req, res, next) => {
  req.socketService = socketService;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/messages', messageRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Vibely API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Vibely API',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/user',
      posts: '/api/posts',
      social: '/api/social',
      notifications: '/api/notifications',
      activities: '/api/activities',
      messages: '/api/messages'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found' 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔌 WebSocket server ready`);
  console.log(`🔐 Enhanced authentication with OAuth support`);
});