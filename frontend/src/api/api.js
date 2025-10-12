/**
 * API Service
 * Handles all API calls to the backend
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('caipng_user') || '{}');
  if (user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Dishes API
export const dishesAPI = {
  getAll: (params) => api.get('/dishes', { params }),
  getById: (id) => api.get(`/dishes/${id}`),
  search: (query) => api.get('/dishes/search', { params: { q: query } }),
  getCategories: () => api.get('/dishes/categories'),
};

// Upload API
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadMultiple: (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return api.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Analysis API
export const analysisAPI = {
  analyzeImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getAnalysis: (id) => api.get(`/analyze/${id}`),
  getUserAnalyses: (userId, params) => api.get(`/analyze/user/${userId}`, { params }),
  deleteAnalysis: (id) => api.delete(`/analyze/${id}`),
};

// Recommendation API
export const recommendationAPI = {
  getRecommendations: (data) => api.post('/recommend', data),
  getSimilarDishes: (dishId, limit) => api.get(`/recommend/similar/${dishId}`, { params: { limit } }),
  optimizeMeal: (data) => api.post('/recommend/optimize', data),
  completeMeal: (data) => api.post('/recommend/complete-meal', data),
};

// User API
export const userAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  getMe: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  getFavorites: () => api.get('/users/favorites'),
  addFavorite: (dishId) => api.post(`/users/favorites/${dishId}`),
  removeFavorite: (dishId) => api.delete(`/users/favorites/${dishId}`),
};

// Preferences API
export const preferencesAPI = {
  setPreferences: (data) => api.post('/preferences', data),
  getPreferences: (userId) => api.get(`/preferences/${userId}`),
  updateDietary: (data) => api.put('/preferences/dietary', data),
  updateNutritionalGoals: (data) => api.put('/preferences/nutritional-goals', data),
  updateBudget: (data) => api.put('/preferences/budget', data),
  deletePreferences: () => api.delete('/preferences'),
};

export default api;

