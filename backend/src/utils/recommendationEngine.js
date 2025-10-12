/**
 * Recommendation Engine
 * Generates optimal dish combinations based on user preferences,
 * nutritional goals, and dietary restrictions
 */

const Dish = require('../models/Dish');
const Preference = require('../models/Preference');

/**
 * Generate meal recommendations based on preferences and goals
 */
class RecommendationEngine {
  /**
   * Generate recommendations for a user
   * @param {Object} preferences - User preferences object
   * @param {Array} excludeDishes - Dish IDs to exclude
   * @returns {Array} - Recommended meal combinations
   */
  async generateRecommendations(preferences, excludeDishes = []) {
    try {
      // Fetch all available dishes
      let dishes = await Dish.find({
        _id: { $nin: excludeDishes }
      }).lean();

      // Filter dishes based on dietary restrictions
      dishes = this.filterByDietaryRestrictions(dishes, preferences);

      // Filter by taste preferences
      dishes = this.filterByTastePreferences(dishes, preferences);

      // Generate multiple meal combinations
      const mealCombinations = this.generateMealCombinations(dishes, preferences);

      // Score each combination
      const scoredCombinations = mealCombinations.map(combo => ({
        dishes: combo,
        score: this.calculateCombinationScore(combo, preferences),
        nutritionalSummary: this.calculateNutrition(combo),
        estimatedPrice: this.calculatePrice(combo)
      }));

      // Sort by score and return top recommendations
      const topRecommendations = scoredCombinations
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      return topRecommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw new Error('Failed to generate recommendations');
    }
  }

  /**
   * Filter dishes by dietary restrictions
   */
  filterByDietaryRestrictions(dishes, preferences) {
    const { dietaryRestrictions } = preferences;

    if (!dietaryRestrictions) return dishes;

    return dishes.filter(dish => {
      if (dietaryRestrictions.vegan && !dish.characteristics.isVegan) {
        return false;
      }
      if (dietaryRestrictions.vegetarian && !dish.characteristics.isVegetarian) {
        return false;
      }
      if (dietaryRestrictions.glutenFree && !dish.characteristics.isGlutenFree) {
        return false;
      }
      return true;
    });
  }

  /**
   * Filter dishes by taste preferences
   */
  filterByTastePreferences(dishes, preferences) {
    const { tastePreferences } = preferences;

    if (!tastePreferences) return dishes;

    return dishes.filter(dish => {
      // Filter by spicy level
      if (tastePreferences.maxSpicyLevel !== undefined) {
        if (dish.characteristics.spicyLevel > tastePreferences.maxSpicyLevel) {
          return false;
        }
      }

      // Filter by disliked ingredients
      if (tastePreferences.dislikedIngredients && tastePreferences.dislikedIngredients.length > 0) {
        const hasDislikedIngredient = dish.ingredients.some(ingredient =>
          tastePreferences.dislikedIngredients.some(disliked =>
            ingredient.toLowerCase().includes(disliked.toLowerCase())
          )
        );
        if (hasDislikedIngredient) return false;
      }

      return true;
    });
  }

  /**
   * Generate meal combinations
   */
  generateMealCombinations(dishes, preferences) {
    const { mealComposition } = preferences;
    const combinations = [];

    // Separate dishes by category
    const vegetables = dishes.filter(d => d.category === 'vegetable');
    const proteins = dishes.filter(d => d.category === 'protein');
    const starches = dishes.filter(d => d.category === 'starch');

    // Default composition if not specified
    const vegCount = mealComposition?.preferredVegetableCount || 2;
    const proteinCount = mealComposition?.preferredProteinCount || 1;
    const includeStarch = mealComposition?.includeStarch !== false;

    // Generate combinations
    const maxCombinations = 50; // Limit to prevent excessive computation

    for (let i = 0; i < maxCombinations; i++) {
      const combination = [];

      // Add vegetables
      const selectedVegs = this.randomSelect(vegetables, vegCount);
      combination.push(...selectedVegs);

      // Add proteins
      const selectedProteins = this.randomSelect(proteins, proteinCount);
      combination.push(...selectedProteins);

      // Add starch if preferred
      if (includeStarch && starches.length > 0) {
        const selectedStarch = this.randomSelect(starches, 1);
        combination.push(...selectedStarch);
      }

      // Only add if combination has dishes
      if (combination.length > 0) {
        combinations.push(combination);
      }
    }

    // Remove duplicate combinations
    return this.removeDuplicateCombinations(combinations);
  }

