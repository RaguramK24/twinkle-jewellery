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
  // Support for multiple images
  images: {
    type: [String],
    default: []
  },
  // ImageKit specific fields for multiple images
  imageKitFileIds: {
    type: [String],
    default: []
  },
  imageMetadataList: [{
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
  }],
  // Legacy fields for backward compatibility (deprecated)
  image: {
    type: String,
    default: null
  },
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

// Virtual fields for backward compatibility and convenience
productSchema.virtual('imageUrl').get(function() {
  // First try to get from images array (new format)
  if (this.images && this.images.length > 0) {
    return this.images[0];
  }
  // Fallback to legacy image field
  return this.imageMetadata?.url || (this.image ? `/uploads/${this.image}` : null);
});

// Virtual field to get all image URLs
productSchema.virtual('imageUrls').get(function() {
  const urls = [];
  
  // Add from new images array (prioritize ImageKit URLs from metadata)
  if (this.imageMetadataList && this.imageMetadataList.length > 0) {
    this.imageMetadataList.forEach(metadata => {
      if (metadata.url) {
        urls.push(metadata.url);
      }
    });
  }
  
  // If no ImageKit URLs, use local image paths
  if (urls.length === 0 && this.images && this.images.length > 0) {
    this.images.forEach(imageName => {
      urls.push(`/uploads/${imageName}`);
    });
  }
  
  // Fallback to legacy single image
  if (urls.length === 0 && this.image) {
    const legacyUrl = this.imageMetadata?.url || `/uploads/${this.image}`;
    urls.push(legacyUrl);
  }
  
  return urls;
});

// Ensure virtual fields are included in JSON output
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);