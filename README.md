[![](https://img.shields.io/badge/caipng_1.0.0-passing-green)](https://github.com/gongahkia/caipng/releases/tag/1.0.0)

# `cAI-png` 🍱

> **AI-Powered Cai Fan Dish Recommendation System**

A full-stack web application that uses computer vision to analyze cai fan dishes and provides personalized meal recommendations based on dietary preferences and nutritional goals.

## Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Computer Vision**: TensorFlow.js (simplified implementation)
- **Image Processing**: Sharp, Multer
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **UI Framework**: Material-UI (MUI)
- **State Management**: React Context API with useReducer
- **HTTP Client**: Axios
- **Charts**: Chart.js with react-chartjs-2
- **Animations**: Framer Motion
- **File Upload**: react-dropzone

### DevOps
- **Containerization**: Docker & Docker Compose
- **Testing**: Jest (Backend), Vitest (Frontend)
- **Linting**: ESLint

## Features

✨ **Image Analysis**
- Upload photos of cai fan dishes
- AI-powered dish identification with confidence scores
- Automatic nutritional calculation

🎯 **Smart Recommendations**
- Personalized meal combinations
- Algorithm considers dietary restrictions, nutritional goals, and budget
- Scoring system for recommendation quality

⚙️ **Customizable Preferences**
- Dietary restrictions (vegetarian, vegan, gluten-free, halal)
- Nutritional goals (weight loss, muscle gain, balanced)
- Budget constraints
- Meal composition preferences

📊 **Nutritional Tracking**
- Detailed macro breakdown (protein, carbs, fat)
- Visual charts and progress bars
- Compare against daily goals

🗄️ **Extensive Dish Database**
- 50+ common cai fan dishes
- Detailed nutritional information
- Search and filter functionality
- Health scores and popularity ratings

## Architecture

```
cai-png/
├── backend/                    # Node.js Express API
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth, upload, error handling
│   │   ├── utils/             # Vision service, recommendation engine
│   │   ├── config/            # Database configuration
│   │   └── server.js          # App entry point
│   ├── uploads/               # Uploaded images
│   └── package.json
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── context/           # React Context for state
│   │   ├── api/               # API service layer
│   │   └── main.jsx           # App entry point
│   └── package.json
│
├── docker-compose.yml          # Docker orchestration
└── README.md
```

## Quick Start (10 Minutes Setup)

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git

### Option 1: Docker Setup (Recommended)

```bash
# Clone repository
git clone https://github.com/yourusername/caipng.git
cd caipng

# Start all services with Docker Compose
docker-compose up -d

# Seed database
docker-compose exec backend npm run seed

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# MongoDB: localhost:27017
```

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp ../.env.example .env
# Edit .env with your MongoDB URI and settings

# Seed database
npm run seed

# Start development server
npm run dev

# Backend runs on http://localhost:5000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional)
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev

# Frontend runs on http://localhost:3000
```

### MongoDB Setup

**Local MongoDB:**
```bash
# Install MongoDB
# macOS with Homebrew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# MongoDB runs on localhost:27017
```

**MongoDB Atlas (Cloud):**
1. Create free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in backend `.env`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Dishes

```http
GET    /dishes              # Get all dishes (with pagination and filters)
GET    /dishes/:id          # Get dish by ID
GET    /dishes/search?q=    # Search dishes
GET    /dishes/categories   # Get all categories
POST   /dishes              # Create new dish (admin)
PUT    /dishes/:id          # Update dish (admin)
DELETE /dishes/:id          # Delete dish (admin)
```

**Example Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "name": "Stir-Fried Bok Choy",
      "chineseName": "清炒白菜",
      "category": "vegetable",
      "nutrition": {
        "calories": 45,
        "protein": 2.5,
        "carbohydrates": 8,
        "fat": 1.2
      },
      "averagePrice": 1.50,
      "healthScore": 85
    }
  ]
}
```

#### Upload & Analysis

```http
POST /upload                # Upload single image
POST /upload/multiple       # Upload multiple images
POST /analyze               # Analyze image for dishes
GET  /analyze/:id           # Get analysis by ID
```

**Example Request:**
```bash
curl -X POST \
  http://localhost:5000/api/analyze \
  -F "image=@/path/to/dish.jpg"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "analysisId": "...",
    "identifiedDishes": [
      {
        "dish": { /* dish object */ },
        "confidence": 0.87,
        "boundingBox": { "x": 100, "y": 50, "width": 200, "height": 150 }
      }
    ],
    "nutritionalSummary": {
      "totalCalories": 450,
      "totalProtein": 25,
      "totalCarbs": 45,
      "totalFat": 15
    }
  }
}
```

#### Recommendations

```http
POST /recommend                  # Generate recommendations
GET  /recommend/similar/:dishId  # Get similar dishes
POST /recommend/optimize         # Optimize meal combination
POST /recommend/complete-meal    # Complete partial meal selection
```

**Example Request:**
```json
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
    }
  }
}
```

#### Users (Authentication)

```http
POST /users/register         # Register new user
POST /users/login            # Login user
GET  /users/me               # Get current user (protected)
PUT  /users/me               # Update profile (protected)
GET  /users/favorites        # Get favorites (protected)
POST /users/favorites/:id    # Add to favorites (protected)
DELETE /users/favorites/:id  # Remove from favorites (protected)
```

#### Preferences

```http
POST /preferences               # Create/update preferences
GET  /preferences/:userId       # Get user preferences
PUT  /preferences/dietary       # Update dietary restrictions
PUT  /preferences/nutritional-goals  # Update nutritional goals
PUT  /preferences/budget        # Update budget preferences
DELETE /preferences             # Delete preferences
```

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- dish.test.js
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with UI
npm test -- --ui
```

## Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/caipng

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
VITE_MAX_IMAGE_SIZE=10485760
```

## Deployment

### Backend Deployment (Railway/Render)

1. **Railway.app**
```bash
# Install Railway CLI
npm install -g railway

# Login
railway login

# Initialize project
railway init

# Add MongoDB plugin
railway add

# Set environment variables in Railway dashboard

# Deploy
railway up
```

2. **Render.com**
- Create new Web Service
- Connect GitHub repository
- Build Command: `cd backend && npm install`
- Start Command: `cd backend && npm start`
- Add environment variables
- Add MongoDB (create database service)

### Frontend Deployment (Vercel/Netlify)

1. **Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Follow prompts to configure
```

2. **Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
cd frontend
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Environment Configuration

**Production Environment Variables:**
- Update `MONGODB_URI` with production database
- Change `JWT_SECRET` to a strong random value
- Set `CORS_ORIGIN` to your frontend domain
- Update `VITE_API_URL` to backend production URL

## Development Workflow

### Adding a New Dish

```bash
# Connect to MongoDB
mongosh

# Use database
use caipng

# Insert dish
db.dishes.insertOne({
  name: "New Dish",
  chineseName: "新菜",
  category: "vegetable",
  nutrition: {
    calories: 60,
    protein: 3,
    carbohydrates: 12,
    fat: 1
  },
  characteristics: {
    isVegetarian: true,
    isVegan: true
  },
  averagePrice: 1.80,
  ingredients: ["ingredient1", "ingredient2"]
})
```

### Modifying the Recommendation Algorithm

Edit `/backend/src/utils/recommendationEngine.js`:

```javascript
// Adjust scoring weights
calculateCombinationScore(combination, preferences) {
  let score = 0;
  
  // Modify these weights to prioritize different factors
  const CALORIE_WEIGHT = 30;
  const PROTEIN_WEIGHT = 20;
  const PRICE_WEIGHT = 15;
  
  // Add custom scoring logic
  // ...
  
  return score;
}
```

### Customizing the Vision Service

Edit `/backend/src/utils/visionService.js`:

```javascript
// Adjust feature matching logic
matchDishes(imageFeatures) {
  // Modify confidence calculation
  // Integrate actual ML model here
  // ...
}
```

## Troubleshooting

### Common Issues

**MongoDB Connection Error**
```bash
# Check MongoDB is running
mongosh

# If not running
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

**Port Already in Use**
```bash
# Find process using port
lsof -i :5000  # Backend
lsof -i :3000  # Frontend

# Kill process
kill -9 <PID>
```

**CORS Errors**
- Ensure `CORS_ORIGIN` in backend `.env` matches frontend URL
- Check browser console for specific error

**Image Upload Failing**
- Verify `uploads` directory exists: `mkdir backend/uploads`
- Check file size doesn't exceed `MAX_FILE_SIZE`
- Ensure file type is allowed (JPEG, PNG, WEBP)

## Future Enhancements

- [ ] Actual trained CNN model for dish recognition
- [ ] User meal history and analytics
- [ ] Social features (share meals, follow users)
- [ ] Mobile app (React Native)
- [ ] Restaurant integration API
- [ ] Barcode scanning for packaged items
- [ ] Meal planning calendar
- [ ] Shopping list generation
- [ ] Multi-language support
- [ ] Voice input for preferences
- [ ] Integration with fitness trackers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Inspired by the vibrant cai fan culture in Singapore
- Built as a learning project for full-stack development
- Special thanks to the open-source community

## Reference

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [TensorFlow.js Guide](https://www.tensorflow.org/js)
- [Material-UI Components](https://mui.com/)

---

**Made with ❤️ for cai fan lovers**

For questions or support, please open an issue on GitHub.
