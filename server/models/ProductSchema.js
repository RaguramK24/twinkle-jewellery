const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price must be positive']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  image: {
    type: String,
    default: null
  },
  // ImageKit specific fields
  imageKitFileId: {
    type: String,
    default: null
  },
  imageMetadata: {
    url: {
      type: String,
      default: null
    },
    thumbnailUrl: {
      type: String,
      default: null
    },
    width: {
      type: Number,
      default: null
    },
    height: {
      type: Number,
      default: null
    },
    size: {
      type: Number,
      default: null
    }
  }
}, {
  timestamps: true
});

// Virtual field for backward compatibility - returns the main image URL
productSchema.virtual('imageUrl').get(function() {
  // Prioritize ImageKit URL, fallback to legacy image field for local files
  return this.imageMetadata?.url || (this.image ? `/uploads/${this.image}` : null);
});

// Ensure virtual fields are included in JSON output
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);