const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');

// Get user's bookings
router.get('/user', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('listing')
      .populate('owner', 'name email phone');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create booking
router.post('/:listingId', auth, async (req, res) => {
  try {
    const newBooking = new Booking({
      listing: req.params.listingId,
      user: req.user.id,
      ...req.body
    });

    const booking = await newBooking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get owner's bookings
router.get('/owner', auth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: 'listing',
        match: { owner: req.user.id }
      })
      .populate('user', 'name email phone');
    const ownerBookings = bookings.filter(booking => booking.listing);
    res.json(ownerBookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update booking status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('listing')
      .populate('user', 'name email phone');
      
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const isOwner = booking.listing.owner.toString() === req.user.id;
    const isBookingUser = booking.user._id.toString() === req.user.id;
    
    if (!isOwner && !isBookingUser) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    booking.status = req.body.status;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel/Delete booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('listing');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const isOwner = booking.listing.owner.toString() === req.user.id;
    const isBookingUser = booking.user.toString() === req.user.id;
    
    if (!isOwner && !isBookingUser) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await booking.deleteOne();
    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 