import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  updatePassword: (passwordData) => api.put('/auth/update-password', passwordData),
  logout: () => api.post('/auth/logout'),
};

// Users API (Admin only)
export const usersAPI = {
  getAllUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  getDashboardStats: () => api.get('/users/dashboard/stats'),
};

// Stores API
export const storesAPI = {
  getAllStores: (params) => api.get('/stores', { params }),
  getStoreById: (id) => api.get(`/stores/${id}`),
  createStore: (storeData) => api.post('/stores', storeData),
  searchStores: (params) => api.get('/stores/search', { params }),
};

// Ratings API
export const ratingsAPI = {
  submitRating: (ratingData) => api.post('/ratings', ratingData),
  updateRating: (ratingData) => api.put('/ratings', ratingData),
  getStoreRatings: (storeId) => api.get(`/ratings/store/${storeId}`),
  getUserRatings: () => api.get('/ratings/user'),
  deleteRating: (id) => api.delete(`/ratings/${id}`),
};

export default api; 