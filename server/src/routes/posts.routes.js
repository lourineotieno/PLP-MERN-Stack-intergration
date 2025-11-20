const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const auth = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { createPost, updatePost } = require('../utils/validation');

const { validationResult } = require('express-validator');

function runValidation(req, res, next) {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}

router.get('/', postController.list); // pagination, search via query
router.get('/:id', postController.get);
router.post('/', auth, upload.single('featuredImage'), createPost, runValidation, postController.create);
router.put('/:id', auth, upload.single('featuredImage'), updatePost, runValidation, postController.update);
router.delete('/:id', auth, postController.remove);

// comment endpoints
router.post('/:id/comments', auth, postController.addComment);
router.delete('/:id/comments/:commentId', auth, postController.deleteComment);

module.exports = router;
