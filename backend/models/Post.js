const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    maxlength: [2000, 'Post content cannot exceed 2000 characters']
  },
  postType: {
    type: String,
    enum: ['text', 'image', 'video', 'quote'],
    default: 'text'
  },
  quoteAuthor: {
    type: String,
    maxlength: [100, 'Quote author cannot exceed 100 characters']
  },
  images: [{
    url: String,
    alt: String,
    thumbnail: String
  }],
  videos: [{
    url: String,
    thumbnail: String,
    duration: Number,
    size: Number
  }],
  location: {
    type: String,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  tags: [{
    type: String,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  mentions: [{
    type: String,
    maxlength: [50, 'Mention cannot exceed 50 characters']
  }],
  visibility: {
    type: String,
    enum: ['public', 'followers', 'private'],
    default: 'public'
  },
  scheduledDate: {
    type: Date,
    default: null
  },
  isScheduled: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  shares: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ 'likes.user': 1 });
postSchema.index({ tags: 1 });
postSchema.index({ mentions: 1 });
postSchema.index({ visibility: 1 });
postSchema.index({ isPublished: 1, scheduledDate: 1 });
postSchema.index({ postType: 1 });

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Virtual for share count
postSchema.virtual('shareCount').get(function() {
  return this.shares.length;
});

// Virtual for engagement count (likes + comments + shares)
postSchema.virtual('engagementCount').get(function() {
  return this.likes.length + this.comments.length + this.shares.length;
});

// Instance method to check if user liked the post
postSchema.methods.isLikedBy = function(userId) {
  return this.likes.some(like => like.user.toString() === userId.toString());
};

// Instance method to add like
postSchema.methods.addLike = function(userId) {
  if (!this.isLikedBy(userId)) {
    this.likes.push({ user: userId });
  }
  return this.save();
};

// Instance method to remove like
postSchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(like => like.user.toString() !== userId.toString());
  return this.save();
};

// Instance method to add comment
postSchema.methods.addComment = function(userId, content) {
  this.comments.push({ user: userId, content });
  return this.save();
};

// Instance method to add share
postSchema.methods.addShare = function(userId) {
  if (!this.isSharedBy(userId)) {
    this.shares.push({ user: userId });
  }
  return this.save();
};

// Instance method to check if user shared the post
postSchema.methods.isSharedBy = function(userId) {
  return this.shares.some(share => share.user.toString() === userId.toString());
};

// Instance method to increment views
postSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Static method to get posts by visibility
postSchema.statics.getPostsByVisibility = function(userId, visibility = 'public') {
  const query = { isActive: true, isPublished: true };
  
  if (visibility === 'public') {
    query.visibility = 'public';
  } else if (visibility === 'followers') {
    query.$or = [
      { visibility: 'public' },
      { visibility: 'followers', author: userId }
    ];
  } else if (visibility === 'private') {
    query.author = userId;
  }
  
  return this.find(query)
    .populate('author', 'firstName lastName email avatar')
    .populate('likes.user', 'firstName lastName')
    .populate('comments.user', 'firstName lastName avatar')
    .sort({ createdAt: -1 });
};

// Static method to get scheduled posts
postSchema.statics.getScheduledPosts = function() {
  return this.find({
    isScheduled: true,
    isPublished: false,
    scheduledDate: { $lte: new Date() }
  });
};

// Ensure virtuals are included in JSON
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Post', postSchema);