const mongoose = require('mongoose');
const baseListingSchema = require('./BaseListingSchema');

const accommodationListingSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true
  },
  roomType: {
    type: String,
    enum: ['single', 'double', 'triple'],
    required: true
  },
  availableRooms: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  latitude: {
    type: String,
    required: false
  },
  longitude: {
    type: String,
    required: false
  }
});

// Merge with base schema
const schema = baseListingSchema.clone();
schema.add(accommodationListingSchema);

module.exports = mongoose.model('AccommodationListing', schema);