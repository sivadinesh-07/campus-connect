const Post = require('../models/Post');

// @desc  Get all posts
// @route GET /api/forum
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name role')
      .populate('replies.author', 'name role')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Create a post
// @route POST /api/forum
const createPost = async (req, res) => {
  try {
    const { title, body, tags } = req.body;
    const post = await Post.create({ title, body, tags, author: req.user._id });
    const populated = await post.populate('author', 'name role');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Add a reply to a post
// @route POST /api/forum/:id/replies
const addReply = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.replies.push({ body: req.body.body, author: req.user._id });
    await post.save();
    await post.populate('author', 'name role');
    await post.populate('replies.author', 'name role');
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Like or dislike a post (toggle)
// @route PUT /api/forum/:id/vote
const votePost = async (req, res) => {
  try {
    const { type } = req.body; // 'like' | 'dislike'
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id.toString();
    const likes = post.likes.map(String);
    const dislikes = post.dislikes.map(String);

    if (type === 'like') {
      post.likes = likes.includes(userId) ? post.likes.filter(id => String(id) !== userId) : [...post.likes, req.user._id];
      post.dislikes = post.dislikes.filter(id => String(id) !== userId);
    } else {
      post.dislikes = dislikes.includes(userId) ? post.dislikes.filter(id => String(id) !== userId) : [...post.dislikes, req.user._id];
      post.likes = post.likes.filter(id => String(id) !== userId);
    }

    await post.save();
    await post.populate('author', 'name role');
    await post.populate('replies.author', 'name role');
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Like or dislike a reply (toggle)
// @route PUT /api/forum/:id/replies/:replyId/vote
const voteReply = async (req, res) => {
  try {
    const { type } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const reply = post.replies.id(req.params.replyId);
    if (!reply) return res.status(404).json({ message: 'Reply not found' });

    const userId = req.user._id.toString();
    const likes = reply.likes.map(String);
    const dislikes = reply.dislikes.map(String);

    if (type === 'like') {
      reply.likes = likes.includes(userId) ? reply.likes.filter(id => String(id) !== userId) : [...reply.likes, req.user._id];
      reply.dislikes = reply.dislikes.filter(id => String(id) !== userId);
    } else {
      reply.dislikes = dislikes.includes(userId) ? reply.dislikes.filter(id => String(id) !== userId) : [...reply.dislikes, req.user._id];
      reply.likes = reply.likes.filter(id => String(id) !== userId);
    }

    await post.save();
    await post.populate('author', 'name role');
    await post.populate('replies.author', 'name role');
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Delete a post (admin only)
// @route DELETE /api/forum/:id
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Delete a reply (admin only)
// @route DELETE /api/forum/:id/replies/:replyId
const deleteReply = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.replies = post.replies.filter(r => r._id.toString() !== req.params.replyId);
    await post.save();
    await post.populate('author', 'name role');
    await post.populate('replies.author', 'name role');
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getPosts, createPost, addReply, votePost, voteReply, deletePost, deleteReply };
