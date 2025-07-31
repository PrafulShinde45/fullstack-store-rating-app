const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateUserRegistration = [
  body('name')
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),
  body('email')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .isLength({ min: 8, max: 16 })
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage('Password must be 8-16 characters with at least one uppercase letter and one special character'),
  body('address')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  handleValidationErrors,
];

const validateStoreCreation = [
  body('name')
    .isLength({ min: 2, max: 60 })
    .withMessage('Store name must be between 2 and 60 characters'),
  body('email')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('address')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  body('ownerName')
    .isLength({ min: 20, max: 60 })
    .withMessage('Owner name must be between 20 and 60 characters'),
  body('ownerEmail')
    .isEmail()
    .withMessage('Must be a valid owner email'),
  body('ownerPassword')
    .isLength({ min: 8, max: 16 })
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage('Owner password must be 8-16 characters with at least one uppercase letter and one special character'),
  body('ownerAddress')
    .isLength({ max: 400 })
    .withMessage('Owner address must not exceed 400 characters'),
  handleValidationErrors,
];

const validateRating = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('storeId')
    .isInt()
    .withMessage('Store ID must be a valid integer'),
  handleValidationErrors,
];

const validatePasswordUpdate = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8, max: 16 })
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage('New password must be 8-16 characters with at least one uppercase letter and one special character'),
  handleValidationErrors,
];

module.exports = {
  validateUserRegistration,
  validateStoreCreation,
  validateRating,
  validatePasswordUpdate,
  handleValidationErrors,
}; 