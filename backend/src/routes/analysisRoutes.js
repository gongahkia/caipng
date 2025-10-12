/**
 * Analysis Routes
 */

const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { optionalAuth, protect } = require('../middleware/auth');
const {
  analyzeImage,
  getAnalysis,
  getUserAnalyses,
  batchAnalyze,
  deleteAnalysis
} = require('../controllers/analysisController');

// Public/optional auth routes
router.post('/', optionalAuth, upload.single('image'), analyzeImage);
router.post('/batch', optionalAuth, batchAnalyze);
router.get('/:id', getAnalysis);

// Protected routes
router.get('/user/:userId', protect, getUserAnalyses);
router.delete('/:id', protect, deleteAnalysis);

module.exports = router;

