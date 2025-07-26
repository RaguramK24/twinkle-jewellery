import axios from 'axios';
import { Product, Category, ProductFormData } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const ADMIN_KEY = process.env.REACT_APP_ADMIN_KEY || 'admin123';

const api = axios.create({
  baseURL: API_BASE_URL,
});

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
        'admin-key': ADMIN_KEY,
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
        'admin-key': ADMIN_KEY,
      },
    });
    return response.data;
  },

  // Delete product (admin only)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`, {
      headers: {
        'admin-key': ADMIN_KEY,
      },
    });
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
    const response = await api.post('/categories', categoryData, {
      headers: {
        'admin-key': ADMIN_KEY,
      },
    });
    return response.data;
  },

  // Update category (admin only)
  update: async (id: string, categoryData: { name: string; description: string }): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, categoryData, {
      headers: {
        'admin-key': ADMIN_KEY,
      },
    });
    return response.data;
  },

  // Delete category (admin only)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`, {
      headers: {
        'admin-key': ADMIN_KEY,
      },
    });
  },
};