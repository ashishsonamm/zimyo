const { body, query, param, validationResult } = require('express-validator');
const path = require('path');

const validateArtworkCreation = [
  body('title').trim().isLength({ min: 1, max: 255 }).escape()
    .withMessage('Title must be between 1 and 255 characters'),
  body('description').trim().isLength({ min: 1, max: 1000 }).escape()
    .withMessage('Description must be between 1 and 1000 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('image').custom((value, { req }) => {
    if (!req.file) {
      throw new Error('Image is required');
    }
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error('Only .jpg, .jpeg, .png, and .gif files are allowed');
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      throw new Error('File size should not exceed 5MB');
    }
    return true;
  }),
  handleValidationErrors
];

const validateArtworkSearch = [
  query('query').optional().trim().escape(),
  query('minPrice').optional().isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  query('artist').optional().trim().escape(),
  query('status').optional().isIn(['available', 'sold'])
    .withMessage('Status must be either "available" or "sold"'),
  handleValidationErrors
];

const validateArtworkId = [
  param('id').isInt().withMessage('Invalid artwork ID'),
  handleValidationErrors
];

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = {
  validateArtworkCreation,
  validateArtworkSearch,
  validateArtworkId
};