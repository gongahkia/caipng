/**
 * Upload Controller
 * Handles image upload and preprocessing
 */

const path = require('path');
const {
  optimizeImage,
  analyzeImageQuality,
  extractDominantColors,
  createThumbnail
} = require('../utils/imageProcessor');

/**
 * @route   POST /api/upload
 * @desc    Upload and process image
 * @access  Public
 */
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    const imagePath = req.file.path;
    
    // Optimize image
    const optimizedImage = await optimizeImage(imagePath, {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 85
    });

    // Analyze image quality
    const quality = await analyzeImageQuality(imagePath);

    // Extract dominant colors
    const colors = await extractDominantColors(imagePath);

    // Create thumbnail
    const thumbnailPath = await createThumbnail(imagePath, 200);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        original: {
          filename: req.file.filename,
          path: `/uploads/${req.file.filename}`,
          size: req.file.size,
          mimetype: req.file.mimetype
        },
        optimized: {
          path: optimizedImage.optimizedPath.replace(/^.*[\\\/]uploads[\\\/]/, '/uploads/'),
          size: optimizedImage.optimizedSize,
          compressionRatio: optimizedImage.compressionRatio
        },
        thumbnail: {
          path: thumbnailPath.replace(/^.*[\\\/]uploads[\\\/]/, '/uploads/')
        },
        analysis: {
          quality,
          dominantColors: colors,
          dimensions: optimizedImage.dimensions
        }
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    next(error);
  }
};

/**
 * @route   POST /api/upload/multiple
 * @desc    Upload multiple images
 * @access  Public
 */
exports.uploadMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one image'
      });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      try {
        const imagePath = file.path;
        
        const optimizedImage = await optimizeImage(imagePath);
        const quality = await analyzeImageQuality(imagePath);
        const thumbnailPath = await createThumbnail(imagePath);

        uploadedFiles.push({
          original: {
            filename: file.filename,
            path: `/uploads/${file.filename}`,
            size: file.size
          },
          optimized: {
            path: optimizedImage.optimizedPath.replace(/^.*[\\\/]uploads[\\\/]/, '/uploads/')
          },
          thumbnail: {
            path: thumbnailPath.replace(/^.*[\\\/]uploads[\\\/]/, '/uploads/')
          },
          quality
        });
      } catch (error) {
        console.error(`Error processing file ${file.filename}:`, error);
      }
    }

    res.status(200).json({
      success: true,
      message: `${uploadedFiles.length} images uploaded successfully`,
      count: uploadedFiles.length,
      data: uploadedFiles
    });
  } catch (error) {
    next(error);
  }
};

