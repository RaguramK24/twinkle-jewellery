// Placeholder for jewelry model
// This file will define the MongoDB schema for jewelry items

const mongoose = require('mongoose');

const jewelrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['rings', 'necklaces', 'earrings', 'bracelets', 'pendants', 'others']
  },
  material: {
    type: String,
    required: true,
    enum: ['gold', 'silver', 'platinum', 'diamond', 'gemstone', 'others']
  },
  images: [{
    type: String // URLs to uploaded images
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 0
  },
  weight: {
    type: Number, // in grams
    min: 0
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  }
}, {
  timestamps: true // adds createdAt and updatedAt fields
});

// Create indexes for better query performance
jewelrySchema.index({ category: 1 });
jewelrySchema.index({ material: 1 });
jewelrySchema.index({ price: 1 });

module.exports = mongoose.model('Jewelry', jewelrySchema);