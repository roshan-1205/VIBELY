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
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
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
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
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
    .normalizeEmail()
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
  handleValidationErrors
};