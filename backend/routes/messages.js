const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const Follow = require('../models/Follow');
const auth = require('../middleware/auth');
const { body, validationResult, param } = require('express-validator');

// Get user's conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user._id;

    const conversations = await Message.getUserConversations(
      userId,
      parseInt(page),
      parseInt(limit)
    );

    res.json({
      success: true,
      data: { conversations },
      message: 'Conversations retrieved successfully'
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve conversations'
    });
  }
});

// Get conversation with specific user
router.get('/conversation/:userId', [
  auth,
  param('userId').isMongoId().withMessage('Invalid user ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const currentUserId = req.user._id;

    // Check if the other user exists
    const otherUser = await User.findById(userId).select('firstName lastName avatar isOnline lastSeen');
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if users can message each other (must be following each other)
    const canMessage = await canUsersMessage(currentUserId, userId);
    if (!canMessage) {
      return res.status(403).json({
        success: false,
        message: 'You can only message users you follow and who follow you back'
      });
    }

    const messages = await Message.getConversation(
      currentUserId,
      userId,
      parseInt(page),
      parseInt(limit)
    );

    // Mark messages as read
    await Message.updateMany(
      {
        sender: userId,
        recipient: currentUserId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({
      success: true,
      data: { 
        messages: messages.reverse(), // Reverse to show oldest first
        otherUser 
      },
      message: 'Conversation retrieved successfully'
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve conversation'
    });
  }
});

// Send a message
router.post('/send', [
  auth,
  body('recipientId').isMongoId().withMessage('Invalid recipient ID'),
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Message content must be between 1 and 1000 characters'),
  body('messageType').optional().isIn(['text', 'image', 'file']).withMessage('Invalid message type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { recipientId, content, messageType = 'text', attachments = [] } = req.body;
    const senderId = req.user._id;

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Check if users can message each other
    const canMessage = await canUsersMessage(senderId, recipientId);
    if (!canMessage) {
      return res.status(403).json({
        success: false,
        message: 'You can only message users you follow and who follow you back'
      });
    }

    // Create message
    const message = new Message({
      sender: senderId,
      recipient: recipientId,
      content,
      messageType,
      attachments
    });

    await message.save();

    // Populate sender and recipient
    await message.populate('sender', 'firstName lastName avatar isOnline lastSeen');
    await message.populate('recipient', 'firstName lastName avatar isOnline lastSeen');

    // Send real-time notification via socket
    if (req.socketService) {
      // Send to recipient via socket service
      req.socketService.sendMessageNotification(recipientId, message)
      
      // Also emit to conversation room
      const conversationId = [senderId, recipientId].sort().join('_')
      req.socketService.io.to(`conversation:${conversationId}`).emit('message:received', {
        senderId: senderId,
        recipientId: recipientId,
        content: message.content,
        messageType: message.messageType,
        sender: message.sender,
        timestamp: message.createdAt,
        conversationId: conversationId,
        messageId: message._id
      })

      console.log(`Message saved and sent via socket: ${message._id}`)
    }

    res.status(201).json({
      success: true,
      data: { message },
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

// Mark messages as read
router.put('/mark-read/:userId', [
  auth,
  param('userId').isMongoId().withMessage('Invalid user ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { userId } = req.params;
    const currentUserId = req.user._id;

    const result = await Message.updateMany(
      {
        sender: userId,
        recipient: currentUserId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    // Send real-time notification to sender
    if (req.socketService && result.modifiedCount > 0) {
      req.socketService.sendToUser(userId, 'messages:read', {
        readBy: currentUserId,
        count: result.modifiedCount
      });
    }

    res.json({
      success: true,
      data: { markedCount: result.modifiedCount },
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read'
    });
  }
});

// Delete a message
router.delete('/:messageId', [
  auth,
  param('messageId').isMongoId().withMessage('Invalid message ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is sender or recipient
    if (!message.sender.equals(userId) && !message.recipient.equals(userId)) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own messages'
      });
    }

    await message.softDelete(userId);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message'
    });
  }
});

// Get unread message count
router.get('/unread-count', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const count = await Message.countDocuments({
      recipient: userId,
      isRead: false,
      isDeleted: false,
      deletedBy: { $not: { $elemMatch: { user: userId } } }
    });

    res.json({
      success: true,
      data: { count },
      message: 'Unread count retrieved successfully'
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count'
    });
  }
});

// Get messageable users (followers and following)
router.get('/messageable-users', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { search = '', page = 1, limit = 20 } = req.query;
    const ObjectId = require('mongoose').Types.ObjectId;

    // Get users who follow current user AND current user follows back (mutual follows)
    const mutualFollows = await Follow.aggregate([
      {
        $match: {
          $or: [
            { follower: new ObjectId(userId), isActive: true },
            { following: new ObjectId(userId), isActive: true }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$follower', new ObjectId(userId)] },
              then: '$following',
              else: '$follower'
            }
          },
          connections: { $push: '$$ROOT' }
        }
      },
      {
        $match: {
          'connections.1': { $exists: true } // Must have at least 2 connections (mutual)
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $match: search ? {
          $or: [
            { 'user.firstName': { $regex: search, $options: 'i' } },
            { 'user.lastName': { $regex: search, $options: 'i' } },
            { 'user.email': { $regex: search, $options: 'i' } }
          ]
        } : {}
      },
      {
        $project: {
          _id: '$user._id',
          firstName: '$user.firstName',
          lastName: '$user.lastName',
          email: '$user.email',
          avatar: '$user.avatar',
          isOnline: '$user.isOnline',
          lastSeen: '$user.lastSeen'
        }
      },
      {
        $sort: { isOnline: -1, firstName: 1 }
      },
      {
        $skip: (parseInt(page) - 1) * parseInt(limit)
      },
      {
        $limit: parseInt(limit)
      }
    ]);

    res.json({
      success: true,
      data: { users: mutualFollows },
      message: 'Messageable users retrieved successfully'
    });
  } catch (error) {
    console.error('Get messageable users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get messageable users'
    });
  }
});

// Helper function to check if users can message each other
async function canUsersMessage(user1Id, user2Id) {
  try {
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

module.exports = router;