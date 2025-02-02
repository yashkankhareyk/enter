const express = require('express');
const auth = require('./middleware/auth');
const upload = require('./uploads/multer-config');
const User = require('./models/User');
const errorHandler = require('./utils/errorHandler');
const connectDB = require('./config/database');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/reviewRoute');
const listingRoutes = require('./routes/listings');

const app = express();

// Connect to MongoDB
connectDB();

// Basic CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Specific configuration for static files/images with more permissive CORS
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
}, express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const reviewsDir = path.join(uploadsDir, 'reviews');
const listingsDir = path.join(uploadsDir, 'listings');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(reviewsDir)) {
    fs.mkdirSync(reviewsDir);
}
if (!fs.existsSync(listingsDir)) {
    fs.mkdirSync(listingsDir);
}

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Add error handling for static files
app.use((err, req, res, next) => {
  if (err.code === 'ENOENT') {
    res.status(404).json({ message: 'File not found' });
  } else {
    next(err);
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/reviews', reviewRoutes);

// Protected routes
app.get('/profile', auth, (req, res) => {
  res.render('profile', { user: req.user });
});

app.post('/profile', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ message: 'No profile picture uploaded' });
    }
    const imageUrl = req.file.path;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profile: imageUrl },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Profile picture updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
