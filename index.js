// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const authRoutes = require('./routers/authRoutes');
// const postRoutes = require('./routers/postRoutes');
// const cors = require('cors');
// const profileRoutes = require('./routers/profileRoutes');

// dotenv.config();
// const app = express();

// const allowedOrigins = ['http://localhost:5000'];
// // , 'http://localhost:5173


// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }
//     callback(new Error('Not allowed by CORS'));
//   },
//   credentials: true,
// }));



// app.use(express.json()); // To parse JSON bodies

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));


// // Use the auth routes
// app.use('/api', authRoutes);
// app.use('/api/post', postRoutes);
// app.use('/profile/', profileRoutes);


// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routers/authRoutes');
const postRoutes = require('./routers/postRoutes');
const cors = require('cors');
const profileRoutes = require('./routers/profileRoutes');

dotenv.config();
const app = express();

// Allow all origins (no frontend port restriction)
app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', authRoutes);
app.use('/api/post', postRoutes);
app.use('/profile', profileRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

