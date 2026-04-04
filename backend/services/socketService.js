const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // userId -> socketId
    this.userSockets = new Map(); // socketId -> userId
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: [
          process.env.FRONTEND_URL || 'http://localhost:3000',
          'http://localhost:3000',
          'http://localhost:3001'
        ],
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
          return next(new Error('User not found'));
        }

        socket.userId = user._id.toString();
        socket.user = user;
        next();
      } catch (error) {
        console.error('Socket authentication error:', error);
        next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket) => {
      this.handleConnection(socket);
    });

    console.log('✅ Socket.IO service initialized');
  }

  async handleConnection(socket) {
    const userId = socket.userId;
    const user = socket.user;

    console.log(`🔌 User connected: ${user.firstName} ${user.lastName} (${userId})`);

    // Store connection
    this.connectedUsers.set(userId, socket.id);
    this.userSockets.set(socket.id, userId);

    // Update user online status
    try {
      await User.findByIdAndUpdate(userId, {
        isOnline: true,
        lastSeen: new Date()
      });
    } catch (error) {
      console.error('Error updating online status:', error);
    }

    // Join user to their personal room
    socket.join(`user:${userId}`);

    // Notify followers that user is online
    this.notifyFollowersOnlineStatus(userId, true);

    // Send initial data
    socket.emit('connected', {
      message: 'Connected to Vibely real-time service',
      userId: userId
    });

    // Handle real-time events
    this.setupEventHandlers(socket);

    // Handle disconnection
    socket.on('disconnect', () => {
      this.handleDisconnection(socket);
    });
  }

  async handleDisconnection(socket) {
    const userId = socket.userId;
    const user = socket.user;

    console.log(`🔌 User disconnected: ${user?.firstName} ${user?.lastName} (${userId})`);

    // Remove from connected users
    this.connectedUsers.delete(userId);
    this.userSockets.delete(socket.id);

    // Update user offline status
    try {
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date()
      });
    } catch (error) {
      console.error('Error updating offline status:', error);
    }

    // Notify followers that user is offline
    this.notifyFollowersOnlineStatus(userId, false);
  }

  setupEventHandlers(socket) {
    const userId = socket.userId;

    // Handle typing indicators
    socket.on('typing:start', (data) => {
      socket.to(`user:${data.targetUserId}`).emit('typing:start', {
        userId: userId,
        user: socket.user
      });
    });

    socket.on('typing:stop', (data) => {
      socket.to(`user:${data.targetUserId}`).emit('typing:stop', {
        userId: userId
      });
    });

    // Handle live reactions
    socket.on('reaction:add', (data) => {
      this.io.emit('reaction:added', {
        postId: data.postId,
        userId: userId,
        user: socket.user,
        reaction: data.reaction
      });
    });

    // Handle live comments
    socket.on('comment:add', (data) => {
      this.io.emit('comment:added', {
        postId: data.postId,
        comment: data.comment,
        user: socket.user
      });
    });
  }

  // Notification methods
  async sendNotification(userId, notification) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit('notification:new', notification);
    }
  }

  async sendActivityUpdate(userId, activity) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit('activity:new', activity);
    }
  }

  async notifyFollowersOnlineStatus(userId, isOnline) {
    try {
      const Follow = require('../models/Follow');
      const followers = await Follow.find({
        following: userId,
        isActive: true
      }).populate('follower', '_id');

      followers.forEach(follow => {
        const followerSocketId = this.connectedUsers.get(follow.follower._id.toString());
        if (followerSocketId) {
          this.io.to(followerSocketId).emit('user:online_status', {
            userId: userId,
            isOnline: isOnline
          });
        }
      });
    } catch (error) {
      console.error('Error notifying followers of online status:', error);
    }
  }

  // Broadcast methods
  broadcastNewPost(post) {
    this.io.emit('post:new', post);
  }

  broadcastPostUpdate(postId, update) {
    this.io.emit('post:updated', { postId, update });
  }

  broadcastUserUpdate(userId, update) {
    this.io.emit('user:updated', { userId, update });
  }

  // Get online users
  getOnlineUsers() {
    return Array.from(this.connectedUsers.keys());
  }

  // Check if user is online
  isUserOnline(userId) {
    return this.connectedUsers.has(userId);
  }

  // Send message to specific user
  sendToUser(userId, event, data) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }

  // Broadcast to all users
  broadcast(event, data) {
    this.io.emit(event, data);
  }
}

module.exports = new SocketService();