# cAI-png Setup Guide

Complete step-by-step guide to get the cAI-png application running locally.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Quick Setup (10 minutes)](#quick-setup)
3. [Detailed Setup](#detailed-setup)
4. [Troubleshooting](#troubleshooting)
5. [Next Steps](#next-steps)

## System Requirements

### Required
- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher (comes with Node.js)
- **MongoDB**: Version 6.0 or higher (local or Atlas)
- **Git**: Latest version

### Optional
- **Docker**: For containerized deployment
- **Docker Compose**: For multi-container setup

### Check Your System

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version (should be 9+)
npm --version

# Check Git version
git --version

# Check if MongoDB is installed (optional if using Docker/Atlas)
mongosh --version
```

## Quick Setup

### Option 1: Using Docker (Easiest)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/caipng.git
cd caipng

# 2. Start all services
docker-compose up -d

# 3. Wait for services to start (30 seconds)
# Check status
docker-compose ps

# 4. Seed the database
docker-compose exec backend npm run seed

# 5. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# MongoDB: localhost:27017

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: Manual Setup

If you prefer not to use Docker, follow the [Detailed Setup](#detailed-setup) below.

## Detailed Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/caipng.git
cd caipng
```

### Step 2: MongoDB Setup

#### Option A: Local MongoDB

**macOS:**
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community@6.0

# Start MongoDB service
brew services start mongodb-community@6.0

# Verify it's running
mongosh
# Should connect successfully
# Type 'exit' to quit
```

**Ubuntu/Debian:**
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
mongosh
```

**Windows:**
1. Download installer from [mongodb.com/download-center/community](https://www.mongodb.com/try/download/community)
2. Run installer and follow wizard
3. MongoDB runs as Windows Service automatically

#### Option B: MongoDB Atlas (Cloud)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create new cluster (free tier M0)
4. Wait for cluster creation (2-3 minutes)
5. Click "Connect" → "Connect your application"
6. Copy connection string
7. Replace `<password>` with your database user password
8. Use this connection string in next step

### Step 3: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies (this may take 2-3 minutes)
npm install

# Create environment file
cp ../.env.example .env

# Edit .env file with your settings
nano .env  # or use any text editor
```

**Edit `.env` file:**
```env
NODE_ENV=development
PORT=5000

# If using local MongoDB:
MONGODB_URI=mongodb://localhost:27017/caipng

# If using MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/caipng

JWT_SECRET=your_super_secret_key_change_this_to_something_random
JWT_EXPIRE=7d
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

**Seed the database:**
```bash
npm run seed

# You should see:
# ✅ Successfully seeded 50+ dishes
# 📊 Seeding Summary:
#    vegetable: 10 dishes
#    protein: 25 dishes
#    starch: 7 dishes
#    combination: 8 dishes
```

**Start backend server:**
```bash
npm run dev

# You should see:
# 🚀 cAI-png server running in development mode on port 5000
# ✅ MongoDB Connected: localhost
# ✅ Vision service initialized
```

Keep this terminal open.

### Step 4: Frontend Setup

Open a **new terminal** window/tab:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (this may take 3-4 minutes)
npm install

# Create environment file (optional)
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev

# You should see:
# VITE v4.x.x  ready in xxx ms
# ➜  Local:   http://localhost:3000/
# ➜  Network: use --host to expose
```

### Step 5: Verify Installation

1. **Open browser** to `http://localhost:3000`
2. You should see the cAI-png homepage with:
   - Navigation bar at top
   - Hero section with "cAI-png 🍱"
   - Feature cards
   - "How It Works" section

3. **Test the application:**
   - Click "Start Analyzing"
   - Try uploading an image (any food image)
   - Click "Analyze Image"
   - Should see identified dishes

4. **Check API:**
   - Visit `http://localhost:5000/health`
   - Should see: `{"success":true,"message":"cAI-png server is running"}`

## Troubleshooting

### MongoDB Connection Issues

**Error: "MongoServerError: Authentication failed"**
```bash
# Solution 1: Use connection string without auth
MONGODB_URI=mongodb://localhost:27017/caipng

# Solution 2: Create user in MongoDB
mongosh
use admin
db.createUser({
  user: "caipng",
  pwd: "password123",
  roles: ["readWrite", "dbAdmin"]
})
exit

# Update .env
MONGODB_URI=mongodb://caipng:password123@localhost:27017/caipng
```

**Error: "MongooseServerSelectionError: connect ECONNREFUSED"**
```bash
# MongoDB is not running
# macOS:
brew services start mongodb-community@6.0

# Linux:
sudo systemctl start mongod

# Windows: Check Services app for MongoDB service
```

### Port Already in Use

**Error: "Port 5000 is already in use"**
```bash
# Find and kill process
# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Windows (Command Prompt as Admin):
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Error: "Port 3000 is already in use"**
```bash
# Same as above but for port 3000
lsof -ti:3000 | xargs kill -9
```

### npm Install Failures

**Error: "EACCES: permission denied"**
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config

# Then retry
npm install
```

**Error: "sharp install failed"**
```bash
# Install build tools
# macOS:
xcode-select --install

# Ubuntu:
sudo apt-get install -y build-essential

# Then retry in backend directory
npm install sharp --force
```

### Frontend Build Errors

**Error: "Cannot find module '@mui/material'"**
```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Image Upload Not Working

```bash
# Create uploads directory manually
cd backend
mkdir -p uploads
chmod 755 uploads
```

### Database Seeding Fails

```bash
# Clear existing data and reseed
mongosh
use caipng
db.dishes.deleteMany({})
exit

cd backend
npm run seed
```

## Next Steps

### 1. Set Your Preferences
- Navigate to `/preferences`
- Set dietary restrictions
- Configure nutritional goals
- Save preferences

### 2. Try the Features
- **Analyze**: Upload food images
- **Recommendations**: Get meal suggestions
- **Dishes**: Browse the database
- **Preferences**: Customize settings

### 3. Explore the API
```bash
# Get all dishes
curl http://localhost:5000/api/dishes

# Get categories
curl http://localhost:5000/api/dishes/categories

# Search dishes
curl "http://localhost:5000/api/dishes/search?q=chicken"
```

### 4. Development Tools

**Backend:**
```bash
# Run tests
npm test

# Watch mode for development
npm run dev

# Check linting
npm run lint
```

**Frontend:**
```bash
# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

### 5. Optional Enhancements

**Add Sample Images:**
```bash
# Download sample cai fan images
mkdir backend/samples
# Add images to samples directory
# Use them for testing
```

**Enable Hot Reload:**
Already enabled! Edit any file and see changes automatically.

**Database GUI:**
```bash
# Install MongoDB Compass
# Download from: https://www.mongodb.com/products/compass
# Connect to: mongodb://localhost:27017
```

## Production Deployment

See [Deployment Guide](./DEPLOYMENT.md) for production setup instructions.

## Support

If you encounter issues not covered here:

1. Check the [main README](./README.md)
2. Search [GitHub Issues](https://github.com/yourusername/caipng/issues)
3. Create a new issue with:
   - Error message
   - Steps to reproduce
   - System information (OS, Node version)
   - Logs from terminal

## Summary Checklist

- [ ] Node.js 18+ installed
- [ ] MongoDB installed and running
- [ ] Repository cloned
- [ ] Backend dependencies installed
- [ ] Backend `.env` configured
- [ ] Database seeded
- [ ] Backend server running on port 5000
- [ ] Frontend dependencies installed
- [ ] Frontend server running on port 3000
- [ ] Application accessible at http://localhost:3000
- [ ] API responding at http://localhost:5000/health

**Setup Time:** 10-15 minutes
**Congratulations!** 🎉 You're ready to use cAI-png!

---

Need help? Open an issue on GitHub or check the troubleshooting section.

