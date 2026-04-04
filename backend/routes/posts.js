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
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Get users that current user follows
    const following = await Follow.find({ 
      follower: req.user._id, 
      isActive: true 
    }).select('following');
    
    const followingIds = following.map(f => f.following);
    followingIds.push(req.user._id); // Include own posts

    const posts = await Post.find({ 
      author: { $in: followingIds },
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
    const { content, images = [] } = req.body;

    const post = new Post({
      author: req.user._id,
      content,
      images
    });

    await post.save();
    await post.populate('author', 'firstName lastName email avatar');

    // Create activity
    await Activity.createActivity({
      user: req.user._id,
      type: 'post_created',
      targetPost: post._id
    });

    // Broadcast new post to all connected users
    if (req.socketService) {
      req.socketService.broadcastNewPost(post);
    }

    res.status(201).json({
      success: true,
      data: { post },
      message: 'Post created successfully'
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