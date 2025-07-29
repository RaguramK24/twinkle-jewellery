import axios from 'axios';
import { Product, Category, ProductFormData } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include cookies in requests
});

// Ensure credentials are always included for admin-protected endpoints
api.interceptors.request.use((config) => {
  // Explicitly ensure credentials are sent for admin-protected operations
  config.withCredentials = true;
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication failed - admin login required:', error.response?.data?.message);
      // Could potentially redirect to login page here if needed
    } else if (error.response?.status === 403) {
      console.error('Access forbidden - admin privileges required:', error.response?.data?.message);
    }
    return Promise.reject(error);
  }
);

// Product services
export const productService = {
  // Get all products
  getAll: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
  },

  // Get single product
  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create product (admin only)
  create: async (productData: ProductFormData): Promise<Product> => {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('price', productData.price.toString());
    formData.append('description', productData.description);
    formData.append('category', productData.category);
    
    if (productData.image) {
      formData.append('image', productData.image);
    }

    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update product (admin only)
  update: async (id: string, productData: ProductFormData): Promise<Product> => {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('price', productData.price.toString());
    formData.append('description', productData.description);
    formData.append('category', productData.category);
    
    if (productData.image) {
      formData.append('image', productData.image);
    }

    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete product (admin only)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

// Category services
export const categoryService = {
  // Get all categories
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Get single category
  getById: async (id: string): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Create category (admin only)
  create: async (categoryData: { name: string; description: string }): Promise<Category> => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // Update category (admin only)
  update: async (id: string, categoryData: { name: string; description: string }): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Delete category (admin only)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

// Message services
export const messageService = {
  // Get all messages (admin only)
  getAll: async (): Promise<any[]> => {
    const response = await api.get('/messages');
    return response.data;
  },

  // Submit a new message (public)
  create: async (messageData: { name: string; email: string; message: string }): Promise<any> => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },
};