  /**
   * Randomly select N items from array without repetition
   */
  randomSelect(array, count) {
    if (!array || array.length === 0) return [];
    
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, array.length));
  }

  /**
   * Remove duplicate combinations
   */
  removeDuplicateCombinations(combinations) {
    const unique = [];
    const seen = new Set();

    for (const combo of combinations) {
      const key = combo.map(d => d._id.toString()).sort().join(',');
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(combo);
      }
    }

    return unique;
  }

  /**
   * Calculate score for a meal combination
   */
  calculateCombinationScore(combination, preferences) {
    let score = 0;
    const nutrition = this.calculateNutrition(combination);
    const { nutritionalGoals, healthPriorities, budgetPreferences } = preferences;

    // Score based on nutritional goals
    if (nutritionalGoals) {
      // Calorie alignment
      const calorieTarget = nutritionalGoals.dailyCalorieTarget / 3; // Per meal
      const calorieDiff = Math.abs(nutrition.totalCalories - calorieTarget);
      score += Math.max(0, 30 - (calorieDiff / 50)); // Max 30 points

      // Protein alignment
      const proteinTarget = nutritionalGoals.proteinTarget / 3;
      const proteinDiff = Math.abs(nutrition.totalProtein - proteinTarget);
      score += Math.max(0, 20 - proteinDiff); // Max 20 points

      // Goal-specific scoring
      if (nutritionalGoals.goalType === 'weight-loss') {
        score += nutrition.totalCalories < calorieTarget ? 10 : 0;
        score += nutrition.totalFiber > 5 ? 5 : 0;
      } else if (nutritionalGoals.goalType === 'muscle-gain') {
        score += nutrition.totalProtein > proteinTarget ? 15 : 0;
      }
    }

    // Score based on health priorities
    if (healthPriorities) {
      if (healthPriorities.prioritizeHighProtein && nutrition.totalProtein > 20) {
        score += 10;
      }
      if (healthPriorities.prioritizeLowCalorie && nutrition.totalCalories < 500) {
        score += 10;
      }
      if (healthPriorities.prioritizeHighFiber && nutrition.totalFiber > 7) {
        score += 10;
      }
    }

    // Score based on budget
    const totalPrice = this.calculatePrice(combination);
    if (budgetPreferences) {
      if (totalPrice <= budgetPreferences.maxPricePerMeal) {
        score += 15;
      } else {
        score -= (totalPrice - budgetPreferences.maxPricePerMeal) * 2;
      }
    }

    // Score based on variety (different categories)
    const categories = new Set(combination.map(d => d.category));
    score += categories.size * 5; // More variety = higher score

    // Score based on health scores of dishes
    const avgHealthScore = combination.reduce((sum, d) => sum + d.healthScore, 0) / combination.length;
    score += avgHealthScore / 5; // Max 20 points

    // Score based on popularity
    const avgPopularity = combination.reduce((sum, d) => sum + d.popularityScore, 0) / combination.length;
    score += avgPopularity / 10; // Max 10 points

    return Math.round(score * 10) / 10;
  }

  /**
   * Calculate total nutrition for a combination
   */
  calculateNutrition(combination) {
    const totals = {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalFiber: 0,
      totalSodium: 0
    };

    combination.forEach(dish => {
      totals.totalCalories += dish.nutrition.calories;
      totals.totalProtein += dish.nutrition.protein;
      totals.totalCarbs += dish.nutrition.carbohydrates;
      totals.totalFat += dish.nutrition.fat;
      totals.totalFiber += dish.nutrition.fiber || 0;
      totals.totalSodium += dish.nutrition.sodium || 0;
    });

    // Round to 1 decimal place
    Object.keys(totals).forEach(key => {
      totals[key] = Math.round(totals[key] * 10) / 10;
    });

    return totals;
  }

  /**
   * Calculate total price for a combination
   */
  calculatePrice(combination) {
    const total = combination.reduce((sum, dish) => sum + dish.averagePrice, 0);
    return Math.round(total * 100) / 100;
  }

  /**
   * Get recommendations for similar dishes
   * @param {String} dishId - Reference dish ID
   * @param {Number} limit - Number of recommendations
   * @returns {Array} - Similar dishes
   */
  async getSimilarDishes(dishId, limit = 5) {
    try {
      const referenceDish = await Dish.findById(dishId);
      if (!referenceDish) {
        throw new Error('Reference dish not found');
      }

      // Find similar dishes based on category, nutrition, and characteristics
      const similarDishes = await Dish.find({
        _id: { $ne: dishId },
        category: referenceDish.category
      }).limit(limit * 2).lean();

      // Score similarity
      const scored = similarDishes.map(dish => ({
        dish,
        similarity: this.calculateSimilarity(referenceDish, dish)
      }));

      // Sort by similarity and return top matches
      return scored
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit)
        .map(item => item.dish);
    } catch (error) {
      console.error('Error getting similar dishes:', error);
      throw error;
    }
  }

  /**
   * Calculate similarity between two dishes
   */
  calculateSimilarity(dish1, dish2) {
    let similarity = 0;

    // Category match
    if (dish1.category === dish2.category) similarity += 30;
    if (dish1.subcategory === dish2.subcategory) similarity += 20;

    // Nutritional similarity
    const caloriesDiff = Math.abs(dish1.nutrition.calories - dish2.nutrition.calories);
    similarity += Math.max(0, 20 - (caloriesDiff / 20));

    const proteinDiff = Math.abs(dish1.nutrition.protein - dish2.nutrition.protein);
    similarity += Math.max(0, 15 - proteinDiff);

    // Characteristics similarity
    if (dish1.characteristics.isVegetarian === dish2.characteristics.isVegetarian) similarity += 10;
    if (dish1.characteristics.isVegan === dish2.characteristics.isVegan) similarity += 5;

    return similarity;
  }
}

module.exports = new RecommendationEngine();

