/**
 * Analysis model
 * Stores image analysis results and identified dishes
 */

const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Image information
  originalImage: {
    filename: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    size: {
      type: Number // bytes
    },
    mimetype: {
      type: String
    }
  },

  // Identified dishes with confidence scores
  identifiedDishes: [{
    dish: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dish',
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      required: true
    },
    boundingBox: {
      x: Number,
      y: Number,
      width: Number,
      height: Number
    }
  }],

  // Overall analysis metadata
  analysisMetadata: {
    processingTime: {
      type: Number // milliseconds
    },
    modelVersion: {
      type: String,
      default: '1.0.0'
    },
    imageQuality: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      default: 'good'
    }
  },

  // Aggregated nutritional summary
  nutritionalSummary: {
    totalCalories: {
      type: Number,
      default: 0
    },
    totalProtein: {
      type: Number,
      default: 0
    },
    totalCarbs: {
      type: Number,
      default: 0
    },
    totalFat: {
      type: Number,
      default: 0
    },
    totalFiber: {
      type: Number,
      default: 0
    },
    estimatedPrice: {
      type: Number,
      default: 0
    }
  },

  // Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },

  error: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate nutritional summary before saving
AnalysisSchema.pre('save', async function(next) {
  if (this.identifiedDishes && this.identifiedDishes.length > 0) {
    try {
      // Populate dish data for calculation
      await this.populate('identifiedDishes.dish');
      
      let totalCalories = 0;
      let totalProtein = 0;
      let totalCarbs = 0;
      let totalFat = 0;
      let totalFiber = 0;
      let estimatedPrice = 0;

      this.identifiedDishes.forEach(item => {
        if (item.dish && item.dish.nutrition) {
          // Weight contribution by confidence score
          const weight = item.confidence;
          totalCalories += item.dish.nutrition.calories * weight;
          totalProtein += item.dish.nutrition.protein * weight;
          totalCarbs += item.dish.nutrition.carbohydrates * weight;
          totalFat += item.dish.nutrition.fat * weight;
          totalFiber += (item.dish.nutrition.fiber || 0) * weight;
          estimatedPrice += item.dish.averagePrice * weight;
        }
      });

      this.nutritionalSummary = {
        totalCalories: Math.round(totalCalories),
        totalProtein: Math.round(totalProtein * 10) / 10,
        totalCarbs: Math.round(totalCarbs * 10) / 10,
        totalFat: Math.round(totalFat * 10) / 10,
        totalFiber: Math.round(totalFiber * 10) / 10,
        estimatedPrice: Math.round(estimatedPrice * 100) / 100
      };
    } catch (error) {
      console.error('Error calculating nutritional summary:', error);
    }
  }
  next();
});

module.exports = mongoose.model('Analysis', AnalysisSchema);

