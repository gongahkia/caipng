/**
 * Preference Routes
 */

const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth');
const {
  setPreferences,
  getPreferences,
  updateDietaryRestrictions,
  updateNutritionalGoals,
  updateBudgetPreferences,
  deletePreferences
} = require('../controllers/preferenceController');

// Public/optional auth routes
router.post('/', optionalAuth, setPreferences);
router.get('/:userId', getPreferences);

// Protected routes
router.put('/dietary', protect, updateDietaryRestrictions);
router.put('/nutritional-goals', protect, updateNutritionalGoals);
router.put('/budget', protect, updateBudgetPreferences);
router.delete('/', protect, deletePreferences);

module.exports = router;

