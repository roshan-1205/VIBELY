const express = require('express');
const User = require('../models/User');
const Follow = require('../models/Follow');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/social/follow/:userId
// @desc    Follow/unfollow a user
// @access  Private
router.post('/follow/:userId', auth, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const existingFollow = await Follow.findOne({
      follower: currentUserId,
      following: targetUserId
    });

    if (existingFollow) {
      // Unfollow
      existingFollow.isActive = !existingFollow.isActive;
      await existingFollow.save();
      
      const action = existingFollow.isActive ? 'followed' : 'unfollowed';
      
      if (existingFollow.isActive) {
        // Create activity and notification for follow
        await Activity.createActivity({
          user: currentUserId,
          type: 'user_followed',
          targetUser: targetUserId
        });

        const notification = await Notification.createNotification({
          recipient: targetUserId,
          sender: currentUserId,
          type: 'follow',
          message: `${req.user.firstName} ${req.user.lastName} started following you`
        });

        // Send real-time notification
        if (notification && req.socketService) {
          req.socketService.sendNotification(targetUserId, notification);
        }
      }

      // Get updated counts
      const followerCount = await Follow.getFollowerCount(targetUserId);
      const followingCount = await Follow.getFollowingCount(currentUserId);

      // Broadcast real-time stats updates
      if (req.socketService) {
        req.socketService.broadcastFollowUpdate(
          currentUserId.toString(),
          targetUserId,
          existingFollow.isActive,
          followerCount,
          followingCount
        );
      }

      res.json({
        success: true,
        data: { 
          isFollowing: existingFollow.isActive,
          followerCount,
          followingCount
        },
        message: `User ${action} successfully`
      });
    } else {
      // Create new follow
      const follow = new Follow({
        follower: currentUserId,
        following: targetUserId
      });
      await follow.save();

      // Create activity and notification
      await Activity.createActivity({
        user: currentUserId,
        type: 'user_followed',
        targetUser: targetUserId
      });

      const notification = await Notification.createNotification({
        recipient: targetUserId,
        sender: currentUserId,
        type: 'follow',
        message: `${req.user.firstName} ${req.user.lastName} started following you`
      });

      // Send real-time notification
      if (notification && req.socketService) {
        req.socketService.sendNotification(targetUserId, notification);
      }

      // Get updated counts
      const followerCount = await Follow.getFollowerCount(targetUserId);
      const followingCount = await Follow.getFollowingCount(currentUserId);

      // Broadcast real-time stats updates
      if (req.socketService) {
        req.socketService.broadcastFollowUpdate(
          currentUserId.toString(),
          targetUserId,
          true,
          followerCount,
          followingCount
        );
      }

      res.json({
        success: true,
        data: { 
          isFollowing: true,
          followerCount,
          followingCount
        },
        message: 'User followed successfully'
      });
    }
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error following user'
    });
  }
});

// @route   GET /api/social/followers/:userId
// @desc    Get user's followers
// @access  Private
router.get('/followers/:userId', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const followers = await Follow.getFollowers(req.params.userId, parseInt(limit), skip);
    const totalCount = await Follow.getFollowerCount(req.params.userId);

    res.json({
      success: true,
      data: { 
        followers: followers.map(f => f.follower),
        totalCount
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: followers.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting followers'
    });
  }
});

// @route   GET /api/social/following/:userId
// @desc    Get users that this user follows
// @access  Private
router.get('/following/:userId', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const following = await Follow.getFollowing(req.params.userId, parseInt(limit), skip);
    const totalCount = await Follow.getFollowingCount(req.params.userId);

    res.json({
      success: true,
      data: { 
        following: following.map(f => f.following),
        totalCount
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: following.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting following'
    });
  }
});

// @route   GET /api/social/stats/:userId
// @desc    Get user's social stats
// @access  Private
router.get('/stats/:userId', auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentUserId = req.user._id;

    const [followerCount, followingCount, isFollowing] = await Promise.all([
      Follow.getFollowerCount(userId),
      Follow.getFollowingCount(userId),
      Follow.isFollowing(currentUserId, userId)
    ]);

    res.json({
      success: true,
      data: {
        followerCount,
        followingCount,
        isFollowing: userId === currentUserId.toString() ? null : isFollowing
      }
    });
  } catch (error) {
    console.error('Get social stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting social stats'
    });
  }
});

// @route   GET /api/social/search
// @desc    Search users
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    const skip = (page - 1) * limit;
    const users = await User.searchUsers(q.trim(), parseInt(limit), skip);

    // Get follow status for each user
    const usersWithFollowStatus = await Promise.all(
      users.map(async (user) => {
        const isFollowing = await Follow.isFollowing(req.user._id, user._id);
        return {
          ...user.toObject(),
          isFollowing: user._id.toString() === req.user._id.toString() ? null : isFollowing
        };
      })
    );

    res.json({
      success: true,
      data: { users: usersWithFollowStatus },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: users.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error searching users'
    });
  }
});

// @route   GET /api/social/discover
// @desc    Discover new users to follow
// @access  Private
router.get('/discover', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Get users that current user is not following
    const following = await Follow.find({ 
      follower: req.user._id, 
      isActive: true 
    }).select('following');
    
    const followingIds = following.map(f => f.following);
    followingIds.push(req.user._id); // Exclude self

    const users = await User.find({
      _id: { $nin: followingIds },
      isActive: true
    })
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(skip);

    res.json({
      success: true,
      data: { users },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: users.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Discover users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error discovering users'
    });
  }
});

// @route   GET /api/social/online
// @desc    Get online users
// @access  Private
router.get('/online', auth, async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const users = await User.getOnlineUsers(parseInt(limit));

    res.json({
      success: true,
      data: { users }
    });
  } catch (error) {
    console.error('Get online users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting online users'
    });
  }
});

module.exports = router;