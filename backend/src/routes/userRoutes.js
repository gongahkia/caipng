/**
 * User Routes
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  updateProfile,
  addFavorite,
  removeFavorite,
  getFavorites
} = require('../controllers/userController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.get('/favorites', protect, getFavorites);
router.post('/favorites/:dishId', protect, addFavorite);
router.delete('/favorites/:dishId', protect, removeFavorite);

module.exports = router;

