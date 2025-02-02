const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

module.exports = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Check if no token
    if (!token) {
      return res.status(401).json({ message: 'No auth token found' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // First try to find admin
    let user = await Admin.findById(decoded.id).select('-password');
    if (user) {
      req.user = { ...user.toObject(), role: 'admin' };
      return next();
    }

    // If not admin, try to find regular user
    user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new Error('User not found');
    }

    req.user = { ...user.toObject(), role: user.userType };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};