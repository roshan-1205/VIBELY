const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  },
  attachments: [{
    url: String,
    type: String,
    name: String,
    size: Number
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    deletedAt: {
      type: Date,
      default: Date.now
    }
  }],
  editedAt: {
    type: Date
  },
  originalContent: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better performance
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, isRead: 1 });
messageSchema.index({ createdAt: -1 });

// Virtual for conversation participants
messageSchema.virtual('participants').get(function() {
  return [this.sender, this.recipient];
});

// Method to mark message as read
messageSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Method to soft delete message
messageSchema.methods.softDelete = function(userId) {
  if (!this.deletedBy.some(del => del.user.toString() === userId.toString())) {
    this.deletedBy.push({ user: userId });
  }
  
  // If both participants deleted, mark as deleted
  if (this.deletedBy.length >= 2) {
    this.isDeleted = true;
  }
  
  return this.save();
};

// Static method to get conversation between two users
messageSchema.statics.getConversation = function(user1Id, user2Id, page = 1, limit = 50) {
  return this.find({
    $or: [
      { sender: user1Id, recipient: user2Id },
      { sender: user2Id, recipient: user1Id }
    ],
    isDeleted: false,
    deletedBy: { $not: { $elemMatch: { user: user1Id } } }
  })
  .populate('sender', 'firstName lastName avatar isOnline lastSeen')
  .populate('recipient', 'firstName lastName avatar isOnline lastSeen')
  .sort({ createdAt: -1 })
  .limit(limit * page)
  .skip((page - 1) * limit);
};

// Static method to get user's conversations
messageSchema.statics.getUserConversations = function(userId, page = 1, limit = 20) {
  const ObjectId = require('mongoose').Types.ObjectId;
  
  return this.aggregate([
    {
      $match: {
        $or: [
          { sender: new ObjectId(userId) },
          { recipient: new ObjectId(userId) }
        ],
        isDeleted: false,
        deletedBy: { $not: { $elemMatch: { user: new ObjectId(userId) } } }
      }
    },
    {
      $addFields: {
        otherUser: {
          $cond: {
            if: { $eq: ['$sender', new ObjectId(userId)] },
            then: '$recipient',
            else: '$sender'
          }
        }
      }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $group: {
        _id: '$otherUser',
        lastMessage: { $first: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$recipient', new ObjectId(userId)] },
                  { $eq: ['$isRead', false] }
                ]
              },
              1,
              0
            ]
          }
        }
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
      $project: {
        user: {
          _id: '$user._id',
          firstName: '$user.firstName',
          lastName: '$user.lastName',
          avatar: '$user.avatar',
          isOnline: '$user.isOnline',
          lastSeen: '$user.lastSeen'
        },
        lastMessage: '$lastMessage',
        unreadCount: '$unreadCount'
      }
    },
    {
      $sort: { 'lastMessage.createdAt': -1 }
    },
    {
      $skip: (page - 1) * limit
    },
    {
      $limit: limit
    }
  ]);
};

module.exports = mongoose.model('Message', messageSchema);