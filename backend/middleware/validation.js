const { body, validationResult } = require('express-validator');

// Validation rules for user registration
const validateRegister = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// Validation rules for user login
const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 1 })
    .withMessage('Password cannot be empty')
];

// Validation rules for password update
const validatePasswordUpdate = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

// Validation rules for profile update
const validateProfileUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('bio')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Bio cannot exceed 200 characters'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),

  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid website URL')
    .isLength({ max: 200 })
    .withMessage('Website URL cannot exceed 200 characters')
];

// Validation rules for posts
const validatePost = [
  body('content')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Post content cannot exceed 500 characters'),

  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),

  body('videos')
    .optional()
    .isArray()
    .withMessage('Videos must be an array'),

  body('postType')
    .optional()
    .isIn(['text', 'image', 'video', 'quote'])
    .withMessage('Post type must be text, image, video, or quote'),

  body('visibility')
    .optional()
    .isIn(['public', 'followers', 'private'])
    .withMessage('Visibility must be public, followers, or private'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('mentions')
    .optional()
    .isArray()
    .withMessage('Mentions must be an array'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),

  body('quoteAuthor')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Quote author cannot exceed 100 characters')
];

// Validation rules for comments
const validateComment = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Comment must be between 1 and 200 characters')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg
    }));

    // Create a more user-friendly error message
    const firstError = errorMessages[0];
    let mainMessage = 'Validation failed';
    
    // Provide specific messages based on the type of error
    if (firstError.field === 'email') {
      if (firstError.message.includes('required')) {
        mainMessage = 'Email address is required';
      } else if (firstError.message.includes('valid')) {
        mainMessage = 'Please enter a valid email address';
      }
    } else if (firstError.field === 'password') {
      if (firstError.message.includes('required') || firstError.message.includes('empty')) {
        mainMessage = 'Password is required';
      } else if (firstError.message.includes('6 characters')) {
        mainMessage = 'Password must be at least 6 characters long';
      } else if (firstError.message.includes('uppercase')) {
        mainMessage = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      }
    } else if (firstError.field === 'firstName') {
      if (firstError.message.includes('required')) {
        mainMessage = 'First name is required';
      } else if (firstError.message.includes('letters')) {
        mainMessage = 'First name can only contain letters and spaces';
      } else if (firstError.message.includes('between')) {
        mainMessage = 'First name must be between 2 and 50 characters';
      }
    } else if (firstError.field === 'lastName') {
      if (firstError.message.includes('required')) {
        mainMessage = 'Last name is required';
      } else if (firstError.message.includes('letters')) {
        mainMessage = 'Last name can only contain letters and spaces';
      } else if (firstError.message.includes('between')) {
        mainMessage = 'Last name must be between 2 and 50 characters';
      }
    }

    return res.status(400).json({
      success: false,
      message: mainMessage,
      errors: errorMessages
    });
  }
  
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validatePasswordUpdate,
  validateProfileUpdate,
  validatePost,
  validateComment,
  handleValidationErrors
};