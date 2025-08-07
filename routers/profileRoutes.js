const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');

// router.get('/api/:id', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('-password');
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const posts = await Post.find({ user: req.params.id }).sort({ createdAt: -1 });

//     res.json({ user, posts });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

router.get('/api/:id', async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const posts = await Post.find({ author: userId });

  res.json({
    user,
    posts,
  });
});


module.exports = router;
