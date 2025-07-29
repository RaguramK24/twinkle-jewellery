const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const { adminAuth } = require('../middleware/auth');
const { optimizeAndUploadMiddleware } = require('../utils/imageOptimizer');
const { deleteImage } = require('../utils/imagekit');

// Configure multer for temporary file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use tmp directory for temporary files
    const tmpDir = path.join(__dirname, '../tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    cb(null, tmpDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// GET /api/products - Get all products (public)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    const populatedProducts = await Product.populate(products, 'category');
    res.json(populatedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/:id - Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const populatedProduct = await Product.populate(product, 'category');
    res.json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/products - Create product (admin only)
router.post('/', adminAuth, upload.array('images', 5), optimizeAndUploadMiddleware, async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    
    const productData = {
      name,
      price: parseFloat(price),
      description,
      category
    };

    // Handle multiple images
    if (req.files && req.files.length > 0) {
      const images = [];
      const imageKitFileIds = [];
      const imageMetadataList = [];

      req.files.forEach(file => {
        if (file.imagekitResponse) {
          const imageKitResponse = file.imagekitResponse;
          images.push(imageKitResponse.url);
          imageKitFileIds.push(imageKitResponse.fileId);
          imageMetadataList.push({
            url: imageKitResponse.url,
            thumbnailUrl: imageKitResponse.thumbnailUrl,
            width: imageKitResponse.width,
            height: imageKitResponse.height,
            size: imageKitResponse.size
          });
        }
      });

      productData.images = images;
      productData.imageKitFileIds = imageKitFileIds;
      productData.imageMetadataList = imageMetadataList;

      // For backward compatibility, also set legacy fields with first image
      if (images.length > 0) {
        productData.image = images[0];
        productData.imageKitFileId = imageKitFileIds[0];
        productData.imageMetadata = imageMetadataList[0];
      }
    }

    const savedProduct = await Product.save(productData);
    const populatedProduct = await Product.populate(savedProduct, 'category');
    
    res.status(201).json(populatedProduct);
  } catch (error) {
    // Clean up uploaded images if product creation fails
    if (req.files && req.files.length > 0) {
      req.files.forEach(async file => {
        if (file.imageKitFileId) {
          try {
            await deleteImage(file.imageKitFileId);
          } catch (deleteError) {
            console.error('Failed to delete uploaded image after product creation error:', deleteError);
          }
        }
      });
    }
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', adminAuth, upload.array('images', 5), optimizeAndUploadMiddleware, async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    
    const updateData = {
      name,
      price: parseFloat(price),
      description,
      category
    };

    // Get existing product to potentially delete old images
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Handle multiple new images
    if (req.files && req.files.length > 0) {
      const images = [];
      const imageKitFileIds = [];
      const imageMetadataList = [];

      req.files.forEach(file => {
        if (file.imagekitResponse) {
          const imageKitResponse = file.imagekitResponse;
          images.push(imageKitResponse.url);
          imageKitFileIds.push(imageKitResponse.fileId);
          imageMetadataList.push({
            url: imageKitResponse.url,
            thumbnailUrl: imageKitResponse.thumbnailUrl,
            width: imageKitResponse.width,
            height: imageKitResponse.height,
            size: imageKitResponse.size
          });
        }
      });

      updateData.images = images;
      updateData.imageKitFileIds = imageKitFileIds;
      updateData.imageMetadataList = imageMetadataList;

      // For backward compatibility, also set legacy fields with first image
      if (images.length > 0) {
        updateData.image = images[0];
        updateData.imageKitFileId = imageKitFileIds[0];
        updateData.imageMetadata = imageMetadataList[0];
      }

      // Delete old images from ImageKit
      const oldFileIds = existingProduct.imageKitFileIds || (existingProduct.imageKitFileId ? [existingProduct.imageKitFileId] : []);
      for (const fileId of oldFileIds) {
        try {
          await deleteImage(fileId);
          console.log('Old image deleted from ImageKit:', fileId);
        } catch (deleteError) {
          console.error('Failed to delete old image from ImageKit:', deleteError);
          // Continue with update even if old image deletion fails
        }
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    const populatedProduct = await Product.populate(product, 'category');
    res.json(populatedProduct);
  } catch (error) {
    // Clean up uploaded images if product update fails
    if (req.files && req.files.length > 0) {
      req.files.forEach(async file => {
        if (file.imageKitFileId) {
          try {
            await deleteImage(file.imageKitFileId);
          } catch (deleteError) {
            console.error('Failed to delete uploaded image after product update error:', deleteError);
          }
        }
      });
    }
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete all images from ImageKit
    const fileIds = product.imageKitFileIds || (product.imageKitFileId ? [product.imageKitFileId] : []);
    for (const fileId of fileIds) {
      try {
        await deleteImage(fileId);
        console.log('Image deleted from ImageKit:', fileId);
      } catch (deleteError) {
        console.error('Failed to delete image from ImageKit:', deleteError);
        // Continue with product deletion even if image deletion fails
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;