const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const adminAuth = async (req, res, next) => {
  try {
    console.log('Admin auth middleware - checking token'); // Debug log
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      console.log('No token provided'); // Debug log
      return res.status(401).json({ message: 'No auth token found' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded); // Debug log

    const admin = await Admin.findOne({ _id: decoded.id, role: 'admin' });
    console.log('Admin found:', admin ? 'yes' : 'no'); // Debug log

    if (!admin) {
      throw new Error('Not authorized as admin');
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(401).json({ message: 'Admin authentication required' });
  }
};

module.exports = adminAuth; 