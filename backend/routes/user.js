const express = require('express');
const User = require('../models/User');
const Follow = require('../models/Follow');
const Post = require('../models/Post');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');
const { 
  validateProfileUpdate, 
  validatePasswordUpdate, 
  handleValidationErrors 
} = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    // Get user with social stats
    const [followerCount, followingCount, postCount] = await Promise.all([
      Follow.getFollowerCount(req.user._id),
      Follow.getFollowingCount(req.user._id),
      Post.countDocuments({ author: req.user._id, isActive: true })
    ]);

    const userProfile = {
      ...req.user.getPublicProfile(),
      stats: {
        followers: followerCount,
        following: followingCount,
        posts: postCount
      }
    };

    res.json({
      success: true,
      data: { user: userProfile }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting profile'
    });
  }
});

// @route   GET /api/user/profile/:userId
// @desc    Get another user's profile
// @access  Private
router.get('/profile/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user stats and follow status
    const [followerCount, followingCount, postCount, isFollowing] = await Promise.all([
      Follow.getFollowerCount(user._id),
      Follow.getFollowingCount(user._id),
      Post.countDocuments({ author: user._id, isActive: true }),
      Follow.isFollowing(req.user._id, user._id)
    ]);

    const userProfile = {
      ...user.toObject(),
      stats: {
        followers: followerCount,
        following: followingCount,
        posts: postCount
      },
      isFollowing: user._id.toString() === req.user._id.toString() ? null : isFollowing
    };

    res.json({
      success: true,
      data: { user: userProfile }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting user profile'
    });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, validateProfileUpdate, handleValidationErrors, async (req, res) => {
  try {
    const { firstName, lastName, email, bio, location, website } = req.body;
    const userId = req.user._id;

    // Check if email is being changed and if it's already taken
    if (email && email !== req.user.email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser._id.toString() !== userId.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken by another user'
        });
      }
    }

    // Update user
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (website !== undefined) updateData.website = website;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    // Create activity for profile update
    await Activity.createActivity({
      user: userId,
      type: 'profile_updated'
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email is already taken'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

// @route   PUT /api/user/password
// @desc    Update user password
// @access  Private
router.put('/password', auth, validatePasswordUpdate, handleValidationErrors, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Get user with password
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating password'
    });
  }
});

// @route   DELETE /api/user/account
// @desc    Deactivate user account
// @access  Private
router.delete('/account', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Deactivate account instead of deleting
    await User.findByIdAndUpdate(userId, { isActive: false });

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deactivating account'
    });
  }
});

// @route   GET /api/user/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const user = req.user;
    
    // Calculate days since registration
    const daysSinceRegistration = Math.floor(
      (new Date() - user.createdAt) / (1000 * 60 * 60 * 24)
    );

    const stats = {
      memberSince: user.createdAt,
      daysSinceRegistration,
      lastLogin: user.lastLogin,
      isEmailVerified: user.isEmailVerified,
      accountStatus: user.isActive ? 'Active' : 'Inactive'
    };

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting user statistics'
    });
  }
});

module.exports = router;