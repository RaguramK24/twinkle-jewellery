const ImageKit = require('imagekit');
const fs = require('fs');
const path = require('path');

let imagekitInstance = null;

/**
 * Get or create ImageKit instance
 * @returns {ImageKit} ImageKit instance
 */
const getImageKitInstance = () => {
  if (!imagekitInstance) {
    // Validate ImageKit configuration
    if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
      throw new Error('ImageKit configuration is missing. Please check environment variables: IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT');
    }

    imagekitInstance = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });
  }
  
  return imagekitInstance;
};

/**
 * Upload an image file to ImageKit.io
 * @param {Buffer|string} file - File buffer or file path
 * @param {string} fileName - Name for the uploaded file
 * @param {string} folder - Optional folder path (default: 'products')
 * @returns {Promise<Object>} ImageKit upload response
 */
const uploadImage = async (file, fileName, folder = 'products') => {
  try {
    const imagekit = getImageKitInstance();

    let fileBuffer;
    
    // Handle file input (either buffer or file path)
    if (typeof file === 'string') {
      // File path provided
      if (!fs.existsSync(file)) {
        throw new Error(`File not found: ${file}`);
      }
      fileBuffer = fs.readFileSync(file);
    } else if (Buffer.isBuffer(file)) {
      // Buffer provided
      fileBuffer = file;
    } else {
      throw new Error('Invalid file input. Expected file path or buffer.');
    }

    const uploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: fileName,
      folder: folder,
      useUniqueFileName: true,
      responseFields: 'isPrivateFile,tags,customCoordinates,metadata,embeddedMetadata'
    });

    console.log('Image uploaded successfully to ImageKit:', uploadResponse.url);
    return uploadResponse;

  } catch (error) {
    console.error('Error uploading image to ImageKit:', error);
    throw error;
  }
};

/**
 * Delete an image from ImageKit.io
 * @param {string} fileId - ImageKit file ID
 * @returns {Promise<void>}
 */
const deleteImage = async (fileId) => {
  try {
    if (!fileId) {
      throw new Error('File ID is required for deletion');
    }

    const imagekit = getImageKitInstance();
    await imagekit.deleteFile(fileId);
    console.log('Image deleted successfully from ImageKit:', fileId);
  } catch (error) {
    console.error('Error deleting image from ImageKit:', error);
    throw error;
  }
};

/**
 * Generate ImageKit URL with transformations
 * @param {string} url - Original ImageKit URL
 * @param {Object} transformations - Transformation options
 * @returns {string} Transformed URL
 */
const getTransformedUrl = (url, transformations = {}) => {
  try {
    const imagekit = getImageKitInstance();
    return imagekit.url({
      src: url,
      transformation: transformations
    });
  } catch (error) {
    console.error('Error generating transformed URL:', error);
    return url; // Return original URL if transformation fails
  }
};

/**
 * Get optimized image URLs for different use cases
 * @param {string} url - Original ImageKit URL
 * @returns {Object} Object with different sized URLs
 */
const getOptimizedUrls = (url) => {
  if (!url) return null;

  return {
    original: url,
    thumbnail: getTransformedUrl(url, [
      { height: 300, width: 300, cropMode: 'pad_resize' },
      { quality: 80, format: 'webp' }
    ]),
    medium: getTransformedUrl(url, [
      { height: 600, width: 600, cropMode: 'pad_resize' },
      { quality: 85, format: 'webp' }
    ]),
    large: getTransformedUrl(url, [
      { height: 1200, width: 1200, cropMode: 'pad_resize' },
      { quality: 90, format: 'webp' }
    ])
  };
};

module.exports = {
  getImageKitInstance,
  uploadImage,
  deleteImage,
  getTransformedUrl,
  getOptimizedUrls
};