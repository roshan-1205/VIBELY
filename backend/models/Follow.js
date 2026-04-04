const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate follows and improve query performance
followSchema.index({ follower: 1, following: 1 }, { unique: true });
followSchema.index({ follower: 1 });
followSchema.index({ following: 1 });

// Prevent self-following
followSchema.pre('save', function(next) {
  if (this.follower.toString() === this.following.toString()) {
    const error = new Error('Users cannot follow themselves');
    return next(error);
  }
  next();
});

// Static method to check if user A follows user B
followSchema.statics.isFollowing = async function(followerId, followingId) {
  const follow = await this.findOne({
    follower: followerId,
    following: followingId,
    isActive: true
  });
  return !!follow;
};

// Static method to get follower count
followSchema.statics.getFollowerCount = async function(userId) {
  return await this.countDocuments({
    following: userId,
    isActive: true
  });
};

// Static method to get following count
followSchema.statics.getFollowingCount = async function(userId) {
  return await this.countDocuments({
    follower: userId,
    isActive: true
  });
};

// Static method to get followers list
followSchema.statics.getFollowers = async function(userId, limit = 20, skip = 0) {
  return await this.find({
    following: userId,
    isActive: true
  })
  .populate('follower', 'firstName lastName email avatar')
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(skip);
};

// Static method to get following list
followSchema.statics.getFollowing = async function(userId, limit = 20, skip = 0) {
  return await this.find({
    follower: userId,
    isActive: true
  })
  .populate('following', 'firstName lastName email avatar')
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(skip);
};

module.exports = mongoose.model('Follow', followSchema);