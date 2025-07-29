const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

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
  optimizeImageMiddleware
};