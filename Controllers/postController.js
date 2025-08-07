const Post = require('../models/Post');
const User = require('../models/User');
// const JWT_SECRET = 'your_jwt_secret_key';

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;

    // Check for empty content
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Post content cannot be empty' });
    }

    // req.user is set by authMiddleware
    const newPost = new Post({
      content,
      author: req.user._id
    });

    await newPost.save();

    res.status(201).json({
      message: 'Post created successfully',
      post: newPost
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all posts (latest first)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // latest first
      .populate('author', 'name email'); // populate author details

    res.status(200).json({
      message: 'All posts fetched successfully',
      posts
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
