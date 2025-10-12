/**
 * Recommendation Routes
 */

const express = require('express');
const router = express.Router();
const {
  getRecommendations,
  getSimilarDishes,
  optimizeMeal,
  completeMeal
} = require('../controllers/recommendationController');

// Public routes
router.post('/', getRecommendations);
router.get('/similar/:dishId', getSimilarDishes);
router.post('/optimize', optimizeMeal);
router.post('/complete-meal', completeMeal);

module.exports = router;

