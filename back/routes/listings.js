const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import all listing models
const AccommodationListing = require('../models/AccommodationListing');
const RestaurantListing = require('../models/RestaurantListing');
const ShopListing = require('../models/ShopListing');
const MessListing = require('../models/MessListing');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, '../uploads/listings');
    if (!fs.existsSync(uploadsDir)){
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'listing-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

// Get all listings (only approved ones)
router.get('/', async (req, res) => {
  try {
    // Fetch only approved listings from all collections
    const [accommodations, restaurants, shops, messes] = await Promise.all([
      AccommodationListing.find({ status: 'approved' }).populate('owner', 'name email'),
      RestaurantListing.find({ status: 'approved' }).populate('owner', 'name email'),
      ShopListing.find({ status: 'approved' }).populate('owner', 'name email'),
      MessListing.find({ status: 'approved' }).populate('owner', 'name email')
    ]);

    res.json({
      success: true,
      listings: {
        accommodations,
        restaurants,
        shops,
        messes
      }
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching listings'
    });
  }
});

// Get pending listings (admin only) - IMPORTANT: This route must come before /:type
router.get('/pending', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.role || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view pending listings'
      });
    }

    // Get all pending listings from all models
    const [pendingAccommodations, pendingRestaurants, pendingShops, pendingMesses] = await Promise.all([
      AccommodationListing.find({ status: 'pending' }).populate('owner', 'name email'),
      RestaurantListing.find({ status: 'pending' }).populate('owner', 'name email'),
      ShopListing.find({ status: 'pending' }).populate('owner', 'name email'),
      MessListing.find({ status: 'pending' }).populate('owner', 'name email')
    ]);

    const allPendingListings = [
      ...pendingAccommodations.map(listing => ({...listing.toObject(), type: 'accommodation'})),
      ...pendingRestaurants.map(listing => ({...listing.toObject(), type: 'restaurant'})),
      ...pendingShops.map(listing => ({...listing.toObject(), type: 'shop'})),
      ...pendingMesses.map(listing => ({...listing.toObject(), type: 'mess'}))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log('Found pending listings:', allPendingListings.length); // Debug log

    res.json({
      success: true,
      listings: allPendingListings
    });
  } catch (error) {
    console.error('Error fetching pending listings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending listings'
    });
  }
});

// Get listings by type (only approved ones)
router.get('/:type', async (req, res) => {
  try {
    let listings = [];
    const { type } = req.params;
    console.log('Fetching listings for type:', type);

    switch (type) {
      case 'accommodations':
        listings = await AccommodationListing.find({ status: 'approved' })
          .populate('owner', 'name email');
        break;
      case 'restaurants':
        listings = await RestaurantListing.find({ status: 'approved' })
          .populate('owner', 'name email');
        break;
      case 'shops':
        listings = await ShopListing.find({ status: 'approved' })
          .populate('owner', 'name email');
        break;
      case 'messes':
        listings = await MessListing.find({ status: 'approved' })
          .populate('owner', 'name email');
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid listing type'
        });
    }

    console.log(`Found ${listings.length} approved ${type} listings`);
    
    res.json({
      success: true,
      listings
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching listings'
    });
  }
});

// Create new listing
router.post('/create/:type', auth, upload.array('images', 5), async (req, res) => {
  try {
    const { type } = req.params;
    const listingData = req.body;
    
    // Add owner field from authenticated user
    listingData.owner = req.user._id;

    // Process uploaded images - Fix image paths
    if (req.files && req.files.length > 0) {
      listingData.images = req.files.map(file => 
        `uploads/listings/${file.filename}`.replace(/\/+/g, '/')
      );
    }

    let listing;
    switch (type) {
      case 'accommodations':
        // Ensure roomType is a string
        if (listingData.roomType) {
          listingData.roomType = listingData.roomType.toString();
        }
        listing = new AccommodationListing(listingData);
        break;
      case 'restaurants':
        listing = new RestaurantListing(listingData);
        break;
      case 'shops':
        listing = new ShopListing(listingData);
        break;
      case 'messes':
        listing = new MessListing(listingData);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid listing type'
        });
    }

    await listing.save();

    res.status(201).json({
      success: true,
      listing
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating listing'
    });
  }
});

