// routes/postRoutes.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const User = require('../models/User');
const authMiddleware = require('../Middleware/authMiddleware');


router.use(express.json());


router.post('/', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;

    // 1. Validate post content
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Post content is required' });
    }

    // 2. Create a new Post document
    const newPost = new Post({
      content: content.trim(),
      author: req.user._id,
    });

    // 3. Save to DB
    const savedPost = await newPost.save();

    res.status(201).json({
      message: 'Post created successfully',
      post: savedPost,
    });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ message: 'Server error while creating post' });
  }
});


router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email') // include author's name and email
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ message: 'Server error while fetching posts' });
  }
});
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;

    // Check if post exists and is owned by the user
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this post' });
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ message: 'Server error while deleting post' });
  }
});
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to update this post' });
    }

    post.content = content || post.content;
    const updatedPost = await post.save();

    res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ message: 'Server error while updating post' });
  }
});




module.exports = router;
