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

    // Handle messaging events
    socket.on('message:typing:start', async (data) => {
      try {
        // Verify users can message each other
        const canMessage = await this.canUsersMessage(userId, data.recipientId);
        if (!canMessage) return;

        const targetSocketId = this.connectedUsers.get(data.recipientId);
        if (targetSocketId) {
          this.io.to(targetSocketId).emit('message:typing:start', {
            senderId: userId,
            sender: socket.user
          });
        }
      } catch (error) {
        console.error('Error handling typing start:', error);
      }
    });

    socket.on('message:typing:stop', async (data) => {
      try {
        // Verify users can message each other
        const canMessage = await this.canUsersMessage(userId, data.recipientId);
        if (!canMessage) return;

        const targetSocketId = this.connectedUsers.get(data.recipientId);
        if (targetSocketId) {
          this.io.to(targetSocketId).emit('message:typing:stop', {
            senderId: userId
          });
        }
      } catch (error) {
        console.error('Error handling typing stop:', error);
      }
    });

    // Handle message read receipts
    socket.on('message:read', async (data) => {
      try {
        // Verify users can message each other
        const canMessage = await this.canUsersMessage(userId, data.senderId);
        if (!canMessage) return;

        const targetSocketId = this.connectedUsers.get(data.senderId);
        if (targetSocketId) {
          this.io.to(targetSocketId).emit('message:read', {
            readBy: userId,
            messageId: data.messageId,
            conversationId: data.conversationId
          });
        }
      } catch (error) {
        console.error('Error handling message read:', error);
      }
    });

    // Handle joining conversation rooms
    socket.on('conversation:join', async (data) => {
      try {
        const { otherUserId } = data;
        // Verify users can message each other
        const canMessage = await this.canUsersMessage(userId, otherUserId);
        if (!canMessage) {
          socket.emit('conversation:error', { message: 'You can only message mutual followers' });
          return;
        }

        // Create conversation room ID (consistent for both users)
        const conversationId = [userId, otherUserId].sort().join('_');
        socket.join(`conversation:${conversationId}`);
        
        socket.emit('conversation:joined', { conversationId, otherUserId });
      } catch (error) {
        console.error('Error joining conversation:', error);
        socket.emit('conversation:error', { message: 'Failed to join conversation' });
      }
    });

    // Handle leaving conversation rooms
    socket.on('conversation:leave', (data) => {
      const { otherUserId } = data;
      const conversationId = [userId, otherUserId].sort().join('_');
      socket.leave(`conversation:${conversationId}`);
    });

    // Handle real-time message sending
    socket.on('message:send', async (data) => {
      try {
        const { recipientId, content, messageType = 'text', messageId } = data;
        
        console.log('Socket message:send received:', { recipientId, content, messageId });
        
        // Verify users can message each other
        const canMessage = await this.canUsersMessage(userId, recipientId);
        if (!canMessage) {
          socket.emit('message:error', { message: 'You can only message mutual followers' });
          return;
        }

        // Create conversation room ID
        const conversationId = [userId, recipientId].sort().join('_');
        
        // Emit to conversation room (both users if online)
        this.io.to(`conversation:${conversationId}`).emit('message:received', {
          senderId: userId,
          recipientId: recipientId,
          content: content,
          messageType: messageType,
          sender: socket.user,
          timestamp: new Date().toISOString(),
          conversationId: conversationId,
          messageId: messageId
        });

        // Also send direct notification to recipient if they're online
        const targetSocketId = this.connectedUsers.get(recipientId);
        if (targetSocketId) {
          this.io.to(targetSocketId).emit('message:notification', {
            senderId: userId,
            sender: socket.user,
            content: content,
            conversationId: conversationId,
            messageId: messageId
          });
        }

        console.log(`Message sent from ${userId} to ${recipientId} via socket`);

      } catch (error) {
        console.error('Error handling real-time message:', error);
        socket.emit('message:error', { message: 'Failed to send message' });
      }
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

  // Broadcast stats updates
  broadcastStatsUpdate(userId, stats) {
    // Send to the user themselves
    const userSocketId = this.connectedUsers.get(userId);
    if (userSocketId) {
      this.io.to(userSocketId).emit('user:stats_updated', {
        userId,
        ...stats
      });
    }

    // Also broadcast to followers for their feeds
    this.notifyFollowersStatsUpdate(userId, stats);
  }

  async notifyFollowersStatsUpdate(userId, stats) {
    try {
      const Follow = require('../models/Follow');
      const followers = await Follow.find({
        following: userId,
        isActive: true
      }).populate('follower', '_id');

      followers.forEach(follow => {
        const followerSocketId = this.connectedUsers.get(follow.follower._id.toString());
        if (followerSocketId) {
          this.io.to(followerSocketId).emit('user:stats_updated', {
            userId,
            ...stats
          });
        }
      });
    } catch (error) {
      console.error('Error notifying followers of stats update:', error);
    }
  }

  // Broadcast follow updates with stats
  broadcastFollowUpdate(followerId, targetUserId, isFollowing, followerCount, followingCount) {
    // Notify the target user about their follower count change
    const targetSocketId = this.connectedUsers.get(targetUserId);
    if (targetSocketId) {
      this.io.to(targetSocketId).emit('follow:updated', {
        followerId,
        targetUserId,
        isFollowing,
        followerCount
      });
    }

    // Notify the follower about their following count change
    const followerSocketId = this.connectedUsers.get(followerId);
    if (followerSocketId) {
      this.io.to(followerSocketId).emit('follow:updated', {
        followerId,
        targetUserId,
        isFollowing,
        followingCount
      });
    }
  }

  // Broadcast post stats updates
  broadcastPostStatsUpdate(authorId, postCount) {
    const authorSocketId = this.connectedUsers.get(authorId);
    if (authorSocketId) {
      this.io.to(authorSocketId).emit('post:stats_updated', {
        authorId,
        postCount
      });
    }
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

  // Helper method to check if users can message each other
  async canUsersMessage(user1Id, user2Id) {
    try {
      const Follow = require('../models/Follow');
      
      // Check if both users follow each other (mutual follow)
      const follow1 = await Follow.findOne({
        follower: user1Id,
        following: user2Id,
        isActive: true
      });

      const follow2 = await Follow.findOne({
        follower: user2Id,
        following: user1Id,
        isActive: true
      });

      return follow1 && follow2;
    } catch (error) {
      console.error('Error checking message permissions:', error);
      return false;
    }
  }

  // Send real-time message notification
  async sendMessageNotification(recipientId, message) {
    const socketId = this.connectedUsers.get(recipientId);
    if (socketId) {
      this.io.to(socketId).emit('message:new', {
        message,
        sender: message.sender
      });
    }
  }
}

module.exports = new SocketService();