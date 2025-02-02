const mongoose = require('mongoose');

const messListingSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  monthlyPrice: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  mealTypes: {
    breakfast: Boolean,
    lunch: Boolean,
    dinner: Boolean
  },
  availableSeats: {
    type: Number,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MessListing', messListingSchema); 