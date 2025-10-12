/**
 * Dish API Tests
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Dish = require('../models/Dish');

describe('Dish API', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/caipng_test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Dish.deleteMany({});
  });

  describe('GET /api/dishes', () => {
    it('should return all dishes', async () => {
      // Create test dishes
      await Dish.create([
        {
          name: 'Test Dish 1',
          category: 'vegetable',
          nutrition: { calories: 100, protein: 5, carbohydrates: 20, fat: 2 },
          averagePrice: 1.50
        },
        {
          name: 'Test Dish 2',
          category: 'protein',
          nutrition: { calories: 200, protein: 20, carbohydrates: 10, fat: 10 },
          averagePrice: 3.00
        }
      ]);

      const res = await request(app).get('/api/dishes');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
    });

    it('should filter dishes by category', async () => {
      await Dish.create([
        {
          name: 'Vegetable Dish',
          category: 'vegetable',
          nutrition: { calories: 100, protein: 5, carbohydrates: 20, fat: 2 },
          averagePrice: 1.50
        },
        {
          name: 'Protein Dish',
          category: 'protein',
          nutrition: { calories: 200, protein: 20, carbohydrates: 10, fat: 10 },
          averagePrice: 3.00
        }
      ]);

      const res = await request(app).get('/api/dishes?category=vegetable');

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].category).toBe('vegetable');
    });
  });

  describe('GET /api/dishes/:id', () => {
    it('should return a single dish', async () => {
      const dish = await Dish.create({
        name: 'Test Dish',
        category: 'vegetable',
        nutrition: { calories: 100, protein: 5, carbohydrates: 20, fat: 2 },
        averagePrice: 1.50
      });

      const res = await request(app).get(`/api/dishes/${dish._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Test Dish');
    });

    it('should return 404 for non-existent dish', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/dishes/${fakeId}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /api/dishes', () => {
    it('should create a new dish', async () => {
      const dishData = {
        name: 'New Dish',
        category: 'protein',
        nutrition: { calories: 150, protein: 15, carbohydrates: 5, fat: 8 },
        averagePrice: 2.50
      };

      const res = await request(app)
        .post('/api/dishes')
        .send(dishData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('New Dish');
    });
  });
});

