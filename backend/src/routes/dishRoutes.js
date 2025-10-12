/**
 * Dish Routes
 */

const express = require('express');
const router = express.Router();
const {
  getAllDishes,
  getDishById,
  createDish,
  updateDish,
  deleteDish,
  searchDishes,
  getCategories
} = require('../controllers/dishController');

// Public routes
router.get('/', getAllDishes);
router.get('/search', searchDishes);
router.get('/categories', getCategories);
router.get('/:id', getDishById);

// Admin routes (simplified - in production, add admin authentication)
router.post('/', createDish);
router.put('/:id', updateDish);
router.delete('/:id', deleteDish);

module.exports = router;

