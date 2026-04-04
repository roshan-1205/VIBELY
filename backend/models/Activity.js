const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'post_created',
      'post_liked',
      'post_commented',
      'user_followed',
      'user_joined',
      'profile_updated'
    ]
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  targetPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ targetUser: 1, createdAt: -1 });
activitySchema.index({ type: 1, createdAt: -1 });
activitySchema.index({ createdAt: -1 });

// Static method to create activity
activitySchema.statics.createActivity = async function(data) {
  try {
    const activity = new this(data);
    await activity.save();
    return activity;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
};

// Static method to get user's activities
activitySchema.statics.getUserActivities = async function(userId, limit = 20, skip = 0) {
  return await this.find({
    user: userId,
    isPublic: true
  })
  .populate('user', 'firstName lastName email avatar')
  .populate('targetUser', 'firstName lastName email avatar')
  .populate('targetPost', 'content images createdAt')
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(skip);
};

// Static method to get feed activities (activities from followed users)
activitySchema.statics.getFeedActivities = async function(userIds, limit = 20, skip = 0) {
  return await this.find({
    user: { $in: userIds },
    isPublic: true
  })
  .populate('user', 'firstName lastName email avatar')
  .populate('targetUser', 'firstName lastName email avatar')
  .populate('targetPost', 'content images createdAt')
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(skip);
};

// Instance method to generate activity message
activitySchema.methods.generateMessage = function() {
  const user = this.user;
  const targetUser = this.targetUser;
  const userName = user ? `${user.firstName} ${user.lastName}` : 'Someone';
  const targetUserName = targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : 'someone';

  switch (this.type) {
    case 'post_created':
      return `${userName} created a new post`;
    case 'post_liked':
      return `${userName} liked a post`;
    case 'post_commented':
      return `${userName} commented on a post`;
    case 'user_followed':
      return `${userName} started following ${targetUserName}`;
    case 'user_joined':
      return `${userName} joined Vibely`;
    case 'profile_updated':
      return `${userName} updated their profile`;
    default:
      return `${userName} performed an action`;
  }
};

// Ensure virtuals are included in JSON
activitySchema.set('toJSON', { virtuals: true });
activitySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Activity', activitySchema);