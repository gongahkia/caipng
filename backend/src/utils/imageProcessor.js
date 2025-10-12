/**
 * Image processing utilities
 * Handles image optimization, resizing, and preprocessing for CV analysis
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

/**
 * Optimize uploaded image (compress and resize if needed)
 * @param {String} imagePath - Path to the original image
 * @param {Object} options - Processing options
 * @returns {Object} - Processed image info
 */
const optimizeImage = async (imagePath, options = {}) => {
  try {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 85,
      format = 'jpeg'
    } = options;

    // Read image metadata
    const metadata = await sharp(imagePath).metadata();

    // Determine if resizing is needed
    let resizeOptions = {};
    if (metadata.width > maxWidth || metadata.height > maxHeight) {
      resizeOptions = {
        width: maxWidth,
        height: maxHeight,
        fit: 'inside',
        withoutEnlargement: true
      };
    }

    // Create optimized filename
    const ext = path.extname(imagePath);
    const optimizedPath = imagePath.replace(ext, `_optimized.${format}`);

    // Process image
    await sharp(imagePath)
      .resize(resizeOptions)
      .jpeg({ quality, progressive: true })
      .toFile(optimizedPath);

    // Get file sizes
    const originalSize = (await fs.stat(imagePath)).size;
    const optimizedSize = (await fs.stat(optimizedPath)).size;

    return {
      originalPath: imagePath,
      optimizedPath,
      originalSize,
      optimizedSize,
      compressionRatio: ((1 - optimizedSize / originalSize) * 100).toFixed(2) + '%',
      dimensions: {
        width: Math.min(metadata.width, maxWidth),
        height: Math.min(metadata.height, maxHeight)
      }
    };
  } catch (error) {
    console.error('Error optimizing image:', error);
    throw new Error('Failed to optimize image');
  }
};

/**
 * Prepare image for computer vision analysis
 * Normalizes and preprocesses image for ML model
 * @param {String} imagePath - Path to image
 * @returns {Buffer} - Preprocessed image buffer
 */
const preprocessForCV = async (imagePath) => {
  try {
    // Resize to standard size for CV model (e.g., 224x224 for many models)
    const processedBuffer = await sharp(imagePath)
      .resize(224, 224, {
        fit: 'cover',
        position: 'center'
      })
      .normalize() // Normalize contrast
      .toBuffer();

    return processedBuffer;
  } catch (error) {
    console.error('Error preprocessing image for CV:', error);
    throw new Error('Failed to preprocess image for analysis');
  }
};

/**
 * Extract dominant colors from image
 * @param {String} imagePath - Path to image
 * @returns {Array} - Array of dominant color hex codes
 */
const extractDominantColors = async (imagePath) => {
  try {
    const { dominant } = await sharp(imagePath)
      .resize(100, 100, { fit: 'cover' })
      .stats();

    // Convert RGB to hex
    const rgbToHex = (r, g, b) => {
      return '#' + [r, g, b].map(x => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');
    };

    return [rgbToHex(dominant.r, dominant.g, dominant.b)];
  } catch (error) {
    console.error('Error extracting colors:', error);
    return ['#808080']; // Return gray as fallback
  }
};

/**
 * Analyze image quality
 * @param {String} imagePath - Path to image
 * @returns {String} - Quality rating: excellent, good, fair, poor
 */
const analyzeImageQuality = async (imagePath) => {
  try {
    const metadata = await sharp(imagePath).metadata();
    const stats = await sharp(imagePath).stats();

    let quality = 'good'; // Default

    // Check resolution
    const pixels = metadata.width * metadata.height;
    if (pixels < 100000) quality = 'poor';
    else if (pixels < 500000) quality = 'fair';
    else if (pixels > 2000000) quality = 'excellent';

    // Check if image is too dark or too bright
    const channels = stats.channels;
    const avgBrightness = channels.reduce((sum, ch) => sum + ch.mean, 0) / channels.length;
    
    if (avgBrightness < 50 || avgBrightness > 230) {
      // Downgrade quality if too dark or bright
      if (quality === 'excellent') quality = 'good';
      else if (quality === 'good') quality = 'fair';
    }

    return quality;
  } catch (error) {
    console.error('Error analyzing image quality:', error);
    return 'fair';
  }
};

/**
 * Create thumbnail from image
 * @param {String} imagePath - Path to original image
 * @param {Number} size - Thumbnail size (square)
 * @returns {String} - Path to thumbnail
 */
const createThumbnail = async (imagePath, size = 150) => {
  try {
    const ext = path.extname(imagePath);
    const thumbnailPath = imagePath.replace(ext, `_thumb${ext}`);

    await sharp(imagePath)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);

    return thumbnailPath;
  } catch (error) {
    console.error('Error creating thumbnail:', error);
    throw new Error('Failed to create thumbnail');
  }
};

/**
 * Delete image file
 * @param {String} imagePath - Path to image
 */
const deleteImage = async (imagePath) => {
  try {
    await fs.unlink(imagePath);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

module.exports = {
  optimizeImage,
  preprocessForCV,
  extractDominantColors,
  analyzeImageQuality,
  createThumbnail,
  deleteImage
};

