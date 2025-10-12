/**
 * Recommendation Controller
 * Handles meal recommendation generation based on user preferences
 */

const recommendationEngine = require('../utils/recommendationEngine');
const Preference = require('../models/Preference');
const Dish = require('../models/Dish');

/**
 * @route   POST /api/recommend
 * @desc    Generate meal recommendations
 * @access  Public
 */
exports.getRecommendations = async (req, res, next) => {
  try {
    const { preferences, userId, excludeDishes = [] } = req.body;

    let userPreferences;

    // Get preferences from database if userId provided
    if (userId) {
      userPreferences = await Preference.findOne({ user: userId });
    }

    // Use provided preferences or fetched preferences or defaults
    const preferencesToUse = preferences || userPreferences || {
      dietaryRestrictions: {},
      nutritionalGoals: {
        goalType: 'balanced',
        dailyCalorieTarget: 2000
      },
      budgetPreferences: {
        maxPricePerMeal: 10
      },
      tastePreferences: {
        maxSpicyLevel: 5
      },
      mealComposition: {
        preferredVegetableCount: 2,
        preferredProteinCount: 1,
        includeStarch: true
      }
    };

    // Generate recommendations
    const recommendations = await recommendationEngine.generateRecommendations(
      preferencesToUse,
      excludeDishes
    );

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    next(error);
  }
};

/**
 * @route   GET /api/recommend/similar/:dishId
 * @desc    Get similar dish recommendations
 * @access  Public
 */
exports.getSimilarDishes = async (req, res, next) => {
  try {
    const { dishId } = req.params;
    const { limit = 5 } = req.query;

    const similarDishes = await recommendationEngine.getSimilarDishes(
      dishId,
      Number(limit)
    );

    res.status(200).json({
      success: true,
      count: similarDishes.length,
      data: similarDishes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/recommend/optimize
 * @desc    Optimize meal combination for specific goals
 * @access  Public
 */
exports.optimizeMeal = async (req, res, next) => {
  try {
    const { dishIds, goal, maxPrice } = req.body;

    if (!dishIds || !Array.isArray(dishIds) || dishIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide dish IDs to optimize'
      });
    }

    // Fetch selected dishes
    const dishes = await Dish.find({ _id: { $in: dishIds } });

    // Calculate current nutrition
    const currentNutrition = {
      calories: dishes.reduce((sum, d) => sum + d.nutrition.calories, 0),
      protein: dishes.reduce((sum, d) => sum + d.nutrition.protein, 0),
      carbs: dishes.reduce((sum, d) => sum + d.nutrition.carbohydrates, 0),
      fat: dishes.reduce((sum, d) => sum + d.nutrition.fat, 0),
      price: dishes.reduce((sum, d) => sum + d.averagePrice, 0)
    };

    // Generate optimization suggestions based on goal
    let suggestions = [];
    
    switch (goal) {
      case 'lower-calories':
        suggestions = await Dish.find({
          _id: { $nin: dishIds },
          category: { $in: dishes.map(d => d.category) },
          'nutrition.calories': { $lt: Math.min(...dishes.map(d => d.nutrition.calories)) }
        }).limit(5);
        break;

      case 'higher-protein':
        suggestions = await Dish.find({
          _id: { $nin: dishIds },
          category: 'protein',
          'nutrition.protein': { $gt: 15 }
        }).sort({ 'nutrition.protein': -1 }).limit(5);
        break;

      case 'budget-friendly':
        suggestions = await Dish.find({
          _id: { $nin: dishIds },
          averagePrice: { $lt: maxPrice || 5 }
        }).sort({ averagePrice: 1 }).limit(5);
        break;

      default:
        suggestions = await Dish.find({ _id: { $nin: dishIds } })
          .sort({ healthScore: -1 })
          .limit(5);
    }

    res.status(200).json({
      success: true,
      currentMeal: {
        dishes,
        nutrition: currentNutrition
      },
      suggestions: {
        count: suggestions.length,
        dishes: suggestions,
        message: `Suggestions for ${goal || 'balanced meal'}`
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/recommend/complete-meal
 * @desc    Complete a partial meal selection
 * @access  Public
 */
exports.completeMeal = async (req, res, next) => {
  try {
    const { selectedDishes, preferences } = req.body;

    if (!selectedDishes || selectedDishes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one selected dish'
      });
    }

    // Get selected dishes
    const selected = await Dish.find({ _id: { $in: selectedDishes } });

    // Determine what's missing
    const categories = selected.map(d => d.category);
    const needsVegetable = !categories.includes('vegetable');
    const needsProtein = !categories.includes('protein');
    const needsStarch = !categories.includes('starch');

    // Find complementary dishes
    const complementary = [];

    if (needsVegetable) {
      const veggies = await Dish.find({ category: 'vegetable' })
        .sort({ healthScore: -1 })
        .limit(3);
      complementary.push(...veggies);
    }

    if (needsProtein) {
      const proteins = await Dish.find({ category: 'protein' })
        .sort({ 'nutrition.protein': -1 })
        .limit(3);
      complementary.push(...proteins);
    }

    if (needsStarch && preferences?.mealComposition?.includeStarch !== false) {
      const starches = await Dish.find({ category: 'starch' })
        .sort({ healthScore: -1 })
        .limit(2);
      complementary.push(...starches);
    }

    res.status(200).json({
      success: true,
      selectedDishes: selected,
      suggestions: complementary,
      analysis: {
        needsVegetable,
        needsProtein,
        needsStarch
      }
    });
  } catch (error) {
    next(error);
  }
};

