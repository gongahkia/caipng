[![](https://img.shields.io/badge/caipng_1.0.0-passing-green)](https://github.com/gongahkia/caipng/releases/tag/1.0.0)

# `cAI-png`

[Cai Fan](https://en.wikipedia.org/wiki/Economy_rice) Suggestion Web App, built atop a [Dish Recommendation Model](#architecture) and [Computer Vision](https://www.ibm.com/think/topics/computer-vision) Engine. See the available [backend](#architecture) endpoints [here](#api-reference).

<div align="center">
  <img src="./asset/logo/caifan.jpg" width="65%">
</div>

## Stack

* Frontend: React 18, Vite 4 (single page, minimal styling)
* Backend: Node.js 18+, Express.js, Mongoose, Sharp
* Database: MongoDB 6 (dish reference data only)
* Computer Vision: Heuristic color/texture features (Sharp) with tfjs-node scaffolding
* LLM: Gemini (Google Generative AI) free API (text-only; no images sent)
* Infrastructure: Docker, Docker Compose

## Usage

The below instructions are for locally hosting `cAI-png` V2 live analysis.

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

## LLM Configuration
# Gemini (Google AI Studio) Free API Key
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
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
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## Architecture

V2 focuses on a live webcam pipeline: the browser captures frames, the backend runs heuristic detection and returns bounding boxes with confidences at ~5–10 FPS, and a derived text summary is sent to Gemini to estimate macros. No images are sent to LLM.

### System Context Diagram

```mermaid
C4Context
    title System Context Diagram for cAI-png

    Person(user, "User", "Uploads cai fan images and receives personalized meal recommendations")

  System(web_app, "cAI-png Web Application", "React SPA with live webcam overlay")
  System(backend_api, "Backend API", "Express.js server handling live frame analysis and LLM macros")
  System(database, "MongoDB Database", "Stores dish reference data only")
    
  System_Ext(image_processor, "Image Processing", "Sharp-based feature extraction")
  System_Ext(vision_service, "Vision Service", "Heuristic matching for dish/categories")
  System_Ext(llm, "Gemini LLM", "Text-only macro estimation")

    Rel(user, web_app, "Uploads images, sets preferences", "HTTPS")
    Rel(web_app, backend_api, "Makes API calls", "REST API")
    Rel(backend_api, database, "Queries and stores data", "MongoDB Protocol")
    Rel(backend_api, image_processor, "Processes uploaded images", "Library")
  Rel(backend_api, vision_service, "Analyzes frames")
  Rel(backend_api, llm, "Text prompt with derived detections")
```

### Container Diagram

```mermaid
C4Container
    title Container Diagram for cAI-png

    Person(user, "User")

    Container_Boundary(caipng_system, "cAI-png System") {
  Container(react_app, "React Frontend", "React 18, Vite", "Single live page with webcam and overlay")
  Container(express_api, "Express Backend", "Node.js, Express", "REST API for live analyze + macros")
  Container(vision_service, "Vision Service", "Sharp heuristics", "Frame analysis with boxes/confidences")
  ContainerDb(mongodb, "MongoDB", "NoSQL Database", "Stores dish reference data")
    }

    Rel(user, react_app, "Interacts with", "HTTPS")
    Rel(react_app, express_api, "API calls", "REST/JSON")
    Rel(express_api, vision_service, "Analyzes images")
  Rel(express_api, mongodb, "Reads dish data", "Mongoose ODM")
  Rel(vision_service, mongodb, "Fetches dish features", "Mongoose ODM")
```

### Live Analysis Flow

```mermaid
C4Component
    title Image Analysis Component Flow

  Person(user, "User", "Holds plate in front of webcam")

    Container_Boundary(backend_system, "Backend System") {
  Component(live_controller, "Live Controller", "Express.js", "Accepts frames, returns boxes+confidences")
  Component(image_processor, "Image Processor", "Sharp", "Extracts features")
  Component(vision_service, "Vision Service", "Heuristics", "Identifies likely dishes/categories")
    }

    Container_Boundary(data_layer, "Data Layer") {
        ComponentDb(mongodb, "MongoDB", "Database", "Dish library with visual features")
        ComponentDb(uploads_storage, "File Storage", "Disk", "Uploaded images")
    }

  Rel(user, live_controller, "POST /api/live/analyze (base64 frame)", "JSON")
  Rel(live_controller, image_processor, "Extract features")
  Rel(image_processor, uploads_storage, "Temp files (optional)")
  Rel(live_controller, vision_service, "Analyze frame")
  Rel(live_controller, user, "Return boxes + confidences", "JSON")
```

### Macros Estimation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant API as Express API
    participant Pref as Preference Store
    participant Rec as Recommendation Engine
    participant DB as Dish Database

  participant U as User
  participant API as Express API
  participant LLM as Gemini

  U->>API: POST /api/live/macros (derived text: labels + avg confidences)
  API->>LLM: Prompt with derived text (no images)
  LLM->>API: JSON with macros + narrative
  API->>U: Return macros summary
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

#### Live Analyze Frame
```http
POST /api/live/analyze
Content-Type: application/json

{
  "imageBase64": "data:image/jpeg;base64,..."
}
```

Response:
```json
{
  "success": true,
  "detections": [
    { "label": "vegetable", "confidence": 0.76, "box": { "x": 100, "y": 60, "width": 180, "height": 140 } }
  ]
}
```

#### Estimate Macros (LLM)
```http
POST /api/live/macros
Content-Type: application/json

{
  "derivedText": "Detected items (rolling):\nvegetable: avgConfidence=78%\nprotein: avgConfidence=65%\n"
}
```

Response:
```json
{
  "success": true,
  "macros": { "calories": 640, "protein": 28, "carbs": 70, "fat": 20 },
  "narrative": "Estimated based on detected categories and common portions."
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
