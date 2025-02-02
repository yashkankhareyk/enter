const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../models/reviewModel');
const Listing = require('../models/Listing');
const AccommodationListing = require('../models/AccommodationListing');
const MessListing = require('../models/MessListing');
const RestaurantListing = require('../models/RestaurantListing');
const ShopListing = require('../models/ShopListing');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads', 'reviews');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for review images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `review-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
}).array('images', 5);

// Middleware to handle multer errors
const handleMulterUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    } else if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error uploading files: ' + err.message
      });
    }
    next();
  });
};

// Create review (students only)
router.post('/', auth, handleMulterUpload, async (req, res) => {
  try {
    console.log('Received review data:', {
      userId: req.user._id,
      listingId: req.body.listingId,
      listing: req.body.listing,
      rating: req.body.rating,
      hasComment: !!req.body.comment,
      filesCount: req.files?.length
    });

    // Validate user type
    if (req.user.userType !== 'student') {
      throw new Error('Only students can post reviews');
    }

    // Validate required fields
    if (!req.body.listing) {
      throw new Error('Listing ID is required');
    }

    // Validate listingId format
    if (!mongoose.Types.ObjectId.isValid(req.body.listingId)) {
      throw new Error('Invalid listing ID format');
    }

    // Check if listing exists in any of the listing collections
    let listing = await AccommodationListing.findById(req.body.listingId);
    if (!listing) {
      listing = await MessListing.findById(req.body.listingId);
    }
    if (!listing) {
      listing = await RestaurantListing.findById(req.body.listingId);
    }
    if (!listing) {
      listing = await ShopListing.findById(req.body.listingId);
    }
    if (!listing) {
      listing = await Listing.findById(req.body.listingId);
    }
    
    if (!listing) {
      throw new Error('Listing not found');
    }

    if (!req.body.rating || isNaN(req.body.rating) || req.body.rating < 1 || req.body.rating > 5) {
      throw new Error('Rating must be a number between 1 and 5');
    }

    if (!req.body.comment || req.body.comment.trim().length < 10) {
      throw new Error('Comment must be at least 10 characters long');
    }

    // Check if user has already reviewed this listing
    const existingReview = await Review.findOne({
      user: req.user._id,
      listing: req.body.listingId
    });

    if (existingReview) {
      throw new Error('You have already reviewed this listing');
    }

    // Create the review with both listing and listingId fields
    const review = new Review({
      user: req.user._id,
      listing: req.body.listing,
      listingId: req.body.listingId,
      rating: req.body.rating,
      comment: req.body.comment,
      images: req.files ? req.files.map(file => file.path) : []
    });

    await review.save();
    
    // Populate user details before sending response
    await review.populate('user', 'name email');
    await review.populate('listing', 'title');

    res.status(201).json({
      success: true,
      review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get reviews for a specific listing
router.get('/listing/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ listing: req.params.id })
      .populate('user', 'name email profilePicture')
      .sort({ timestamp: -1 });

    res.json({
      success: true,
      reviews: reviews.map(review => ({
        _id: review._id,
        rating: review.rating,
        comment: review.comment,
        images: review.images,
        timestamp: review.timestamp,
        user: {
          _id: review.user._id,
          name: review.user.name,
          email: review.user.email,
          profilePicture: review.user.profilePicture
        }
      }))
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching reviews',
      error: error.message 
    });
  }
});

// Add owner feedback to review
router.post('/:reviewId/feedback', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId)
      .populate('listing');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the authenticated user is the owner of the listing
    if (review.listing.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the listing owner can add feedback' });
    }

    review.ownerFeedback = {
      comment: req.body.comment,
      timestamp: new Date()
    };

    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'name email')
            .populate('listing', 'title description');
        res.json({
          success: true,
          reviews
        });
    } catch (err) {
        res.status(500).json({ 
          success: false,
          message: err.message 
        });
    }
});

// Update review
router.put('/:id', auth, handleMulterUpload, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own reviews'
      });
    }

    const imagePaths = req.files ? req.files.map(file => `/uploads/reviews/${path.basename(file.path)}`) : review.images;
    
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      {
        rating: Number(req.body.rating) || review.rating,
        comment: req.body.comment || review.comment,
        images: imagePaths,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('user', 'name');

    res.json({
      success: true,
      review: {
        ...updatedReview.toObject(),
        images: updatedReview.images.map(img => `/uploads/reviews/${path.basename(img)}`)
      }
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating review'
    });
  }
});

// Delete review
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own reviews'
      });
    }

    // Delete associated images
    if (review.images && review.images.length > 0) {
      review.images.forEach(image => {
        const imagePath = path.join(uploadsDir, path.basename(image));
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    await review.deleteOne();
    
    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting review'
    });
  }
});

module.exports = router;