// Get single listing by type and ID
router.get('/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    
    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid listing ID format'
      });
    }

    // Validate listing type
    const validTypes = ['restaurants', 'accommodations', 'shops', 'messes'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid listing type'
      });
    }

    let Model;
    switch (type) {
      case 'restaurants':
        Model = RestaurantListing;
        break;
      case 'accommodations':
        Model = AccommodationListing;
        break;
      case 'shops':
        Model = ShopListing;
        break;
      case 'messes':
        Model = MessListing;
        break;
    }

    const listing = await Model.findById(id).populate('owner', 'name email');
    console.log('Found listing:', listing); // Debug log
    
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: `${type} listing not found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      listing
    });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Approve listing (admin only)
router.post('/:id/approve', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.role || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to approve listings'
      });
    }

    // Find the listing in all models
    let listing = await AccommodationListing.findById(req.params.id);
    if (!listing) {
      listing = await RestaurantListing.findById(req.params.id);
    }
    if (!listing) {
      listing = await ShopListing.findById(req.params.id);
    }
    if (!listing) {
      listing = await MessListing.findById(req.params.id);
    }

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Update listing status
    listing.status = 'approved';
    await listing.save();

    // Send email notification to owner
    // TODO: Implement email notification

    res.json({
      success: true,
      message: 'Listing approved successfully'
    });
  } catch (error) {
    console.error('Error approving listing:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving listing'
    });
  }
});

// Reject listing (admin only)
router.post('/:id/reject', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.role || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject listings'
      });
    }

    // Find the listing in all models
    let listing = await AccommodationListing.findById(req.params.id);
    if (!listing) {
      listing = await RestaurantListing.findById(req.params.id);
    }
    if (!listing) {
      listing = await ShopListing.findById(req.params.id);
    }
    if (!listing) {
      listing = await MessListing.findById(req.params.id);
    }

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Update listing status and rejection reason
    listing.status = 'rejected';
    listing.rejectionReason = req.body.rejectionReason || '';
    await listing.save();

    // Send email notification to owner
    // TODO: Implement email notification

    res.json({
      success: true,
      message: 'Listing rejected successfully'
    });
  } catch (error) {
    console.error('Error rejecting listing:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting listing'
    });
  }
});

// Add these new routes for specific listing types
router.get('/restaurants', async (req, res) => {
  try {
    const listings = await RestaurantListing.find({ status: 'approved' })
      .populate('owner', 'name email');
    res.json({ success: true, listings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching restaurants' });
  }
});

router.get('/shops', async (req, res) => {
  try {
    const listings = await ShopListing.find({ status: 'approved' })
      .populate('owner', 'name email');
    res.json({ success: true, listings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching shops' });
  }
});

router.get('/accommodations', async (req, res) => {
  try {
    const listings = await AccommodationListing.find({ status: 'approved' })
      .populate('owner', 'name email');
    res.json({ success: true, listings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching accommodations' });
  }
});

router.get('/messes', async (req, res) => {
  try {
    const listings = await MessListing.find({ status: 'approved' })
      .populate('owner', 'name email');
    res.json({ success: true, listings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching messes' });
  }
});

router.post('/accommodations', upload.array('images'), async (req, res) => {
  try {
    const listingData = {
      ...req.body,
      images: req.files.map(file => `/uploads/listings/${file.filename}`),
      // Ensure coordinates are included if present
      ...(req.body.latitude && { latitude: req.body.latitude }),
      ...(req.body.longitude && { longitude: req.body.longitude })
    };

    const listing = new AccommodationListing(listingData);
    await listing.save();

    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      listing
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating listing',
      error: error.message
    });
  }
});

router.get('/debug/:id', async (req, res) => {
  try {
    const listing = await AccommodationListing.findById(req.params.id);
    res.json({
      success: true,
      listing: {
        location: listing.location,
        latitude: listing.latitude,
        longitude: listing.longitude
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router; 