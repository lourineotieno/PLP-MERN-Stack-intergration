const { body, param } = require('express-validator');

exports.createPost = [
  body('title').isLength({ min: 3 }).withMessage('Title too short'),
  body('body').isLength({ min: 10 }).withMessage('Body too short'),
  body('categories').optional().isArray(),
];

exports.updatePost = [
  body('title').optional().isLength({ min: 3 }),
  body('body').optional().isLength({ min: 10 })
];
