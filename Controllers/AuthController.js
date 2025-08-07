const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Secret key for JWT (should be stored in .env file in production)
const JWT_SECRET = 'your_jwt_secret_key';

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;

    // new 
if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const  newUser  = new User({
      name,
      email,
      password: hashedPassword,
      bio
    });

   await newUser.save();

// Create a JWT token
const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

res.status(201).json({
  message: 'User registered successfully',
  user: {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
  },
  token,
});


  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Use correct JWT_SECRET variable
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    // Send success response with user data and token
    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};
