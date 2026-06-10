const express = require('express');
const router = express.Router();
const { getPosts, createPost, addReply, votePost, voteReply, deletePost, deleteReply } = require('../controllers/forumController');
const { protect, admin } = require('../middleware/authMiddleware');

// Base routes
router.route('/').get(protect, getPosts).post(protect, createPost);

// Specific sub-routes BEFORE generic /:id to avoid conflicts
router.route('/:id/replies/:replyId/vote').put(protect, voteReply);
router.route('/:id/replies/:replyId').delete(protect, admin, deleteReply);
router.route('/:id/replies').post(protect, addReply);
router.route('/:id/vote').put(protect, votePost);

// Generic /:id (must come LAST)
router.route('/:id').delete(protect, admin, deletePost);

module.exports = router;
