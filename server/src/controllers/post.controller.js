const Post = require('../models/Post');
const slugify = require('slugify');

exports.list = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, q, category } = req.query;
    const skip = (page - 1) * limit;
    const filter = {};
    if (q) filter.$or = [{ title: new RegExp(q, 'i') }, { body: new RegExp(q, 'i') }];
    if (category) filter.categories = category;

    const posts = await Post.find(filter)
      .populate('author', 'name')
      .populate('categories')
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    const total = await Post.countDocuments(filter);
    res.json({ data: posts, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .populate('categories');
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { title, body, categories } = req.body;
    const slug = slugify(title, { lower: true, strict: true });
    const post = await Post.create({
      title, slug, body,
      author: req.user._id,
      categories: categories ? JSON.parse(categories) : [],
      featuredImage: req.file ? `/uploads/${req.file.filename}` : undefined
    });
    res.status(201).json(post);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.featuredImage = `/uploads/${req.file.filename}`;
    if (updates.title) updates.slug = slugify(updates.title, { lower: true, strict: true });
    const post = await Post.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

// comments
exports.addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    post.comments.push({ user: req.user._id, text: req.body.text });
    await post.save();
    res.status(201).json(post);
  } catch (err) { next(err); }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    post.comments = post.comments.filter(c => c._id.toString() !== req.params.commentId);
    await post.save();
    res.json(post);
  } catch (err) { next(err); }
};
