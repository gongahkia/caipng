/**
 * Dish Controller
 * Handles CRUD operations for dishes
 */

const Dish = require('../models/Dish');
const { validationResult } = require('express-validator');

/**
 * @route   GET /api/dishes
 * @desc    Get all dishes with optional filtering
 * @access  Public
 */
exports.getAllDishes = async (req, res, next) => {
  try {
    const {
      category,
      subcategory,
      vegetarian,
      vegan,
      minProtein,
      maxCalories,
      sortBy = 'name',
      order = 'asc',
      page = 1,
      limit = 50
    } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (vegetarian === 'true') filter['characteristics.isVegetarian'] = true;
    if (vegan === 'true') filter['characteristics.isVegan'] = true;
    if (minProtein) filter['nutrition.protein'] = { $gte: Number(minProtein) };
    if (maxCalories) filter['nutrition.calories'] = { $lte: Number(maxCalories) };

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    // Execute query
    const dishes = await Dish.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(Number(limit));

    const total = await Dish.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: dishes.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: dishes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/dishes/:id
 * @desc    Get single dish by ID
 * @access  Public
 */
exports.getDishById = async (req, res, next) => {
  try {
    const dish = await Dish.findById(req.params.id);

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Dish not found'
      });
    }

    res.status(200).json({
      success: true,
      data: dish
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/dishes
 * @desc    Create new dish
 * @access  Private (Admin only - simplified for this project)
 */
exports.createDish = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const dish = await Dish.create(req.body);

    res.status(201).json({
      success: true,
      data: dish
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/dishes/:id
 * @desc    Update dish
 * @access  Private (Admin only)
 */
exports.updateDish = async (req, res, next) => {
  try {
    const dish = await Dish.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Dish not found'
      });
    }

    res.status(200).json({
      success: true,
      data: dish
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/dishes/:id
 * @desc    Delete dish
 * @access  Private (Admin only)
 */
exports.deleteDish = async (req, res, next) => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Dish not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Dish deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/dishes/search
 * @desc    Search dishes by name or ingredients
 * @access  Public
 */
exports.searchDishes = async (req, res, next) => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const dishes = await Dish.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { chineseName: { $regex: q, $options: 'i' } },
        { ingredients: { $in: [new RegExp(q, 'i')] } }
      ]
    }).limit(Number(limit));

    res.status(200).json({
      success: true,
      count: dishes.length,
      data: dishes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/dishes/categories
 * @desc    Get all dish categories
 * @access  Public
 */
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Dish.distinct('category');
    const subcategories = await Dish.distinct('subcategory');

    res.status(200).json({
      success: true,
      data: {
        categories,
        subcategories: subcategories.filter(Boolean)
      }
    });
  } catch (error) {
    next(error);
  }
};

