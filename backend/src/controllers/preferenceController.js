/**
 * Preference Controller
 * Handles user dietary preferences and nutritional goals
 */

const Preference = require('../models/Preference');
const User = require('../models/User');

/**
 * @route   POST /api/preferences
 * @desc    Create or update user preferences
 * @access  Private
 */
exports.setPreferences = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : req.body.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Check if preferences already exist
    let preference = await Preference.findOne({ user: userId });

    if (preference) {
      // Update existing preferences
      preference = await Preference.findOneAndUpdate(
        { user: userId },
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      // Create new preferences
      preference = await Preference.create({
        user: userId,
        ...req.body
      });

      // Update user's preference reference
      await User.findByIdAndUpdate(userId, { preferences: preference._id });
    }

    res.status(200).json({
      success: true,
      message: preference ? 'Preferences updated successfully' : 'Preferences created successfully',
      data: preference
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/preferences/:userId
 * @desc    Get user preferences
 * @access  Public
 */
exports.getPreferences = async (req, res, next) => {
  try {
    const userId = req.params.userId || (req.user ? req.user._id : null);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const preference = await Preference.findOne({ user: userId }).populate('user', 'name email');

    if (!preference) {
      return res.status(404).json({
        success: false,
        message: 'Preferences not found'
      });
    }

    res.status(200).json({
      success: true,
      data: preference
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/preferences/dietary
 * @desc    Update dietary restrictions
 * @access  Private
 */
exports.updateDietaryRestrictions = async (req, res, next) => {
  try {
    const preference = await Preference.findOneAndUpdate(
      { user: req.user._id },
      { dietaryRestrictions: req.body },
      { new: true, runValidators: true }
    );

    if (!preference) {
      return res.status(404).json({
        success: false,
        message: 'Preferences not found. Please create preferences first.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Dietary restrictions updated',
      data: preference
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/preferences/nutritional-goals
 * @desc    Update nutritional goals
 * @access  Private
 */
exports.updateNutritionalGoals = async (req, res, next) => {
  try {
    const preference = await Preference.findOneAndUpdate(
      { user: req.user._id },
      { nutritionalGoals: req.body },
      { new: true, runValidators: true }
    );

    if (!preference) {
      return res.status(404).json({
        success: false,
        message: 'Preferences not found. Please create preferences first.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Nutritional goals updated',
      data: preference
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/preferences/budget
 * @desc    Update budget preferences
 * @access  Private
 */
exports.updateBudgetPreferences = async (req, res, next) => {
  try {
    const preference = await Preference.findOneAndUpdate(
      { user: req.user._id },
      { budgetPreferences: req.body },
      { new: true, runValidators: true }
    );

    if (!preference) {
      return res.status(404).json({
        success: false,
        message: 'Preferences not found. Please create preferences first.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Budget preferences updated',
      data: preference
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/preferences
 * @desc    Delete user preferences
 * @access  Private
 */
exports.deletePreferences = async (req, res, next) => {
  try {
    const preference = await Preference.findOneAndDelete({ user: req.user._id });

    if (!preference) {
      return res.status(404).json({
        success: false,
        message: 'Preferences not found'
      });
    }

    // Remove preference reference from user
    await User.findByIdAndUpdate(req.user._id, { preferences: null });

    res.status(200).json({
      success: true,
      message: 'Preferences deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

