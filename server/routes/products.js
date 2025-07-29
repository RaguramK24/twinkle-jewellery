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
    fileSize: 5 * 1024 * 1024 // 5MB limit
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
router.post('/', adminAuth, upload.single('image'), optimizeAndUploadMiddleware, async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    
    const productData = {
      name,
      price: parseFloat(price),
      description,
      category
    };

    if (req.file && req.file.imagekitResponse) {
      // Store ImageKit data
      const imageKitResponse = req.file.imagekitResponse;
      productData.imageKitFileId = imageKitResponse.fileId;
      productData.imageMetadata = {
        url: imageKitResponse.url,
        thumbnailUrl: imageKitResponse.thumbnailUrl,
        width: imageKitResponse.width,
        height: imageKitResponse.height,
        size: imageKitResponse.size
      };
      // Keep backward compatibility by storing URL in image field
      productData.image = imageKitResponse.url;
    }

    const savedProduct = await Product.save(productData);
    const populatedProduct = await Product.populate(savedProduct, 'category');
    
    res.status(201).json(populatedProduct);
  } catch (error) {
    // Clean up uploaded image if product creation fails
    if (req.file && req.file.imageKitFileId) {
      try {
        await deleteImage(req.file.imageKitFileId);
      } catch (deleteError) {
        console.error('Failed to delete uploaded image after product creation error:', deleteError);
      }
    }
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', adminAuth, upload.single('image'), optimizeAndUploadMiddleware, async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    
    const updateData = {
      name,
      price: parseFloat(price),
      description,
      category
    };

    // Get existing product to potentially delete old image
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (req.file && req.file.imagekitResponse) {
      // Store new ImageKit data
      const imageKitResponse = req.file.imagekitResponse;
      updateData.imageKitFileId = imageKitResponse.fileId;
      updateData.imageMetadata = {
        url: imageKitResponse.url,
        thumbnailUrl: imageKitResponse.thumbnailUrl,
        width: imageKitResponse.width,
        height: imageKitResponse.height,
        size: imageKitResponse.size
      };
      // Keep backward compatibility by storing URL in image field
      updateData.image = imageKitResponse.url;

      // Delete old image from ImageKit if it exists
      if (existingProduct.imageKitFileId) {
        try {
          await deleteImage(existingProduct.imageKitFileId);
          console.log('Old image deleted from ImageKit:', existingProduct.imageKitFileId);
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
    // Clean up uploaded image if product update fails
    if (req.file && req.file.imageKitFileId) {
      try {
        await deleteImage(req.file.imageKitFileId);
      } catch (deleteError) {
        console.error('Failed to delete uploaded image after product update error:', deleteError);
      }
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

    // Delete image from ImageKit if it exists
    if (product.imageKitFileId) {
      try {
        await deleteImage(product.imageKitFileId);
        console.log('Image deleted from ImageKit:', product.imageKitFileId);
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