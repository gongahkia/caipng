/**
 * Database Seeder
 * Populates database with initial dish data
 * Run with: npm run seed
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Dish = require('../models/Dish');

// Load env vars
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI);

// Seed data - 50+ common cai fan dishes
const dishes = [
  // VEGETABLES
  {
    name: 'Stir-Fried Bok Choy',
    chineseName: '清炒白菜',
    category: 'vegetable',
    subcategory: 'leafy-green',
    description: 'Fresh bok choy stir-fried with garlic',
    nutrition: { calories: 45, protein: 2.5, carbohydrates: 8, fat: 1.2, fiber: 2.5, sodium: 250 },
    characteristics: { isVegetarian: true, isVegan: true, isGlutenFree: true, spicyLevel: 0 },
    averagePrice: 1.50,
    ingredients: ['bok choy', 'garlic', 'oil'],
    visualFeatures: { dominantColors: ['#2d5016', '#4a7c2a'], textureDescription: 'leafy green vegetable' },
    popularityScore: 85
  },
  {
    name: 'Braised Cabbage',
    chineseName: '红烧卷心菜',
    category: 'vegetable',
    subcategory: 'leafy-green',
    description: 'Tender cabbage braised in savory sauce',
    nutrition: { calories: 55, protein: 2, carbohydrates: 10, fat: 1.5, fiber: 3, sodium: 320 },
    characteristics: { isVegetarian: true, isVegan: false, isGlutenFree: false, spicyLevel: 0 },
    averagePrice: 1.30,
    ingredients: ['cabbage', 'soy sauce', 'oyster sauce'],
    visualFeatures: { dominantColors: ['#d4e6c1', '#8fbc5f'], textureDescription: 'soft braised vegetable' },
    popularityScore: 75
  },
  {
    name: 'Kangkung Belacan',
    chineseName: '马来风光',
    category: 'vegetable',
    subcategory: 'leafy-green',
    description: 'Water spinach stir-fried with spicy shrimp paste',
    nutrition: { calories: 65, protein: 3.5, carbohydrates: 7, fat: 3, fiber: 2.8, sodium: 480 },
    characteristics: { isVegetarian: false, isVegan: false, isGlutenFree: true, spicyLevel: 3 },
    averagePrice: 1.80,
    ingredients: ['kangkung', 'belacan', 'chili', 'garlic'],
    visualFeatures: { dominantColors: ['#2d5016', '#8b0000'], textureDescription: 'leafy with red sauce' },
    popularityScore: 90
  },
  {
    name: 'Stir-Fried Broccoli',
    chineseName: '清炒西兰花',
    category: 'vegetable',
    subcategory: 'leafy-green',
    description: 'Crunchy broccoli florets with garlic',
    nutrition: { calories: 55, protein: 4, carbohydrates: 9, fat: 1, fiber: 4, sodium: 200 },
    characteristics: { isVegetarian: true, isVegan: true, isGlutenFree: true, spicyLevel: 0 },
    averagePrice: 2.00,
    ingredients: ['broccoli', 'garlic', 'oil'],
    visualFeatures: { dominantColors: ['#4a7c2a', '#1a4d0f'], textureDescription: 'tree-like florets' },
    popularityScore: 80
  },
  {
    name: 'French Beans with Minced Pork',
    chineseName: '肉末四季豆',
    category: 'vegetable',
    subcategory: 'root-vegetable',
    description: 'French beans stir-fried with savory minced pork',
    nutrition: { calories: 95, protein: 8, carbohydrates: 10, fat: 4, fiber: 3.5, sodium: 380 },
    characteristics: { isVegetarian: false, isVegan: false, isGlutenFree: false, spicyLevel: 1 },
    averagePrice: 2.20,
    ingredients: ['french beans', 'minced pork', 'soy sauce', 'garlic'],
    visualFeatures: { dominantColors: ['#4a7c2a', '#8b4513'], textureDescription: 'long green beans with meat' },
    popularityScore: 88
  },
  {
    name: 'Eggplant with Garlic Sauce',
    chineseName: '鱼香茄子',
    category: 'vegetable',
    subcategory: 'root-vegetable',
    description: 'Soft eggplant in fragrant garlic sauce',
    nutrition: { calories: 85, protein: 2, carbohydrates: 15, fat: 3.5, fiber: 5, sodium: 420 },
    characteristics: { isVegetarian: true, isVegan: false, isGlutenFree: false, spicyLevel: 2 },
    averagePrice: 1.80,
    ingredients: ['eggplant', 'garlic', 'soy sauce', 'chili'],
    visualFeatures: { dominantColors: ['#614051', '#8b0000'], textureDescription: 'purple soft vegetable' },
    popularityScore: 82
  },
  {
    name: 'Stir-Fried Cauliflower',
    chineseName: '清炒菜花',
    category: 'vegetable',
    subcategory: 'leafy-green',
    description: 'Light and healthy cauliflower florets',
    nutrition: { calories: 50, protein: 3.5, carbohydrates: 8, fat: 1, fiber: 3.5, sodium: 220 },
    characteristics: { isVegetarian: true, isVegan: true, isGlutenFree: true, spicyLevel: 0 },
    averagePrice: 1.70,
    ingredients: ['cauliflower', 'garlic', 'oil'],
    visualFeatures: { dominantColors: ['#f5f5dc', '#e8e8e8'], textureDescription: 'white florets' },
    popularityScore: 70
  },
  {
    name: 'Chye Sim (Baby Cabbage)',
    chineseName: '菜心',
    category: 'vegetable',
    subcategory: 'leafy-green',
    description: 'Tender baby cabbage with oyster sauce',
    nutrition: { calories: 40, protein: 2, carbohydrates: 7, fat: 1, fiber: 2, sodium: 280 },
    characteristics: { isVegetarian: true, isVegan: false, isGlutenFree: false, spicyLevel: 0 },
    averagePrice: 1.50,
    ingredients: ['chye sim', 'oyster sauce', 'garlic'],
    visualFeatures: { dominantColors: ['#4a7c2a', '#90ee90'], textureDescription: 'tender green stalks' },
    popularityScore: 78
  },
  {
    name: 'Bitter Gourd with Egg',
    chineseName: '苦瓜炒蛋',
    category: 'vegetable',
    subcategory: 'root-vegetable',
    description: 'Bitter gourd stir-fried with scrambled eggs',
    nutrition: { calories: 75, protein: 6, carbohydrates: 6, fat: 4, fiber: 2.5, sodium: 310 },
    characteristics: { isVegetarian: true, isVegan: false, isGlutenFree: true, spicyLevel: 0 },
    averagePrice: 1.90,
    ingredients: ['bitter gourd', 'egg', 'soy sauce'],
    visualFeatures: { dominantColors: ['#90ee90', '#fff44f'], textureDescription: 'green with yellow egg' },
    popularityScore: 65
  },
  {
    name: 'Stir-Fried Spinach',
    chineseName: '清炒菠菜',
    category: 'vegetable',
    subcategory: 'leafy-green',
    description: 'Nutritious spinach with garlic',
    nutrition: { calories: 42, protein: 3, carbohydrates: 6, fat: 1.2, fiber: 3, sodium: 240 },
    characteristics: { isVegetarian: true, isVegan: true, isGlutenFree: true, spicyLevel: 0 },
    averagePrice: 1.60,
    ingredients: ['spinach', 'garlic', 'oil'],
    visualFeatures: { dominantColors: ['#2d5016', '#4a7c2a'], textureDescription: 'dark leafy green' },
    popularityScore: 80
  },

  // PROTEINS - CHICKEN
  {
    name: 'Sweet and Sour Chicken',
    chineseName: '糖醋鸡',
    category: 'protein',
    subcategory: 'chicken',
    description: 'Crispy chicken in tangy sweet and sour sauce',
    nutrition: { calories: 245, protein: 18, carbohydrates: 25, fat: 9, fiber: 1, sodium: 520 },
    characteristics: { isVegetarian: false, isVegan: false, isGlutenFree: false, spicyLevel: 0 },
    averagePrice: 3.00,
    ingredients: ['chicken', 'bell peppers', 'pineapple', 'sweet and sour sauce'],
    visualFeatures: { dominantColors: ['#ff6347', '#ffa500'], textureDescription: 'glazed chicken pieces' },
    popularityScore: 92
  },
  {
    name: 'Fried Chicken Cutlet',
    chineseName: '炸鸡排',
    category: 'protein',
    subcategory: 'chicken',
    description: 'Crispy breaded chicken cutlet',
    nutrition: { calories: 280, protein: 22, carbohydrates: 18, fat: 14, fiber: 0.5, sodium: 580 },
    characteristics: { isVegetarian: false, isVegan: false, isGlutenFree: false, spicyLevel: 0 },
    averagePrice: 3.20,
    ingredients: ['chicken', 'breadcrumbs', 'flour', 'egg'],
    visualFeatures: { dominantColors: ['#d2691e', '#8b4513'], textureDescription: 'golden crispy coating' },
    popularityScore: 95
  },
  {
    name: 'Kung Pao Chicken',
    chineseName: '宫保鸡丁',
    category: 'protein',
    subcategory: 'chicken',
    description: 'Spicy chicken with peanuts and dried chilies',
    nutrition: { calories: 220, protein: 19, carbohydrates: 12, fat: 12, fiber: 2, sodium: 650 },
    characteristics: { isVegetarian: false, isVegan: false, isGlutenFree: false, spicyLevel: 4 },
    averagePrice: 2.80,
    ingredients: ['chicken', 'peanuts', 'dried chili', 'soy sauce'],
    visualFeatures: { dominantColors: ['#8b0000', '#d2691e'], textureDescription: 'chicken with red sauce' },
    popularityScore: 88
  },
  {
    name: 'Lemon Chicken',
    chineseName: '柠檬鸡',
    category: 'protein',
    subcategory: 'chicken',
    description: 'Crispy chicken with tangy lemon sauce',
    nutrition: { calories: 235, protein: 20, carbohydrates: 20, fat: 10, fiber: 0.5, sodium: 480 },
    characteristics: { isVegetarian: false, isVegan: false, isGlutenFree: false, spicyLevel: 0 },
    averagePrice: 2.90,
    ingredients: ['chicken', 'lemon', 'flour', 'sugar'],
    visualFeatures: { dominantColors: ['#fff44f', '#d2691e'], textureDescription: 'glazed with lemon sauce' },
    popularityScore: 85
  },
  {
    name: 'Curry Chicken',
    chineseName: '咖喱鸡',
    category: 'protein',
    subcategory: 'chicken',
    description: 'Tender chicken in aromatic curry sauce',
    nutrition: { calories: 210, protein: 18, carbohydrates: 10, fat: 12, fiber: 2, sodium: 580 },
    characteristics: { isVegetarian: false, isVegan: false, isGlutenFree: true, spicyLevel: 2 },
    averagePrice: 2.70,
    ingredients: ['chicken', 'curry powder', 'coconut milk', 'potato'],
    visualFeatures: { dominantColors: ['#ffa500', '#ff8c00'], textureDescription: 'yellow curry sauce' },
    popularityScore: 87
  },
  {
    name: 'Black Pepper Chicken',
    chineseName: '黑椒鸡',
    category: 'protein',
    subcategory: 'chicken',
    description: 'Savory chicken with black pepper sauce',
    nutrition: { calories: 215, protein: 20, carbohydrates: 8, fat: 11, fiber: 1, sodium: 620 },
    characteristics: { isVegetarian: false, isVegan: false, isGlutenFree: false, spicyLevel: 2 },
    averagePrice: 2.80,
    ingredients: ['chicken', 'black pepper', 'bell peppers', 'onion'],
    visualFeatures: { dominantColors: ['#2f4f4f', '#8b4513'], textureDescription: 'dark pepper sauce' },
    popularityScore: 86
  },
  {
    name: 'Teriyaki Chicken',
    chineseName: '照烧鸡',
    category: 'protein',
    subcategory: 'chicken',
    description: 'Glazed chicken in sweet teriyaki sauce',
    nutrition: { calories: 230, protein: 21, carbohydrates: 22, fat: 8, fiber: 0.5, sodium: 720 },
    characteristics: { isVegetarian: false, isVegan: false, isGlutenFree: false, spicyLevel: 0 },
    averagePrice: 2.90,
    ingredients: ['chicken', 'teriyaki sauce', 'sesame seeds'],
    visualFeatures: { dominantColors: ['#8b4513', '#cd853f'], textureDescription: 'glossy brown glaze' },
    popularityScore: 84
  },
  {
    name: 'Sesame Chicken',
    chineseName: '芝麻鸡',
    category: 'protein',
    subcategory: 'chicken',
    description: 'Crispy chicken topped with sesame seeds',
    nutrition: { calories: 255, protein: 19, carbohydrates: 20, fat: 12, fiber: 1.5, sodium: 540 },
    characteristics: { isVegetarian: false, isVegan: false, isGlutenFree: false, spicyLevel: 0 },
    averagePrice: 2.80,
    ingredients: ['chicken', 'sesame seeds', 'honey', 'soy sauce'],
    visualFeatures: { dominantColors: ['#d2691e', '#f0e68c'], textureDescription: 'sesame coated' },
    popularityScore: 83
  },

  // PROTEINS - PORK
  {
    name: 'Braised Pork Belly',
    chineseName: '红烧肉',
    category: 'protein',
    subcategory: 'pork',
    description: 'Melt-in-mouth pork belly in rich sauce',
    nutrition: { calories: 320, protein: 15, carbohydrates: 12, fat: 24, fiber: 0.5, sodium: 680 },
    characteristics: { isVegetarian: false, isVegan: false, isGlutenFree: false, spicyLevel: 0 },
    averagePrice: 3.50,
    ingredients: ['pork belly', 'soy sauce', 'sugar', 'star anise'],
    visualFeatures: { dominantColors: ['#8b4513', '#a0522d'], textureDescription: 'fatty glazed pork' },
    popularityScore: 90
  },
  {
    name: 'Sweet and Sour Pork',
    chineseName: '糖醋排骨',
    category: 'protein',
    subcategory: 'pork',
    description: 'Crispy pork in tangy sauce',
    nutrition: { calories: 265, protein: 16, carbohydrates: 28, fat: 11, fiber: 1, sodium: 540 },
    characteristics: { isVegetarian: false, isVegan: false, isGlutenFree: false, spicyLevel: 0 },
    averagePrice: 3.00,
    ingredients: ['pork', 'bell peppers', 'pineapple', 'vinegar'],
    visualFeatures: { dominantColors: ['#ff6347', '#ffa500'], textureDescription: 'red glazed pork' },
    popularityScore: 91
  },
  {
    name: 'Char Siew (BBQ Pork)',
    chineseName: '叉烧',
    category: 'protein',
    subcategory: 'pork',
    description: 'Sweet and savory barbecue pork',
    nutrition: { calories: 240, protein: 18, carbohydrates: 18, fat: 12, fiber: 0, sodium: 720 },
    characteristics: { isVegetarian: false, isVegan: false, isGlutenFree: false, spicyLevel: 0 },
    averagePrice: 3.20,
    ingredients: ['pork', 'honey', 'five spice', 'soy sauce'],
    visualFeatures: { dominantColors: ['#8b0000', '#cd5c5c'], textureDescription: 'red glazed strips' },
    popularityScore: 93
  },
  {
    name: 'Pork Cutlet',
    chineseName: '炸猪排',
    category: 'protein',
    subcategory: 'pork',
    description: 'Breaded and fried pork cutlet',
    nutrition: { calories: 290, protein: 20, carbohydrates: 20, fat: 15, fiber: 0.5, sodium: 590 },
    characteristics: { isVegetarian: false, isVegan: false, isGlutenFree: false, spicyLevel: 0 },
    averagePrice: 3.30,
    ingredients: ['pork', 'breadcrumbs', 'flour', 'egg'],
    visualFeatures: { dominantColors: ['#d2691e', '#8b4513'], textureDescription: 'golden crispy' },
    popularityScore: 89
  },
  {
    name: 'Ginger Pork',
    chineseName: '姜炒猪肉',
    category: 'protein',
    subcategory: 'pork',
    description: 'Tender pork with aromatic ginger',
    nutrition: { calories: 210, protein: 17, carbohydrates: 8, fat: 13, fiber: 1, sodium: 560 },
    characteristics: { isVegetarian: false, isVegan: false, isGlutenFree: false, spicyLevel: 1 },
    averagePrice: 2.60,
    ingredients: ['pork', 'ginger', 'soy sauce', 'spring onion'],
    visualFeatures: { dominantColors: ['#8b4513', '#daa520'], textureDescription: 'brown with ginger slices' },
    popularityScore: 78
  },

  // PROTEINS - FISH
  {
    name: 'Fried Fish Fillet',
    chineseName: '炸鱼片',
    category: 'protein',
    subcategory: 'fish',
    description: 'Crispy breaded fish fillet',
    nutrition: { calories: 200, protein: 22, carbohydrates: 15, fat: 7, fiber: 0.5, sodium: 450 },
    characteristics: { isVegetarian: false, isVegan: false, isGlutenFree: false, spicyLevel: 0 },
    averagePrice: 2.80,
    ingredients: ['fish', 'breadcrumbs', 'flour', 'egg'],
    visualFeatures: { dominantColors: ['#f5deb3', '#daa520'], textureDescription: 'golden fish fillet' },
    popularityScore: 85
  },
  {
    name: 'Sweet and Sour Fish',
    chineseName: '糖醋鱼',
    category: 'protein',
    subcategory: 'fish',
    description: 'Crispy fish in tangy sweet and sour sauce',
    nutrition: { calories: 220, protein: 20, carbohydrates: 22, fat: 8, fiber: 1, sodium: 480 },
    characteristics: { isVegetarian: false, isVegan: false, isGlutenFree: false, spicyLevel: 0 },
    averagePrice: 3.00,
    ingredients: ['fish', 'bell peppers', 'vinegar', 'sugar'],
    visualFeatures: { dominantColors: ['#ff6347', '#ffa500'], textureDescription: 'red sauce on fish' },
    popularityScore: 87
  },
  {
    name: 'Steamed Fish with Soy Sauce',
    chineseName: '清蒸鱼',
    category: 'protein',
    subcategory: 'fish',
    description: 'Healthy steamed fish with light soy sauce',
    nutrition: { calories: 150, protein: 24, carbohydrates: 3, fat: 5, fiber: 0, sodium: 520 },
    characteristics: { isVegetarian: false, isVegan: false, isGlutenFree: false, spicyLevel: 0 },
    averagePrice: 3.20,
    ingredients: ['fish', 'soy sauce', 'ginger', 'spring onion'],
    visualFeatures: { dominantColors: ['#f5f5dc', '#8b4513'], textureDescription: 'pale steamed fish' },
    popularityScore: 80
  },
  {
    name: 'Curry Fish',
    chineseName: '咖喱鱼',
    category: 'protein',
    subcategory: 'fish',
    description: 'Fish cooked in spicy curry sauce',
    nutrition: { calories: 190, protein: 21, carbohydrates: 9, fat: 8, fiber: 1.5, sodium: 550 },
    characteristics: { isVegetarian: false, isVegan: false, isGlutenFree: true, spicyLevel: 3 },
    averagePrice: 2.90,
    ingredients: ['fish', 'curry powder', 'coconut milk', 'tomato'],
    visualFeatures: { dominantColors: ['#ffa500', '#ff8c00'], textureDescription: 'yellow curry' },
    popularityScore: 82
  },

  // PROTEINS - TOFU & EGG
  {
    name: 'Mapo Tofu',
    chineseName: '麻婆豆腐',
    category: 'protein',
    subcategory: 'tofu',
    description: 'Spicy Sichuan tofu with minced meat',
    nutrition: { calories: 150, protein: 12, carbohydrates: 8, fat: 9, fiber: 2, sodium: 680 },
    characteristics: { isVegetarian: false, isVegan: false, isGlutenFree: false, spicyLevel: 4 },
    averagePrice: 2.20,
    ingredients: ['tofu', 'minced pork', 'chili bean paste', 'sichuan pepper'],
    visualFeatures: { dominantColors: ['#8b0000', '#f5f5dc'], textureDescription: 'white tofu in red sauce' },
    popularityScore: 86
  },
  {
    name: 'Egg Tofu',
    chineseName: '鸡蛋豆腐',
    category: 'protein',
    subcategory: 'tofu',
    description: 'Silky smooth egg tofu in sauce',
    nutrition: { calories: 120, protein: 10, carbohydrates: 6, fat: 7, fiber: 1, sodium: 420 },
    characteristics: { isVegetarian: true, isVegan: false, isGlutenFree: false, spicyLevel: 0 },
    averagePrice: 2.00,
    ingredients: ['egg tofu', 'soy sauce', 'mushroom'],
    visualFeatures: { dominantColors: ['#fff44f', '#f5f5dc'], textureDescription: 'smooth yellow tofu' },
    popularityScore: 78
  },
  {
    name: 'Fried Tofu',
    chineseName: '油炸豆腐',
    category: 'protein',
    subcategory: 'tofu',
    description: 'Crispy fried tofu cubes',
    nutrition: { calories: 135, protein: 11, carbohydrates: 5, fat: 8, fiber: 2, sodium: 380 },
    characteristics: { isVegetarian: true, isVegan: true, isGlutenFree: true, spicyLevel: 0 },
    averagePrice: 1.80,
    ingredients: ['tofu', 'oil'],
    visualFeatures: { dominantColors: ['#d2691e', '#f5f5dc'], textureDescription: 'golden fried cubes' },
    popularityScore: 75
  },
  {
    name: 'Braised Tofu',
    chineseName: '红烧豆腐',
    category: 'protein',
    subcategory: 'tofu',
    description: 'Soft tofu in savory braising sauce',
    nutrition: { calories: 130, protein: 11, carbohydrates: 7, fat: 7, fiber: 2, sodium: 520 },
    characteristics: { isVegetarian: true, isVegan: false, isGlutenFree: false, spicyLevel: 0 },
    averagePrice: 1.90,
    ingredients: ['tofu', 'soy sauce', 'oyster sauce', 'spring onion'],
    visualFeatures: { dominantColors: ['#8b4513', '#f5f5dc'], textureDescription: 'tofu in brown sauce' },
    popularityScore: 76
  },
  {
    name: 'Scrambled Eggs',
    chineseName: '炒鸡蛋',
    category: 'protein',
    subcategory: 'egg',
    description: 'Fluffy scrambled eggs',
    nutrition: { calories: 140, protein: 12, carbohydrates: 2, fat: 10, fiber: 0, sodium: 340 },
    characteristics: { isVegetarian: true, isVegan: false, isGlutenFree: true, spicyLevel: 0 },
    averagePrice: 1.50,
    ingredients: ['egg', 'oil', 'salt'],
    visualFeatures: { dominantColors: ['#fff44f', '#ffd700'], textureDescription: 'yellow fluffy eggs' },
    popularityScore: 82
  },
  {
    name: 'Egg Omelette',
    chineseName: '煎蛋',
    category: 'protein',
    subcategory: 'egg',
    description: 'Simple fried egg omelette',
    nutrition: { calories: 145, protein: 12, carbohydrates: 1, fat: 11, fiber: 0, sodium: 320 },
    characteristics: { isVegetarian: true, isVegan: false, isGlutenFree: true, spicyLevel: 0 },
    averagePrice: 1.40,
    ingredients: ['egg', 'oil'],
    visualFeatures: { dominantColors: ['#fff44f', '#ffa500'], textureDescription: 'golden flat omelette' },
    popularityScore: 80
  },
  {
    name: 'Tomato Scrambled Eggs',
    chineseName: '番茄炒蛋',
    category: 'protein',
    subcategory: 'egg',
    description: 'Classic Chinese home-style eggs with tomato',
    nutrition: { calories: 155, protein: 11, carbohydrates: 8, fat: 10, fiber: 1.5, sodium: 360 },
    characteristics: { isVegetarian: true, isVegan: false, isGlutenFree: true, spicyLevel: 0 },
    averagePrice: 1.80,
    ingredients: ['egg', 'tomato', 'sugar', 'spring onion'],
    visualFeatures: { dominantColors: ['#ff6347', '#fff44f'], textureDescription: 'red and yellow mix' },
    popularityScore: 88
  },

  // STARCHES
  {
    name: 'Steamed White Rice',
    chineseName: '白饭',
    category: 'starch',
    subcategory: 'rice',
    description: 'Fluffy steamed jasmine rice',
    nutrition: { calories: 130, protein: 2.7, carbohydrates: 28, fat: 0.3, fiber: 0.4, sodium: 1 },
    characteristics: { isVegetarian: true, isVegan: true, isGlutenFree: true, spicyLevel: 0 },
    averagePrice: 0.50,
    ingredients: ['white rice', 'water'],
    visualFeatures: { dominantColors: ['#ffffff', '#f5f5dc'], textureDescription: 'white fluffy grains' },
    popularityScore: 98
  },
  {
    name: 'Brown Rice',
    chineseName: '糙米饭',
    category: 'starch',
    subcategory: 'rice',
    description: 'Nutritious whole grain brown rice',
    nutrition: { calories: 112, protein: 2.6, carbohydrates: 24, fat: 0.9, fiber: 1.8, sodium: 2 },
    characteristics: { isVegetarian: true, isVegan: true, isGlutenFree: true, spicyLevel: 0 },
    averagePrice: 0.80,
    ingredients: ['brown rice', 'water'],
    visualFeatures: { dominantColors: ['#8b4513', '#a0522d'], textureDescription: 'brown whole grains' },
    popularityScore: 75
  },
  {
    name: 'Fried Rice',
    chineseName: '炒饭',
    category: 'starch',
    subcategory: 'rice',
    description: 'Savory fried rice with egg and vegetables',
    nutrition: { calories: 190, protein: 5, carbohydrates: 32, fat: 4.5, fiber: 1, sodium: 480 },
    characteristics: { isVegetarian: true, isVegan: false, isGlutenFree: false, spicyLevel: 0 },
    averagePrice: 2.50,
    ingredients: ['rice', 'egg', 'soy sauce', 'vegetables'],
    visualFeatures: { dominantColors: ['#daa520', '#8b4513'], textureDescription: 'golden fried rice' },
    popularityScore: 90
  },
  {
    name: 'Chicken Rice',
    chineseName: '鸡饭',
    category: 'starch',
    subcategory: 'rice',
    description: 'Fragrant rice cooked in chicken broth',
    nutrition: { calories: 160, protein: 4, carbohydrates: 30, fat: 2.5, fiber: 0.5, sodium: 380 },
    characteristics: { isVegetarian: false, isVegan: false, isGlutenFree: true, spicyLevel: 0 },
    averagePrice: 1.00,
    ingredients: ['rice', 'chicken broth', 'garlic', 'ginger'],
    visualFeatures: { dominantColors: ['#f5f5dc', '#daa520'], textureDescription: 'slightly yellow rice' },
    popularityScore: 92
  },
  {
    name: 'Yellow Noodles',
    chineseName: '黄面',
    category: 'starch',
    subcategory: 'noodle',
    description: 'Fresh egg noodles',
    nutrition: { calories: 138, protein: 4.5, carbohydrates: 25, fat: 2, fiber: 1.2, sodium: 280 },
    characteristics: { isVegetarian: true, isVegan: false, isGlutenFree: false, spicyLevel: 0 },
    averagePrice: 0.80,
    ingredients: ['wheat flour', 'egg', 'water'],
    visualFeatures: { dominantColors: ['#ffd700', '#daa520'], textureDescription: 'yellow noodle strands' },
    popularityScore: 85
  },
  {
    name: 'Bee Hoon (Rice Vermicelli)',
    chineseName: '米粉',
    category: 'starch',
    subcategory: 'noodle',
    description: 'Thin rice noodles',
    nutrition: { calories: 109, protein: 1.8, carbohydrates: 25, fat: 0.2, fiber: 1, sodium: 6 },
    characteristics: { isVegetarian: true, isVegan: true, isGlutenFree: true, spicyLevel: 0 },
    averagePrice: 0.70,
    ingredients: ['rice flour', 'water'],
    visualFeatures: { dominantColors: ['#ffffff', '#f5f5dc'], textureDescription: 'white thin noodles' },
    popularityScore: 88
  },
  {
    name: 'Fried Noodles',
    chineseName: '炒面',
    category: 'starch',
    subcategory: 'noodle',
    description: 'Stir-fried noodles with vegetables',
    nutrition: { calories: 200, protein: 6, carbohydrates: 35, fat: 4.5, fiber: 2, sodium: 520 },
    characteristics: { isVegetarian: true, isVegan: false, isGlutenFree: false, spicyLevel: 0 },
    averagePrice: 2.30,
    ingredients: ['noodles', 'soy sauce', 'vegetables', 'egg'],
    visualFeatures: { dominantColors: ['#8b4513', '#daa520'], textureDescription: 'dark fried noodles' },
    popularityScore: 87
  },

  // COMBINATION DISHES
  {
    name: 'Mixed Vegetables',
    chineseName: '杂菜',
    category: 'combination',
    subcategory: 'mixed',
    description: 'Assorted stir-fried vegetables',
    nutrition: { calories: 70, protein: 3, carbohydrates: 12, fat: 2, fiber: 4, sodium: 320 },
    characteristics: { isVegetarian: true, isVegan: true, isGlutenFree: true, spicyLevel: 0 },
    averagePrice: 2.00,
    ingredients: ['mixed vegetables', 'garlic', 'oyster sauce'],
    visualFeatures: { dominantColors: ['#4a7c2a', '#ff6347', '#ffa500'], textureDescription: 'colorful vegetables' },
    popularityScore: 80
  },
  {
    name: 'Sambal Long Beans',
    chineseName: '参巴豆角',
    category: 'vegetable',
    subcategory: 'root-vegetable',
    description: 'Long beans in spicy sambal sauce',
    nutrition: { calories: 80, protein: 3, carbohydrates: 11, fat: 3.5, fiber: 3, sodium: 450 },
    characteristics: { isVegetarian: true, isVegan: true, isGlutenFree: true, spicyLevel: 3 },
    averagePrice: 1.70,
    ingredients: ['long beans', 'sambal', 'belacan', 'garlic'],
    visualFeatures: { dominantColors: ['#4a7c2a', '#8b0000'], textureDescription: 'green beans with red sauce' },
    popularityScore: 84
  },
  {
    name: 'Potato Curry',
    chineseName: '咖喱土豆',
    category: 'vegetable',
    subcategory: 'root-vegetable',
    description: 'Soft potatoes in curry sauce',
    nutrition: { calories: 110, protein: 2, carbohydrates: 20, fat: 3, fiber: 2.5, sodium: 380 },
    characteristics: { isVegetarian: true, isVegan: true, isGlutenFree: true, spicyLevel: 2 },
    averagePrice: 1.50,
    ingredients: ['potato', 'curry powder', 'coconut milk', 'onion'],
    visualFeatures: { dominantColors: ['#ffa500', '#ff8c00'], textureDescription: 'yellow curry with potatoes' },
    popularityScore: 81
  },
  {
    name: 'Stir-Fried Luncheon Meat',
    chineseName: '炒午餐肉',
    category: 'protein',
    subcategory: 'pork',
    description: 'Fried spam with vegetables',
    nutrition: { calories: 180, protein: 7, carbohydrates: 6, fat: 15, fiber: 0.5, sodium: 820 },
    characteristics: { isVegetarian: false, isVegan: false, isGlutenFree: true, spicyLevel: 0 },
    averagePrice: 2.00,
    ingredients: ['luncheon meat', 'vegetables', 'soy sauce'],
    visualFeatures: { dominantColors: ['#ff69b4', '#cd5c5c'], textureDescription: 'pink meat cubes' },
    popularityScore: 78
  },
  {
    name: 'Salted Egg Yolk Prawns',
    chineseName: '咸蛋黄虾',
    category: 'protein',
    subcategory: 'fish',
    description: 'Crispy prawns in salted egg yolk sauce',
    nutrition: { calories: 210, protein: 18, carbohydrates: 12, fat: 11, fiber: 0.5, sodium: 680 },
    characteristics: { isVegetarian: false, isVegan: false, isGlutenFree: false, spicyLevel: 0 },
    averagePrice: 3.80,
    ingredients: ['prawns', 'salted egg yolk', 'curry leaves', 'butter'],
    visualFeatures: { dominantColors: ['#ffd700', '#ff69b4'], textureDescription: 'golden coated prawns' },
    popularityScore: 91
  },
  {
    name: 'Salted Fish Fried Rice',
    chineseName: '咸鱼炒饭',
    category: 'starch',
    subcategory: 'rice',
    description: 'Fried rice with aromatic salted fish',
    nutrition: { calories: 210, protein: 7, carbohydrates: 33, fat: 6, fiber: 1, sodium: 720 },
    characteristics: { isVegetarian: false, isVegan: false, isGlutenFree: false, spicyLevel: 0 },
    averagePrice: 2.80,
    ingredients: ['rice', 'salted fish', 'egg', 'spring onion'],
    visualFeatures: { dominantColors: ['#daa520', '#8b4513'], textureDescription: 'golden rice with fish bits' },
    popularityScore: 82
  },
  {
    name: 'Otah',
    chineseName: '乌达',
    category: 'protein',
    subcategory: 'fish',
    description: 'Grilled spicy fish cake',
    nutrition: { calories: 120, protein: 12, carbohydrates: 8, fat: 5, fiber: 1, sodium: 480 },
    characteristics: { isVegetarian: false, isVegan: false, isGlutenFree: true, spicyLevel: 2 },
    averagePrice: 1.50,
    ingredients: ['fish paste', 'coconut milk', 'spices', 'banana leaf'],
    visualFeatures: { dominantColors: ['#ff6347', '#ffa500'], textureDescription: 'orange grilled fish cake' },
    popularityScore: 86
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing dishes
    await Dish.deleteMany({});
    console.log('🗑️  Cleared existing dishes');

    // Insert seed data
    const createdDishes = await Dish.insertMany(dishes);
    console.log(`✅ Successfully seeded ${createdDishes.length} dishes`);

    // Print summary
    const categories = await Dish.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    console.log('\n📊 Seeding Summary:');
    categories.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} dishes`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();

