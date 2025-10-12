# API Examples & Testing

Collection of example API requests for testing the cAI-png backend.

## Base URL
```
http://localhost:5000/api
```

## Health Check

```bash
curl http://localhost:5000/health
```

**Response:**
```json
{
  "success": true,
  "message": "cAI-png server is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## Dishes API

### Get All Dishes

```bash
curl http://localhost:5000/api/dishes
```

### Get Dishes with Filters

```bash
# Filter by category
curl "http://localhost:5000/api/dishes?category=vegetable"

# Filter vegetarian dishes
curl "http://localhost:5000/api/dishes?vegetarian=true"

# Filter with calorie limit
curl "http://localhost:5000/api/dishes?maxCalories=150"

# Pagination
curl "http://localhost:5000/api/dishes?page=2&limit=10"

# Sort by protein (descending)
curl "http://localhost:5000/api/dishes?sortBy=nutrition.protein&order=desc"
```

### Get Dish by ID

```bash
curl http://localhost:5000/api/dishes/DISH_ID_HERE
```

### Search Dishes

```bash
curl "http://localhost:5000/api/dishes/search?q=chicken"
```

### Get Categories

```bash
curl http://localhost:5000/api/dishes/categories
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": ["vegetable", "protein", "starch", "combination"],
    "subcategories": ["chicken", "pork", "fish", "tofu", "egg", "leafy-green", "rice", "noodle"]
  }
}
```

### Create Dish (Admin)

```bash
curl -X POST http://localhost:5000/api/dishes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Garlic Broccoli",
    "chineseName": "蒜蓉西兰花",
    "category": "vegetable",
    "subcategory": "leafy-green",
    "description": "Fresh broccoli with garlic",
    "nutrition": {
      "calories": 60,
      "protein": 4,
      "carbohydrates": 10,
      "fat": 1.5,
      "fiber": 4,
      "sodium": 200
    },
    "characteristics": {
      "isVegetarian": true,
      "isVegan": true,
      "isGlutenFree": true,
      "spicyLevel": 0
    },
    "averagePrice": 1.80,
    "ingredients": ["broccoli", "garlic", "oil"]
  }'
```

---

## Upload & Analysis API

### Upload Image

```bash
curl -X POST http://localhost:5000/api/upload \
  -F "image=@/path/to/your/image.jpg"
```

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "original": {
      "filename": "image-1234567890.jpg",
      "path": "/uploads/image-1234567890.jpg",
      "size": 2048000,
      "mimetype": "image/jpeg"
    },
    "optimized": {
      "path": "/uploads/image-1234567890_optimized.jpeg",
      "size": 512000,
      "compressionRatio": "75.00%"
    },
    "thumbnail": {
      "path": "/uploads/image-1234567890_thumb.jpg"
    },
    "analysis": {
      "quality": "good",
      "dominantColors": ["#4a7c2a", "#8b4513"],
      "dimensions": { "width": 1920, "height": 1080 }
    }
  }
}
```

### Analyze Image

```bash
curl -X POST http://localhost:5000/api/analyze \
  -F "image=@/path/to/dish-photo.jpg"
```

**Response:**
```json
{
  "success": true,
  "message": "Image analyzed successfully",
  "data": {
    "analysisId": "507f1f77bcf86cd799439011",
    "identifiedDishes": [
      {
        "dish": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Stir-Fried Bok Choy",
          "category": "vegetable",
          "nutrition": {
            "calories": 45,
            "protein": 2.5,
            "carbohydrates": 8,
            "fat": 1.2
          },
          "averagePrice": 1.50
        },
        "confidence": 0.87,
        "boundingBox": { "x": 100, "y": 50, "width": 200, "height": 150 }
      },
      {
        "dish": {
          "_id": "507f1f77bcf86cd799439013",
          "name": "Sweet and Sour Chicken",
          "category": "protein",
          "nutrition": {
            "calories": 245,
            "protein": 18,
            "carbohydrates": 25,
            "fat": 9
          },
          "averagePrice": 3.00
        },
        "confidence": 0.92,
        "boundingBox": { "x": 350, "y": 80, "width": 180, "height": 160 }
      }
    ],
    "nutritionalSummary": {
      "totalCalories": 290,
      "totalProtein": 20.5,
      "totalCarbs": 33,
      "totalFat": 10.2,
      "estimatedPrice": 4.50
    },
    "metadata": {
      "processingTime": 1523,
      "modelVersion": "1.0.0",
      "imageQuality": "good"
    },
    "status": "completed"
  }
}
```

### Get Analysis by ID

```bash
curl http://localhost:5000/api/analyze/507f1f77bcf86cd799439011
```

---

## Recommendation API

