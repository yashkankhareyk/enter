const mongoose = require('mongoose');
const baseListingSchema = require('./BaseListingSchema');

const shopListingSchema = new mongoose.Schema({
  shopType: {
    type: String,
    enum: ['stationery', 'grocery', 'electronics', 'other'],
    required: true
  },
  openingHours: {
    type: String,
    required: true
  }
});

// Merge with base schema
const schema = baseListingSchema.clone();
schema.add(shopListingSchema);

module.exports = mongoose.model('ShopListing', schema);