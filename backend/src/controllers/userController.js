/**
 * User Controller
 * Handles user authentication and profile management
 */

const User = require('../models/User');

/**
 * @route   POST /api/users/register
 * @desc    Register new user
 * @access  Public
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/users/login
 * @desc    Login user
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('preferences')
      .populate('favorites');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/users/me
 * @desc    Update user profile
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (email) fieldsToUpdate.email = email;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/users/favorites/:dishId
 * @desc    Add dish to favorites
 * @access  Private
 */
exports.addFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.favorites.includes(req.params.dishId)) {
      return res.status(400).json({
        success: false,
        message: 'Dish already in favorites'
      });
    }

    user.favorites.push(req.params.dishId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Dish added to favorites',
      favorites: user.favorites
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/users/favorites/:dishId
 * @desc    Remove dish from favorites
 * @access  Private
 */
exports.removeFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    user.favorites = user.favorites.filter(
      id => id.toString() !== req.params.dishId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Dish removed from favorites',
      favorites: user.favorites
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users/favorites
 * @desc    Get user's favorite dishes
 * @access  Private
 */
exports.getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');

    res.status(200).json({
      success: true,
      count: user.favorites.length,
      data: user.favorites
    });
  } catch (error) {
    next(error);
  }
};

