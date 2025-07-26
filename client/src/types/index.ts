export interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  price: number;
  description: string;
  category: string;
  image?: File;
}

export interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}