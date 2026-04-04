const express = require('express');
const Post = require('../models/Post');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const Follow = require('../models/Follow');
const auth = require('../middleware/auth');
const { 
  validatePost, 
  validateComment,
  handleValidationErrors 
} = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/posts
// @desc    Get posts feed (from followed users + own posts)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, postType, visibility } = req.query;
    const skip = (page - 1) * limit;

    // Get users that current user follows
    const following = await Follow.find({ 
      follower: req.user._id, 
      isActive: true 
    }).select('following');
    
    const followingIds = following.map(f => f.following);
    followingIds.push(req.user._id); // Include own posts

    // Build query
    const query = { 
      author: { $in: followingIds },
      isActive: true,
      isPublished: true,
      $or: [
        { visibility: 'public' },
        { visibility: 'followers', author: { $in: followingIds } },
        { visibility: 'private', author: req.user._id }
      ]
    };

    // Add filters
    if (postType && postType !== 'all') {
      query.postType = postType;
    }

    if (visibility && visibility !== 'all') {
      query.visibility = visibility;
    }

    const posts = await Post.find(query)
      .populate('author', 'firstName lastName email avatar')
      .populate('likes.user', 'firstName lastName')
      .populate('comments.user', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    res.json({
      success: true,
      data: { posts },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: posts.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting posts'
    });
  }
});

// @route   GET /api/posts/user/:userId
// @desc    Get posts by specific user
// @access  Private
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ 
      author: req.params.userId,
      isActive: true 
    })
    .populate('author', 'firstName lastName email avatar')
    .populate('likes.user', 'firstName lastName')
    .populate('comments.user', 'firstName lastName avatar')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(skip);

    res.json({
      success: true,
      data: { posts },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: posts.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting user posts'
    });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', auth, validatePost, handleValidationErrors, async (req, res) => {
  try {
    const { 
      content, 
      postType = 'text',
      quoteAuthor,
      images = [], 
      videos = [],
      location,
      tags = [],
      mentions = [],
      visibility = 'public',
      scheduledDate
    } = req.body;

    // Check if post should be scheduled
    const isScheduled = scheduledDate && new Date(scheduledDate) > new Date();
    
    const post = new Post({
      author: req.user._id,
      content,
      postType,
      quoteAuthor: postType === 'quote' ? quoteAuthor : undefined,
      images,
      videos,
      location,
      tags: tags.filter(tag => tag && tag.trim()),
      mentions: mentions.filter(mention => mention && mention.trim()),
      visibility,
      scheduledDate: isScheduled ? new Date(scheduledDate) : undefined,
      isScheduled,
      isPublished: !isScheduled
    });

    await post.save();
    await post.populate('author', 'firstName lastName email avatar');

    // Only create activity and broadcast if not scheduled
    if (!isScheduled) {
      // Create activity
      await Activity.createActivity({
        user: req.user._id,
        type: 'post_created',
        targetPost: post._id
      });

      // Get updated post count
      const postCount = await Post.countDocuments({ author: req.user._id, isActive: true, isPublished: true });

      // Broadcast new post to all connected users
      if (req.socketService) {
        req.socketService.broadcastNewPost(post);
        // Broadcast post count update to the author
        req.socketService.broadcastPostStatsUpdate(req.user._id.toString(), postCount);
      }
    }

    res.status(201).json({
      success: true,
      data: { post },
      message: isScheduled ? 'Post scheduled successfully' : 'Post created successfully'
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating post'
    });
  }
});

