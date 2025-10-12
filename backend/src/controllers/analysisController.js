/**
 * Analysis Controller
 * Handles image analysis and dish identification using computer vision
 */

const Analysis = require('../models/Analysis');
const visionService = require('../utils/visionService');
const { analyzeImageQuality } = require('../utils/imageProcessor');
const path = require('path');

/**
 * @route   POST /api/analyze
 * @desc    Analyze uploaded image to identify dishes
 * @access  Public
 */
exports.analyzeImage = async (req, res, next) => {
  try {
    const { imagePath, filename } = req.body;

    if (!imagePath && !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image to analyze'
      });
    }

    // Use provided path or uploaded file
    const imageToAnalyze = imagePath 
      ? path.join(__dirname, '../../', imagePath)
      : req.file.path;

    const imageFilename = filename || (req.file ? req.file.filename : '');

    // Create analysis record
    const analysis = await Analysis.create({
      user: req.user ? req.user._id : null,
      originalImage: {
        filename: imageFilename,
        path: imageToAnalyze,
        size: req.file ? req.file.size : 0,
        mimetype: req.file ? req.file.mimetype : 'image/jpeg'
      },
      status: 'processing'
    });

    try {
      // Perform computer vision analysis
      const startTime = Date.now();
      const cvResults = await visionService.analyzeDish(imageToAnalyze);
      const processingTime = Date.now() - startTime;

      // Analyze image quality
      const imageQuality = await analyzeImageQuality(imageToAnalyze);

      // Format identified dishes
      const identifiedDishes = cvResults.identifiedDishes.map(match => ({
        dish: match.dish,
        confidence: match.confidence,
        boundingBox: match.boundingBox
      }));

      // Update analysis with results
      analysis.identifiedDishes = identifiedDishes;
      analysis.status = 'completed';
      analysis.analysisMetadata = {
        processingTime,
        modelVersion: '1.0.0',
        imageQuality
      };

      await analysis.save();
      await analysis.populate('identifiedDishes.dish');

      res.status(200).json({
        success: true,
        message: 'Image analyzed successfully',
        data: {
          analysisId: analysis._id,
          identifiedDishes: analysis.identifiedDishes,
          nutritionalSummary: analysis.nutritionalSummary,
          metadata: analysis.analysisMetadata,
          status: analysis.status
        }
      });
    } catch (error) {
      // Update analysis with error
      analysis.status = 'failed';
      analysis.error = error.message;
      await analysis.save();

      throw error;
    }
  } catch (error) {
    console.error('Analysis error:', error);
    next(error);
  }
};

/**
 * @route   GET /api/analyze/:id
 * @desc    Get analysis by ID
 * @access  Public
 */
exports.getAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id)
      .populate('identifiedDishes.dish')
      .populate('user', 'name email');

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }

    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/analyze/user/:userId
 * @desc    Get all analyses for a user
 * @access  Private
 */
exports.getUserAnalyses = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const analyses = await Analysis.find({ user: req.params.userId })
      .populate('identifiedDishes.dish')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Analysis.countDocuments({ user: req.params.userId });

    res.status(200).json({
      success: true,
      count: analyses.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: analyses
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/analyze/batch
 * @desc    Batch analyze multiple images
 * @access  Public
 */
exports.batchAnalyze = async (req, res, next) => {
  try {
    const { images } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of images to analyze'
      });
    }

    const results = [];

    for (const imageData of images) {
      try {
        const imagePath = path.join(__dirname, '../../', imageData.path);
        const cvResults = await visionService.analyzeDish(imagePath);

        results.push({
          image: imageData,
          identifiedDishes: cvResults.identifiedDishes,
          success: true
        });
      } catch (error) {
        results.push({
          image: imageData,
          error: error.message,
          success: false
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Analyzed ${results.length} images`,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/analyze/:id
 * @desc    Delete analysis
 * @access  Private
 */
exports.deleteAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }

    // Check if user owns this analysis
    if (req.user && analysis.user && analysis.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this analysis'
      });
    }

    await analysis.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Analysis deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