### Generate Recommendations

```bash
curl -X POST http://localhost:5000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": {
      "dietaryRestrictions": {
        "vegetarian": false,
        "vegan": false,
        "glutenFree": false
      },
      "nutritionalGoals": {
        "goalType": "balanced",
        "dailyCalorieTarget": 2000,
        "proteinTarget": 50,
        "carbTarget": 250,
        "fatTarget": 65
      },
      "budgetPreferences": {
        "maxPricePerMeal": 10
      },
      "mealComposition": {
        "preferredVegetableCount": 2,
        "preferredProteinCount": 1,
        "includeStarch": true
      }
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "dishes": [
        { "_id": "...", "name": "Stir-Fried Bok Choy", "category": "vegetable" },
        { "_id": "...", "name": "Sweet and Sour Chicken", "category": "protein" },
        { "_id": "...", "name": "Steamed White Rice", "category": "starch" }
      ],
      "score": 87.5,
      "nutritionalSummary": {
        "totalCalories": 420,
        "totalProtein": 25.2,
        "totalCarbs": 61,
        "totalFat": 12.7,
        "totalFiber": 3.9
      },
      "estimatedPrice": 6.00
    }
  ]
}
```

### Get Similar Dishes

```bash
curl "http://localhost:5000/api/recommend/similar/507f1f77bcf86cd799439012?limit=5"
```

### Optimize Meal

```bash
curl -X POST http://localhost:5000/api/recommend/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "dishIds": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"],
    "goal": "lower-calories",
    "maxPrice": 8
  }'
```

### Complete Meal

```bash
curl -X POST http://localhost:5000/api/recommend/complete-meal \
  -H "Content-Type: application/json" \
  -d '{
    "selectedDishes": ["507f1f77bcf86cd799439012"],
    "preferences": {
      "mealComposition": {
        "preferredVegetableCount": 2,
        "preferredProteinCount": 1,
        "includeStarch": true
      }
    }
  }'
```

---

## User API

### Register User

```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Login

```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Current User (Protected)

```bash
TOKEN="your_jwt_token_here"

curl http://localhost:5000/api/users/me \
  -H "Authorization: Bearer $TOKEN"
```

### Add to Favorites (Protected)

```bash
curl -X POST http://localhost:5000/api/users/favorites/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer $TOKEN"
```

### Get Favorites (Protected)

```bash
curl http://localhost:5000/api/users/favorites \
  -H "Authorization: Bearer $TOKEN"
```

---

## Preferences API

### Set Preferences

```bash
curl -X POST http://localhost:5000/api/preferences \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "507f1f77bcf86cd799439011",
    "dietaryRestrictions": {
      "vegetarian": true,
      "vegan": false,
      "glutenFree": false
    },
    "nutritionalGoals": {
      "goalType": "weight-loss",
      "dailyCalorieTarget": 1800,
      "proteinTarget": 80,
      "carbTarget": 180,
      "fatTarget": 50
    },
    "budgetPreferences": {
      "maxPricePerMeal": 8,
      "preferBudgetOptions": true
    },
    "tastePreferences": {
      "maxSpicyLevel": 3,
      "dislikedIngredients": ["bitter gourd"]
    },
    "healthPriorities": {
      "prioritizeHighProtein": true,
      "prioritizeLowCalorie": true
    },
    "mealComposition": {
      "preferredVegetableCount": 2,
      "preferredProteinCount": 1,
      "includeStarch": false
    }
  }'
```

### Get Preferences

```bash
curl http://localhost:5000/api/preferences/507f1f77bcf86cd799439011
```

---

## Testing with Postman

### Import Collection

Create a Postman collection with these requests:

1. Open Postman
2. Click "Import"
3. Choose "Raw text"
4. Paste the collection JSON below
5. Click "Import"

```json
{
  "info": {
    "name": "cAI-png API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/health"
      }
    },
    {
      "name": "Get All Dishes",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/dishes"
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000"
    }
  ]
}
```

---

## Load Testing

### Using Apache Bench

```bash
# Test dish listing endpoint
ab -n 1000 -c 10 http://localhost:5000/api/dishes

# Test with keepalive
ab -n 1000 -c 10 -k http://localhost:5000/api/dishes
```

### Using Artillery

```bash
# Install Artillery
npm install -g artillery

# Create test config
cat > artillery-test.yml << EOF
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - flow:
      - get:
          url: "/api/dishes"
      - get:
          url: "/api/dishes/categories"
EOF

# Run test
artillery run artillery-test.yml
```

---

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Validation error message"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error

```json
{
  "success": false,
  "error": "Server Error"
}
```

---

For more examples, check the [API Documentation](./README.md#api-documentation).

