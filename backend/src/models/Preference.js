/**
 * Preference model
 * Stores user dietary preferences and nutritional goals
 */

const mongoose = require('mongoose');

const PreferenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  // Dietary restrictions
  dietaryRestrictions: {
    vegetarian: {
      type: Boolean,
      default: false
    },
    vegan: {
      type: Boolean,
      default: false
    },
    glutenFree: {
      type: Boolean,
      default: false
    },
    halal: {
      type: Boolean,
      default: false
    }
  },

  // Nutritional goals
  nutritionalGoals: {
    goalType: {
      type: String,
      enum: ['weight-loss', 'muscle-gain', 'maintenance', 'balanced'],
      default: 'balanced'
    },
    dailyCalorieTarget: {
      type: Number,
      min: 1000,
      max: 5000,
      default: 2000
    },
    proteinTarget: {
      type: Number, // grams per day
      min: 0,
      max: 300,
      default: 50
    },
    carbTarget: {
      type: Number, // grams per day
      min: 0,
      max: 500,
      default: 250
    },
    fatTarget: {
      type: Number, // grams per day
      min: 0,
      max: 150,
      default: 65
    }
  },

  // Budget constraints
  budgetPreferences: {
    maxPricePerMeal: {
      type: Number,
      min: 0,
      default: 10
    },
    preferBudgetOptions: {
      type: Boolean,
      default: false
    }
  },

  // Taste preferences
  tastePreferences: {
    maxSpicyLevel: {
      type: Number,
      min: 0,
      max: 5,
      default: 5
    },
    preferredCategories: [{
      type: String,
      enum: ['vegetable', 'protein', 'starch', 'combination']
    }],
    dislikedIngredients: [{
      type: String
    }]
  },

  // Health priorities
  healthPriorities: {
    prioritizeHighProtein: {
      type: Boolean,
      default: false
    },
    prioritizeLowCalorie: {
      type: Boolean,
      default: false
    },
    prioritizeLowSodium: {
      type: Boolean,
      default: false
    },
    prioritizeHighFiber: {
      type: Boolean,
      default: false
    }
  },

  // Meal composition preferences
  mealComposition: {
    preferredVegetableCount: {
      type: Number,
      min: 0,
      max: 5,
      default: 2
    },
    preferredProteinCount: {
      type: Number,
      min: 0,
      max: 3,
      default: 1
    },
    includeStarch: {
      type: Boolean,
      default: true
    }
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Preference', PreferenceSchema);

