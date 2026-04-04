const express = require('express');
const Activity = require('../models/Activity');
const Follow = require('../models/Follow');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/activities/feed
// @desc    Get activity feed (activities from followed users)
// @access  Private
router.get('/feed', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Get users that current user follows
    const following = await Follow.find({ 
      follower: req.user._id, 
      isActive: true 
    }).select('following');
    
    const followingIds = following.map(f => f.following);
    followingIds.push(req.user._id); // Include own activities

    const activities = await Activity.getFeedActivities(
      followingIds, 
      parseInt(limit), 
      skip
    );

    // Add generated messages to activities
    const activitiesWithMessages = activities.map(activity => ({
      ...activity.toObject(),
      message: activity.generateMessage()
    }));

    res.json({
      success: true,
      data: { activities: activitiesWithMessages },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: activities.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get activity feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting activity feed'
    });
  }
});

// @route   GET /api/activities/user/:userId
// @desc    Get activities for a specific user
// @access  Private
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const activities = await Activity.getUserActivities(
      req.params.userId, 
      parseInt(limit), 
      skip
    );

    // Add generated messages to activities
    const activitiesWithMessages = activities.map(activity => ({
      ...activity.toObject(),
      message: activity.generateMessage()
    }));

    res.json({
      success: true,
      data: { activities: activitiesWithMessages },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: activities.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get user activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting user activities'
    });
  }
});

module.exports = router;