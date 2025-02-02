const mongoose = require('mongoose');
const baseListingSchema = require('./BaseListingSchema');

const restaurantListingSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cuisineType: {
    type: [String],
    required: true
  },
  priceRange: {
    type: String,
    enum: ['budget', 'moderate', 'expensive'],
    required: true
  },
  openingHours: {
    type: String,
    required: true
  }
});

// Merge with base schema
const schema = baseListingSchema.clone();
schema.add(restaurantListingSchema);

module.exports = mongoose.model('RestaurantListing', schema);