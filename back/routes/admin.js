const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Listing = require('../models/Listing');
const Booking = require('../models/Booking');
const Review = require('../models/reviewModel');
const adminAuth = require('../middleware/adminAuth');

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Create token
    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Admin Verification Route
router.get('/verify', adminAuth, async (req, res) => {
  try {
    console.log('Admin verification route hit'); // Debug log
    const admin = await Admin.findById(req.admin._id)
      .select('-password -lastLogin');

    if (!admin) {
      console.log('Admin not found in database'); // Debug log
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    console.log('Admin verified successfully:', admin._id); // Debug log
    res.json({
      success: true,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
        isAdmin: true
      }
    });
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying admin'
    });
  }
});

// Get Dashboard Stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const stats = {
      totalUsers: await User.countDocuments(),
      totalListings: await Listing.countDocuments(),
      totalBookings: await Booking.countDocuments(),
      totalReviews: await Review.countDocuments()
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Recent Activities
router.get('/activities', adminAuth, async (req, res) => {
  try {
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name')
      .populate('listing', 'title');

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');

    res.json({
      recentBookings,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Test route - add this temporarily
router.get('/test', (req, res) => {
  console.log('Admin test route hit');
  res.json({ message: 'Admin routes are accessible' });
});

module.exports = router; 