// @route   POST /api/posts/:postId/like
// @desc    Like/unlike a post
// @access  Private
router.post('/:postId/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const isLiked = post.isLikedBy(req.user._id);
    
    if (isLiked) {
      await post.removeLike(req.user._id);
    } else {
      await post.addLike(req.user._id);
      
      // Create activity and notification
      await Activity.createActivity({
        user: req.user._id,
        type: 'post_liked',
        targetPost: post._id,
        targetUser: post.author
      });

      const notification = await Notification.createNotification({
        recipient: post.author,
        sender: req.user._id,
        type: 'like',
        message: `${req.user.firstName} ${req.user.lastName} liked your post`,
        targetPost: post._id
      });

      // Send real-time notification
      if (notification && req.socketService) {
        req.socketService.sendNotification(post.author.toString(), notification);
      }

      // Broadcast post update for real-time like count
      if (req.socketService) {
        req.socketService.broadcastPostUpdate(post._id, {
          likeCount: post.likeCount,
          likes: post.likes
        });
      }
    }

    await post.populate('author', 'firstName lastName email avatar');
    await post.populate('likes.user', 'firstName lastName');

    res.json({
      success: true,
      data: { 
        post,
        isLiked: !isLiked,
        likeCount: post.likeCount
      },
      message: isLiked ? 'Post unliked' : 'Post liked'
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error liking post'
    });
  }
});

// @route   POST /api/posts/:postId/comment
// @desc    Add comment to post
// @access  Private
router.post('/:postId/comment', auth, validateComment, handleValidationErrors, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    await post.addComment(req.user._id, content);
    await post.populate('comments.user', 'firstName lastName avatar');

    // Create activity and notification
    await Activity.createActivity({
      user: req.user._id,
      type: 'post_commented',
      targetPost: post._id,
      targetUser: post.author
    });

    const notification = await Notification.createNotification({
      recipient: post.author,
      sender: req.user._id,
      type: 'comment',
      message: `${req.user.firstName} ${req.user.lastName} commented on your post`,
      targetPost: post._id
    });

    // Send real-time notification
    if (notification && req.socketService) {
      req.socketService.sendNotification(post.author.toString(), notification);
    }

    // Broadcast post update for real-time comment count
    if (req.socketService) {
      req.socketService.broadcastPostUpdate(post._id, {
        commentCount: post.commentCount,
        comments: post.comments
      });
    }

    res.json({
      success: true,
      data: { 
        post,
        commentCount: post.commentCount
      },
      message: 'Comment added successfully'
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding comment'
    });
  }
});

// @route   POST /api/posts/:postId/share
// @desc    Share a post
// @access  Private
router.post('/:postId/share', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const isShared = post.isSharedBy(req.user._id);
    
    if (!isShared) {
      await post.addShare(req.user._id);
      
      // Create activity and notification
      await Activity.createActivity({
        user: req.user._id,
        type: 'post_shared',
        targetPost: post._id,
        targetUser: post.author
      });

      const notification = await Notification.createNotification({
        recipient: post.author,
        sender: req.user._id,
        type: 'share',
        message: `${req.user.firstName} ${req.user.lastName} shared your post`,
        targetPost: post._id
      });

      // Send real-time notification
      if (notification && req.socketService) {
        req.socketService.sendNotification(post.author.toString(), notification);
      }

      // Broadcast post update for real-time share count
      if (req.socketService) {
        req.socketService.broadcastPostUpdate(post._id, {
          shareCount: post.shareCount,
          shares: post.shares
        });
      }
    }

    await post.populate('author', 'firstName lastName email avatar');
    await post.populate('shares.user', 'firstName lastName');

    res.json({
      success: true,
      data: { 
        post,
        isShared: !isShared,
        shareCount: post.shareCount
      },
      message: isShared ? 'Post unshared' : 'Post shared'
    });
  } catch (error) {
    console.error('Share post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error sharing post'
    });
  }
});

// @route   DELETE /api/posts/:postId
// @desc    Delete a post
// @access  Private
router.delete('/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user owns the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    post.isActive = false;
    await post.save();

    // Get updated post count
    const postCount = await Post.countDocuments({ author: req.user._id, isActive: true });

    // Broadcast post count update to the author
    if (req.socketService) {
      req.socketService.broadcastPostStatsUpdate(req.user._id.toString(), postCount);
    }

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting post'
    });
  }
});

module.exports = router;