const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { uploadImage } = require('./imagekit');

const optimizeImage = async (inputPath, outputPath = null) => {
  try {
    // If no output path provided, optimize in place
    const outputFile = outputPath || inputPath;
    const tempFile = outputFile + '.tmp';

    await sharp(inputPath)
      .resize({
        width: 1200,
        height: 1200,
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({
        quality: 85,
        progressive: true
      })
      .toFile(tempFile);

    // Replace the original file with the optimized version
    fs.renameSync(tempFile, outputFile);
    
    console.log(`Image optimized: ${outputFile}`);
    return outputFile;
  } catch (error) {
    console.error('Error optimizing image:', error);
    // If optimization fails, keep the original file
    if (fs.existsSync(inputPath + '.tmp')) {
      fs.unlinkSync(inputPath + '.tmp');
    }
    throw error;
  }
};

/**
 * Optimize image and return buffer for ImageKit upload
 * @param {string} inputPath - Path to the input image file
 * @returns {Promise<Buffer>} Optimized image buffer
 */
const optimizeImageForUpload = async (inputPath) => {
  try {
    const optimizedBuffer = await sharp(inputPath)
      .resize({
        width: 1200,
        height: 1200,
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({
        quality: 85,
        progressive: true
      })
      .toBuffer();
    
    console.log(`Image optimized for upload: ${inputPath}`);
    return optimizedBuffer;
  } catch (error) {
    console.error('Error optimizing image for upload:', error);
    // If optimization fails, return original file buffer
    return fs.readFileSync(inputPath);
  }
};

/**
 * Middleware to optimize image and upload to ImageKit
 */
const optimizeAndUploadMiddleware = async (req, res, next) => {
  if (req.file) {
    try {
      // Optimize image and get buffer
      const optimizedBuffer = await optimizeImageForUpload(req.file.path);
      
      // Generate unique filename
      const fileExtension = path.extname(req.file.originalname);
      const fileName = `product-${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
      
      // Upload to ImageKit
      const uploadResponse = await uploadImage(optimizedBuffer, fileName, 'products');
      
      // Store ImageKit response in req.file for later use
      req.file.imagekitResponse = uploadResponse;
      req.file.imageUrl = uploadResponse.url;
      req.file.imageKitFileId = uploadResponse.fileId;
      
      // Clean up local file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      console.log('Image uploaded to ImageKit successfully:', uploadResponse.url);
    } catch (error) {
      console.error('Image upload to ImageKit failed:', error.message);
      // Clean up local file even if upload fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(500).json({ 
        message: 'Image upload failed', 
        error: error.message 
      });
    }
  }
  next();
};

// Legacy middleware for backward compatibility
const optimizeImageMiddleware = async (req, res, next) => {
  if (req.file) {
    try {
      await optimizeImage(req.file.path);
    } catch (error) {
      console.error('Image optimization failed, using original:', error.message);
      // Continue with original file if optimization fails
    }
  }
  next();
};

module.exports = {
  optimizeImage,
  optimizeImageForUpload,
  optimizeImageMiddleware,
  optimizeAndUploadMiddleware
};