// routers/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../Controllers/AuthController');
const authMiddleware = require('../Middleware/authMiddleware');
const { body, validationResult } = require('express-validator');
const User = require('../models/User'); 


// Validation middleware
const validate = (validations) => [
  ...validations,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Register route
router.post(
  '/register',
  validate([
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ]),
  register
);

// Login route
router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ]),
  login
);

// Protected route: get profile
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: 'Profile fetched successfully', user: req.user });
});

// Protected route: update profile
router.put('/profile', authMiddleware, async (req, res) => {
  const { name, bio } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.bio = bio || user.bio;

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
