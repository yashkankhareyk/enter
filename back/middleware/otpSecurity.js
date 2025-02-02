const rateLimit = require('express-rate-limit');
const axios = require('axios');

// Track OTP attempts and blacklisted IPs
const otpAttempts = new Map();
const blacklistedIPs = new Set();
let monthlyOTPCount = 0;

// Rate limiters
const phoneNumberLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  keyGenerator: (req) => req.body.phoneNumber,
  message: 'Too many OTP requests for this phone number, please try again later'
});

const ipLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10,
  message: 'Too many OTP requests from this IP, please try again later'
});

// Check for abnormal activity
const checkAbnormalActivity = (req, res, next) => {
  const ip = req.ip;
  const phone = req.body.phoneNumber;

  if (blacklistedIPs.has(ip)) {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied due to suspicious activity' 
    });
  }

  // Track attempts
  const key = `${ip}:${phone}`;
  const attempts = otpAttempts.get(key) || { count: 0, timestamp: Date.now() };
  
  // Reset count if more than 1 hour old
  if (Date.now() - attempts.timestamp > 3600000) {
    attempts.count = 0;
    attempts.timestamp = Date.now();
  }

  attempts.count++;
  otpAttempts.set(key, attempts);

  // Block if too many recent attempts
  if (attempts.count > 10) {
    blacklistedIPs.add(ip);
    return res.status(403).json({
      success: false,
      message: 'Too many failed attempts. Please try again later'
    });
  }

  next();
};

// Verify phone number validity
const verifyPhoneNumber = async (req, res, next) => {
  try {
    const phone = req.body.phoneNumber;
    // Basic validation without API
    if (!phone.match(/^\+[1-9]\d{10,14}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }
    next();
  } catch (error) {
    next(); // Proceed even if validation fails
  }
};

// Monitor monthly usage
const monitorUsage = (req, res, next) => {
  monthlyOTPCount++;

  if (monthlyOTPCount > 9500) {
    return res.status(503).json({
      success: false,
      message: 'OTP service temporarily unavailable'
    });
  }

  if (monthlyOTPCount > 9000) {
    // Send admin alert (implement your notification method)
    console.warn('OTP usage alert: Over 9000 requests this month');
  }

  next();
};

module.exports = {
  phoneNumberLimiter,
  ipLimiter,
  checkAbnormalActivity,
  verifyPhoneNumber,
  monitorUsage
}; 