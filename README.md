[![](https://img.shields.io/badge/caipng_1.0.0-passing-green)](https://github.com/gongahkia/caipng/releases/tag/1.0.0)

# `cAI-png`

[Cai Fan](https://en.wikipedia.org/wiki/Economy_rice) Suggestion Web App, built atop a [Dish Recommendation Model](#architecture) and [Computer Vision](https://www.ibm.com/think/topics/computer-vision) Engine. See the available [backend](#architecture) endpoints [here](#api-reference).

<div align="center">
  <img src="./asset/logo/caifan.jpg" width="65%">
</div>

## Stack

* *Frontend*: [React 18](https://react.dev/), [Vite 4](https://vitejs.dev/), [Material-UI 5](https://mui.com/), [React Router 6](https://reactrouter.com/), [Chart.js](https://www.chartjs.org/), [Framer Motion](https://www.framer.com/motion/), [Axios](https://axios-http.com/), [React Context API](https://react.dev/reference/react/useContext)
* *Backend*: [Node.js 18+](https://nodejs.org/), [Express.js](https://expressjs.com/), [Mongoose ODM](https://mongoosejs.com/), [Multer](https://github.com/expressjs/multer), [Sharp](https://sharp.pixelplumbing.com/), [JWT](https://jwt.io/)
* *Database*: [MongoDB 6](https://www.mongodb.com/)
* *Computer Vision*: [TensorFlow.js](https://www.tensorflow.org/js)
* *Security*: [Helmet](https://helmetjs.github.io/), [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
* *Testing*: [Jest](https://jestjs.io/) (Backend), [Vitest](https://vitest.dev/) (Frontend), [React Testing Library](https://testing-library.com/react)
* *Infrastructure*: [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/)

## Usage

The below instructions are for locally hosting `cAI-png`.

1. First execute the below.

```console
$ git clone https://github.com/gongahkia/caipng.git && cd caipng
```

2. Set up MongoDB. You can either:
    1. **Local MongoDB Installation**
        1. macOS: `brew install mongodb-community@6.0 && brew services start mongodb-community@6.0`
        2. Ubuntu: Follow [MongoDB Ubuntu Installation Guide](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/)
        3. Windows: Download installer from [mongodb.com/download-center/community](https://www.mongodb.com/try/download/community)
    2. **MongoDB Atlas (Cloud)**
        1. Visit https://www.mongodb.com/cloud/atlas
        2. Create free account and cluster (M0 free tier)
        3. Get connection string from "Connect" → "Connect your application"
        4. Use this connection string in next step

3. Then create environment variables. For backend, create `backend/.env`:

```env
# Application Configuration
NODE_ENV=development
PORT=5000

# Database Configuration (choose one)
# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/caipng

# Option 2: MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/caipng

# Authentication & Security
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

For frontend, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_MAX_IMAGE_SIZE=10485760
```

4. Install dependencies and seed database:

```console
$ cd backend && npm install
$ npm run seed
$ cd ../frontend && npm install
$ cd ..
```

5. Finally run the development servers. Open two terminal windows:

**Terminal 1 (Backend):**
```console
$ cd backend && npm run dev
```

**Terminal 2 (Frontend):**
```console
$ cd frontend && npm run dev
```

6. Alternatively, use Docker Compose to run everything:

```console
$ docker-compose up -d
$ docker-compose exec backend npm run seed
```

7. Or use the Makefile for convenience:

```console
$ make install
$ make docker-up
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## Architecture

`cAI-png` is structured as a full-stack MERN application with Express.js backend API, React frontend with image upload capabilities, and MongoDB for data persistence. The system uses a simplified computer vision pipeline for dish identification and a multi-criteria recommendation engine for meal suggestions.

### System Context Diagram

```mermaid
C4Context
    title System Context Diagram for cAI-png

    Person(user, "User", "Uploads cai fan images and receives personalized meal recommendations")

    System(web_app, "cAI-png Web Application", "React SPA with image upload and recommendation display")
    System(backend_api, "Backend API", "Express.js server handling dish analysis and recommendations")
    System(database, "MongoDB Database", "Stores dishes, analyses, user preferences, and favorites")
    
    System_Ext(image_processor, "Image Processing", "Sharp library for image optimization")
    System_Ext(vision_service, "Vision Service", "Computer vision for dish identification")

    Rel(user, web_app, "Uploads images, sets preferences", "HTTPS")
    Rel(web_app, backend_api, "Makes API calls", "REST API")
    Rel(backend_api, database, "Queries and stores data", "MongoDB Protocol")
    Rel(backend_api, image_processor, "Processes uploaded images", "Library")
    Rel(backend_api, vision_service, "Analyzes dish images", "Internal Service")
```

### Container Diagram

```mermaid
C4Container
    title Container Diagram for cAI-png

    Person(user, "User")

    Container_Boundary(caipng_system, "cAI-png System") {
        Container(react_app, "React Frontend", "React 18, Vite, MUI", "SPA with image upload and meal recommendations")
        Container(express_api, "Express Backend", "Node.js, Express", "REST API with file upload and authentication")
        Container(vision_service, "Vision Service", "TensorFlow.js, Image Processing", "Dish identification from images")
        Container(recommendation_engine, "Recommendation Engine", "TypeScript, Scoring Algorithm", "Generates personalized meal combinations")
        ContainerDb(mongodb, "MongoDB", "NoSQL Database", "Stores dishes, users, preferences, analyses")
    }

    Rel(user, react_app, "Interacts with", "HTTPS")
    Rel(react_app, express_api, "API calls", "REST/JSON")
    Rel(express_api, vision_service, "Analyzes images")
    Rel(express_api, recommendation_engine, "Generates recommendations")
    Rel(express_api, mongodb, "Reads/Writes", "Mongoose ODM")
    Rel(vision_service, mongodb, "Fetches dish features", "Mongoose ODM")
```

### Image Analysis Flow

```mermaid
C4Component
    title Image Analysis Component Flow

    Person(user, "User", "Uploads cai fan dish photo")

    Container_Boundary(backend_system, "Backend System") {
        Component(upload_controller, "Upload Controller", "Express.js", "Handles multipart file upload")
        Component(image_processor, "Image Processor", "Sharp", "Optimizes and creates thumbnails")
        Component(vision_service, "Vision Service", "Computer Vision", "Identifies dishes in image")
        Component(dish_matcher, "Dish Matcher", "Pattern Matching", "Matches visual features to dish database")
        Component(nutrition_calculator, "Nutrition Calculator", "Aggregator", "Sums nutritional values")
    }

    Container_Boundary(data_layer, "Data Layer") {
        ComponentDb(mongodb, "MongoDB", "Database", "Dish library with visual features")
        ComponentDb(uploads_storage, "File Storage", "Disk", "Uploaded images")
    }

    Rel(user, upload_controller, "POST /api/analyze + image", "multipart/form-data")
    Rel(upload_controller, image_processor, "Process image")
    Rel(image_processor, uploads_storage, "Save files")
    
    Rel(upload_controller, vision_service, "Analyze image")
    Rel(vision_service, dish_matcher, "Extract features")
    Rel(dish_matcher, mongodb, "Query dish features")
    Rel(dish_matcher, vision_service, "Return matched dishes")
    
    Rel(vision_service, nutrition_calculator, "Calculate totals")
    Rel(nutrition_calculator, upload_controller, "Return analysis")
    Rel(upload_controller, user, "Return identified dishes + nutrition", "JSON")
```

### Recommendation Generation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant API as Express API
    participant Pref as Preference Store
    participant Rec as Recommendation Engine
    participant DB as Dish Database

    U->>API: POST /api/recommend (preferences)
    API->>Pref: Fetch user preferences
    Pref->>API: Return preferences
    
    API->>DB: Query available dishes
    DB->>API: Return all dishes
    
    API->>Rec: Generate combinations
    Rec->>Rec: Filter by dietary restrictions
    Rec->>Rec: Generate meal combinations
    
    loop For each combination
        Rec->>Rec: Calculate nutrition scores
        Rec->>Rec: Calculate budget score
        Rec->>Rec: Calculate variety score
        Rec->>Rec: Calculate health score
        Rec->>Rec: Compute total score
    end
    
    Rec->>Rec: Sort by score (descending)
    Rec->>Rec: Take top 10 recommendations
    Rec->>API: Return recommendations
    
    API->>U: Return ranked meal suggestions
```

### Data Model

```mermaid
erDiagram
    USERS ||--o{ PREFERENCES : has
    USERS ||--o{ FAVORITES : has
    USERS ||--o{ ANALYSES : creates
    DISHES ||--o{ FAVORITES : "in"
    DISHES ||--o{ ANALYSIS_DISHES : "identified in"
    ANALYSES ||--o{ ANALYSIS_DISHES : contains
    
    USERS {
        ObjectId _id PK
        string name
        string email UK
        string password "bcrypt hashed"
        array favoriteDishes "Array of Dish IDs"
        timestamp createdAt
        timestamp updatedAt
    }
    
    DISHES {
        ObjectId _id PK
        string name
        string chineseName
        enum category "vegetable, protein, starch, combination"
        string subcategory
        string description
        object nutrition "calories, protein, carbs, fat, fiber, sodium"
        object characteristics "vegetarian, vegan, glutenFree, spicy"
        decimal averagePrice
        array ingredients
        object visualFeatures "dominantColors, textureDescription"
        int healthScore
        int popularityScore
        timestamp createdAt
    }
    
    PREFERENCES {
        ObjectId _id PK
        ObjectId userId FK
        object dietaryRestrictions "vegetarian, vegan, glutenFree, halal"
        object nutritionalGoals "goalType, targets"
        object budgetPreferences "maxPricePerMeal, preferBudgetOptions"
        object tastePreferences "maxSpicyLevel, dislikedIngredients"
        object healthPriorities "prioritizeHighProtein, prioritizeLowCalorie"
        object mealComposition "preferredVegetableCount, preferredProteinCount"
        timestamp createdAt
        timestamp updatedAt
    }
    
    ANALYSES {
        ObjectId _id PK
        ObjectId userId FK "optional"
        string imageUrl
        array identifiedDishes "Array of identified dish objects"
        object nutritionalSummary "totals"
        object metadata "processingTime, modelVersion"
        enum status "completed, failed, processing"
        timestamp createdAt
    }
```

## API Reference

### Base URL
- **Development**: `http://localhost:5000`
- **Production**: `https://api.caipng.example.com`

### Endpoints

#### Health Check
```http
GET /health
```

**Response**:
```json
{
  "success": true,
  "message": "cAI-png server is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

#### Get All Dishes
```http
GET /api/dishes?category=vegetable&vegetarian=true&page=1&limit=20
```

**Query Parameters**:
- `category` - Filter by category (vegetable, protein, starch, combination)
- `vegetarian` - Filter vegetarian dishes (true/false)
- `maxCalories` - Maximum calories
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sortBy` - Sort field (e.g., nutrition.protein)
- `order` - Sort order (asc/desc)

**Response**:
```json
{
  "success": true,
  "count": 10,
  "totalPages": 3,
  "currentPage": 1,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Stir-Fried Bok Choy",
      "chineseName": "清炒白菜",
      "category": "vegetable",
      "nutrition": {
        "calories": 45,
        "protein": 2.5,
        "carbohydrates": 8,
        "fat": 1.2,
        "fiber": 2.5,
        "sodium": 250
      },
      "characteristics": {
        "isVegetarian": true,
        "isVegan": true,
        "isGlutenFree": true
      },
      "averagePrice": 1.50,
      "healthScore": 85
    }
  ]
}
```

#### Search Dishes
```http
GET /api/dishes/search?q=chicken
```

#### Analyze Image
```http
POST /api/analyze
Content-Type: multipart/form-data

image: <file>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "analysisId": "507f1f77bcf86cd799439011",
    "identifiedDishes": [
      {
        "dish": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Sweet and Sour Chicken",
          "category": "protein",
          "nutrition": { "calories": 245, "protein": 18 }
        },
        "confidence": 0.87,
        "boundingBox": { "x": 100, "y": 50, "width": 200, "height": 150 }
      }
    ],
    "nutritionalSummary": {
      "totalCalories": 450,
      "totalProtein": 25,
      "totalCarbs": 45,
      "totalFat": 15,
      "estimatedPrice": 7.50
    },
    "metadata": {
      "processingTime": 1523,
      "imageQuality": "good"
    }
  }
}
```

#### Generate Recommendations
```http
POST /api/recommend
Content-Type: application/json

{
  "preferences": {
    "dietaryRestrictions": {
      "vegetarian": true
    },
    "nutritionalGoals": {
      "goalType": "weight-loss",
      "dailyCalorieTarget": 1800
    },
    "budgetPreferences": {
      "maxPricePerMeal": 8
    },
    "mealComposition": {
      "preferredVegetableCount": 2,
      "preferredProteinCount": 1,
      "includeStarch": true
    }
  }
}
```

**Response**:
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "dishes": [
        { "name": "Stir-Fried Bok Choy", "category": "vegetable" },
        { "name": "Braised Tofu", "category": "protein" },
        { "name": "Brown Rice", "category": "starch" }
      ],
      "score": 87.5,
      "nutritionalSummary": {
        "totalCalories": 420,
        "totalProtein": 22,
        "totalCarbs": 58,
        "totalFat": 10
      },
      "estimatedPrice": 6.00
    }
  ]
}
```

#### User Authentication
```http
POST /api/users/register
POST /api/users/login
GET /api/users/me (requires auth)
POST /api/users/favorites/:dishId (requires auth)
DELETE /api/users/favorites/:dishId (requires auth)
```

#### Preferences Management
```http
POST /api/preferences
GET /api/preferences/:userId
PUT /api/preferences/dietary
PUT /api/preferences/nutritional-goals
PUT /api/preferences/budget
```
