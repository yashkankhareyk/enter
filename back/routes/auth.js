const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const {
  phoneNumberLimiter,
  ipLimiter,
  checkAbnormalActivity,
  verifyPhoneNumber,
  monitorUsage
} = require('../middleware/otpSecurity');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password, userType } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user || user.userType !== userType) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Create token
        const token = jwt.sign(
            { id: user._id, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error in login'
        });
    }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    let user;
    const userType = req.user.userType || req.user.role;  // Handle both formats

    switch (userType) {
      case 'student':
        user = await User.findById(req.user.id).select('-password');
        break;
      case 'admin':
        user = await Admin.findById(req.user.id).select('-password');
        break;
      default:
        user = await User.findById(req.user.id).select('-password');
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        userType: userType
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user details'
    });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, userType } = req.body;
        console.log('Registration request received:', { name, email, phone, userType }); // Debug log

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            userType
        });

        console.log('Attempting to save user:', user); // Debug log

        await user.save();
        console.log('User saved successfully:', user._id); // Debug log

        // Create token
        const token = jwt.sign(
            { id: user._id, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType,
                phone: user.phone
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error in registration',
            error: error.message // Include error message for debugging
        });
    }
});

// Add this temporary route to check users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'email role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/verify
router.get('/verify', auth, async (req, res) => {
    try {
        // req.user is already populated by the auth middleware
        res.json(req.user);
    } catch (error) {
        console.error('Verify token error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add this new endpoint for token verification
router.get('/verify-token', auth, async (req, res) => {
  try {
    // Check if user exists
    let user = await User.findById(req.user.id).select('-password');
    
    // If not a regular user, check if admin
    if (!user) {
      user = await Admin.findById(req.user.id).select('-password');
      if (user) {
        user.role = 'admin'; // Explicitly set admin role
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ 
      success: true, 
      user: user 
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/auth/student/login
router.post('/student/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find student
    const student = await User.findOne({ email });
    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = student.generateAuthToken();

    res.json({
      success: true,
      token,
      user: {
        _id: student._id,
        name: student.name,
        email: student.email,
        role: 'student'
      }
    });
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in'
    });
  }
});

// Add this route for OTP verification
router.post('/send-otp',
  ipLimiter,
  phoneNumberLimiter,
  checkAbnormalActivity,
  verifyPhoneNumber,
  monitorUsage,
  async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      
      // Firebase OTP sending is handled on the frontend
      // This endpoint is for rate limiting and security checks only
      res.json({
        success: true,
        message: 'Security checks passed'
      });
    } catch (error) {
      console.error('OTP security check error:', error);
      res.status(500).json({
        success: false,
        message: 'Error in OTP security check'
      });
    }
  }
);

module.exports = router; 